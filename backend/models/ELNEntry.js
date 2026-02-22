const mongoose = require('mongoose');

const elnEntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    experimentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    version: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['draft', 'in-review', 'approved', 'published'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        name: String,
        size: Number,
        type: String,
        url: String,
        uploadedAt: Date
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
elnEntrySchema.index({ title: 'text', content: 'text' });
elnEntrySchema.index({ author: 1 });
elnEntrySchema.index({ projectId: 1 });
elnEntrySchema.index({ experimentId: 1 });
elnEntrySchema.index({ status: 1 });
elnEntrySchema.index({ createdAt: -1 });

module.exports = mongoose.model('ELNEntry', elnEntrySchema);