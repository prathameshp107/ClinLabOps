const Activity = require('../models/Activity');

/**
 * Activity Service
 * Provides a centralized service for logging activities across the application
 */

class ActivityService {
    /**
     * Log an activity
     * @param {Object} options - Activity options
     * @param {string} options.type - Type of activity (e.g., 'project_created', 'task_updated')
     * @param {string} options.description - Human-readable description of the activity
     * @param {string} options.userId - ID of the user performing the action
     * @param {string} [options.projectId] - ID of the project related to the activity
     * @param {Object} [options.meta] - Additional metadata about the activity
     * @returns {Promise<Object>} Created activity
     */
    static async logActivity({ type, description, userId, projectId, meta = {} }) {
        try {
            // Validate required fields
            if (!type || !description) {
                throw new Error('Type and description are required to log an activity');
            }

            // Create activity object
            const activityData = {
                type,
                description,
                meta
            };

            // Add user reference if provided
            if (userId) {
                activityData.user = userId;
            }

            // Add project reference if provided
            if (projectId) {
                activityData.project = projectId;
            }

            // Create and save the activity
            const activity = new Activity(activityData);
            const savedActivity = await activity.save();

            // Populate user info for immediate use (if user exists)
            if (userId) {
                await savedActivity.populate('user', 'name email');
            }

            return savedActivity;
        } catch (error) {
            console.error('Error logging activity:', error);
            // Don't throw error to avoid breaking main operations
            return null;
        }
    }

    /**
     * Log project-related activity
     * @param {string} action - Action performed (created, updated, deleted)
     * @param {Object} project - Project object
     * @param {Object} user - User who performed the action
     * @param {Object} [details] - Additional details
     */
    static async logProjectActivity(action, project, user, details = {}) {
        const actionTypes = {
            created: 'project_created',
            updated: 'project_updated',
            deleted: 'project_deleted'
        };

        const actionDescriptions = {
            created: `created project "${project.name}"`,
            updated: `updated project "${project.name}"`,
            deleted: `deleted project "${project.name}"`
        };

        return this.logActivity({
            type: actionTypes[action],
            description: `${user.name} ${actionDescriptions[action]}`,
            userId: user._id || user.id,
            projectId: project._id || project.id,
            meta: {
                category: 'project',
                projectName: project.name,
                projectCode: project.projectCode,
                ...details
            }
        });
    }

    /**
     * Log task-related activity
     * @param {string} action - Action performed (created, updated, deleted)
     * @param {Object} task - Task object
     * @param {Object} user - User who performed the action
     * @param {Object} [project] - Project associated with the task (optional)
     * @param {Object} [details] - Additional details
     */
    static async logTaskActivity(action, task, user, project = null, details = {}) {
        const actionTypes = {
            created: 'task_created',
            updated: 'task_updated',
            deleted: 'task_deleted'
        };

        const actionDescriptions = {
            created: `created task "${task.name}"`,
            updated: `updated task "${task.name}"`,
            deleted: `deleted task "${task.name}"`
        };

        const activityData = {
            type: actionTypes[action],
            description: `${user.name} ${actionDescriptions[action]}`,
            userId: user._id || user.id,
            meta: {
                category: 'task',
                taskName: task.name,
                taskId: task._id || task.id,
                ...details
            }
        };

        // Add project reference if available
        if (task.projectId) {
            activityData.projectId = task.projectId;
            activityData.meta.projectId = task.projectId;
        } else if (project) {
            activityData.projectId = project._id || project.id;
            activityData.meta.projectId = project._id || project.id;
            activityData.meta.projectName = project.name;
        }

        return this.logActivity(activityData);
    }

    /**
     * Log user-related activity
     * @param {string} action - Action performed (created, updated, deleted, etc.)
     * @param {Object} targetUser - User being acted upon
     * @param {Object} actingUser - User performing the action
     * @param {Object} [details] - Additional details
     */
    static async logUserActivity(action, targetUser, actingUser, details = {}) {
        const actionTypes = {
            created: 'user_created',
            updated: 'user_updated',
            deleted: 'user_deleted',
            activated: 'user_activated',
            deactivated: 'user_deactivated',
            roleChanged: 'role_changed'
        };

        const actionDescriptions = {
            created: `created user account for ${targetUser.name}`,
            updated: `updated profile for ${targetUser.name}`,
            deleted: `deleted user account for ${targetUser.name}`,
            activated: `activated user account for ${targetUser.name}`,
            deactivated: `deactivated user account for ${targetUser.name}`,
            roleChanged: `changed role for ${targetUser.name}${details.newRole ? ` to ${details.newRole}` : ''}`
        };

        return this.logActivity({
            type: actionTypes[action],
            description: `${actingUser.name} ${actionDescriptions[action]}`,
            userId: actingUser._id || actingUser.id,
            meta: {
                category: 'user_management',
                targetUserId: targetUser._id || targetUser.id,
                targetUserName: targetUser.name,
                ...details
            }
        });
    }

    /**
     * Log authentication-related activity
     * @param {string} action - Action performed (login, logout, failed_login)
     * @param {Object} user - User involved
     * @param {Object} [details] - Additional details
     */
    static async logAuthActivity(action, user, details = {}) {
        const actionTypes = {
            login: 'user_login',
            logout: 'user_logout',
            failed_login: 'failed_login_attempt'
        };

        const actionDescriptions = {
            login: 'logged in to the system',
            logout: 'logged out of the system',
            failed_login: 'failed login attempt'
        };

        return this.logActivity({
            type: actionTypes[action],
            description: user ? `${user.name} ${actionDescriptions[action]}` : `Anonymous user ${actionDescriptions[action]}`,
            userId: user ? (user._id || user.id) : null,
            meta: {
                category: 'authentication',
                ...details
            }
        });
    }

    /**
     * Get activities with filtering and pagination
     * @param {Object} filters - Filter criteria
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Promise<Object>} Paginated activities
     */
    static async getActivities(filters = {}, page = 1, limit = 20) {
        try {
            const query = {};

            // Apply filters
            if (filters.category) {
                query['meta.category'] = filters.category;
            }

            if (filters.type) {
                query.type = filters.type;
            }

            if (filters.userId) {
                query.user = filters.userId;
            }

            if (filters.projectId) {
                query.project = filters.projectId;
            }

            // Apply date range if provided
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    query.createdAt.$lte = new Date(filters.endDate);
                }
            }

            const activities = await Activity.find(query)
                .populate('user', 'name email') // This will populate user data or leave it as null if user doesn't exist
                .populate('project', 'name projectCode')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await Activity.countDocuments(query);

            return {
                activities,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            };
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }

    /**
     * Get activity statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Activity statistics
     */
    static async getActivityStats(filters = {}) {
        try {
            const query = {};

            // Apply filters
            if (filters.category) {
                query['meta.category'] = filters.category;
            }

            if (filters.userId) {
                query.user = filters.userId;
            }

            if (filters.projectId) {
                query.project = filters.projectId;
            }

            // Apply date range if provided
            if (filters.startDate || filters.endDate) {
                query.createdAt = {};
                if (filters.startDate) {
                    query.createdAt.$gte = new Date(filters.startDate);
                }
                if (filters.endDate) {
                    query.createdAt.$lte = new Date(filters.endDate);
                }
            }

            // Get total activities
            const totalActivities = await Activity.countDocuments(query);

            // Get activities by type
            const activitiesByType = await Activity.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            // Get activities by user
            const activitiesByUser = await Activity.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$user',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        count: 1,
                        user: { $arrayElemAt: ['$user.name', 0] }
                    }
                }
            ]);

            // Get recent activities
            const recentActivities = await Activity.find(query)
                .populate('user', 'name email') // This will populate user data or leave it as null if user doesn't exist
                .populate('project', 'name projectCode')
                .sort({ createdAt: -1 })
                .limit(5);

            return {
                totalActivities,
                activitiesByType,
                activitiesByUser,
                recentActivities
            };
        } catch (error) {
            console.error('Error fetching activity stats:', error);
            throw error;
        }
    }
}

module.exports = ActivityService;