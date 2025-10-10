import axios from 'axios';
import config from '../config/config.js';

const API_BASE_URL = config.api.baseUrl;

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
 * Fetch all users with pagination support
 * @param {Object} params - Query parameters (page, limit, role, status, search)
 * @returns {Promise<Object>} Object containing users array and pagination info
 */
export async function getUsers(params = {}) {
    try {
        const response = await api.get('/users', { params });
        // Return the full response object with pagination info
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Fetch all users without pagination
 * @returns {Promise<Array>} Array of all users
 */
export async function getAllUsers() {
    try {
        // Fetch all users with a high limit to get everything
        const response = await api.get('/users', { params: { limit: 1000 } });
        return response.data.users || response.data;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
}

/**
 * Fetch a user by ID
 * @param {string} id
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(id) {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching user:', error);
        throw error;
    }
}

/**
 * Create a new user
 * @param {Object} user
 * @returns {Promise<Object>} Created user
 */
export async function createUser(user) {
    try {
        const response = await api.post('/users', user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Update an existing user
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated user or null
 */
export async function updateUser(id, updates) {
    try {
        const response = await api.put(`/users/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating user:', error);
        throw error;
    }
}

/**
 * Delete a user
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteUser(id) {
    try {
        await api.delete(`/users/${id}`);
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error deleting user:', error);
        throw error;
    }
}

/**
 * Activate a user
 * @param {string} id
 * @returns {Promise<Object|null>} Activated user or null
 */
export async function activateUser(id) {
    try {
        const response = await api.patch(`/users/${id}/activate`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error activating user:', error);
        throw error;
    }
}

/**
 * Deactivate a user
 * @param {string} id
 * @returns {Promise<Object|null>} Deactivated user or null
 */
export async function deactivateUser(id) {
    try {
        const response = await api.patch(`/users/${id}/deactivate`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error deactivating user:', error);
        throw error;
    }
}

/**
 * Lock a user
 * @param {string} id
 * @returns {Promise<Object|null>} Locked user or null
 */
export async function lockUser(id) {
    try {
        const response = await api.patch(`/users/${id}/lock`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error locking user:', error);
        throw error;
    }
}

/**
 * Unlock a user
 * @param {string} id
 * @returns {Promise<Object|null>} Unlocked user or null
 */
export async function unlockUser(id) {
    try {
        const response = await api.patch(`/users/${id}/unlock`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error unlocking user:', error);
        throw error;
    }
}

/**
 * Invite a user
 * @param {Object} user
 * @returns {Promise<Object>} Invited user
 */
export async function inviteUser(user) {
    try {
        const response = await api.post('/users/invite', user);
        return response.data;
    } catch (error) {
        console.error('Error inviting user:', error);
        throw error;
    }
}

/**
 * Reset a user's password
 * @param {string} id
 * @param {string} newPassword
 * @returns {Promise<boolean>} Success
 */
export async function resetUserPassword(id, newPassword) {
    try {
        await api.patch(`/users/${id}/reset-password`, { newPassword });
        return true;
    } catch (error) {
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error resetting user password:', error);
        throw error;
    }
}

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats() {
    try {
        const response = await api.get('/users/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
}

/**
 * Get user activity logs
 * @param {string} id
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Activity logs with pagination
 */
export async function getUserActivityLogs(id, params = {}) {
    try {
        const response = await api.get(`/users/${id}/activity`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity logs:', error);
        throw error;
    }
} 