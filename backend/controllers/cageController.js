const Cage = require('../models/Cage');
const mongoose = require('mongoose');

// Get all cages
const getCages = async (req, res) => {
    try {
        const cages = await Cage.find().sort({ createdAt: -1 });
        res.status(200).json(cages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cages', error: error.message });
    }
};

// Get cage by ID
const getCageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid cage ID' });
        }

        const cage = await Cage.findById(id);

        if (!cage) {
            return res.status(404).json({ message: 'Cage not found' });
        }

        res.status(200).json(cage);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cage', error: error.message });
    }
};

// Create new cage
const createCage = async (req, res) => {
    try {
        const cageData = req.body;

        // Validate required fields
        const requiredFields = ['name', 'type', 'location', 'capacity'];
        const missingFields = requiredFields.filter(field => !cageData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate capacity is a positive number
        if (cageData.capacity <= 0) {
            return res.status(400).json({ message: 'Capacity must be a positive number' });
        }

        // Validate currentOccupancy if provided
        if (cageData.currentOccupancy !== undefined && cageData.currentOccupancy < 0) {
            return res.status(400).json({ message: 'Current occupancy cannot be negative' });
        }

        const cage = new Cage(cageData);
        const savedCage = await cage.save();

        res.status(201).json(savedCage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cage', error: error.message });
    }
};

// Update cage
const updateCage = async (req, res) => {
    try {
        const { id } = req.params;
        const cageData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid cage ID' });
        }

        // Validate capacity if provided
        if (cageData.capacity !== undefined && cageData.capacity <= 0) {
            return res.status(400).json({ message: 'Capacity must be a positive number' });
        }

        // Validate currentOccupancy if provided
        if (cageData.currentOccupancy !== undefined && cageData.currentOccupancy < 0) {
            return res.status(400).json({ message: 'Current occupancy cannot be negative' });
        }

        const cage = await Cage.findByIdAndUpdate(
            id,
            cageData,
            { new: true, runValidators: true }
        );

        if (!cage) {
            return res.status(404).json({ message: 'Cage not found' });
        }

        res.status(200).json(cage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cage', error: error.message });
    }
};

// Delete cage
const deleteCage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid cage ID' });
        }

        const cage = await Cage.findByIdAndDelete(id);

        if (!cage) {
            return res.status(404).json({ message: 'Cage not found' });
        }

        res.status(200).json({ message: 'Cage deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cage', error: error.message });
    }
};

module.exports = {
    getCages,
    getCageById,
    createCage,
    updateCage,
    deleteCage
};