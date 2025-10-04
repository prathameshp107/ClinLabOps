const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

// Get list of reports
router.get('/', reportController.getReportsList);

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

// Generate audit report (was experiments)
router.get('/audits', reportController.generateAuditReport);

// Generate experiment report (was dashboard)
router.get('/experiments', reportController.generateExperimentReport);

module.exports = router;