const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

// Get all notifications for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// Generate notifications from activities
router.post('/generate-from-activities', notificationController.generateNotificationsFromActivities);

// Get notification statistics
router.get('/user/:userId/stats', notificationController.getNotificationStats);

// Get unread count for a user
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Create new notification
router.post('/', notificationController.createNotification);

// Send bulk notifications
router.post('/bulk', notificationController.sendBulkNotifications);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for a user
router.patch('/user/:userId/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Delete all notifications for a user
router.delete('/user/:userId/all', notificationController.deleteAllNotifications);

module.exports = router;