const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  type: String,
  uploadedAt: String,
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
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema); 