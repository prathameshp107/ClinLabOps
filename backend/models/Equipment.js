const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  type: String,
  uploadedAt: String,
});

const MaintenanceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // 'preventive', 'corrective', 'calibration', etc.
  description: { type: String, required: true },
  performedBy: { type: String, required: true },
  performedDate: { type: Date, required: true },
  cost: { type: Number, default: 0 },
  notes: String,
  nextDueDate: Date,
  status: { type: String, enum: ['completed', 'scheduled', 'overdue'], default: 'completed' },
  partsReplaced: [String],
  downtime: Number, // in hours
  createdAt: { type: Date, default: Date.now }
});

const EquipmentSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  type: String,
  model: String,
  manufacturer: String,
  serialNumber: String,
  location: String,
  status: String,
  purchaseDate: String,
  lastMaintenanceDate: String,
  nextMaintenanceDate: String,
  assignedTo: String,
  notes: String,
  files: [FileSchema],
  maintenanceHistory: [MaintenanceRecordSchema],
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema); 