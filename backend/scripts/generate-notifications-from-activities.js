require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
});

// Map activity types to notification properties (same as in middleware)
const getActivityNotificationTitle = (activity) => {
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
        'experiment_created': 'New Experiment Created',
        'experiment_updated': 'Experiment Updated',
        'experiment_deleted': 'Experiment Deleted',
        'inventory_added': 'New Inventory Added',
        'inventory_updated': 'Inventory Updated',
        'inventory_low': 'Low Inventory Alert',
        'compliance_updated': 'Compliance Status Changed'
    };

    return titleMap[activity.type] || 'System Activity';
};

const getActivityNotificationType = (activity) => {
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
        'experiment_created': 'success',
        'experiment_updated': 'info',
        'experiment_deleted': 'warning',
        'inventory_added': 'success',
        'inventory_updated': 'info',
        'inventory_low': 'warning',
        'compliance_updated': 'warning'
    };

    return typeMap[activity.type] || 'info';
};

const generateNotificationsFromActivities = async () => {
    try {
        console.log('Generating notifications from existing activities...');

        // Get all activities that don't have associated notifications
        const activities = await Activity.find({}).populate('user', 'name email');
        console.log(`Found ${activities.length} activities`);

        let notificationCount = 0;

        for (const activity of activities) {
            // Skip if notification already exists for this activity
            const existingNotification = await Notification.findOne({
                'metadata.activityId': activity._id
            });

            // Only create notification if activity has a user and no notification exists yet
            if (activity.user && !existingNotification) {
                // Map activity categories to notification categories
                let category = activity.meta?.category || 'general';
                const allowedCategories = ['task', 'project', 'experiment', 'inventory', 'system', 'user', 'general'];
                if (!allowedCategories.includes(category)) {
                    // Map common categories that might not be in the enum
                    const categoryMap = {
                        'authentication': 'system',
                        'user_management': 'user',
                        'notification': 'system'
                    };
                    category = categoryMap[category] || 'general';
                }

                // Check user's notification settings
                const userSettings = await require('../models/Settings').findOne({ userId: activity.user._id });

                // Check in-app notification settings
                const shouldCreateInAppNotification = userSettings
                    ? userSettings.notifications?.inApp?.enabled !== false
                    : activity.user.preferences?.notifications?.push !== false;

                // Only create notification if in-app notifications are enabled
                if (shouldCreateInAppNotification) {
                    const notification = new Notification({
                        title: getActivityNotificationTitle(activity),
                        message: activity.description,
                        type: getActivityNotificationType(activity),
                        recipient: activity.user._id,
                        category: category,
                        metadata: {
                            activityId: activity._id,
                            activityType: activity.type
                        }
                    });

                    await notification.save();
                    notificationCount++;

                    if (notificationCount % 100 === 0) {
                        console.log(`Generated ${notificationCount} notifications so far...`);
                    }
                }
            }
        }

        console.log(`Generated ${notificationCount} notifications from ${activities.length} activities`);

        // Show some statistics
        const totalNotifications = await Notification.countDocuments();
        const unreadNotifications = await Notification.countDocuments({ isRead: false });

        console.log(`Total notifications in database: ${totalNotifications}`);
        console.log(`Unread notifications: ${unreadNotifications}`);

        process.exit(0);
    } catch (error) {
        console.error('Failed to generate notifications:', error);
        process.exit(1);
    }
};

generateNotificationsFromActivities();