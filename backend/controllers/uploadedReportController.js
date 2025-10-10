const Report = require('../models/Report');
const ActivityService = require('../services/activityService');
const fs = require('fs');
const path = require('path');

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const { type, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = {};
        if (type && ['regulatory', 'research', 'miscellaneous'].includes(type)) {
            filter.type = type;
        }

        // Pagination
        const skip = (page - 1) * limit;

        const reports = await Report.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('uploadedBy', 'name email');

        const total = await Report.countDocuments(filter);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'reports_viewed',
                description: `${req.user.name} viewed reports list`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'view_list',
                    filters: { type, page, limit }
                }
            });
        }

        res.json({
            reports,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalReports: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('uploadedBy', 'name email');

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_viewed',
                description: `${req.user.name} viewed report: ${report.title}`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'view',
                    reportId: report._id
                }
            });
        }

        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new report
exports.createReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, type, description, format } = req.body;

        // Validate required fields
        if (!title || !type || !format) {
            return res.status(400).json({ error: 'Title, type, and format are required' });
        }

        // Validate report type
        if (!['regulatory', 'research', 'miscellaneous'].includes(type)) {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        // Validate format
        if (!['pdf', 'xlsx', 'csv', 'docx', 'json', 'jpg', 'jpeg', 'png', 'gif'].includes(format)) {
            return res.status(400).json({ error: 'Invalid file format' });
        }

        const report = new Report({
            title,
            type,
            description: description || '',
            format,
            fileName: req.file.filename,
            fileSize: req.file.size,
            fileUrl: `/uploads/reports/${req.file.filename}`,
            uploadedBy: req.user._id
        });

        const savedReport = await report.save();

        // Populate the uploadedBy field
        await savedReport.populate('uploadedBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_created',
                description: `${req.user.name} uploaded report: ${savedReport.title}`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'create',
                    reportId: savedReport._id
                }
            });
        }

        res.status(201).json(savedReport);
    } catch (err) {
        // Delete the uploaded file if report creation fails
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', 'reports', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(500).json({ error: err.message });
    }
};

// Update a report
exports.updateReport = async (req, res) => {
    try {
        const { title, type, description } = req.body;

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Update fields
        if (title) report.title = title;
        if (type && ['regulatory', 'research', 'miscellaneous'].includes(type)) {
            report.type = type;
        }
        if (description !== undefined) report.description = description;

        const updatedReport = await report.save();

        // Populate the uploadedBy field
        await updatedReport.populate('uploadedBy', 'name email');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_updated',
                description: `${req.user.name} updated report: ${updatedReport.title}`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'update',
                    reportId: updatedReport._id
                }
            });
        }

        res.json(updatedReport);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '..', 'uploads', 'reports', report.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete the report from the database
        await Report.findByIdAndDelete(req.params.id);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_deleted',
                description: `${req.user.name} deleted report: ${report.title}`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'delete',
                    reportId: report._id
                }
            });
        }

        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Download a report
exports.downloadReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', 'reports', report.fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'report_downloaded',
                description: `${req.user.name} downloaded report: ${report.title}`,
                userId: req.user._id,
                meta: {
                    category: 'report',
                    operation: 'download',
                    reportId: report._id
                }
            });
        }

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};