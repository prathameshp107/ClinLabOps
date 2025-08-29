const Activity = require('../models/Activity');

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

/**
 * Get all activities with filtering and pagination
 */
exports.getAllActivities = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            type,
            userId,
            search,
            startDate,
            endDate
        } = req.query;

        // Build filter object
        const filter = {};

        if (category) {
            filter['meta.category'] = category;
        }

        if (type) {
            filter.type = type;
        }

        if (userId) {
            filter.$or = [
                { user: userId },
                { 'meta.targetUserId': userId }
            ];
        }

        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } },
                { 'meta.details': { $regex: search, $options: 'i' } }
            ];
        }

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        const activities = await Activity.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Activity.countDocuments(filter);

        // Transform activities to match frontend format for user management activities
        let transformedActivities = activities;
        if (category === 'user_management') {
            transformedActivities = activities.map(activity => ({
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
                    id: activity.meta?.targetUserId,
                    name: activity.meta?.targetUserName,
                    type: 'user'
                },
                details: activity.meta?.details || activity.description
            }));
        }

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

/**
 * Get activity by ID
 */
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
            .populate('user', 'name email');

        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Create new activity (for manual logging)
 */
exports.createActivity = async (req, res) => {
    try {
        const { type, description, meta = {} } = req.body;

        // Get user from auth middleware or request
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: 'User authentication required' });
        }

        const activity = new Activity({
            type,
            description,
            user: userId,
            meta
        });

        await activity.save();

        // Populate user info before returning
        await activity.populate('user', 'name email');

        res.status(201).json(activity);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/**
 * Get activity statistics
 */
exports.getActivityStats = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;

        const filter = {};
        if (category) {
            filter['meta.category'] = category;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);
            }
        }

        // Get total activities
        const totalActivities = await Activity.countDocuments(filter);

        // Get activities by type
        const activitiesByType = await Activity.aggregate([
            { $match: filter },
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
            { $match: filter },
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
        const recentActivities = await Activity.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalActivities,
            activitiesByType,
            activitiesByUser,
            recentActivities
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};