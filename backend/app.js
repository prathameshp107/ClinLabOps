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
    credentials: config.cors.credentials
}));
app.use(express.json());

// Log all requests
app.use(logger);

// Health check route
app.get('/', (req, res) => {
    res.send('LabTasker Backend API is running');
});

// MongoDB connection
mongoose.connect(config.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

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

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
}

module.exports = app;