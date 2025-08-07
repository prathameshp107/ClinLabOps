const Notification = require('../models/Notification');

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

        res.status(201).json({
            message: `${createdNotifications.length} notifications sent successfully`,
            notifications: createdNotifications
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
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