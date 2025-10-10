const express = require('express');
const router = express.Router();
const uploadedReportController = require('../controllers/uploadedReportController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/reports/');
    },
    filename: (req, file, cb) => {
        // Create a unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only specific file types
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/json'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, XLSX, CSV, DOCX, and JSON files are allowed.'));
        }
    }
});

// CRUD operations
router.get('/', protect, uploadedReportController.getAllReports)
router.get('/:id', protect, uploadedReportController.getReportById)
router.post('/', protect, upload.single('file'), uploadedReportController.createReport)
router.put('/:id', protect, uploadedReportController.updateReport)
router.delete('/:id', protect, uploadedReportController.deleteReport)

// File download
router.get('/download/:id', protect, uploadedReportController.downloadReport)

module.exports = router;