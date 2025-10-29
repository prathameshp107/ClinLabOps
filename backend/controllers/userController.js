const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');
const ActivityService = require('../services/activityService');

/**
 * Invite a new user
 */
exports.inviteUser = async (req, res) => {
    try {
        const { email, role } = req.body;
        const invitedBy = req.user;

        // Validate input
        if (!email || !role) {
            return res.status(400).json({ message: 'Email and role are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Generate invitation token
        const inviteToken = crypto.randomBytes(32).toString('hex');
        const inviteTokenHash = crypto.createHash('sha256').update(inviteToken).digest('hex');

        // Set token expiration (7 days)
        const inviteTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        // Create invited user record
        const invitedUser = new User({
            email,
            roles: [role],
            status: 'Invited',
            isActive: false,
            passwordResetToken: inviteTokenHash,
            passwordResetExpires: inviteTokenExpires
        });

        await invitedUser.save();

        // Send invitation email asynchronously (non-blocking)
        emailService.sendUserInvitation({
            email,
            inviteToken,
            invitedBy,
            role
        })
            .then(() => {
                console.log(`Invitation email sent to ${email}`);
            })
            .catch((emailError) => {
                console.error(`Failed to send invitation email to ${email}:`, emailError);
                // Note: We don't delete the user record if email fails since the user was already created
            });

        // Log activity
        await ActivityService.logUserActivity('invited', invitedBy, invitedUser, {
            action: 'user_invitation',
            role
        });

        // Respond immediately without waiting for email
        res.status(201).json({
            message: 'User invitation sent successfully',
            user: { id: invitedUser._id, email, role }
        });
    } catch (err) {
        console.error('Invite user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Accept invitation and create account
 */
exports.acceptInvitation = async (req, res) => {
    try {
        const { token, name, password } = req.body;

        // Validate input
        if (!token || !name || !password) {
            return res.status(400).json({ message: 'Token, name, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash token for comparison
        const inviteTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid invitation token
        const user = await User.findOne({
            passwordResetToken: inviteTokenHash,
            passwordResetExpires: { $gt: Date.now() },
            status: 'Invited'
        });

        if (!user) {
            return res.status(400).json({ message: 'Invitation token is invalid or has expired' });
        }

        // Update user details
        user.name = name;
        user.password = await bcrypt.hash(password, 10);
        user.status = 'Active';
        user.isActive = true;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        // Log activity
        await ActivityService.logAuthActivity('register', user);

        res.json({ message: 'Account created successfully' });
    } catch (err) {
        console.error('Accept invitation error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Send account confirmation email
 */
exports.sendConfirmationEmail = async (req, res) => {
    try {
        const user = req.user;

        // Generate confirmation token
        const confirmToken = crypto.randomBytes(32).toString('hex');
        const confirmTokenHash = crypto.createHash('sha256').update(confirmToken).digest('hex');

        // Set token expiration (24 hours)
        const confirmTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Save token to user
        user.passwordResetToken = confirmTokenHash;
        user.passwordResetExpires = confirmTokenExpires;
        await user.save();

        // Send confirmation email asynchronously (non-blocking)
        emailService.sendAccountConfirmation(user, confirmToken)
            .then(() => {
                console.log(`Account confirmation email sent to ${user.email}`);
            })
            .catch((emailError) => {
                console.error(`Failed to send confirmation email to ${user.email}:`, emailError);
            });

        // Respond immediately without waiting for email
        res.json({ message: 'Confirmation email sent successfully' });
    } catch (err) {
        console.error('Send confirmation email error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Confirm account email
 */
exports.confirmEmail = async (req, res) => {
    try {
        const { token } = req.body;

        // Validate input
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Hash token for comparison
        const confirmTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid confirmation token
        const user = await User.findOne({
            passwordResetToken: confirmTokenHash,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Confirmation token is invalid or has expired' });
        }

        // Update user status
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // Assuming we add an isEmailConfirmed field in the future
        // user.isEmailConfirmed = true;

        await user.save();

        // Log activity
        await ActivityService.logAuthActivity('email_confirmed', user);

        res.json({ message: 'Email confirmed successfully' });
    } catch (err) {
        console.error('Confirm email error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

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
        const { name, email, password, roles, department, phone, status = 'Active', isPowerUser = false } = req.body;

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
            isPowerUser,
            lastLogin: null,
            isActive: status === 'Active'
        });

        await user.save();

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('created', user, req.user);
        }

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
        const { password, isPowerUser, ...updateData } = req.body;

        // If password is being updated, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Add isPowerUser to update data if provided
        if (isPowerUser !== undefined) {
            updateData.isPowerUser = isPowerUser;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('updated', user, req.user);
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('deleted', user, req.user);
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('activated', user, req.user);
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('deactivated', user, req.user);
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('deactivated', user, req.user, { reason: 'locked' });
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('activated', user, req.user, { reason: 'unlocked' });
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('updated', user, req.user, { action: 'password_reset' });
        }

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

        // Log activity
        if (req.user) {
            await ActivityService.logUserActivity('created', user, req.user, { action: 'invited' });
        }

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
        const { page = 1, limit = 20, actionType, search } = req.query;
        const Activity = require('../models/Activity');

        // Build filter for user-specific activities
        const filter = {
            'meta.category': 'user_management'
        };

        // Filter by specific user if userId is provided
        if (req.params.id) {
            filter.$or = [
                { 'meta.targetUserId': req.params.id }, // Activities performed on this user
                { user: req.params.id } // Activities performed by this user
            ];
        }

        // Filter by action type
        if (actionType) {
            filter.type = actionType;
        }

        // Search filter
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { 'meta.details': { $regex: search, $options: 'i' } }
            ];
        }

        const activities = await Activity.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Activity.countDocuments(filter);

        // Transform activities to match frontend format
        const transformedActivities = activities.map(activity => ({
            id: activity._id,
            timestamp: activity.createdAt,
            user: {
                id: activity.user._id,
                name: activity.user.name,
                email: activity.user.email
            },
            actionType: getActionTypeFromActivityType(activity.type),
            action: activity.description,
            target: {
                id: activity.meta.targetUserId,
                name: activity.meta.targetUserName,
                type: 'user'
            },
            details: activity.meta.details || activity.description
        }));

        res.json({
            activities: transformedActivities,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to map activity types to frontend action types
function getActionTypeFromActivityType(type) {
    const typeMap = {
        'user_created': 'create',
        'user_invited': 'create',
        'user_updated': 'update',
        'profile_updated': 'update',
        'role_changed': 'update',
        'user_deleted': 'delete',
        'password_reset': 'security',
        'two_fa_enabled': 'security',
        'two_fa_disabled': 'security',
        'user_locked': 'security',
        'user_unlocked': 'security',
        'user_activated': 'activate',
        'user_deactivated': 'deactivate'
    };
    return typeMap[type] || 'other';
}