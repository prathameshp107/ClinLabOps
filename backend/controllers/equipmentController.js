const Equipment = require('../models/Equipment');
const mongoose = require('mongoose');
const ActivityService = require('../services/activityService');

// Get all equipments
exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipments_listed',
        description: `${req.user.name} viewed equipment list`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentCount: equipments.length,
          operation: 'list'
        }
      });
    }

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_viewed',
        description: `${req.user.name} viewed equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          operation: 'view'
        }
      });
    }

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_created',
        description: `${req.user.name} created equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          operation: 'create'
        }
      });
    }

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_updated',
        description: `${req.user.name} updated equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          operation: 'update'
        }
      });
    }

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_deleted',
        description: `${req.user.name} deleted equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentName: equipment.name,
          operation: 'delete'
        }
      });
    }

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

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_file_uploaded',
        description: `${req.user.name} uploaded file "${originalname}" to equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          fileName: originalname,
          fileSize: size,
          operation: 'file_upload'
        }
      });
    }

    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a file from equipment
exports.deleteEquipmentFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

    const file = equipment.files.find(f => f._id.toString() === fileId);
    const fileName = file ? file.name : 'Unknown file';

    equipment.files = equipment.files.filter(f => f._id.toString() !== fileId);
    await equipment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_file_deleted',
        description: `${req.user.name} deleted file "${fileName}" from equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          fileName: fileName,
          operation: 'file_delete'
        }
      });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get maintenance history for equipment
exports.getMaintenanceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Sort maintenance history by date (most recent first)
    const sortedHistory = equipment.maintenanceHistory.sort((a, b) =>
      new Date(b.performedDate) - new Date(a.performedDate)
    );

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_maintenance_history_viewed',
        description: `${req.user.name} viewed maintenance history for equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          maintenanceRecordCount: sortedHistory.length,
          operation: 'view_maintenance_history'
        }
      });
    }

    res.json(sortedHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add maintenance record to equipment
exports.addMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Generate a unique ID for the maintenance record
    const recordId = `MR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const maintenanceRecord = {
      id: recordId,
      type: req.body.type || 'maintenance',
      description: req.body.description,
      performedBy: req.body.performedBy,
      performedDate: req.body.performedDate || new Date(),
      cost: req.body.cost || 0,
      notes: req.body.notes || '',
      nextDueDate: req.body.nextDueDate,
      status: req.body.status || 'completed',
      partsReplaced: req.body.partsReplaced || [],
      downtime: req.body.downtime || 0,
    };

    equipment.maintenanceHistory.push(maintenanceRecord);

    // Update last maintenance date if this is a completed maintenance
    if (maintenanceRecord.status === 'completed') {
      equipment.lastMaintenanceDate = maintenanceRecord.performedDate;
      if (maintenanceRecord.nextDueDate) {
        equipment.nextMaintenanceDate = maintenanceRecord.nextDueDate;
      }
    }

    await equipment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_maintenance_added',
        description: `${req.user.name} added maintenance record to equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          maintenanceType: maintenanceRecord.type,
          maintenanceStatus: maintenanceRecord.status,
          operation: 'maintenance_add'
        }
      });
    }

    res.status(201).json(maintenanceRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update maintenance record
exports.updateMaintenanceRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const maintenanceRecord = equipment.maintenanceHistory.id(recordId);
    if (!maintenanceRecord) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    // Update the maintenance record
    Object.assign(maintenanceRecord, req.body);

    // Update last maintenance date if this is a completed maintenance
    if (maintenanceRecord.status === 'completed') {
      equipment.lastMaintenanceDate = maintenanceRecord.performedDate;
      if (maintenanceRecord.nextDueDate) {
        equipment.nextMaintenanceDate = maintenanceRecord.nextDueDate;
      }
    }

    await equipment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_maintenance_updated',
        description: `${req.user.name} updated maintenance record for equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          maintenanceType: maintenanceRecord.type,
          maintenanceStatus: maintenanceRecord.status,
          operation: 'maintenance_update'
        }
      });
    }

    res.json(maintenanceRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete maintenance record
exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    const equipment = await Equipment.findOne({ id });
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const maintenanceRecord = equipment.maintenanceHistory.id(recordId);
    const recordDescription = maintenanceRecord ? maintenanceRecord.description : 'maintenance record';

    equipment.maintenanceHistory.pull(recordId);
    await equipment.save();

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_maintenance_deleted',
        description: `${req.user.name} deleted maintenance record from equipment "${equipment.name}"`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          recordDescription: recordDescription,
          operation: 'maintenance_delete'
        }
      });
    }

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get equipment statistics
exports.getEquipmentStats = async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments();
    const activeEquipment = await Equipment.countDocuments({ status: 'active' });
    const maintenanceDue = await Equipment.countDocuments({
      nextMaintenanceDate: { $lte: new Date() }
    });

    const stats = {
      total: totalEquipment,
      active: activeEquipment,
      maintenanceDue: maintenanceDue,
      inactive: totalEquipment - activeEquipment
    };

    // Log activity
    if (req.user) {
      await ActivityService.logActivity({
        type: 'equipment_stats_viewed',
        description: `${req.user.name} viewed equipment statistics`,
        userId: req.user._id || req.user.id,
        meta: {
          category: 'equipment',
          operation: 'view_stats'
        }
      });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};