const Notification = require('../models/Notification');
const ActivityService = require('../services/activityService');
const Activity = require('../models/Activity');

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, isRead, type, category } = req.query;
        const userId = req.params.userId || req.user?.id;

        const filter = { recipient: userId };
        if (isRead !== undefined) filter.isRead = isRead === 'true';
        if (type) filter.type = type;
        if (category) filter.category = category;

        const notifications = await Notification.find(filter)
            .populate('sender', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.getUnreadCount(userId);

        res.json({
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
            unreadCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
            .populate('sender', 'name email')
            .populate('recipient', 'name email');

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create new notification
exports.createNotification = async (req, res) => {
    try {
        const notification = await Notification.createNotification(req.body);
        await notification.populate('sender', 'name email');
        await notification.populate('recipient', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notification_created',
                description: `${req.user.name} created notification "${notification.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    notificationId: notification._id,
                    notificationTitle: notification.title,
                    operation: 'create'
                }
            });
        }

        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.markAsRead();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notification_read',
                description: `${req.user.name} marked notification as read`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    notificationId: notification._id,
                    operation: 'read'
                }
            });
        }

        res.json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?.id;
        await Notification.markAllAsRead(userId);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notifications_all_read',
                description: `${req.user.name} marked all notifications as read`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    operation: 'read_all'
                }
            });
        }

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notification_deleted',
                description: `${req.user.name} deleted notification "${notification.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    notificationTitle: notification.title,
                    operation: 'delete'
                }
            });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?.id;
        await Notification.deleteMany({ recipient: userId });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notifications_all_deleted',
                description: `${req.user.name} deleted all notifications`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    operation: 'delete_all'
                }
            });
        }

        res.json({ message: 'All notifications deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get unread count for a user
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?.id;
        const count = await Notification.getUnreadCount(userId);

        res.json({ unreadCount: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send bulk notifications
exports.sendBulkNotifications = async (req, res) => {
    try {
        const { recipients, title, message, type, category, actionUrl } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'Recipients array is required' });
        }

        const notifications = recipients.map(recipientId => ({
            title,
            message,
            type,
            category,
            recipient: recipientId,
            sender: req.user?.id,
            actionUrl
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'notifications_bulk_sent',
                description: `${req.user.name} sent ${createdNotifications.length} notifications`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'notification',
                    notificationCount: createdNotifications.length,
                    operation: 'bulk_send'
                }
            });
        }

        res.status(201).json({
            message: `${createdNotifications.length} notifications sent successfully`,
            notifications: createdNotifications
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Generate notifications from activities
exports.generateNotificationsFromActivities = async (req, res) => {
    try {
        // Get recent activities that don't have associated notifications
        const activities = await Activity.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        }).populate('user', 'name email');

        const notifications = [];

        for (const activity of activities) {
            // Skip if notification already exists for this activity
            const existingNotification = await Notification.findOne({
                'metadata.activityId': activity._id
            });

            if (!existingNotification && activity.user) {
                // Create notification based on activity type
                const notification = new Notification({
                    title: this.getActivityNotificationTitle(activity),
                    message: activity.description,
                    type: this.getActivityNotificationType(activity),
                    recipient: activity.user._id,
                    category: activity.meta?.category || 'general',
                    metadata: {
                        activityId: activity._id,
                        activityType: activity.type
                    }
                });
                await notification.save();

                notifications.push(notification);
            }
        }

        res.json({
            message: `${notifications.length} notifications generated`,
            notifications
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to determine notification title based on activity
exports.getActivityNotificationTitle = function (activity) {
    const titleMap = {
        'project_created': 'New Project Created',
        'project_updated': 'Project Updated',
        'project_deleted': 'Project Deleted',
        'task_created': 'New Task Assigned',
        'task_updated': 'Task Updated',
        'task_deleted': 'Task Deleted',
        'user_created': 'New User Registered',
        'user_updated': 'User Profile Updated',
        'user_deleted': 'User Account Deleted',
        'user_login': 'Login Activity',
        'failed_login_attempt': 'Failed Login Attempt',
        'notification_created': 'New Notification',
        'notification_read': 'Notification Read',
        'notifications_all_read': 'All Notifications Read',
        'notification_deleted': 'Notification Deleted',
        'notifications_all_deleted': 'All Notifications Deleted',
        'notifications_bulk_sent': 'Bulk Notifications Sent'
    };

    return titleMap[activity.type] || 'System Activity';
};

// Helper function to determine notification type based on activity
exports.getActivityNotificationType = function (activity) {
    const typeMap = {
        'user_created': 'success',
        'user_updated': 'info',
        'user_deleted': 'warning',
        'user_login': 'info',
        'failed_login_attempt': 'error',
        'project_created': 'success',
        'project_updated': 'info',
        'project_deleted': 'warning',
        'task_created': 'success',
        'task_updated': 'info',
        'task_deleted': 'warning',
        'notification_created': 'info',
        'notification_deleted': 'warning',
        'failed_login_attempt': 'error'
    };

    return typeMap[activity.type] || 'info';
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?.id;

        const totalNotifications = await Notification.countDocuments({ recipient: userId });
        const unreadNotifications = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });
        const readNotifications = totalNotifications - unreadNotifications;

        const typeStats = await Notification.aggregate([
            { $match: { recipient: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const categoryStats = await Notification.aggregate([
            { $match: { recipient: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recentNotifications = await Notification.find({ recipient: userId })
            .populate('sender', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalNotifications,
            unreadNotifications,
            readNotifications,
            typeStats,
            categoryStats,
            recentNotifications
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};