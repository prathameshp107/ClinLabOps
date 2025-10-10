const express = require('express');
const router = express.Router();
const {
    getCages,
    getCageById,
    createCage,
    updateCage,
    deleteCage
} = require('../controllers/cageController');

// GET /api/cages - Get all cages
router.get('/', getCages);

// GET /api/cages/:id - Get a specific cage by ID
router.get('/:id', getCageById);

// POST /api/cages - Create a new cage
router.post('/', createCage);

// PUT /api/cages/:id - Update a cage
router.put('/:id', updateCage);

// DELETE /api/cages/:id - Delete a cage
router.delete('/:id', deleteCage);

module.exports = router;