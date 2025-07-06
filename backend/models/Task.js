const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: { type: String },
  author: { type: String }, // user id or name
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  replies: [{
    id: { type: String },
    author: { type: String },
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
});

const SubtaskSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  assignee: { type: String },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  dueDate: { type: Date },
});

const FileSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  size: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String },
  path: { type: String },
});

const ActivitySchema = new mongoose.Schema({
  id: { type: String },
  userId: { type: String },
  action: { type: String },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  assignee: { type: String }, // Could be user ID or name
  dueDate: { type: Date },
  labels: [{ type: String }],
  attachments: [{ type: String }],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  customId: { type: String }, // Pretty task ID (e.g., LMS - 1)
  subtasks: [SubtaskSchema],
  comments: [CommentSchema],
  files: [FileSchema],
  activity: [ActivitySchema],
  relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema); 