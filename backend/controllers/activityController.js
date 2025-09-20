const Activity = require('../models/Activity');
const ActivityService = require('../services/activityService');

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

    // Use ActivityService to get activities
    const result = await ActivityService.getActivities({
      category,
      type,
      userId,
      startDate,
      endDate
    }, page, limit);

    // Transform activities to match frontend format for user management activities
    let transformedActivities = result.activities;
    if (category === 'user_management') {
      transformedActivities = result.activities.map(activity => ({
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
      result.activities = transformedActivities;
    }

    res.json(result);
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

    // Use ActivityService to log activity
    const activity = await ActivityService.logActivity({
      type,
      description,
      userId,
      meta
    });

    if (!activity) {
      return res.status(500).json({ error: 'Failed to log activity' });
    }

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

    // Use ActivityService to get statistics
    const stats = await ActivityService.getActivityStats({
      category,
      startDate,
      endDate
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};