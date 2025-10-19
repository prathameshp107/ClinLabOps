const Settings = require('../models/Settings');
const User = require('../models/User');
const crypto = require('crypto');
const ActivityService = require('../services/activityService');

// Encryption helpers for sensitive data
const encrypt = (text) => {
    if (!text) return null;
    const algorithm = 'aes-256-cbc';
    const key = process.env.ENCRYPTION_KEY;
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (encryptedText) => {
    if (!encryptedText) return null;
    const algorithm = 'aes-256-cbc';
    const key = process.env.ENCRYPTION_KEY;

    try {
        const [iv, encrypted] = encryptedText.split(':');
        const decipher = crypto.createDecipher(algorithm, key);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

/**
 * Get user settings
 * @route GET /api/settings
 * @access Private
 */
const getSettings = async (req, res) => {
    try {
        const userId = req.user._id;

        let settings = await Settings.findOne({ userId }).populate('userId', 'name email role');

        if (!settings) {
            // Create default settings for new user
            const defaultSettings = Settings.getDefaultSettings();
            settings = new Settings({
                userId,
                ...defaultSettings
            });
            await settings.save();
        }

        // Return public settings (sensitive data removed)
        res.json(settings.getPublicSettings());
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            message: 'Failed to fetch settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update specific settings section
 * @route PATCH /api/settings/:section
 * @access Private
 */
const updateSettingsSection = async (req, res) => {
    try {
        const userId = req.user._id;
        const { section } = req.params;
        const updates = req.body;

        // Validate section
        const validSections = ['general', 'notifications', 'security', 'privacy', 'theme', 'integrations', 'data', 'system'];
        if (!validSections.includes(section)) {
            return res.status(400).json({ message: 'Invalid settings section' });
        }

        // Check if user has permission to update system settings
        if (section === 'system') {
            const user = await User.findById(userId);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admin role required for system settings.' });
            }
        }

        // Encrypt sensitive data
        if (section === 'security' && updates.twoFactorAuth?.secret) {
            updates.twoFactorAuth.secret = encrypt(updates.twoFactorAuth.secret);
        }
        if (section === 'integrations') {
            if (updates.slack?.webhookUrl) {
                updates.slack.webhookUrl = encrypt(updates.slack.webhookUrl);
            }
            if (updates.email?.password) {
                updates.email.password = encrypt(updates.email.password);
            }
            if (updates.calendar?.accessToken) {
                updates.calendar.accessToken = encrypt(updates.calendar.accessToken);
            }
            if (updates.calendar?.refreshToken) {
                updates.calendar.refreshToken = encrypt(updates.calendar.refreshToken);
            }
        }

        let settings = await Settings.findOne({ userId });

        if (!settings) {
            // Create new settings with defaults
            const defaultSettings = Settings.getDefaultSettings();
            settings = new Settings({
                userId,
                ...defaultSettings,
                [section]: { ...defaultSettings[section], ...updates }
            });
        } else {
            // Update existing settings
            settings[section] = { ...settings[section].toObject(), ...updates };
            settings.markModified(section);
        }

        await settings.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'settings_updated',
                description: `${req.user.name} updated ${section} settings`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'settings',
                    section: section,
                    operation: 'update'
                }
            });
        }

        res.json({
            message: `${section} settings updated successfully`,
            settings: settings.getPublicSettings()
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            message: 'Failed to update settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update all settings
 * @route PUT /api/settings
 * @access Private
 */
const updateAllSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Check if updating system settings
        if (updates.system) {
            const user = await User.findById(userId);
            if (!user || user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admin role required for system settings.' });
            }
        }

        // Encrypt sensitive data
        if (updates.security?.twoFactorAuth?.secret) {
            updates.security.twoFactorAuth.secret = encrypt(updates.security.twoFactorAuth.secret);
        }
        if (updates.integrations?.slack?.webhookUrl) {
            updates.integrations.slack.webhookUrl = encrypt(updates.integrations.slack.webhookUrl);
        }
        if (updates.integrations?.email?.password) {
            updates.integrations.email.password = encrypt(updates.integrations.email.password);
        }

        let settings = await Settings.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, upsert: true, runValidators: true }
        );

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'settings_updated_all',
                description: `${req.user.name} updated all settings`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'settings',
                    operation: 'update_all'
                }
            });
        }

        res.json({
            message: 'Settings updated successfully',
            settings: settings.getPublicSettings()
        });
    } catch (error) {
        console.error('Error updating all settings:', error);
        res.status(500).json({
            message: 'Failed to update settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Reset settings to defaults
 * @route POST /api/settings/reset
 * @route POST /api/settings/:section/reset
 * @access Private
 */
const resetSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { section } = req.params;

        let settings = await Settings.findOne({ userId });
        const defaultSettings = Settings.getDefaultSettings();

        if (section) {
            // Reset specific section
            if (!defaultSettings[section]) {
                return res.status(400).json({ message: 'Invalid settings section' });
            }

            // Check permissions for system settings
            if (section === 'system') {
                const user = await User.findById(userId);
                if (!user || user.role !== 'admin') {
                    return res.status(403).json({ message: 'Access denied. Admin role required for system settings.' });
                }
            }

            if (settings) {
                settings[section] = defaultSettings[section];
                settings.markModified(section);
                await settings.save();
            } else {
                settings = new Settings({
                    userId,
                    ...defaultSettings
                });
                await settings.save();
            }

            // Log activity
            if (req.user) {
                await ActivityService.logActivity({
                    type: 'settings_reset_section',
                    description: `${req.user.name} reset ${section} settings to defaults`,
                    userId: req.user._id || req.user.id,
                    meta: {
                        category: 'settings',
                        section: section,
                        operation: 'reset_section'
                    }
                });
            }

            res.json({
                message: `${section} settings reset to defaults`,
                settings: settings.getPublicSettings()
            });
        } else {
            // Reset all settings
            if (settings) {
                await Settings.findOneAndDelete({ userId });
            }

            settings = new Settings({
                userId,
                ...defaultSettings
            });
            await settings.save();

            // Log activity
            if (req.user) {
                await ActivityService.logActivity({
                    type: 'settings_reset_all',
                    description: `${req.user.name} reset all settings to defaults`,
                    userId: req.user._id || req.user.id,
                    meta: {
                        category: 'settings',
                        operation: 'reset_all'
                    }
                });
            }

            res.json({
                message: 'All settings reset to defaults',
                settings: settings.getPublicSettings()
            });
        }
    } catch (error) {
        console.error('Error resetting settings:', error);
        res.status(500).json({
            message: 'Failed to reset settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Export user settings
 * @route GET /api/settings/export
 * @access Private
 */
const exportSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { format = 'json' } = req.query;

        const settings = await Settings.findOne({ userId });
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        const exportData = settings.getPublicSettings();
        exportData.exportedAt = new Date().toISOString();
        exportData.exportedBy = req.user.name;

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'settings_exported',
                description: `${req.user.name} exported settings in ${format} format`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'settings',
                    format: format,
                    operation: 'export'
                }
            });
        }

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename="settings-export-${Date.now()}.json"`);
            res.json(exportData);
        } else if (format === 'csv') {
            // Convert to CSV format (simplified)
            const csv = convertToCSV(exportData);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="settings-export-${Date.now()}.csv"`);
            res.send(csv);
        } else {
            res.status(400).json({ message: 'Unsupported export format. Use json or csv.' });
        }
    } catch (error) {
        console.error('Error exporting settings:', error);
        res.status(500).json({
            message: 'Failed to export settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Import user settings
 * @route POST /api/settings/import
 * @access Private
 */
const importSettings = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let importData;
        try {
            const fileContent = req.file.buffer.toString('utf8');
            importData = JSON.parse(fileContent);
        } catch (parseError) {
            return res.status(400).json({ message: 'Invalid JSON file format' });
        }

        // Validate import data structure
        if (!importData || typeof importData !== 'object') {
            return res.status(400).json({ message: 'Invalid settings data format' });
        }

        // Remove sensitive fields that shouldn't be imported
        delete importData._id;
        delete importData.userId;
        delete importData.createdAt;
        delete importData.updatedAt;
        delete importData.exportedAt;
        delete importData.exportedBy;

        // Update settings
        await Settings.findOneAndUpdate(
            { userId },
            { $set: importData },
            { upsert: true, runValidators: true }
        );

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'settings_imported',
                description: `${req.user.name} imported settings`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'settings',
                    operation: 'import'
                }
            });
        }

        const updatedSettings = await Settings.findOne({ userId });

        res.json({
            message: 'Settings imported successfully',
            settings: updatedSettings.getPublicSettings()
        });
    } catch (error) {
        console.error('Error importing settings:', error);
        res.status(500).json({
            message: 'Failed to import settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Get system settings (Admin only)
 * @route GET /api/settings/system
 * @access Private (Admin)
 */
const getSystemSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        // Get system-wide settings (not user-specific)
        const systemSettings = await Settings.findOne({ userId: null });

        if (!systemSettings) {
            const defaultSettings = Settings.getDefaultSettings();
            res.json(defaultSettings.system);
        } else {
            res.json(systemSettings.system);
        }
    } catch (error) {
        console.error('Error fetching system settings:', error);
        res.status(500).json({
            message: 'Failed to fetch system settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * Update system settings (Admin only)
 * @route PATCH /api/settings/system
 * @access Private (Admin)
 */
const updateSystemSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        const updates = req.body;

        // Update or create system-wide settings
        let systemSettings = await Settings.findOneAndUpdate(
            { userId: null },
            { $set: { system: updates } },
            { new: true, upsert: true, runValidators: true }
        );

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'system_settings_updated',
                description: `${req.user.name} updated system settings`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'settings',
                    operation: 'update_system'
                }
            });
        }

        res.json({
            message: 'System settings updated successfully',
            settings: systemSettings.system
        });
    } catch (error) {
        console.error('Error updating system settings:', error);
        res.status(500).json({
            message: 'Failed to update system settings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper function to convert object to CSV
const convertToCSV = (obj, prefix = '') => {
    let csv = '';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                csv += convertToCSV(value, newKey);
            } else {
                csv += `${newKey},${value}\n`;
            }
        }
    }
    return csv;
};

module.exports = {
    getSettings,
    updateSettingsSection,
    updateAllSettings,
    resetSettings,
    exportSettings,
    importSettings,
    getSystemSettings,
    updateSystemSettings
};