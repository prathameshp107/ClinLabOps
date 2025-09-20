const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  meta: {
    type: Object,
    required: false,
  },
});

module.exports = mongoose.model('Activity', ActivitySchema); 