const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/authMiddleware');

// Upload single file
router.post('/upload', fileController.uploadSingle, fileController.handleSingleUpload);

// Upload multiple files
router.post('/upload-multiple', fileController.uploadMultiple, fileController.handleMultipleUpload);

// Serve file
router.get('/:filename', fileController.serveFile);

// Get file info
router.get('/:filename/info', fileController.getFileInfo);

// Delete file
router.delete('/:filename', fileController.deleteFile);

// List all files
router.get('/', fileController.listFiles);

module.exports = router;