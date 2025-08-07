const { ComplianceItem, Audit, TrainingRecord } = require('../models/Compliance');

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
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteComplianceItem = async (req, res) => {
    try {
        const item = await ComplianceItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Compliance item not found' });
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

        res.json(action);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// AUDITS
exports.getAllAudits = async (req, res) => {
    try {
        const { type, status, department, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (department) filter.department = department;

        const audits = await Audit.find(filter)
            .populate('createdBy', 'name email')
            .populate('findings.assignedTo', 'name email')
            .sort({ auditDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Audit.countDocuments(filter);

        res.json({
            audits,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAuditById = async (req, res) => {
    try {
        const audit = await Audit.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('findings.assignedTo', 'name email department');

        if (!audit) return res.status(404).json({ error: 'Audit not found' });
        res.json(audit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAudit = async (req, res) => {
    try {
        const audit = new Audit({
            ...req.body,
            createdBy: req.user?.id || req.body.createdBy
        });
        await audit.save();
        await audit.populate('createdBy', 'name email');

        res.status(201).json(audit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateAudit = async (req, res) => {
    try {
        const audit = await Audit.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('createdBy', 'name email')
            .populate('findings.assignedTo', 'name email');

        if (!audit) return res.status(404).json({ error: 'Audit not found' });
        res.json(audit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteAudit = async (req, res) => {
    try {
        const audit = await Audit.findByIdAndDelete(req.params.id);
        if (!audit) return res.status(404).json({ error: 'Audit not found' });
        res.json({ message: 'Audit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// TRAINING RECORDS
exports.getAllTrainingRecords = async (req, res) => {
    try {
        const { category, mandatory, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (mandatory !== undefined) filter.mandatory = mandatory === 'true';

        const records = await TrainingRecord.find(filter)
            .populate('createdBy', 'name email')
            .populate('attendees.user', 'name email department')
            .sort({ trainingDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TrainingRecord.countDocuments(filter);

        res.json({
            records,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTrainingRecordById = async (req, res) => {
    try {
        const record = await TrainingRecord.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('attendees.user', 'name email department');

        if (!record) return res.status(404).json({ error: 'Training record not found' });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTrainingRecord = async (req, res) => {
    try {
        const record = new TrainingRecord({
            ...req.body,
            createdBy: req.user?.id || req.body.createdBy
        });
        await record.save();
        await record.populate('createdBy', 'name email');
        await record.populate('attendees.user', 'name email department');

        res.status(201).json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTrainingRecord = async (req, res) => {
    try {
        const record = await TrainingRecord.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('createdBy', 'name email')
            .populate('attendees.user', 'name email department');

        if (!record) return res.status(404).json({ error: 'Training record not found' });
        res.json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTrainingRecord = async (req, res) => {
    try {
        const record = await TrainingRecord.findByIdAndDelete(req.params.id);
        if (!record) return res.status(404).json({ error: 'Training record not found' });
        res.json({ message: 'Training record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAttendeeStatus = async (req, res) => {
    try {
        const { status, score, completedAt } = req.body;
        const record = await TrainingRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ error: 'Training record not found' });

        const attendee = record.attendees.id(req.params.attendeeId);
        if (!attendee) return res.status(404).json({ error: 'Attendee not found' });

        attendee.status = status;
        if (score !== undefined) attendee.score = score;
        if (completedAt) attendee.completedAt = completedAt;

        await record.save();
        res.json(attendee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DASHBOARD STATS
exports.getComplianceStats = async (req, res) => {
    try {
        const totalItems = await ComplianceItem.countDocuments();
        const compliantItems = await ComplianceItem.countDocuments({ status: 'Compliant' });
        const nonCompliantItems = await ComplianceItem.countDocuments({ status: 'Non-Compliant' });
        const expiredItems = await ComplianceItem.countDocuments({ status: 'Expired' });
        const actionRequiredItems = await ComplianceItem.countDocuments({ status: 'Action Required' });

        const upcomingDue = await ComplianceItem.countDocuments({
            dueDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            status: { $ne: 'Compliant' }
        });

        const categoryStats = await ComplianceItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const priorityStats = await ComplianceItem.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const totalAudits = await Audit.countDocuments();
        const completedAudits = await Audit.countDocuments({ status: 'Completed' });
        const openFindings = await Audit.aggregate([
            { $unwind: '$findings' },
            { $match: { 'findings.status': 'Open' } },
            { $count: 'total' }
        ]);

        const totalTrainings = await TrainingRecord.countDocuments();
        const mandatoryTrainings = await TrainingRecord.countDocuments({ mandatory: true });

        res.json({
            complianceItems: {
                total: totalItems,
                compliant: compliantItems,
                nonCompliant: nonCompliantItems,
                expired: expiredItems,
                actionRequired: actionRequiredItems,
                upcomingDue,
                complianceRate: totalItems > 0 ? ((compliantItems / totalItems) * 100).toFixed(1) : 0
            },
            audits: {
                total: totalAudits,
                completed: completedAudits,
                openFindings: openFindings[0]?.total || 0
            },
            training: {
                total: totalTrainings,
                mandatory: mandatoryTrainings
            },
            categoryStats,
            priorityStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};