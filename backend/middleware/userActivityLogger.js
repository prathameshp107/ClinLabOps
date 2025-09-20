const Activity = require('../models/Activity');

/**
 * User activity logging middleware for user management operations
 * Logs all CRUD operations on users and related activities
 */

// Helper function to get user info from request
const getUserInfo = (req) => {
    console.log('Getting user info from request. req.user:', req.user ? { id: req.user._id || req.user.id, name: req.user.name } : 'null');

    // Try to get user from auth middleware
    if (req.user) {
        return {
            id: req.user._id || req.user.id,
            name: req.user.name || req.user.username || 'Unknown User'
        };
    }

    // Fallback to request body or headers
    const userId = req.body.userId || req.headers['x-user-id'] || 'anonymous';
    const userName = req.body.userName || req.headers['x-user-name'] || 'Unknown User';

    console.log('Using fallback user info:', { id: userId, name: userName });
    return { id: userId, name: userName };
};

// Helper function to create user activity log entry
const createUserActivityLog = async (type, description, performedBy, targetUser = null, details = null, meta = {}) => {
    try {
        console.log('Creating user activity log:', {
            type,
            description,
            performedBy,
            targetUser: targetUser ? { id: targetUser.id || targetUser._id, name: targetUser.name } : null,
            details
        });

        // Create activity in global activities collection
        const activity = new Activity({
            type,
            description,
            user: performedBy.id,
            meta: {
                targetUserId: targetUser?.id || targetUser?._id,
                targetUserName: targetUser?.name,
                details,
                category: 'user_management',
                ...meta
            }
        });
        await activity.save();

        console.log(`User activity logged successfully: ${type} - ${description} - Activity ID: ${activity._id}`);
        return activity;
    } catch (error) {
        console.error('Error creating user activity log:', error);
        console.error('Error details:', error.message);
    }
};

// Middleware for user creation
const logUserCreation = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 201 && data) {
            const performedBy = getUserInfo(req);
            const userData = typeof data === 'string' ? JSON.parse(data) : data;

            if (userData._id || userData.id) {
                createUserActivityLog(
                    'user_created',
                    `User "${userData.name}" was created`,
                    performedBy,
                    userData,
                    `Created user with email ${userData.email} and role ${Array.isArray(userData.roles) ? userData.roles[0] : userData.role}`,
                    {
                        userEmail: userData.email,
                        userRole: Array.isArray(userData.roles) ? userData.roles[0] : userData.role,
                        userDepartment: userData.department,
                        userStatus: userData.status
                    }
                );
            }
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for user updates
const logUserUpdate = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 200 && data) {
            const performedBy = getUserInfo(req);
            const userData = typeof data === 'string' ? JSON.parse(data) : data;
            const userId = req.params.id;

            if (userData._id || userData.id || userId) {
                const changes = [];
                if (req.body.name) changes.push(`name to "${req.body.name}"`);
                if (req.body.email) changes.push(`email to "${req.body.email}"`);
                if (req.body.roles) changes.push(`role to "${Array.isArray(req.body.roles) ? req.body.roles[0] : req.body.roles}"`);
                if (req.body.department) changes.push(`department to "${req.body.department}"`);
                if (req.body.status) changes.push(`status to "${req.body.status}"`);
                if (req.body.twoFactorEnabled !== undefined) changes.push(`2FA to ${req.body.twoFactorEnabled ? 'enabled' : 'disabled'}`);

                const changeDetails = changes.length > 0 ? `Updated ${changes.join(', ')}` : 'Updated user profile';

                createUserActivityLog(
                    'user_updated',
                    `User "${userData.name || 'Unknown'}" was updated`,
                    performedBy,
                    userData,
                    changeDetails,
                    {
                        userId: userData._id || userData.id || userId,
                        changes: req.body
                    }
                );
            }
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for user deletion
const logUserDeletion = async (req, res, next) => {
    // Get user info before deletion
    const User = require('../models/User');
    let userToDelete = null;

    try {
        userToDelete = await User.findById(req.params.id).select('name email');
    } catch (error) {
        console.error('Error fetching user for deletion log:', error);
    }

    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 200) {
            const performedBy = getUserInfo(req);
            const userId = req.params.id;

            createUserActivityLog(
                'user_deleted',
                `User "${userToDelete?.name || 'Unknown'}" was deleted`,
                performedBy,
                userToDelete,
                `Permanently deleted user account with email ${userToDelete?.email || 'unknown'}`,
                {
                    deletedUserId: userId,
                    deletedUserEmail: userToDelete?.email
                }
            );
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for password reset
const logPasswordReset = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 200) {
            const performedBy = getUserInfo(req);
            const userId = req.params.id;

            // Get user info for the target
            const User = require('../models/User');
            User.findById(userId).select('name email').then(targetUser => {
                if (targetUser) {
                    createUserActivityLog(
                        'password_reset',
                        `Password was reset for user "${targetUser.name}"`,
                        performedBy,
                        targetUser,
                        'Admin reset user password',
                        {
                            targetUserId: userId,
                            resetType: 'admin_reset'
                        }
                    );
                }
            }).catch(error => {
                console.error('Error fetching user for password reset log:', error);
            });
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for user status changes (activate/deactivate/lock/unlock)
const logUserStatusChange = (operation) => {
    return async (req, res, next) => {
        const originalSend = res.send;

        res.send = function (data) {
            if (res.statusCode === 200 && data) {
                const performedBy = getUserInfo(req);
                const userData = typeof data === 'string' ? JSON.parse(data) : data;

                let actionDescription = '';
                let actionType = '';

                switch (operation) {
                    case 'activate':
                        actionDescription = `User "${userData.name}" was activated`;
                        actionType = 'user_activated';
                        break;
                    case 'deactivate':
                        actionDescription = `User "${userData.name}" was deactivated`;
                        actionType = 'user_deactivated';
                        break;
                    case 'lock':
                        actionDescription = `User "${userData.name}" was locked`;
                        actionType = 'user_locked';
                        break;
                    case 'unlock':
                        actionDescription = `User "${userData.name}" was unlocked`;
                        actionType = 'user_unlocked';
                        break;
                }

                createUserActivityLog(
                    actionType,
                    actionDescription,
                    performedBy,
                    userData,
                    `Changed user status to ${userData.status}`,
                    {
                        operation,
                        newStatus: userData.status,
                        userId: userData._id || userData.id
                    }
                );
            }
            originalSend.call(this, data);
        };

        next();
    };
};

// Middleware for user invitation
const logUserInvitation = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 201 && data) {
            const performedBy = getUserInfo(req);
            const userData = typeof data === 'string' ? JSON.parse(data) : data;

            if (userData._id || userData.id) {
                createUserActivityLog(
                    'user_invited',
                    `User invitation sent to "${userData.name}"`,
                    performedBy,
                    userData,
                    `Sent invitation email to ${userData.email} for role ${Array.isArray(userData.roles) ? userData.roles[0] : userData.role}`,
                    {
                        userEmail: userData.email,
                        userRole: Array.isArray(userData.roles) ? userData.roles[0] : userData.role,
                        userDepartment: userData.department,
                        invitationType: 'email'
                    }
                );
            }
        }
        originalSend.call(this, data);
    };

    next();
};

module.exports = {
    logUserCreation,
    logUserUpdate,
    logUserDeletion,
    logPasswordReset,
    logUserStatusChange,
    logUserInvitation,
    createUserActivityLog
};