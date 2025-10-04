const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ActivityService = require('../services/activityService');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is required for authentication');
    process.exit(1);
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            department: department || '',
            roles: ['User'] // Default role
        });
        await user.save();

        // Log activity
        await ActivityService.logAuthActivity('register', user);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            // Log failed login attempt
            await ActivityService.logAuthActivity('failed_login', null, { email, reason: 'User not found' });
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Log failed login attempt
            await ActivityService.logAuthActivity('failed_login', null, { email: user.email, reason: 'Invalid password' });
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, roles: user.roles }, JWT_SECRET, { expiresIn: '1d' });

        // Update last login
        await user.updateLastLogin();

        // Log successful login
        await ActivityService.logAuthActivity('login', user);

        res.json({
            user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    res.json(req.user);
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        // Log password change activity
        await ActivityService.logUserActivity('updated', user, user, { action: 'password_change' });

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.logout = (req, res) => {
    // Log logout activity if user is available
    if (req.user) {
        ActivityService.logAuthActivity('logout', req.user);
    }
    res.json({ message: 'Logout successful' });
};