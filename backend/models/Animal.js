const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    species: {
        type: String,
        required: true,
        trim: true
    },
    customSpecies: {
        type: String,
        trim: true
    },
    strain: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'quarantine', 'deceased']
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    experiments: [{
        type: String,
        trim: true
    }],
    breedingPair: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Animal', animalSchema);