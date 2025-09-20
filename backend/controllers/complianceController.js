const { ComplianceItem, Audit, TrainingRecord } = require('../models/Compliance');
const ActivityService = require('../services/activityService');

// COMPLIANCE ITEMS
exports.getAllComplianceItems = async (req, res) => {
    try {
        const { category, status, priority, department, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (department) filter.department = department;

        const items = await ComplianceItem.find(filter)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ dueDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ComplianceItem.countDocuments(filter);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_items_listed',
                description: `${req.user.name} viewed compliance items list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemCount: items.length,
                    filters: { category, status, priority, department },
                    operation: 'list'
                }
            });
        }

        res.json({
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComplianceItemById = async (req, res) => {
    try {
        const item = await ComplianceItem.findById(req.params.id)
            .populate('assignedTo', 'name email department')
            .populate('createdBy', 'name email')
            .populate('actions.assignedTo', 'name email')
            .populate('evidence.uploadedBy', 'name email');

        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_item_viewed',
                description: `${req.user.name} viewed compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    operation: 'view'
                }
            });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createComplianceItem = async (req, res) => {
    try {
        const item = new ComplianceItem({
            ...req.body,
            createdBy: req.user?.id || req.body.createdBy
        });
        await item.save();
        await item.populate('assignedTo', 'name email');
        await item.populate('createdBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_item_created',
                description: `${req.user.name} created compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    operation: 'create'
                }
            });
        }

        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateComplianceItem = async (req, res) => {
    try {
        const item = await ComplianceItem.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user?.id },
            { new: true }
        )
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_item_updated',
                description: `${req.user.name} updated compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    operation: 'update'
                }
            });
        }

        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteComplianceItem = async (req, res) => {
    try {
        const item = await ComplianceItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_item_deleted',
                description: `${req.user.name} deleted compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemTitle: item.title,
                    operation: 'delete'
                }
            });
        }

        res.json({ message: 'Compliance item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addComplianceAction = async (req, res) => {
    try {
        const item = await ComplianceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        item.actions.push(req.body);
        await item.save();
        await item.populate('actions.assignedTo', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_action_added',
                description: `${req.user.name} added action to compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    operation: 'add_action'
                }
            });
        }

        res.status(201).json(item.actions[item.actions.length - 1]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateComplianceAction = async (req, res) => {
    try {
        const item = await ComplianceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        const action = item.actions.id(req.params.actionId);
        if (!action) return res.status(404).json({ error: 'Action not found' });

        Object.assign(action, req.body);
        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_action_updated',
                description: `${req.user.name} updated action in compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    actionId: req.params.actionId,
                    operation: 'update_action'
                }
            });
        }

        res.json(action);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteComplianceAction = async (req, res) => {
    try {
        const item = await ComplianceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        const action = item.actions.id(req.params.actionId);
        if (!action) return res.status(404).json({ error: 'Action not found' });

        const actionDescription = action.description || 'action';
        item.actions.pull(req.params.actionId);
        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_action_deleted',
                description: `${req.user.name} deleted action from compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    actionId: req.params.actionId,
                    actionDescription: actionDescription,
                    operation: 'delete_action'
                }
            });
        }

        res.json({ message: 'Action deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addComplianceEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { originalname, size, filename, path } = req.file;
        const evidence = {
            name: originalname,
            size: `${(size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: new Date(),
            uploadedBy: req.body.uploadedBy || req.user?.name || 'Unknown',
            path,
        };

        const item = await ComplianceItem.findById(id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        item.evidence.push(evidence);
        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_evidence_added',
                description: `${req.user.name} uploaded evidence "${originalname}" to compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    fileName: originalname,
                    operation: 'add_evidence'
                }
            });
        }

        res.status(201).json(evidence);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteComplianceEvidence = async (req, res) => {
    try {
        const { id, evidenceId } = req.params;
        const item = await ComplianceItem.findById(id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });

        const evidence = item.evidence.id(evidenceId);
        const evidenceName = evidence ? evidence.name : 'Unknown file';
        item.evidence.pull(evidenceId);
        await item.save();

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_evidence_deleted',
                description: `${req.user.name} deleted evidence "${evidenceName}" from compliance item "${item.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    itemId: item._id,
                    itemTitle: item.title,
                    evidenceId: evidenceId,
                    evidenceName: evidenceName,
                    operation: 'delete_evidence'
                }
            });
        }

        res.json({ message: 'Evidence deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// AUDITS
exports.getAllAudits = async (req, res) => {
    try {
        const audits = await Audit.find()
            .populate('complianceItems.item', 'title')
            .populate('conductedBy', 'name email')
            .sort({ scheduledDate: -1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'audits_listed',
                description: `${req.user.name} viewed audits list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    auditCount: audits.length,
                    operation: 'list_audits'
                }
            });
        }

        res.json(audits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add the missing getAuditById function
exports.getAuditById = async (req, res) => {
    try {
        const audit = await Audit.findById(req.params.id)
            .populate('complianceItems.item', 'title')
            .populate('conductedBy', 'name email');

        if (!audit) return res.status(404).json({ error: 'Audit not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'audit_viewed',
                description: `${req.user.name} viewed audit "${audit.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    auditId: audit._id,
                    auditTitle: audit.title,
                    operation: 'view_audit'
                }
            });
        }

        res.json(audit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAudit = async (req, res) => {
    try {
        const audit = new Audit({
            ...req.body,
            conductedBy: req.user?.id
        });
        await audit.save();
        await audit.populate('complianceItems.item', 'title');
        await audit.populate('conductedBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'audit_created',
                description: `${req.user.name} created audit "${audit.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    auditId: audit._id,
                    auditTitle: audit.title,
                    operation: 'create_audit'
                }
            });
        }

        res.status(201).json(audit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateAudit = async (req, res) => {
    try {
        const audit = await Audit.findByIdAndUpdate(
            req.params.id,
            { ...req.body, conductedBy: req.user?.id },
            { new: true }
        )
            .populate('complianceItems.item', 'title')
            .populate('conductedBy', 'name email');

        if (!audit) return res.status(404).json({ error: 'Audit not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'audit_updated',
                description: `${req.user.name} updated audit "${audit.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    auditId: audit._id,
                    auditTitle: audit.title,
                    operation: 'update_audit'
                }
            });
        }

        res.json(audit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAudit = async (req, res) => {
    try {
        const audit = await Audit.findByIdAndDelete(req.params.id);
        if (!audit) return res.status(404).json({ error: 'Audit not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'audit_deleted',
                description: `${req.user.name} deleted audit "${audit.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    auditTitle: audit.title,
                    operation: 'delete_audit'
                }
            });
        }

        res.json({ message: 'Audit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// TRAINING RECORDS
exports.getAllTrainingRecords = async (req, res) => {
    try {
        const records = await TrainingRecord.find()
            .populate('assignedTo', 'name email')
            .populate('completedBy', 'name email')
            .sort({ dueDate: 1 });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_records_listed',
                description: `${req.user.name} viewed training records list`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordCount: records.length,
                    operation: 'list_training'
                }
            });
        }

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add the missing getTrainingRecordById function
exports.getTrainingRecordById = async (req, res) => {
    try {
        const record = await TrainingRecord.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('completedBy', 'name email');

        if (!record) return res.status(404).json({ error: 'Training record not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_record_viewed',
                description: `${req.user.name} viewed training record "${record.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordId: record._id,
                    recordTitle: record.title,
                    operation: 'view_training'
                }
            });
        }

        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTrainingRecord = async (req, res) => {
    try {
        const record = new TrainingRecord({
            ...req.body,
            assignedBy: req.user?.id
        });
        await record.save();
        await record.populate('assignedTo', 'name email');
        await record.populate('assignedBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_record_created',
                description: `${req.user.name} created training record "${record.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordId: record._id,
                    recordTitle: record.title,
                    operation: 'create_training'
                }
            });
        }

        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTrainingRecord = async (req, res) => {
    try {
        const record = await TrainingRecord.findByIdAndUpdate(
            req.params.id,
            { ...req.body, assignedBy: req.user?.id },
            { new: true }
        )
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email');

        if (!record) return res.status(404).json({ error: 'Training record not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_record_updated',
                description: `${req.user.name} updated training record "${record.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordId: record._id,
                    recordTitle: record.title,
                    operation: 'update_training'
                }
            });
        }

        res.json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTrainingRecord = async (req, res) => {
    try {
        const record = await TrainingRecord.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ error: 'Training record not found' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_record_deleted',
                description: `${req.user.name} deleted training record "${record.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordTitle: record.title,
                    operation: 'delete_training'
                }
            });
        }

        res.json({ message: 'Training record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const { completionDate, notes } = req.body;

        const record = await TrainingRecord.findById(id);
        if (!record) return res.status(404).json({ error: 'Training record not found' });

        record.status = 'completed';
        record.completionDate = completionDate || new Date();
        record.notes = notes;
        record.completedBy = req.user?.id;
        await record.save();

        await record.populate('assignedTo', 'name email');
        await record.populate('completedBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'training_completed',
                description: `${req.user.name} completed training "${record.title}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    recordId: record._id,
                    recordTitle: record.title,
                    operation: 'complete_training'
                }
            });
        }

        res.json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Add the missing getComplianceStats function
exports.getComplianceStats = async (req, res) => {
    try {
        // Get counts for different compliance items
        const totalItems = await ComplianceItem.countDocuments();
        const overdueItems = await ComplianceItem.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });
        const pendingItems = await ComplianceItem.countDocuments({ status: 'pending' });
        const inProgressItems = await ComplianceItem.countDocuments({ status: 'in-progress' });
        const completedItems = await ComplianceItem.countDocuments({ status: 'completed' });

        // Get audit stats
        const totalAudits = await Audit.countDocuments();
        const upcomingAudits = await Audit.countDocuments({
            scheduledDate: { $gte: new Date() }
        });
        const completedAudits = await Audit.countDocuments({ status: 'completed' });

        // Get training stats
        const totalTraining = await TrainingRecord.countDocuments();
        const overdueTraining = await TrainingRecord.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });
        const completedTraining = await TrainingRecord.countDocuments({ status: 'completed' });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'compliance_stats_viewed',
                description: `${req.user.name} viewed compliance statistics`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'compliance',
                    operation: 'view_stats'
                }
            });
        }

        res.json({
            complianceItems: {
                total: totalItems,
                overdue: overdueItems,
                pending: pendingItems,
                inProgress: inProgressItems,
                completed: completedItems
            },
            audits: {
                total: totalAudits,
                upcoming: upcomingAudits,
                completed: completedAudits
            },
            training: {
                total: totalTraining,
                overdue: overdueTraining,
                completed: completedTraining
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};