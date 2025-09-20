const express = require('express');
const router = express.Router();
const {
    getBreedingPairs,
    getBreedingPairById,
    createBreedingPair,
    updateBreedingPair,
    deleteBreedingPair
} = require('../controllers/breedingController');

// GET /api/breeding - Get all breeding pairs
router.get('/', getBreedingPairs);

// GET /api/breeding/:id - Get breeding pair by ID
router.get('/:id', getBreedingPairById);

// POST /api/breeding - Create new breeding pair
router.post('/', createBreedingPair);

// PUT /api/breeding/:id - Update breeding pair
router.put('/:id', updateBreedingPair);

// DELETE /api/breeding/:id - Delete breeding pair
router.delete('/:id', deleteBreedingPair);

module.exports = router;