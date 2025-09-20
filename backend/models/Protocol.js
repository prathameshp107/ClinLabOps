const mongoose = require('mongoose');

const protocolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Protocol name is required'],
    trim: true,
    maxlength: [100, 'Protocol name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Molecular Biology', 'Cell Culture', 'Protein', 'DNA/RNA', 'Pharmacokinetics', 'Toxicology', 'Efficacy', 'Bioanalytical', 'Formulation', 'Safety', 'Other'],
    required: [true, 'Category is required']
  },
  version: {
    type: String,
    default: '1.0'
  },
  status: {
    type: String,
    enum: ['Draft', 'In Review', 'Approved', 'Archived'],
    default: 'Draft'
  },
  steps: [{
    number: Number,
    title: String,
    instructions: String,
    duration: String,
    notes: String,
    stepNumber: Number,
    description: String
  }],
  materials: [{
    name: String,
    quantity: String,
    notes: String
  }],
  safetyNotes: {
    type: String,
    trim: true
  },
  references: [{
    type: String,
    trim: true
  }],
  files: [{
    name: String,
    size: Number,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
protocolSchema.index({ name: 'text', description: 'text', 'steps.instructions': 'text' });
protocolSchema.index({ category: 1 });
protocolSchema.index({ createdBy: 1 });
protocolSchema.index({ isPublic: 1 });

// Virtual for protocol URL
protocolSchema.virtual('url').get(function () {
  return `/protocols/${this._id}`;
});

// Update lastModified timestamp before saving
protocolSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

const Protocol = mongoose.model('Protocol', protocolSchema);

module.exports = Protocol;
