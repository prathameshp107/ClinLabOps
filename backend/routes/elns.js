const express = require('express');
const router = express.Router();
const {
    getELNEntries,
    getELNEntryById,
    createELNEntry,
    updateELNEntry,
    deleteELNEntry,
    getELNVersions,
    addCollaborator,
    removeCollaborator,
    addComment,
    deleteComment,
    searchELNEntries
} = require('../controllers/elnController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// GET /api/elns - List ELN entries with filters
router.get('/', getELNEntries);

// POST /api/elns - Create new ELN entry
router.post('/', createELNEntry);

// GET /api/elns/:id - Get specific ELN entry
router.get('/:id', getELNEntryById);

// PUT /api/elns/:id - Update ELN entry
router.put('/:id', updateELNEntry);

// DELETE /api/elns/:id - Delete ELN entry
router.delete('/:id', deleteELNEntry);

// GET /api/elns/:id/versions - Get version history
router.get('/:id/versions', getELNVersions);

// POST /api/elns/:id/collaborators - Add collaborators
router.post('/:id/collaborators', addCollaborator);

// DELETE /api/elns/:id/collaborators - Remove collaborators
router.delete('/:id/collaborators', removeCollaborator);

// POST /api/elns/:id/comments - Add comments
router.post('/:id/comments', addComment);

// DELETE /api/elns/:id/comments/:commentId - Delete comment
router.delete('/:id/comments/:commentId', deleteComment);

// GET /api/elns/search - Search ELN entries
router.get('/search', searchELNEntries);

module.exports = router;