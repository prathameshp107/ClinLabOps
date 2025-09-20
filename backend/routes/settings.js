const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
    getSettings,
    updateSettingsSection,
    updateAllSettings,
    resetSettings,
    exportSettings,
    importSettings,
    getSystemSettings,
    updateSystemSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { validateSettings } = require('../middleware/validationMiddleware');

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only JSON files for settings import
        if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
            cb(null, true);
        } else {
            cb(new Error('Only JSON files are allowed for settings import'), false);
        }
    }
});

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/', getSettings);

/**
 * @route   PATCH /api/settings/:section
 * @desc    Update specific settings section
 * @access  Private
 */
router.patch('/:section', validateSettings, updateSettingsSection);

/**
 * @route   PUT /api/settings
 * @desc    Update all settings
 * @access  Private
 */
router.put('/', validateSettings, updateAllSettings);

/**
 * @route   POST /api/settings/reset
 * @desc    Reset all settings to defaults
 * @access  Private
 */
router.post('/reset', resetSettings);

/**
 * @route   POST /api/settings/:section/reset
 * @desc    Reset specific section to defaults
 * @access  Private
 */
router.post('/:section/reset', resetSettings);

/**
 * @route   GET /api/settings/export
 * @desc    Export user settings
 * @access  Private
 * @query   format=json|csv
 */
router.get('/export', exportSettings);

/**
 * @route   POST /api/settings/import
 * @desc    Import user settings from file
 * @access  Private
 */
router.post('/import', upload.single('settings'), importSettings);

/**
 * @route   GET /api/settings/system
 * @desc    Get system settings (Admin only)
 * @access  Private (Admin)
 */
router.get('/system', getSystemSettings);

/**
 * @route   PATCH /api/settings/system
 * @desc    Update system settings (Admin only)
 * @access  Private (Admin)
 */
router.patch('/system', validateSettings, updateSystemSettings);

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
    }
    if (error.message === 'Only JSON files are allowed for settings import') {
        return res.status(400).json({ message: error.message });
    }
    next(error);
});

module.exports = router;