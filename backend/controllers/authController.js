const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ActivityService = require('../services/activityService');
const emailService = require('../services/emailService');

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

        // Send welcome email asynchronously (non-blocking)
        // Don't await this - let it run in the background
        emailService.sendWelcomeEmail(user)
            .then(() => {
                console.log(`Welcome email sent to ${user.email}`);
            })
            .catch((emailError) => {
                console.error(`Failed to send welcome email to ${user.email}:`, emailError);
            });

        // Log activity
        await ActivityService.logAuthActivity('register', user);

        // Respond immediately without waiting for email
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
            user: { id: user._id, name: user.name, email: user.email, roles: user.roles, isPowerUser: user.isPowerUser },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    res.json(req.user);
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, email, phone, department } = req.body;

        // Validate email if it's being updated
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        // Prepare update data
        const updateData = {};
        if (fullName !== undefined) updateData.name = fullName;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (department !== undefined) updateData.department = department;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log profile update activity
        await ActivityService.logUserActivity('updated', updatedUser, updatedUser, { action: 'profile_update' });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
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

/**
 * Forgot password - generate reset token and send email
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token expiration (1 hour)
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

        // Save token to user
        user.passwordResetToken = resetTokenHash;
        user.passwordResetExpires = resetTokenExpires;
        await user.save();

        // Send reset email asynchronously (non-blocking)
        // Don't await this - let it run in the background
        emailService.sendPasswordReset(user, resetToken, resetTokenExpires)
            .then(() => {
                console.log(`Password reset email sent to ${user.email}`);
            })
            .catch((emailError) => {
                console.error(`Failed to send password reset email to ${user.email}:`, emailError);
            });

        // Log activity
        await ActivityService.logAuthActivity('forgot_password', user, { email });

        // Respond immediately without waiting for email
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Validate input
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash token for comparison
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            passwordResetToken: resetTokenHash,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        // Set new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Log activity
        await ActivityService.logAuthActivity('password_reset', user);

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};