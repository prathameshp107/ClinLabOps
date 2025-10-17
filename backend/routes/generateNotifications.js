const express = require('express');
const router = express.Router();
const { generateNotificationsFromActivities } = require('../controllers/notificationController');

// Generate notifications from all existing activities
// This is a utility endpoint for development/testing purposes
router.post('/generate-from-activities', generateNotificationsFromActivities);

module.exports = router;