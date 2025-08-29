import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Don't add Authorization header if no valid token - let backend use default user
    return config;
});

/**
 * User activity types for consistent logging
 */
export const USER_ACTIVITY_TYPES = {
    USER_CREATED: 'user_created',
    USER_UPDATED: 'user_updated',
    USER_DELETED: 'user_deleted',
    USER_ACTIVATED: 'user_activated',
    USER_DEACTIVATED: 'user_deactivated',
    USER_LOCKED: 'user_locked',
    USER_UNLOCKED: 'user_unlocked',
    USER_INVITED: 'user_invited',
    PASSWORD_RESET: 'password_reset',
    TWO_FA_ENABLED: 'two_fa_enabled',
    TWO_FA_DISABLED: 'two_fa_disabled',
    ROLE_CHANGED: 'role_changed',
    PROFILE_UPDATED: 'profile_updated'
};

/**
 * Fetch user activities with filtering and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Activity logs with pagination
 */
export async function getUserActivities(params = {}) {
    try {
        console.log('Fetching user activities with params:', params);
        const requestParams = {
            category: 'user_management',
            ...params
        };
        console.log('Final request params:', requestParams);

        const response = await api.get('/activities', {
            params: requestParams
        });

        console.log('User activities response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user activities:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
}

/**
 * Fetch activities for a specific user
 * @param {string} userId - User ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} User-specific activity logs
 */
export async function getUserActivityLogs(userId, params = {}) {
    try {
        const response = await api.get(`/users/${userId}/activity`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity logs:', error);
        throw error;
    }
}

/**
 * Log a manual user activity (for frontend-only actions)
 * @param {string} type - Activity type
 * @param {string} description - Activity description
 * @param {Object} targetUser - Target user object
 * @param {string} details - Additional details
 * @returns {Promise<Object>} Created activity log
 */
export async function logUserActivity(type, description, targetUser = null, details = null) {
    try {
        const activityData = {
            type,
            description,
            meta: {
                targetUserId: targetUser?._id || targetUser?.id,
                targetUserName: targetUser?.name,
                details,
                category: 'user_management'
            }
        };

        const response = await api.post('/activities', activityData);
        return response.data;
    } catch (error) {
        console.error('Error logging user activity:', error);
        throw error;
    }
}

/**
 * Format activity description based on type and details
 * @param {string} type - Activity type
 * @param {Object} user - User who performed the action
 * @param {Object} targetUser - Target user
 * @param {string} details - Additional details
 * @returns {string} Formatted description
 */
export function formatUserActivityDescription(type, user, targetUser, details) {
    const userName = user?.name || 'Unknown User';
    const targetName = targetUser?.name || 'Unknown User';

    switch (type) {
        case USER_ACTIVITY_TYPES.USER_CREATED:
            return `${userName} created user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_UPDATED:
            return `${userName} updated profile for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_DELETED:
            return `${userName} deleted user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_ACTIVATED:
            return `${userName} activated user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_DEACTIVATED:
            return `${userName} deactivated user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_LOCKED:
            return `${userName} locked user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_UNLOCKED:
            return `${userName} unlocked user account for ${targetName}`;
        case USER_ACTIVITY_TYPES.USER_INVITED:
            return `${userName} sent invitation to ${targetName}`;
        case USER_ACTIVITY_TYPES.PASSWORD_RESET:
            return `${userName} reset password for ${targetName}`;
        case USER_ACTIVITY_TYPES.TWO_FA_ENABLED:
            return `${userName} enabled 2FA for ${targetName}`;
        case USER_ACTIVITY_TYPES.TWO_FA_DISABLED:
            return `${userName} disabled 2FA for ${targetName}`;
        case USER_ACTIVITY_TYPES.ROLE_CHANGED:
            return `${userName} changed role for ${targetName}${details ? ` to ${details}` : ''}`;
        case USER_ACTIVITY_TYPES.PROFILE_UPDATED:
            return `${userName} updated profile information for ${targetName}`;
        default:
            return `${userName} performed action on ${targetName}`;
    }
}

/**
 * Get activity icon and color based on type
 * @param {string} type - Activity type
 * @returns {Object} Icon and color configuration
 */
export function getActivityTypeConfig(type) {
    switch (type) {
        case USER_ACTIVITY_TYPES.USER_CREATED:
        case USER_ACTIVITY_TYPES.USER_INVITED:
            return {
                icon: 'UserPlus',
                color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
                actionType: 'create'
            };
        case USER_ACTIVITY_TYPES.USER_UPDATED:
        case USER_ACTIVITY_TYPES.PROFILE_UPDATED:
        case USER_ACTIVITY_TYPES.ROLE_CHANGED:
            return {
                icon: 'Edit',
                color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
                actionType: 'update'
            };
        case USER_ACTIVITY_TYPES.USER_DELETED:
            return {
                icon: 'UserX',
                color: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
                actionType: 'delete'
            };
        case USER_ACTIVITY_TYPES.PASSWORD_RESET:
        case USER_ACTIVITY_TYPES.TWO_FA_ENABLED:
        case USER_ACTIVITY_TYPES.TWO_FA_DISABLED:
        case USER_ACTIVITY_TYPES.USER_LOCKED:
        case USER_ACTIVITY_TYPES.USER_UNLOCKED:
            return {
                icon: 'Shield',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
                actionType: 'security'
            };
        case USER_ACTIVITY_TYPES.USER_ACTIVATED:
            return {
                icon: 'CheckCircle',
                color: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
                actionType: 'activate'
            };
        case USER_ACTIVITY_TYPES.USER_DEACTIVATED:
            return {
                icon: 'XCircle',
                color: 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400',
                actionType: 'deactivate'
            };
        default:
            return {
                icon: 'Activity',
                color: 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400',
                actionType: 'other'
            };
    }
}