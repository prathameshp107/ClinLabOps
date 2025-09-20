const mongoose = require('mongoose');

const cageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['standard', 'breeding', 'quarantine', 'isolation', 'custom']
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentOccupancy: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'occupied', 'maintenance', 'quarantine'],
        default: 'available'
    },
    notes: {
        type: String,
        trim: true
    },
    lastCleaned: {
        type: Date
    },
    nextCleaning: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cage', cageSchema);