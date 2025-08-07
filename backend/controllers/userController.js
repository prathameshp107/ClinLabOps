const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status, search, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (role) filter.roles = { $in: [role] };
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(filter);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, roles, department, phone, status = 'Active' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            roles: Array.isArray(roles) ? roles : [roles || 'User'],
            department,
            phone,
            status,
            lastLogin: null,
            isActive: status === 'Active'
        });

        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // If password is being updated, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Activate user
exports.activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'Active', isActive: true },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'Inactive', isActive: false },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Lock user
exports.lockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'Locked', isActive: false },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Unlock user
exports.unlockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'Active', isActive: true },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Invite user (create with invited status)
exports.inviteUser = async (req, res) => {
    try {
        const { name, email, roles, department } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            roles: Array.isArray(roles) ? roles : [roles || 'User'],
            department,
            status: 'Invited',
            isActive: false,
            tempPassword: true
        });

        await user.save();

        // Return user without password but include temp password for email
        const userResponse = user.toObject();
        delete userResponse.password;
        userResponse.temporaryPassword = tempPassword; // Only for invitation email

        res.status(201).json(userResponse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'Active' });
        const inactiveUsers = await User.countDocuments({ status: 'Inactive' });
        const lockedUsers = await User.countDocuments({ status: 'Locked' });
        const invitedUsers = await User.countDocuments({ status: 'Invited' });

        const roleStats = await User.aggregate([
            { $unwind: '$roles' },
            { $group: { _id: '$roles', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const departmentStats = await User.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            lockedUsers,
            invitedUsers,
            roleStats,
            departmentStats,
            recentUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user activity logs
exports.getUserActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        // This would typically come from an Activity model
        // For now, return mock data structure
        const activities = [
            {
                id: '1',
                userId: req.params.id,
                action: 'Login',
                timestamp: new Date(),
                details: 'User logged in successfully',
                ipAddress: '192.168.1.1'
            }
        ];

        res.json({
            activities,
            totalPages: 1,
            currentPage: parseInt(page),
            total: activities.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};