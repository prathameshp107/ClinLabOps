require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import logger middleware
const logger = require('./middleware/logger');

// Load configuration
const config = require('./config/config');

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'] // Expose these headers to frontend
}));
app.use(express.json());

// Log all requests
app.use(logger);

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Basic health check route
app.get('/', (req, res) => {
    res.send('LabTasker Backend API is running');
});

// Dedicated health check endpoint for deployment verification
app.get('/health', async (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
        },
        database: {
            status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
        }
    };

    try {
        // Test database connectivity
        await mongoose.connection.db.admin().ping();
        healthCheck.database.status = 'Connected';
        healthCheck.database.ping = 'OK';
    } catch (error) {
        healthCheck.database.status = 'Disconnected';
        healthCheck.database.error = error.message;
        return res.status(503).json(healthCheck);
    }

    res.status(200).json(healthCheck);
});

// MongoDB connection - only connect if not already connected
if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.mongodbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('✅ MongoDB connected successfully'))
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err.message);
            process.exit(1);
        });
} else {
    console.log('✅ MongoDB already connected');
}

// Initialize email service
const emailService = require('./services/emailService');
if (config.email.provider) {
    emailService.initialize(config.email)
        .then(() => {
            // Verify connection
            return emailService.verifyConnection();
        })
        .then(() => {
            // Start email queue
            emailService.startQueue();
        })
        .catch((error) => {
            console.error('❌ Email service initialization failed:', error.message);
            // Don't exit the application, just log the error
        });
} else {
    console.log('📧 Email service not configured - skipping initialization');
}

const enquiriesRouter = require('./routes/enquiries');
app.use('/api/enquiries', enquiriesRouter);

const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const activitiesRouter = require('./routes/activities');
app.use('/api/activities', activitiesRouter);

// Register tasks route
app.use('/api/tasks', require('./routes/tasks'));

// Register experiments route
const experimentsRouter = require('./routes/experiments');
app.use('/api/experiments', experimentsRouter);

// Protocol routes
const protocolsRouter = require('./routes/protocols');
app.use('/api/protocols', protocolsRouter);

const equipmentsRouter = require('./routes/equipments');
app.use('/api/equipments', equipmentsRouter);

// User management routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Inventory management routes
const inventoryRouter = require('./routes/inventory');
app.use('/api/inventory', inventoryRouter);

// Notification routes
const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);

// Dashboard routes
const dashboardRouter = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRouter);

// Compliance routes
const complianceRouter = require('./routes/compliance');
app.use('/api/compliance', complianceRouter);

// File upload routes
const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

// Report generation routes
const reportsRouter = require('./routes/reports');
app.use('/api/reports', reportsRouter);

// Settings routes
const settingsRouter = require('./routes/settings');
app.use('/api/settings', settingsRouter);

// Animal management routes
const animalsRouter = require('./routes/animals');
app.use('/api/animals', animalsRouter);

// Breeding management routes
const breedingRouter = require('./routes/breeding');
app.use('/api/breeding', breedingRouter);

// Cage management routes
const cagesRouter = require('./routes/cages');
app.use('/api/cages', cagesRouter);

// Uploaded reports routes (original)
const uploadedReportsRouter = require('./routes/uploadedReports');
app.use('/api/uploaded-reports', uploadedReportsRouter);

// GridFS reports routes (new)
const gridfsReportsRouter = require('./routes/gridfsReports');
app.use('/api/gridfs-reports', gridfsReportsRouter);

// Initialize deadline notification service
const deadlineNotificationService = require('./services/deadlineNotificationService');
// Start the scheduler in production mode
if (config.nodeEnv === 'production') {
    deadlineNotificationService.startScheduler();
}

// Deadline notification routes
const deadlineNotificationsRouter = require('./routes/deadlineNotifications');
app.use('/api/deadline-notifications', deadlineNotificationsRouter);

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
}

module.exports = app;