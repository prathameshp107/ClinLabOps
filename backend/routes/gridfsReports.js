const express = require('express');
const router = express.Router();
const gridfsReportController = require('../controllers/gridfsReportController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for temporary file uploads
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
            'application/json', 'image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, XLSX, CSV, DOCX, JSON, and image files (JPG, PNG, GIF) are allowed.'));
        }
    }
});

// CRUD operations
router.get('/', protect, gridfsReportController.getAllReports)
router.get('/:id', protect, gridfsReportController.getReportById)
router.post('/', protect, upload.single('file'), gridfsReportController.createReport)
router.put('/:id', protect, gridfsReportController.updateReport)
router.delete('/:id', protect, gridfsReportController.deleteReport)

// File download
router.get('/gridfs-download/:id', protect, gridfsReportController.downloadReport)

module.exports = router;