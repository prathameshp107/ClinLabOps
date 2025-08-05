const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all equipments
router.get('/', auth.protect, equipmentController.getAllEquipments);

// Get equipment by ID
router.get('/:id', auth.protect, equipmentController.getEquipmentById);

// Create new equipment
router.post('/', auth.protect, equipmentController.createEquipment);

// Update equipment
router.put('/:id', auth.protect, equipmentController.updateEquipment);

// Delete equipment
router.delete('/:id', auth.protect, equipmentController.deleteEquipment);

// Upload a file to equipment
router.post('/:id/files', auth.protect, upload.single('file'), equipmentController.uploadEquipmentFile);

module.exports = router; 