const express = require('express');
const router = express.Router();
const deadlineNotificationService = require('../services/deadlineNotificationService');
const { protect, authorize } = require('../middleware/authMiddleware');

// Manual trigger for deadline check (for testing/admin purposes)
router.post('/check-deadlines', protect, authorize('admin'), async (req, res) => {
    try {
        await deadlineNotificationService.runManualCheck();
        res.json({ message: 'Deadline check completed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;