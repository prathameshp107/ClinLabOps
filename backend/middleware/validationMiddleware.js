const validateSettings = (req, res, next) => {
    const { section } = req.params;
    const data = req.body;

    try {
        // Validate based on section
        switch (section) {
            case 'general':
                validateGeneralSettings(data);
                break;
            case 'notifications':
                validateNotificationSettings(data);
                break;
            case 'security':
                validateSecuritySettings(data);
                break;
            case 'privacy':
                validatePrivacySettings(data);
                break;
            case 'theme':
                validateThemeSettings(data);
                break;
            case 'integrations':
                validateIntegrationSettings(data);
                break;
            case 'data':
                validateDataSettings(data);
                break;
            case 'system':
                validateSystemSettings(data);
                break;
            default:
                // For full settings update, validate all sections
                if (!section) {
                    validateAllSettings(data);
                }
                break;
        }

        next();
    } catch (error) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.message
        });
    }
};

const validateGeneralSettings = (data) => {
    const errors = [];

    if (data.language && !['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(data.language)) {
        errors.push('Invalid language selection');
    }

    if (data.dateFormat && !['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'dd MMM yyyy', 'MMM dd, yyyy'].includes(data.dateFormat)) {
        errors.push('Invalid date format');
    }

    if (data.timeFormat && !['12h', '24h'].includes(data.timeFormat)) {
        errors.push('Invalid time format');
    }

    if (data.sessionTimeout && (data.sessionTimeout < 5 || data.sessionTimeout > 480)) {
        errors.push('Session timeout must be between 5 and 480 minutes');
    }

    if (data.defaultView && !['dashboard', 'tasks', 'projects', 'experiments', 'protocols'].includes(data.defaultView)) {
        errors.push('Invalid default view');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateNotificationSettings = (data) => {
    const errors = [];

    // Validate email notifications
    if (data.email) {
        const booleanFields = ['enabled', 'taskAssignments', 'projectUpdates', 'systemAlerts', 'weeklyDigest', 'marketingEmails'];
        booleanFields.forEach(field => {
            if (data.email[field] !== undefined && typeof data.email[field] !== 'boolean') {
                errors.push(`Email ${field} must be a boolean value`);
            }
        });
    }

    // Validate push notifications
    if (data.push) {
        const booleanFields = ['enabled', 'taskReminders', 'deadlineAlerts', 'mentions', 'comments'];
        booleanFields.forEach(field => {
            if (data.push[field] !== undefined && typeof data.push[field] !== 'boolean') {
                errors.push(`Push ${field} must be a boolean value`);
            }
        });
    }

    // Validate in-app notifications
    if (data.inApp) {
        const booleanFields = ['enabled', 'sound', 'desktop', 'taskUpdates', 'systemMessages'];
        booleanFields.forEach(field => {
            if (data.inApp[field] !== undefined && typeof data.inApp[field] !== 'boolean') {
                errors.push(`In-app ${field} must be a boolean value`);
            }
        });
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateSecuritySettings = (data) => {
    const errors = [];

    // Validate two-factor authentication
    if (data.twoFactorAuth) {
        if (data.twoFactorAuth.method && !['app', 'sms', 'email'].includes(data.twoFactorAuth.method)) {
            errors.push('Invalid two-factor authentication method');
        }
    }

    // Validate session management
    if (data.sessionManagement) {
        if (data.sessionManagement.sessionDuration && (data.sessionManagement.sessionDuration < 30 || data.sessionManagement.sessionDuration > 43200)) {
            errors.push('Session duration must be between 30 minutes and 30 days');
        }
        if (data.sessionManagement.idleTimeout && (data.sessionManagement.idleTimeout < 5 || data.sessionManagement.idleTimeout > 120)) {
            errors.push('Idle timeout must be between 5 and 120 minutes');
        }
    }

    // Validate password policy
    if (data.passwordPolicy) {
        if (data.passwordPolicy.minimumLength && (data.passwordPolicy.minimumLength < 6 || data.passwordPolicy.minimumLength > 32)) {
            errors.push('Password minimum length must be between 6 and 32 characters');
        }
        if (data.passwordPolicy.passwordExpiry && (data.passwordPolicy.passwordExpiry < 30 || data.passwordPolicy.passwordExpiry > 365)) {
            errors.push('Password expiry must be between 30 and 365 days');
        }
    }

    // Validate login attempts
    if (data.loginAttempts) {
        if (data.loginAttempts.maxAttempts && (data.loginAttempts.maxAttempts < 3 || data.loginAttempts.maxAttempts > 10)) {
            errors.push('Maximum login attempts must be between 3 and 10');
        }
        if (data.loginAttempts.lockoutDuration && (data.loginAttempts.lockoutDuration < 5 || data.loginAttempts.lockoutDuration > 1440)) {
            errors.push('Lockout duration must be between 5 minutes and 24 hours');
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validatePrivacySettings = (data) => {
    const errors = [];

    if (data.profileVisibility && !['public', 'team', 'private'].includes(data.profileVisibility)) {
        errors.push('Invalid profile visibility setting');
    }

    if (data.dataRetention && (data.dataRetention < 30 || data.dataRetention > 2555)) {
        errors.push('Data retention must be between 30 days and 7 years');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateThemeSettings = (data) => {
    const errors = [];

    if (data.mode && !['light', 'dark', 'auto'].includes(data.mode)) {
        errors.push('Invalid theme mode');
    }

    if (data.primaryColor && !['blue', 'green', 'purple', 'red', 'orange', 'teal', 'pink', 'indigo'].includes(data.primaryColor)) {
        errors.push('Invalid primary color');
    }

    if (data.fontSize && !['small', 'medium', 'large'].includes(data.fontSize)) {
        errors.push('Invalid font size');
    }

    if (data.density && !['compact', 'comfortable', 'spacious'].includes(data.density)) {
        errors.push('Invalid layout density');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateIntegrationSettings = (data) => {
    const errors = [];

    // Validate email integration
    if (data.email) {
        if (data.email.provider && !['smtp', 'sendgrid', 'mailgun', 'ses'].includes(data.email.provider)) {
            errors.push('Invalid email provider');
        }
        if (data.email.port && (data.email.port < 1 || data.email.port > 65535)) {
            errors.push('Email port must be between 1 and 65535');
        }
    }

    // Validate calendar integration
    if (data.calendar) {
        if (data.calendar.provider && !['google', 'outlook', 'caldav'].includes(data.calendar.provider)) {
            errors.push('Invalid calendar provider');
        }
    }

    // Validate storage integration
    if (data.storage) {
        if (data.storage.provider && !['local', 's3', 'dropbox', 'google-drive'].includes(data.storage.provider)) {
            errors.push('Invalid storage provider');
        }
        if (data.storage.backupFrequency && !['daily', 'weekly', 'monthly'].includes(data.storage.backupFrequency)) {
            errors.push('Invalid backup frequency');
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateDataSettings = (data) => {
    const errors = [];

    // Validate backup settings
    if (data.backup) {
        if (data.backup.frequency && !['daily', 'weekly', 'monthly'].includes(data.backup.frequency)) {
            errors.push('Invalid backup frequency');
        }
        if (data.backup.retention && (data.backup.retention < 7 || data.backup.retention > 365)) {
            errors.push('Backup retention must be between 7 and 365 days');
        }
    }

    // Validate import settings
    if (data.import) {
        if (data.import.maxFileSize && (data.import.maxFileSize < 1 || data.import.maxFileSize > 100)) {
            errors.push('Maximum file size must be between 1 and 100 MB');
        }
        if (data.import.duplicateHandling && !['skip', 'replace', 'merge'].includes(data.import.duplicateHandling)) {
            errors.push('Invalid duplicate handling method');
        }
    }

    // Validate export settings
    if (data.export) {
        if (data.export.format && !['csv', 'xlsx', 'json', 'pdf'].includes(data.export.format)) {
            errors.push('Invalid export format');
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateSystemSettings = (data) => {
    const errors = [];

    // Validate logging settings
    if (data.logging) {
        if (data.logging.level && !['debug', 'info', 'warn', 'error'].includes(data.logging.level)) {
            errors.push('Invalid logging level');
        }
        if (data.logging.retention && (data.logging.retention < 7 || data.logging.retention > 365)) {
            errors.push('Log retention must be between 7 and 365 days');
        }
    }

    // Validate performance settings
    if (data.performance) {
        if (data.performance.cacheDuration && (data.performance.cacheDuration < 60 || data.performance.cacheDuration > 3600)) {
            errors.push('Cache duration must be between 60 and 3600 seconds');
        }
    }

    // Validate database settings
    if (data.database) {
        if (data.database.optimizeFrequency && !['daily', 'weekly', 'monthly'].includes(data.database.optimizeFrequency)) {
            errors.push('Invalid database optimization frequency');
        }
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

const validateAllSettings = (data) => {
    if (data.general) validateGeneralSettings(data.general);
    if (data.notifications) validateNotificationSettings(data.notifications);
    if (data.security) validateSecuritySettings(data.security);
    if (data.privacy) validatePrivacySettings(data.privacy);
    if (data.theme) validateThemeSettings(data.theme);
    if (data.integrations) validateIntegrationSettings(data.integrations);
    if (data.data) validateDataSettings(data.data);
    if (data.system) validateSystemSettings(data.system);
};

module.exports = {
    validateSettings
};