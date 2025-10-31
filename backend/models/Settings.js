const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // General Settings
    general: {
        language: {
            type: String,
            default: 'en',
            enum: ['en', 'es', 'fr', 'de', 'ja', 'zh']
        },
        timezone: {
            type: String,
            default: 'UTC'
        },
        dateFormat: {
            type: String,
            default: 'MM/dd/yyyy',
            enum: ['MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'dd MMM yyyy', 'MMM dd, yyyy']
        },
        timeFormat: {
            type: String,
            default: '12h',
            enum: ['12h', '24h']
        },
        autoSave: {
            type: Boolean,
            default: true
        },
        sessionTimeout: {
            type: Number,
            default: 30,
            min: 5,
            max: 480
        },
        defaultView: {
            type: String,
            default: 'dashboard',
            enum: ['dashboard', 'tasks', 'projects', 'experiments', 'protocols']
        }
    },

    // Notification Settings
    notifications: {
        email: {
            enabled: { type: Boolean, default: true },
            taskAssignments: { type: Boolean, default: true },
            projectUpdates: { type: Boolean, default: true },
            systemAlerts: { type: Boolean, default: true },
            weeklyDigest: { type: Boolean, default: true },
            marketingEmails: { type: Boolean, default: false }
        },
        push: {
            enabled: { type: Boolean, default: true },
            taskReminders: { type: Boolean, default: true },
            deadlineAlerts: { type: Boolean, default: true },
            mentions: { type: Boolean, default: true },
            comments: { type: Boolean, default: true }
        },
        inApp: {
            enabled: { type: Boolean, default: true },
            sound: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            taskUpdates: { type: Boolean, default: true },
            systemMessages: { type: Boolean, default: true }
        }
    },

    // Security Settings
    security: {
        twoFactorAuth: {
            enabled: { type: Boolean, default: false },
            method: {
                type: String,
                default: 'app',
                enum: ['app', 'sms', 'email']
            },
            secret: String, // Store encrypted
            backupCodes: [String] // Store encrypted
        },
        sessionManagement: {
            multipleLogins: { type: Boolean, default: true },
            sessionDuration: {
                type: Number,
                default: 720,
                min: 30,
                max: 43200
            },
            idleTimeout: {
                type: Number,
                default: 30,
                min: 5,
                max: 120
            }
        },
        passwordPolicy: {
            requireSpecialChars: { type: Boolean, default: true },
            minimumLength: {
                type: Number,
                default: 8,
                min: 6,
                max: 32
            },
            requireNumbers: { type: Boolean, default: true },
            requireUppercase: { type: Boolean, default: true },
            passwordExpiry: {
                type: Number,
                default: 90,
                min: 30,
                max: 365
            }
        },
        loginAttempts: {
            maxAttempts: {
                type: Number,
                default: 5,
                min: 3,
                max: 10
            },
            lockoutDuration: {
                type: Number,
                default: 15,
                min: 5,
                max: 1440
            }
        }
    },

    // Privacy Settings
    privacy: {
        profileVisibility: {
            type: String,
            default: 'team',
            enum: ['public', 'team', 'private']
        },
        activityTracking: { type: Boolean, default: true },
        dataRetention: {
            type: Number,
            default: 365,
            min: 30,
            max: 2555 // ~7 years
        },
        shareUsageData: { type: Boolean, default: false },
        cookiesAccepted: { type: Boolean, default: true },
        dataProcessingConsent: { type: Boolean, default: true }
    },

    // Theme Settings
    theme: {
        mode: {
            type: String,
            default: 'light',
            enum: ['light', 'dark', 'auto']
        },
        primaryColor: {
            type: String,
            default: 'blue',
            enum: ['blue', 'green', 'purple', 'red', 'orange', 'teal', 'pink', 'indigo']
        },
        fontSize: {
            type: String,
            default: 'medium',
            enum: ['small', 'medium', 'large']
        },
        density: {
            type: String,
            default: 'comfortable',
            enum: ['compact', 'comfortable', 'spacious']
        },
        sidebarCollapsed: { type: Boolean, default: false },
        animationsEnabled: { type: Boolean, default: true }
    },

    // Integration Settings
    integrations: {
        slack: {
            enabled: { type: Boolean, default: false },
            workspace: String,
            channel: String,
            webhookUrl: String, // Store encrypted
            notifications: { type: Boolean, default: true }
        },
        email: {
            provider: {
                type: String,
                default: 'smtp',
                enum: ['smtp', 'sendgrid', 'mailgun', 'ses']
            },
            host: String,
            port: { type: Number, default: 587 },
            secure: { type: Boolean, default: false },
            username: String, // Store encrypted
            password: String, // Store encrypted
            from: String
        },
        calendar: {
            provider: {
                type: String,
                default: 'google',
                enum: ['google', 'outlook', 'caldav']
            },
            syncEnabled: { type: Boolean, default: false },
            calendarId: String,
            accessToken: String, // Store encrypted
            refreshToken: String // Store encrypted
        },
        storage: {
            provider: {
                type: String,
                default: 'local',
                enum: ['local', 's3', 'dropbox', 'google-drive']
            },
            autoBackup: { type: Boolean, default: false },
            backupFrequency: {
                type: String,
                default: 'daily',
                enum: ['daily', 'weekly', 'monthly']
            },
            credentials: mongoose.Schema.Types.Mixed // Store encrypted
        }
    },

    // Data Management Settings
    data: {
        backup: {
            autoBackup: { type: Boolean, default: true },
            frequency: {
                type: String,
                default: 'weekly',
                enum: ['daily', 'weekly', 'monthly']
            },
            retention: {
                type: Number,
                default: 30,
                min: 7,
                max: 365
            },
            includeFiles: { type: Boolean, default: true }
        },
        import: {
            allowedFormats: {
                type: [String],
                default: ['csv', 'xlsx', 'json'],
                enum: ['csv', 'xlsx', 'json', 'xml']
            },
            maxFileSize: {
                type: Number,
                default: 10,
                min: 1,
                max: 100
            },
            duplicateHandling: {
                type: String,
                default: 'skip',
                enum: ['skip', 'replace', 'merge']
            }
        },
        export: {
            format: {
                type: String,
                default: 'csv',
                enum: ['csv', 'xlsx', 'json', 'pdf']
            },
            includeMetadata: { type: Boolean, default: true },
            compression: { type: Boolean, default: true }
        }
    },

    // Project Settings
    project: {
        categories: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, default: '' },
            icon: { type: String, default: 'FolderPlus' },
            color: { type: String, default: 'text-blue-500' },
            bgColor: { type: String, default: 'bg-blue-500/10' },
            borderColor: { type: String, default: 'border-blue-500/20' },
            keywords: { type: [String], default: [] },
            templates: [{
                id: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, default: '' }
            }],
            subTypes: [{
                id: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, default: '' },
                icon: { type: String, default: 'FileText' },
                color: { type: String, default: 'text-blue-600' },
                bgColor: { type: String, default: 'bg-blue-500/10' },
                templates: [{
                    id: { type: String, required: true },
                    name: { type: String, required: true },
                    description: { type: String, default: '' }
                }]
            }]
        }]
    },

    // System Settings (Admin only)
    system: {
        maintenance: {
            maintenanceMode: { type: Boolean, default: false },
            maintenanceMessage: String,
            allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        },
        logging: {
            level: {
                type: String,
                default: 'info',
                enum: ['debug', 'info', 'warn', 'error']
            },
            retention: {
                type: Number,
                default: 30,
                min: 7,
                max: 365
            },
            includeUserActions: { type: Boolean, default: true }
        },
        performance: {
            cacheEnabled: { type: Boolean, default: true },
            cacheDuration: {
                type: Number,
                default: 300,
                min: 60,
                max: 3600
            },
            compressionEnabled: { type: Boolean, default: true },
            lazyLoading: { type: Boolean, default: true }
        },
        database: {
            autoOptimize: { type: Boolean, default: true },
            optimizeFrequency: {
                type: String,
                default: 'weekly',
                enum: ['daily', 'weekly', 'monthly']
            },
            backupBeforeOptimize: { type: Boolean, default: true }
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
settingsSchema.index({ userId: 1 }, { unique: true });
settingsSchema.index({ 'general.language': 1 });
settingsSchema.index({ 'theme.mode': 1 });

// Virtual for settings summary
settingsSchema.virtual('summary').get(function () {
    return {
        language: this.general?.language || 'en',
        theme: this.theme?.mode || 'light',
        notifications: this.notifications?.email?.enabled || false,
        twoFactorAuth: this.security?.twoFactorAuth?.enabled || false
    };
});

// Methods
settingsSchema.methods.getPublicSettings = function () {
    const settings = this.toObject();

    // Remove sensitive information
    if (settings.security?.twoFactorAuth?.secret) {
        delete settings.security.twoFactorAuth.secret;
    }
    if (settings.security?.twoFactorAuth?.backupCodes) {
        delete settings.security.twoFactorAuth.backupCodes;
    }
    if (settings.integrations?.slack?.webhookUrl) {
        delete settings.integrations.slack.webhookUrl;
    }
    if (settings.integrations?.email?.password) {
        delete settings.integrations.email.password;
    }
    if (settings.integrations?.calendar?.accessToken) {
        delete settings.integrations.calendar.accessToken;
    }
    if (settings.integrations?.calendar?.refreshToken) {
        delete settings.integrations.calendar.refreshToken;
    }
    if (settings.integrations?.storage?.credentials) {
        delete settings.integrations.storage.credentials;
    }

    return settings;
};

// Static methods
settingsSchema.statics.getDefaultSettings = function () {
    return {
        general: {
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/dd/yyyy',
            timeFormat: '12h',
            autoSave: true,
            sessionTimeout: 30,
            defaultView: 'dashboard'
        },
        notifications: {
            email: {
                enabled: true,
                taskAssignments: true,
                projectUpdates: true,
                systemAlerts: true,
                weeklyDigest: true,
                marketingEmails: false
            },
            push: {
                enabled: true,
                taskReminders: true,
                deadlineAlerts: true,
                mentions: true,
                comments: true
            },
            inApp: {
                enabled: true,
                sound: true,
                desktop: true,
                taskUpdates: true,
                systemMessages: true
            }
        },
        security: {
            twoFactorAuth: {
                enabled: false,
                method: 'app'
            },
            sessionManagement: {
                multipleLogins: true,
                sessionDuration: 720,
                idleTimeout: 30
            },
            passwordPolicy: {
                requireSpecialChars: true,
                minimumLength: 8,
                requireNumbers: true,
                requireUppercase: true,
                passwordExpiry: 90
            },
            loginAttempts: {
                maxAttempts: 5,
                lockoutDuration: 15
            }
        },
        privacy: {
            profileVisibility: 'team',
            activityTracking: true,
            dataRetention: 365,
            shareUsageData: false,
            cookiesAccepted: true,
            dataProcessingConsent: true
        },
        theme: {
            mode: 'light',
            primaryColor: 'blue',
            fontSize: 'medium',
            density: 'comfortable',
            sidebarCollapsed: false,
            animationsEnabled: true
        },
        integrations: {
            slack: { enabled: false },
            email: { provider: 'smtp' },
            calendar: { provider: 'google', syncEnabled: false },
            storage: { provider: 'local', autoBackup: false }
        },
        data: {
            backup: {
                autoBackup: true,
                frequency: 'weekly',
                retention: 30,
                includeFiles: true
            },
            import: {
                allowedFormats: ['csv', 'xlsx', 'json'],
                maxFileSize: 10,
                duplicateHandling: 'skip'
            },
            export: {
                format: 'csv',
                includeMetadata: true,
                compression: true
            }
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
                        { id: "basic-research", name: "Basic Research", description: "Standard research project template" },
                        { id: "experimental", name: "Experimental Study", description: "Controlled experiment template" },
                        { id: "data-analysis", name: "Data Analysis", description: "Data-driven research template" }
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
                    templates: [
                        { id: "fda", name: "FDA Submission", description: "FDA regulatory submission template" },
                        { id: "iso", name: "ISO Compliance", description: "ISO standard compliance template" },
                        { id: "oecd", name: "OECD Guidelines", description: "OECD testing guidelines template" }
                    ]
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
                        { id: "pilot", name: "Pilot Study", description: "Small-scale preliminary study template" },
                        { id: "academic", name: "Academic Research", description: "University research project template" },
                        { id: "consulting", name: "Consulting Project", description: "Client consulting project template" }
                    ]
                }
            ]
        },
        system: {
            maintenance: { maintenanceMode: false },
            logging: { level: 'info', retention: 30, includeUserActions: true },
            performance: {
                cacheEnabled: true,
                cacheDuration: 300,
                compressionEnabled: true,
                lazyLoading: true
            },
            database: {
                autoOptimize: true,
                optimizeFrequency: 'weekly',
                backupBeforeOptimize: true
            }
        }
    };
};

module.exports = mongoose.model('Settings', settingsSchema);