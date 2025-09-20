const mongoose = require('mongoose');

const breedingPairSchema = new mongoose.Schema({
    maleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true
    },
    femaleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true
    },
    maleName: {
        type: String,
        required: true
    },
    femaleName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    expectedDelivery: {
        type: Date,
        required: true
    },
    actualDelivery: {
        type: Date
    },
    offspringCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BreedingPair', breedingPairSchema);