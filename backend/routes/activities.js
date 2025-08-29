const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

// Get activity statistics
router.get('/stats', auth.protect, activityController.getActivityStats);

// Get all activities
router.get('/', auth.protect, activityController.getAllActivities);

// Debug endpoint to check activities without auth (temporary)
router.get('/debug', activityController.getAllActivities);

// Get activity by ID
router.get('/:id', auth.protect, activityController.getActivityById);

// Create a new activity
router.post('/', auth.protect, activityController.createActivity);

module.exports = router; 