const Animal = require('../models/Animal');
const mongoose = require('mongoose');

// Get all animals
const getAnimals = async (req, res) => {
    try {
        const animals = await Animal.find({});
        res.status(200).json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching animals', error: error.message });
    }
};

// Get animal by ID
const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid animal ID' });
        }

        const animal = await Animal.findById(id);

        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching animal', error: error.message });
    }
};

// Create new animal
const createAnimal = async (req, res) => {
    try {
        const animalData = req.body;

        // Validate required fields
        // Check for truly missing fields (undefined or null)
        const requiredFields = [
            'name', 'species', 'strain', 'age', 'weight',
            'gender', 'status', 'location', 'dateOfBirth'
        ];

        const missingFields = requiredFields.filter(field => {
            // For age and weight, 0 is a valid value
            if (field === 'age' || field === 'weight') {
                return animalData[field] === undefined || animalData[field] === null;
            }
            // For string fields, empty string is invalid
            return !animalData[field];
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields
            });
        }

        const animal = new Animal(animalData);
        const savedAnimal = await animal.save();

        res.status(201).json(savedAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating animal', error: error.message });
    }
};

// Update animal
const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const animalData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid animal ID' });
        }

        const animal = await Animal.findByIdAndUpdate(id, animalData, { new: true, runValidators: true });

        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        res.status(200).json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating animal', error: error.message });
    }
};

// Delete animal
const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid animal ID' });
        }

        const animal = await Animal.findByIdAndDelete(id);

        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting animal', error: error.message });
    }
};

// Search animals
const searchAnimals = async (req, res) => {
    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        const animals = await Animal.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { species: { $regex: searchTerm, $options: 'i' } },
                { strain: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        res.status(200).json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Error searching animals', error: error.message });
    }
};

module.exports = {
    getAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    searchAnimals
};