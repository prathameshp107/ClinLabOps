const Notification = require('../models/Notification');

// Map activity types to notification properties
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
        'compliance_updated': 'Compliance Status Changed',
        'project_deadline': 'Project Deadline Reminder',
        'task_deadline': 'Task Deadline Reminder'
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
        'compliance_updated': 'warning',
        'project_deadline': 'warning',
        'task_deadline': 'warning'
    };

    return typeMap[activity.type] || 'info';
};

// Middleware to automatically create notifications from activities
const createNotificationFromActivity = async (activity) => {
    try {
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

            const notification = new Notification({
                title: getActivityNotificationTitle(activity),
                message: activity.description,
                type: getActivityNotificationType(activity),
                recipient: activity.user,
                category: category,
                metadata: {
                    activityId: activity._id,
                    activityType: activity.type
                }
            });

            await notification.save();
            return notification;
        }

        return null;
    } catch (error) {
        console.error('Error creating notification from activity:', error);
        return null;
    }
};

module.exports = {
    createNotificationFromActivity
};