const express = require('express');
const router = express.Router();
const {
  getProtocols,
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
router.get('/:id', getProtocol);

// Protected routes (require authentication)
// router.use(protect);

router.route('/')
  .post(createProtocol);

router.route('/:id')
  .put(updateProtocol)
  .delete(deleteProtocol);

router.route('/:id/archive').put(archiveProtocol);
router.route('/:id/restore').put(restoreProtocol);
router.route('/:id/duplicate').post(duplicateProtocol);

module.exports = router;
