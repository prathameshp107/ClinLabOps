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

// Get project health data
router.get('/project-health', dashboardController.getProjectHealth);

// Get experiment progress data
router.get('/experiment-progress', dashboardController.getExperimentProgress);

// Get user activity data
router.get('/user-activity', dashboardController.getUserActivity);

// Get compliance alerts
router.get('/compliance-alerts', dashboardController.getComplianceAlerts);

// Get system logs
router.get('/system-logs', dashboardController.getSystemLogs);

// Get task heatmap data
router.get('/task-heatmap', dashboardController.getTaskHeatmap);

module.exports = router;