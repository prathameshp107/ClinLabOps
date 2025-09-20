const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  email: String,
  department: String,
  avatar: String,
  status: String,
});

const TaskSchema = new mongoose.Schema({
  id: String,
  name: String,
  status: String,
  assignee: String,
  assigneeId: String,
  dueDate: String,
  priority: String,
  progress: Number,
  description: String,
});

const DocumentSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  size: String,
  uploadedBy: String,
  uploadedAt: String,
  tags: [String],
});

const MilestoneSchema = new mongoose.Schema({
  id: String,
  name: String,
  date: String,
  status: String,
  description: String,
});

const DependencySchema = new mongoose.Schema({
  id: String,
  sourceId: String,
  sourceName: String,
  targetId: String,
  targetName: String,
  type: String,
  created: String,
});

const ActivityLogSchema = new mongoose.Schema({
  id: String,
  userId: String,
  action: String,
  timestamp: String,
  details: String,
  user: String,
  task: String,
  taskId: String,
  comment: String,
  document: String,
  documentId: String,
  type: String,
  time: String,
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: String,
  endDate: String,
  status: String,
  priority: String,
  progress: Number,
  isFavorite: Boolean,
  budget: String,
  confidential: Boolean,
  complexity: Number,
  department: String,
  team: [TeamMemberSchema],
  tags: [String],
  dependencies: [DependencySchema],
  activityLog: [ActivityLogSchema],
  tasks: [TaskSchema],
  documents: [DocumentSchema],
  milestones: [MilestoneSchema],
  projectCode: {
    type: String,
    unique: true,
    required: true,
  },
  // Add category field
  category: {
    type: String,
    enum: ['research', 'regulatory', 'miscellaneous'],
    default: 'miscellaneous'
  },
  // Add projectType field for regulatory projects
  projectType: {
    type: String,
    enum: ['iso', 'oecd', 'fda', 'ema', 'ich', 'other', ''],
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);