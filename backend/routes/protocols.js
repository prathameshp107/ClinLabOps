const express = require('express');
const router = express.Router();
const {
  getProtocols,
  getMyProtocols,
  getProtocol,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  archiveProtocol,
  restoreProtocol,
  duplicateProtocol
} = require('../controllers/protocolController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (with optional auth for public/private handling)
router.get('/', getProtocols);
router.get('/my-protocols', protect, getMyProtocols);
router.get('/:id', getProtocol);

// Protected routes (require authentication)
router.route('/')
  .post(protect, createProtocol);

router.route('/:id')
  .put(protect, updateProtocol)
  .delete(protect, deleteProtocol);

router.route('/:id/archive').put(protect, archiveProtocol);
router.route('/:id/restore').put(protect, restoreProtocol);
router.route('/:id/duplicate').post(protect, duplicateProtocol);

module.exports = router;