require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send('LabTasker Backend API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

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

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;