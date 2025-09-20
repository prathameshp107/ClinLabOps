const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');
const auth = require('../middleware/authMiddleware');

// COMPLIANCE ITEMS ROUTES
router.get('/items', complianceController.getAllComplianceItems);
router.get('/items/:id', complianceController.getComplianceItemById);
router.post('/items', complianceController.createComplianceItem);
router.put('/items/:id', complianceController.updateComplianceItem);
router.delete('/items/:id', complianceController.deleteComplianceItem);

// COMPLIANCE ACTIONS
router.post('/items/:id/actions', complianceController.addComplianceAction);
router.put('/items/:id/actions/:actionId', complianceController.updateComplianceAction);

// AUDITS ROUTES
router.get('/audits', complianceController.getAllAudits);
router.get('/audits/:id', complianceController.getAuditById);
router.post('/audits', complianceController.createAudit);
router.put('/audits/:id', complianceController.updateAudit);
router.delete('/audits/:id', complianceController.deleteAudit);

// TRAINING RECORDS ROUTES
router.get('/training', complianceController.getAllTrainingRecords);
router.get('/training/:id', complianceController.getTrainingRecordById);
router.post('/training', complianceController.createTrainingRecord);
router.put('/training/:id', complianceController.updateTrainingRecord);
router.delete('/training/:id', complianceController.deleteTrainingRecord);

// TRAINING ATTENDEE STATUS
router.patch('/training/:id/attendees/:attendeeId', complianceController.updateAttendeeStatus);

// DASHBOARD STATS
router.get('/stats', complianceController.getComplianceStats);

module.exports = router;