const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  size: String,
  uploadedAt: String,
  uploadedBy: String,
  isReport: Boolean,
});

const ActivitySchema = new mongoose.Schema({
  id: String,
  action: String,
  user: String,
  timestamp: String,
  details: String,
});

const CommentSchema = new mongoose.Schema({
  id: String,
  user: String,
  userRole: String,
  content: String,
  timestamp: String,
});

const EnquirySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  companyName: String,
  subject: { type: String, required: true },
  details: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  assignedTo: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold'], default: 'Pending' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  documents: [DocumentSchema],
  activities: [ActivitySchema],
  comments: [CommentSchema],
  progress: Number,
});

module.exports = mongoose.model('Enquiry', EnquirySchema); 