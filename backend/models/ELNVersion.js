const mongoose = require('mongoose');

const elnVersionSchema = new mongoose.Schema({
    elnEntryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ELNEntry',
        required: [true, 'ELN Entry ID is required']
    },
    versionNumber: {
        type: Number,
        required: [true, 'Version number is required']
    },
    content: {
        type: String,
        required: [true, 'Content snapshot is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    changes: {
        type: String,
        required: [true, 'Changes description is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
elnVersionSchema.index({ elnEntryId: 1, versionNumber: 1 });
elnVersionSchema.index({ author: 1 });
elnVersionSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ELNVersion', elnVersionSchema);