const express = require('express');
const router = express.Router();
const {
    getAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    searchAnimals
} = require('../controllers/animalController');

// Get all animals
router.get('/', getAnimals);

// Search animals
router.get('/search', searchAnimals);

// Create new animal
router.post('/', createAnimal);

// Get animal by ID
router.get('/:id', getAnimalById);

// Update animal
router.put('/:id', updateAnimal);

// Delete animal
router.delete('/:id', deleteAnimal);

module.exports = router;