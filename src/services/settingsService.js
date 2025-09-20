import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    return config;
});

/**
 * Default settings structure for fallback - simplified version
 */
const defaultSettings = {
    general: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/dd/yyyy',
        autoSave: true
    },
    notifications: {
        email: {
            enabled: true,
            taskAssignments: true,
            projectUpdates: true
        },
        inApp: {
            enabled: true,
            taskUpdates: true
        }
    },
    security: {
        twoFactorAuth: {
            enabled: false
        },
        sessionManagement: {
            sessionDuration: 720 // minutes
        },
        passwordPolicy: {
            minimumLength: 8
        }
    },
    theme: {
        mode: 'light', // 'light', 'dark', 'auto'
        primaryColor: 'blue'
    }
};

/**
 * Get all user settings
 * @returns {Promise<Object>} User settings object
 */
export async function getSettings() {
    try {
        const response = await api.get('/settings');
        // Merge with defaults to ensure all settings exist
        return mergeWithDefaults(response.data, defaultSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        // Return defaults if API call fails
        if (error.response?.status === 404) {
            return defaultSettings;
        }
        throw error;
    }
}

/**
 * Update specific settings section
 * @param {string} section - Settings section name
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export async function updateSettings(section, settings) {
    try {
        const response = await api.patch(`/settings/${section}`, settings);
        return response.data;
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}

/**
 * Update entire settings object
 * @param {Object} settings - Complete settings object
 * @returns {Promise<Object>} Updated settings
 */
export async function updateAllSettings(settings) {
    try {
        const response = await api.put('/settings', settings);
        return response.data;
    } catch (error) {
        console.error('Error updating all settings:', error);
        throw error;
    }
}

/**
 * Reset settings to default values
 * @param {string|null} section - Specific section to reset, or null for all
 * @returns {Promise<Object>} Reset settings
 */
export async function resetSettings(section = null) {
    try {
        const endpoint = section ? `/settings/${section}/reset` : '/settings/reset';
        const response = await api.post(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error resetting settings:', error);
        throw error;
    }
}

/**
 * Export user settings
 * @param {string} format - Export format ('json', 'csv')
 * @returns {Promise<Blob>} Settings export file
 */
export async function exportSettings(format = 'json') {
    try {
        const response = await api.get(`/settings/export?format=${format}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting settings:', error);
        throw error;
    }
}

/**
 * Import user settings
 * @param {File} file - Settings file to import
 * @returns {Promise<Object>} Import result
 */
export async function importSettings(file) {
    try {
        const formData = new FormData();
        formData.append('settings', file);

        const response = await api.post('/settings/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error importing settings:', error);
        throw error;
    }
}

/**
 * Get available system settings (admin only)
 * @returns {Promise<Object>} System settings
 */
export async function getSystemSettings() {
    try {
        const response = await api.get('/settings/system');
        return response.data;
    } catch (error) {
        console.error('Error fetching system settings:', error);
        throw error;
    }
}

/**
 * Update system settings (admin only)
 * @param {Object} settings - System settings to update
 * @returns {Promise<Object>} Updated system settings
 */
export async function updateSystemSettings(settings) {
    try {
        const response = await api.patch('/settings/system', settings);
        return response.data;
    } catch (error) {
        console.error('Error updating system settings:', error);
        throw error;
    }
}

/**
 * Get user preferences for quick access
 * @returns {Promise<Object>} User preferences
 */
export async function getUserPreferences() {
    try {
        const settings = await getSettings();
        return {
            theme: settings.theme?.mode || 'light',
            language: settings.general?.language || 'en',
            timezone: settings.general?.timezone || 'UTC',
            notifications: settings.notifications?.inApp?.enabled || true
        };
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            notifications: true
        };
    }
}

/**
 * Update user preferences
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<void>}
 */
export async function updateUserPreferences(preferences) {
    try {
        const updates = {};

        if (preferences.theme) {
            updates.theme = { mode: preferences.theme };
        }

        if (preferences.language || preferences.timezone) {
            updates.general = {};
            if (preferences.language) updates.general.language = preferences.language;
            if (preferences.timezone) updates.general.timezone = preferences.timezone;
        }

        if (preferences.notifications !== undefined) {
            updates.notifications = {
                inApp: { enabled: preferences.notifications }
            };
        }

        // Update each section separately
        for (const [section, sectionData] of Object.entries(updates)) {
            await updateSettings(section, sectionData);
        }
    } catch (error) {
        console.error('Error updating user preferences:', error);
        throw error;
    }
}

/**
 * Merge settings with defaults recursively
 * @param {Object} settings - Current settings
 * @param {Object} defaults - Default settings
 * @returns {Object} Merged settings
 */
function mergeWithDefaults(settings, defaults) {
    const result = { ...defaults };

    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            if (typeof settings[key] === 'object' && settings[key] !== null && !Array.isArray(settings[key])) {
                result[key] = mergeWithDefaults(settings[key], defaults[key] || {});
            } else {
                result[key] = settings[key];
            }
        }
    }

    return result;
}

/**
 * Validate settings before saving - simplified version
 * @param {string} section - Settings section
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validation result
 */
export function validateSettings(section, settings) {
    const errors = [];

    switch (section) {
        case 'security':
            if (settings.passwordPolicy?.minimumLength < 6) {
                errors.push('Minimum password length must be at least 6 characters');
            }
            if (settings.sessionManagement?.sessionDuration < 30) {
                errors.push('Session duration must be at least 30 minutes');
            }
            break;

        case 'general':
            if (!settings.language || !settings.timezone) {
                errors.push('Language and timezone are required');
            }
            break;
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export default {
    getSettings,
    updateSettings,
    updateAllSettings,
    resetSettings,
    exportSettings,
    importSettings,
    getSystemSettings,
    updateSystemSettings,
    getUserPreferences,
    updateUserPreferences,
    validateSettings,
    defaultSettings
};