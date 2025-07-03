const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Get all activities
router.get('/', activityController.getActivities);

// Get activity by ID
router.get('/:id', activityController.getActivityById);

// Create a new activity
router.post('/', activityController.createActivity);

// Delete an activity
router.delete('/:id', activityController.deleteActivity);

module.exports = router; 