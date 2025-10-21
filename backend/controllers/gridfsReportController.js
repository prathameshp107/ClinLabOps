const Report = require('../models/Report');
const ActivityService = require('../services/activityService');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const gridfsService = require('../services/gridfsService');

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const { type, page = 1, limit = 100 } = req.query;

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

// Create a new report with GridFS
exports.createReport = async (req, res) => {
    try {
        console.log('Received report creation request:', {
            user: req.user ? { id: req.user._id, name: req.user.name } : 'No user',
            body: req.body,
            file: req.file
        });

        if (!req.file) {
            console.error('No file uploaded in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, type, description, format } = req.body;

        // Validate required fields
        if (!title || !type || !format) {
            console.error('Missing required fields:', { title, type, format });
            return res.status(400).json({ error: 'Title, type, and format are required' });
        }

        // Validate report type
        if (!['regulatory', 'research', 'miscellaneous'].includes(type)) {
            console.error('Invalid report type:', type);
            return res.status(400).json({ error: 'Invalid report type' });
        }

        // Validate format
        if (!['pdf', 'xlsx', 'csv', 'docx', 'json', 'jpg', 'jpeg', 'png', 'gif'].includes(format)) {
            console.error('Invalid file format:', format);
            return res.status(400).json({ error: 'Invalid file format' });
        }

        // Check if file exists before trying to read it
        if (!fs.existsSync(req.file.path)) {
            console.error('Uploaded file not found at path:', req.file.path);
            return res.status(500).json({ error: 'Uploaded file not found. Please try uploading again.' });
        }

        // Read file buffer
        console.log('Reading file buffer from:', req.file.path);
        let fileBuffer;
        try {
            fileBuffer = fs.readFileSync(req.file.path);
        } catch (readErr) {
            console.error('Failed to read uploaded file:', readErr);
            return res.status(500).json({ error: 'Failed to read uploaded file. Please try uploading again.' });
        }

        // Upload file to GridFS
        console.log('Uploading file to GridFS:', req.file.filename);
        let gridFSFile;
        try {
            gridFSFile = await gridfsService.uploadFile(fileBuffer, req.file.filename, {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.user._id
            });
        } catch (uploadErr) {
            console.error('GridFS upload failed:', uploadErr);
            // Try to delete the temporary file if upload fails
            try {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (deleteErr) {
                console.error('Failed to delete temporary file after upload error:', deleteErr);
            }
            throw new Error(`Failed to upload file to GridFS: ${uploadErr.message}`);
        }

        // Debug log to see what gridFSFile contains
        console.log('GridFS file upload result:', gridFSFile);

        // Check if gridFSFile is valid
        if (!gridFSFile) {
            const error = new Error('Failed to upload file to GridFS - no response received');
            console.error(error.message);
            // Try to delete the temporary file
            try {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (deleteErr) {
                console.error('Failed to delete temporary file after upload error:', deleteErr);
            }
            throw error;
        }

        // The GridFS file object should have an _id property
        const fileId = gridFSFile._id || gridFSFile.id;
        if (!fileId) {
            const error = new Error('Failed to upload file to GridFS - missing file ID');
            console.error(error.message, { gridFSFile });
            // Try to delete the temporary file
            try {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (deleteErr) {
                console.error('Failed to delete temporary file after upload error:', deleteErr);
            }
            throw error;
        }

        const report = new Report({
            title,
            type,
            description: description || '',
            format,
            fileName: req.file.filename,
            fileSize: req.file.size,
            fileUrl: `/api/gridfs-reports/gridfs-download/${fileId}`,
            uploadedBy: req.user._id,
            gridFSFileId: fileId
        });

        console.log('Creating report in database:', {
            title,
            type,
            format,
            fileName: req.file.filename,
            fileSize: req.file.size,
            uploadedBy: req.user._id,
            gridFSFileId: fileId
        });

        const savedReport = await report.save();

        // Populate the uploadedBy field
        await savedReport.populate('uploadedBy', 'name email');

        // Delete the temporary file
        try {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (deleteErr) {
            console.error('Failed to delete temporary file after successful upload:', deleteErr);
            // Don't throw an error here as the report was successfully created
        }

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

        console.log('Report created successfully:', savedReport._id);
        res.status(201).json(savedReport);
    } catch (err) {
        // Delete the temporary file if report creation fails
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (deleteErr) {
                console.error('Failed to delete temporary file after error:', deleteErr);
            }
        }
        console.error('Error creating report:', err);
        res.status(500).json({
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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

// Delete a report with GridFS file
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete the file from GridFS if it exists
        if (report.gridFSFileId) {
            try {
                await gridfsService.deleteFile(report.gridFSFileId);
            } catch (err) {
                console.error('Error deleting file from GridFS:', err);
            }
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

// Download a report from GridFS
// Download a report file
exports.downloadReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Common headers that can be set early (Content-Disposition)
        res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);

        // Log activity (logging the attempt, even if file not found)
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

        if (!report.gridFSFileId) {
            // Fall back to filesystem download for older reports
            const filePath = path.join(__dirname, '..', 'uploads', 'reports', report.fileName);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Set additional headers
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Length', report.fileSize);

            // Stream the file
            const fileStream = fs.createReadStream(filePath);
            fileStream.on('error', (err) => {
                console.error('Error streaming file from filesystem:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to stream file' });
                }
            });
            fileStream.pipe(res);
        } else {
            // Download from GridFS
            const file = await gridfsService.findFile(report.gridFSFileId);
            if (!file) {
                return res.status(404).json({ error: 'File not found in GridFS' });
            }

            // Set additional headers
            res.setHeader('Content-Type', file.metadata.mimetype || 'application/octet-stream');
            res.setHeader('Content-Length', file.length || report.fileSize);

            // Stream the file from GridFS
            await gridfsService.downloadFile(report.gridFSFileId, res);
        }
    } catch (err) {
        console.error('Error downloading report:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};