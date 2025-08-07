const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'system'],
        default: 'info'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    category: {
        type: String,
        enum: ['task', 'project', 'experiment', 'inventory', 'system', 'user', 'general'],
        default: 'general'
    },
    relatedEntity: {
        entityType: {
            type: String,
            enum: ['Task', 'Project', 'Experiment', 'InventoryItem', 'User', 'Order']
        },
        entityId: { type: mongoose.Schema.Types.ObjectId }
    },
    actionUrl: { type: String }, // URL to navigate when notification is clicked
    expiresAt: { type: Date }, // Optional expiration date
    metadata: { type: mongoose.Schema.Types.Mixed } // Additional data
}, { timestamps: true });

// Index for efficient queries
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark notification as read
NotificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to create notification
NotificationSchema.statics.createNotification = async function (data) {
    const notification = new this(data);
    await notification.save();
    return notification;
};

// Static method to mark all notifications as read for a user
NotificationSchema.statics.markAllAsRead = async function (userId) {
    return this.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
    );
};

// Static method to get unread count for a user
NotificationSchema.statics.getUnreadCount = async function (userId) {
    return this.countDocuments({ recipient: userId, isRead: false });
};

module.exports = mongoose.model('Notification', NotificationSchema);