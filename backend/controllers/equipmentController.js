const Equipment = require('../models/Equipment');
const mongoose = require('mongoose');

// Get all equipments
exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findOne({ id: req.params.id });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new equipment
exports.createEquipment = async (req, res) => {
  try {
    const count = await Equipment.countDocuments();
    const equipmentId = `EQ-${String(count + 1).padStart(3, '0')}`;
    const equipment = new Equipment({
      ...req.body,
      id: equipmentId,
    });
    await equipment.save();
    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create equipment', error: err.message });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndDelete({ id: req.params.id });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload a file to equipment
exports.uploadEquipmentFile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, mimetype, size, path } = req.file;
    const newFile = {
      name: originalname,
      type: mimetype,
      size,
      uploadedAt: new Date().toISOString(),
      filePath: path,
    };
    const equipment = await Equipment.findOne({ id });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    equipment.files.push(newFile);
    await equipment.save();
    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 