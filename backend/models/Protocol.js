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
    enum: ['Molecular Biology', 'Cell Culture', 'Protein', 'DNA/RNA', 'Other'],
    required: [true, 'Category is required']
  },
  steps: [{
    number: Number,
    title: String,
    instructions: String,
    duration: String,
    notes: String
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
protocolSchema.virtual('url').get(function() {
  return `/protocols/${this._id}`;
});

// Update lastModified timestamp before saving
protocolSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

const Protocol = mongoose.model('Protocol', protocolSchema);

module.exports = Protocol;
