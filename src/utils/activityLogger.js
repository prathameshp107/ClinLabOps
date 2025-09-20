/**
 * Frontend utility for logging activities
 * This can be used to manually log activities from the frontend
 */

/**
 * Log an activity for a task
 * @param {string} taskId - The task ID
 * @param {string} type - The activity type
 * @param {string} description - The activity description
 * @param {string} details - Additional details
 * @param {Object} user - User information
 */
export const logActivity = async (taskId, type, description, details = null, user = null) => {
    try {
        // Get user info from localStorage if not provided
        if (!user) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            user = {
                id: storedUser.id || 'anonymous',
                name: storedUser.name || storedUser.username || 'Unknown User'
            };
        }

        // For now, we'll just log to console since we don't have a direct activity endpoint
        console.log('Activity logged:', {
            taskId,
            type,
            description,
            details,
            user,
            timestamp: new Date().toISOString()
        });

        // In a real implementation, you might want to send this to an analytics service
        // or queue it for batch processing

        return true;
    } catch (error) {
        console.error('Error logging activity:', error);
        return false;
    }
};

/**
 * Common activity types for easy reference
 */
export const ACTIVITY_TYPES = {
    TASK_CREATED: 'task_created',
    TASK_UPDATED: 'task_updated',
    TASK_DELETED: 'task_deleted',
    TASK_ASSIGNED: 'task_assigned',
    STATUS_CHANGED: 'status_changed',
    PRIORITY_CHANGED: 'priority_changed',
    DUE_DATE_UPDATED: 'due_date_updated',
    TITLE_UPDATED: 'title_updated',
    DESCRIPTION_UPDATED: 'description_updated',
    COMMENT_ADDED: 'comment_added',
    COMMENT_UPDATED: 'comment_updated',
    COMMENT_DELETED: 'comment_deleted',
    SUBTASK_ADDED: 'subtask_added',
    SUBTASK_UPDATED: 'subtask_updated',
    SUBTASK_COMPLETED: 'subtask_completed',
    SUBTASK_DELETED: 'subtask_deleted',
    FILE_UPLOADED: 'file_uploaded',
    FILE_DELETED: 'file_deleted',
    PROGRESS_UPDATED: 'progress_updated'
};

/**
 * Helper function to format activity descriptions
 */
export const formatActivityDescription = (type, user, details) => {
    const userName = user?.name || 'Unknown User';

    switch (type) {
        case ACTIVITY_TYPES.TASK_CREATED:
            return `${userName} created this task`;
        case ACTIVITY_TYPES.TASK_ASSIGNED:
            return `${userName} assigned this task${details ? ` to ${details}` : ''}`;
        case ACTIVITY_TYPES.STATUS_CHANGED:
            return `${userName} changed status${details ? ` to ${details}` : ''}`;
        case ACTIVITY_TYPES.PRIORITY_CHANGED:
            return `${userName} changed priority${details ? ` to ${details}` : ''}`;
        case ACTIVITY_TYPES.COMMENT_ADDED:
            return `${userName} added a comment`;
        case ACTIVITY_TYPES.SUBTASK_ADDED:
            return `${userName} added subtask${details ? ` "${details}"` : ''}`;
        case ACTIVITY_TYPES.SUBTASK_COMPLETED:
            return `${userName} completed subtask${details ? ` "${details}"` : ''}`;
        case ACTIVITY_TYPES.FILE_UPLOADED:
            return `${userName} uploaded file${details ? ` "${details}"` : ''}`;
        default:
            return `${userName} performed an action`;
    }
};