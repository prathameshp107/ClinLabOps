const BreedingPair = require('../models/BreedingPair');
const Animal = require('../models/Animal');
const mongoose = require('mongoose');
const ActivityService = require('../services/activityService');

// Get all breeding pairs
const getBreedingPairs = async (req, res) => {
    try {
        const breedingPairs = await BreedingPair.find().sort({ createdAt: -1 });
        
        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'breeding_pairs_listed',
                description: `${req.user.name} viewed the list of breeding pairs`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'breeding',
                    breedingPairCount: breedingPairs.length,
                    operation: 'list'
                }
            });
        }
        
        res.status(200).json(breedingPairs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching breeding pairs', error: error.message });
    }
};

// Get breeding pair by ID
const getBreedingPairById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid breeding pair ID' });
        }

        const breedingPair = await BreedingPair.findById(id);

        if (!breedingPair) {
            return res.status(404).json({ message: 'Breeding pair not found' });
        }
        
        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'breeding_pair_viewed',
                description: `${req.user.name} viewed breeding pair`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'breeding',
                    breedingPairId: breedingPair._id,
                    operation: 'view'
                }
            });
        }

        res.status(200).json(breedingPair);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching breeding pair', error: error.message });
    }
};

// Create new breeding pair
const createBreedingPair = async (req, res) => {
    try {
        const breedingPairData = req.body;

        // Validate required fields
        if (!breedingPairData.maleId || !breedingPairData.femaleId ||
            !breedingPairData.startDate || !breedingPairData.expectedDelivery) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify that the animals exist
        const maleAnimal = await Animal.findById(breedingPairData.maleId);
        const femaleAnimal = await Animal.findById(breedingPairData.femaleId);

        if (!maleAnimal) {
            return res.status(404).json({ message: 'Male animal not found' });
        }

        if (!femaleAnimal) {
            return res.status(404).json({ message: 'Female animal not found' });
        }

        // Create breeding pair with animal names and convert date strings to Date objects
        const breedingPair = new BreedingPair({
            ...breedingPairData,
            maleName: maleAnimal.name,
            femaleName: femaleAnimal.name,
            startDate: new Date(breedingPairData.startDate),
            expectedDelivery: new Date(breedingPairData.expectedDelivery)
        });

        const savedBreedingPair = await breedingPair.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'breeding_pair_created',
                description: `${req.user.name} created breeding pair for ${maleAnimal.name} and ${femaleAnimal.name}`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'breeding',
                    breedingPairId: savedBreedingPair._id,
                    maleId: maleAnimal._id,
                    femaleId: femaleAnimal._id,
                    maleName: maleAnimal.name,
                    femaleName: femaleAnimal.name,
                    operation: 'create'
                }
            });
        }

        res.status(201).json(savedBreedingPair);
    } catch (error) {
        res.status(500).json({ message: 'Error creating breeding pair', error: error.message });
    }
};

// Update breeding pair
const updateBreedingPair = async (req, res) => {
    try {
        const { id } = req.params;
        const breedingPairData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid breeding pair ID' });
        }

        const breedingPair = await BreedingPair.findByIdAndUpdate(
            id,
            breedingPairData,
            { new: true, runValidators: true }
        );

        if (!breedingPair) {
            return res.status(404).json({ message: 'Breeding pair not found' });
        }

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'breeding_pair_updated',
                description: `${req.user.name} updated breeding pair`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'breeding',
                    breedingPairId: breedingPair._id,
                    operation: 'update'
                }
            });
        }

        res.status(200).json(breedingPair);
    } catch (error) {
        res.status(500).json({ message: 'Error updating breeding pair', error: error.message });
    }
};

// Delete breeding pair
const deleteBreedingPair = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid breeding pair ID' });
        }

        const breedingPair = await BreedingPair.findByIdAndDelete(id);

        if (!breedingPair) {
            return res.status(404).json({ message: 'Breeding pair not found' });
        }

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'breeding_pair_deleted',
                description: `${req.user.name} deleted breeding pair`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'breeding',
                    operation: 'delete'
                }
            });
        }

        res.status(200).json({ message: 'Breeding pair deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting breeding pair', error: error.message });
    }
};

module.exports = {
    getBreedingPairs,
    getBreedingPairById,
    createBreedingPair,
    updateBreedingPair,
    deleteBreedingPair
};