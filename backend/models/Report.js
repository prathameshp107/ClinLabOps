const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['regulatory', 'research', 'miscellaneous']
    },
    description: {
        type: String,
        trim: true
    },
    format: {
        type: String,
        required: true,
        enum: ['pdf', 'xlsx', 'csv', 'docx', 'json', 'jpg', 'jpeg', 'png', 'gif']
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
reportSchema.index({ type: 1 });
reportSchema.index({ uploadedBy: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);