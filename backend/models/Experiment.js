const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const versionHistorySchema = new Schema({
  version: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
  changes: { type: String, required: true }
});

// Define comment schema
const commentSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  replies: [{
    author: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    replies: [this] // Self-referencing for nested replies
  }]
});

const experimentSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  protocol: {
    type: String,
    required: [true, 'Protocol is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'on-hold', 'completed', 'archived'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function (value) {
        // End date should be after start date
        return this.startDate ? value > this.startDate : true;
      },
      message: 'End date must be after start date'
    }
  },
  teamMembers: [{
    type: String,
    trim: true
  }],
  // Add project reference
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  },
  // Add comments field
  comments: [commentSchema],
  version: {
    type: Number,
    default: 1
  },
  versionHistory: [versionHistorySchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
experimentSchema.index({
  title: 'text',
  description: 'text',
  protocol: 'text'
});

// Pre-save hook to manage version history
experimentSchema.pre('save', function (next) {
  if (this.isNew) {
    // For new documents, add initial version
    this.versionHistory.push({
      version: this.version,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy || 'system',
      changes: 'Initial version'
    });
  } else if (this.isModified()) {
    // For updates, increment version and add to history
    this.version += 1;
    this.versionHistory.push({
      version: this.version,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy || 'system',
      changes: this._updateDescription || 'Document updated'
    });
  }
  next();
});

// Static method to get experiment statistics
experimentSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgDuration: { $avg: { $subtract: ['$endDate', '$startDate'] } }
      }
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
        avgDuration: { $divide: ['$avgDuration', 1000 * 60 * 60 * 24] } // Convert to days
      }
    }
  ]);

  return stats;
};

const Experiment = mongoose.model('Experiment', experimentSchema);

module.exports = Experiment;