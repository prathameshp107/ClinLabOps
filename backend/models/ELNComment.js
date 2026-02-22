const mongoose = require('mongoose');

const elnCommentSchema = new mongoose.Schema({
    elnEntryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ELNEntry',
        required: [true, 'ELN Entry ID is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ELNComment',
        required: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
elnCommentSchema.index({ elnEntryId: 1, createdAt: -1 });
elnCommentSchema.index({ author: 1 });
elnCommentSchema.index({ parentCommentId: 1 });

module.exports = mongoose.model('ELNComment', elnCommentSchema);