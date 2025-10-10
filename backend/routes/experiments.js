const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const {
  getExperiments,
  getExperimentStats,
  createExperiment,
  getExperimentById,
  updateExperiment,
  deleteExperiment,
  addCommentToExperiment,
  addReplyToComment,
  deleteCommentFromExperiment,
  deleteReplyFromComment
} = require('../controllers/experimentController');

// @route   GET /api/experiments
// @desc    Get all experiments with optional filtering and sorting
// @access  Private
router.get('/', auth.protect, getExperiments);

// @route   GET /api/experiments/stats
// @desc    Get experiment statistics
// @access  Private
router.get('/stats', auth.protect, getExperimentStats);

// @route   POST /api/experiments
// @desc    Create a new experiment
// @access  Private
router.post(
  '/',
  [
    auth.protect,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('protocol', 'Protocol is required').not().isEmpty(),
      body('startDate', 'Start date is required').isISO8601(),
      body('endDate', 'End date is required').isISO8601()
    ]
  ],
  createExperiment
);

// @route   GET /api/experiments/:id
// @desc    Get experiment by ID
// @access  Private
router.get('/:id', auth.protect, getExperimentById);

// @route   PUT /api/experiments/:id
// @desc    Update experiment
// @access  Private
router.put(
  '/:id',
  [
    auth.protect,
    [
      body('title', 'Title is required').not().isEmpty(),
      body('description', 'Description is required').not().isEmpty(),
      body('protocol', 'Protocol is required').not().isEmpty(),
      body('startDate', 'Start date is required').isISO8601(),
      body('endDate', 'End date is required').isISO8601()
    ]
  ],
  updateExperiment
);

// @route   DELETE /api/experiments/:id
// @desc    Delete experiment
// @access  Private
router.delete('/:id', auth.protect, deleteExperiment);

// @route   POST /api/experiments/:id/comments
// @desc    Add comment to experiment
// @access  Private
router.post('/:id/comments', auth.protect, addCommentToExperiment);

// @route   POST /api/experiments/:id/comments/:comment_id/replies
// @desc    Add reply to comment in experiment
// @access  Private
router.post('/:id/comments/:comment_id/replies', auth.protect, addReplyToComment);

// @route   DELETE /api/experiments/:id/comments/:comment_id
// @desc    Delete comment from experiment
// @access  Private
router.delete('/:id/comments/:comment_id', auth.protect, deleteCommentFromExperiment);

// @route   DELETE /api/experiments/:id/comments/:comment_id/replies/:reply_id
// @desc    Delete reply from comment in experiment
// @access  Private
router.delete('/:id/comments/:comment_id/replies/:reply_id', auth.protect, deleteReplyFromComment);

module.exports = router;