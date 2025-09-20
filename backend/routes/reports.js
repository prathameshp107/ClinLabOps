const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

// Generate project report
router.get('/projects', reportController.generateProjectReport);

// Generate task report
router.get('/tasks', reportController.generateTaskReport);

// Generate inventory report
router.get('/inventory', reportController.generateInventoryReport);

// Generate user report
router.get('/users', reportController.generateUserReport);

// Generate compliance report
router.get('/compliance', reportController.generateComplianceReport);

// Generate experiment report
router.get('/experiments', reportController.generateExperimentReport);

// Generate dashboard summary report
router.get('/dashboard', reportController.generateDashboardReport);

module.exports = router;