require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Import logger middleware
const logger = require('./middleware/logger');

// Load configuration
const config = require('./config/config');

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const reportsDir = path.join(uploadsDir, 'reports');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create reports directory if it doesn't exist
if (!fs.existsSync(reportsDir)) {
    console.log('Creating uploads/reports directory...');
    fs.mkdirSync(reportsDir, { recursive: true });
}

console.log('Upload directories verified:', { uploadsDir, reportsDir });

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'] // Expose these headers to frontend
}));
app.use(express.json({ limit: '10mb' })); // Increase payload limit for file uploads

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

// Enhanced MongoDB connection with better error handling and retry logic
const connectDB = async (retries = 5) => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        console.log('   URI:', config.mongodbUri.replace(/:[^:@]+@/, ':***@')); // Hide password in logs

        await mongoose.connect(config.mongodbUri, {
            dbName: config.dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });

        console.log('✅ MongoDB connected successfully');
        console.log('   Database Name:', config.dbName);
        console.log('   Connection State:', mongoose.connection.readyState);

        // Log additional connection details
        console.log('   Connection Host:', mongoose.connection.host);
        console.log('   Connection Port:', mongoose.connection.port);
        console.log('   Connection Name:', mongoose.connection.name);

        // Test database connectivity
        await mongoose.connection.db.admin().ping();
        console.log('   Database Ping Test: OK');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('   Error Code:', err.code);
        console.error('   Error Name:', err.name);

        if (retries > 0) {
            console.log(`⏳ Retrying connection... (${retries} attempts left)`);
            setTimeout(() => {
                connectDB(retries - 1);
            }, 5000); // Wait 5 seconds before retry
        } else {
            console.error('💥 Failed to connect to MongoDB after all retries');
            process.exit(1);
        }
    }
};

// Connect to MongoDB
connectDB();

// Cleanup old temporary files (older than 1 hour)
const cleanupOldTempFiles = () => {
    try {
        const reportsDir = path.join(__dirname, 'uploads', 'reports');
        if (!fs.existsSync(reportsDir)) return;
        
        const files = fs.readdirSync(reportsDir);
        const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour in milliseconds
        
        files.forEach(file => {
            const filePath = path.join(reportsDir, file);
            try {
                const stats = fs.statSync(filePath);
                if (stats.mtime.getTime() < oneHourAgo) {
                    fs.unlinkSync(filePath);
                    console.log('Cleaned up old temporary file:', filePath);
                }
            } catch (err) {
                console.error('Error checking/cleaning file:', filePath, err.message);
            }
        });
    } catch (err) {
        console.error('Error during temporary file cleanup:', err.message);
    }
};

// Run cleanup on startup and every hour
cleanupOldTempFiles();
setInterval(cleanupOldTempFiles, 60 * 60 * 1000); // Every hour

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
    const server = app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
        console.log(`🔗 Health check endpoint: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('🛑 SIGTERM received, shutting down gracefully');
        server.close(() => {
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    });

    process.on('SIGINT', () => {
        console.log('🛑 SIGINT received, shutting down gracefully');
        server.close(() => {
            mongoose.connection.close(false, () => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    });
}

module.exports = app;