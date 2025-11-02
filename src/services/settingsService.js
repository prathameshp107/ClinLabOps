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
    },
    project: {
        categories: [
            {
                id: "research",
                name: "Research",
                description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
                icon: "FlaskConical",
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/20",
                keywords: ["research", "exploratory", "proof-of-concept", "scientific", "study", "experiment", "innovation", "discovery", "laboratory", "genomics", "drug-discovery", "ai", "machine-learning"],
                templates: [
                    { id: "basic-research", name: "Basic Research", description: "Standard research project template", tags: ["research", "scientific", "study"] },
                    { id: "experimental", name: "Experimental Study", description: "Controlled experiment template", tags: ["experiment", "controlled-study", "methodology"] },
                    { id: "data-analysis", name: "Data Analysis", description: "Data-driven research template", tags: ["data-analysis", "statistics", "research"] }
                ]
            },
            {
                id: "regulatory",
                name: "Regulatory",
                description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
                icon: "FileText",
                color: "text-amber-500",
                bgColor: "bg-amber-500/10",
                borderColor: "border-amber-500/20",
                keywords: ["regulatory", "iso", "oecd", "fda", "guideline", "compliance", "authority", "submission", "validation", "testing", "environmental", "monitoring", "biomedical", "device-testing", "safety"],
                subTypes: [
                    {
                        id: "iso",
                        name: "ISO Standards",
                        description: "International Organization for Standardization standards",
                        icon: "FileTextIcon",
                        color: "text-blue-600",
                        bgColor: "bg-blue-500/10",
                        templates: [
                            { id: "iso-10993-1", name: "ISO 10993-1 Biological Evaluation", description: "Biological evaluation of medical devices - Part 1: Evaluation and testing within a risk management process", tags: ["biocompatibility", "risk-management", "medical-devices"] },
                            { id: "iso-14155", name: "ISO 14155 Clinical Investigation", description: "Clinical investigation of medical devices for human subjects - Good clinical practice", tags: ["clinical-trials", "good-clinical-practice", "medical-devices"] },
                            { id: "iso-13485", name: "ISO 13485 Quality Management", description: "Quality management systems - Requirements for regulatory purposes", tags: ["quality-systems", "regulatory-compliance", "standards"] }
                        ]
                    },
                    {
                        id: "oecd",
                        name: "OECD Guidelines",
                        description: "Organisation for Economic Co-operation and Development guidelines",
                        icon: "FileSpreadsheet",
                        color: "text-green-600",
                        bgColor: "bg-green-500/10",
                        templates: [
                            { id: "oecd-401", name: "OECD Guideline 401", description: "Acute Oral Toxicity - Fixed Dose Procedure", tags: ["toxicity", "oral-administration", "safety-testing"] },
                            { id: "oecd-402", name: "OECD Guideline 402", description: "Acute Dermal Toxicity", tags: ["toxicity", "dermal-exposure", "safety-testing"] },
                            { id: "oecd-403", name: "OECD Guideline 403", description: "Acute Inhalation Toxicity", tags: ["toxicity", "inhalation-exposure", "safety-testing"] }
                        ]
                    },
                    {
                        id: "fda",
                        name: "FDA Regulations",
                        description: "U.S. Food and Drug Administration regulations",
                        icon: "FileTextIcon",
                        color: "text-red-600",
                        bgColor: "bg-red-500/10",
                        templates: [
                            { id: "fda-21-cfr-11", name: "FDA 21 CFR Part 11", description: "Electronic Records and Electronic Signatures", tags: ["electronic-records", "digital-signatures", "compliance"] },
                            { id: "fda-510k", name: "FDA 510(k) Template", description: "Premarket Notification for Medical Devices", tags: ["medical-devices", "premarket-notification", "regulatory-submission"] },
                            { id: "fda-ind", name: "FDA IND Application", description: "Investigational New Drug Application", tags: ["drug-development", "clinical-trials", "regulatory-submission"] }
                        ]
                    },
                    {
                        id: "ema",
                        name: "EMA Guidelines",
                        description: "European Medicines Agency guidelines",
                        icon: "FileTextIcon",
                        color: "text-purple-600",
                        bgColor: "bg-purple-500/10",
                        templates: [
                            { id: "ema-cta", name: "EMA Clinical Trial Application", description: "Application for authorization of a clinical trial", tags: ["clinical-trials", "authorization", "european-regulations"] },
                            { id: "ema-rmp", name: "EMA Risk Management Plan", description: "Pharmacovigilance risk management plan template", tags: ["risk-management", "pharmacovigilance", "safety-monitoring"] }
                        ]
                    },
                    {
                        id: "ich",
                        name: "ICH Guidelines",
                        description: "International Council for Harmonisation guidelines",
                        icon: "FileTextIcon",
                        color: "text-indigo-600",
                        bgColor: "bg-indigo-500/10",
                        templates: [
                            { id: "ich-e6", name: "ICH E6 (R2) Good Clinical Practice", description: "Guideline for good clinical practice in clinical trials", tags: ["clinical-trials", "good-clinical-practice", "international-harmonization"] },
                            { id: "ich-q7", name: "ICH Q7 Active Pharmaceutical Ingredients", description: "Good manufacturing practice guidance for active pharmaceutical ingredients", tags: ["manufacturing", "quality-control", "pharmaceutical-ingredients"] }
                        ]
                    }
                ],
                templates: [] // Regulatory category templates (if any)
            },
            {
                id: "miscellaneous",
                name: "Miscellaneous",
                description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
                icon: "Layers",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/20",
                keywords: ["pilot", "academic", "client", "miscellaneous", "other", "general", "management", "platform", "system"],
                templates: [
                    { id: "pilot", name: "Pilot Study", description: "Small-scale preliminary study template", tags: ["pilot-study", "feasibility", "preliminary-research"] },
                    { id: "academic", name: "Academic Research", description: "University research project template", tags: ["academic", "literature-review", "methodology"] },
                    { id: "consulting", name: "Consulting Project", description: "Client consulting project template", tags: ["client-project", "deliverables", "milestones"] }
                ]
            }
        ]
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
    // If no settings provided, return defaults
    if (!settings) return { ...defaults };

    // If settings is not an object, return it
    if (typeof settings !== 'object' || Array.isArray(settings)) return settings;

    // Start with a copy of defaults
    const result = { ...defaults };

    // Merge each property from settings
    for (const key in settings) {
        if (settings.hasOwnProperty(key)) {
            // If both values are objects (but not arrays), merge recursively
            if (typeof settings[key] === 'object' && settings[key] !== null && !Array.isArray(settings[key]) &&
                typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                result[key] = mergeWithDefaults(settings[key], defaults[key]);
            } else {
                // For arrays, primitives, or mismatched types, use settings value
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