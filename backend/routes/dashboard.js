const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

// Get dashboard overview stats
router.get('/stats', dashboardController.getDashboardStats);

// Get task distribution data
router.get('/task-distribution', dashboardController.getTaskDistribution);

// Get recent activities
router.get('/recent-activities', dashboardController.getRecentActivities);

// Get team performance data
router.get('/team-performance', dashboardController.getTeamPerformance);

// Get system health data (was project-health)
router.get('/system-health', dashboardController.getSystemHealth);

// Get user activity timeline (was experiment-progress)
router.get('/user-activity-timeline', dashboardController.getUserActivityTimeline);

// Get compliance alerts
router.get('/compliance-alerts', dashboardController.getComplianceAlerts);

// Get system logs
router.get('/system-logs', dashboardController.getSystemLogs);

// Get task heatmap data
router.get('/task-heatmap', dashboardController.getTaskHeatmap);

module.exports = router;