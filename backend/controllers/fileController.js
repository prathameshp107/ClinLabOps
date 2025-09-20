const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ActivityService = require('../services/activityService');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: fileFilter
});

// Single file upload
exports.uploadSingle = upload.single('file');

// Multiple files upload
exports.uploadMultiple = upload.array('files', 10);

// Handle single file upload
exports.handleSingleUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileInfo = {
            id: `file-${Date.now()}`,
            originalName: req.file.originalname,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            url: `/api/files/${req.file.filename}`,
            uploadedAt: new Date(),
            uploadedBy: req.body.uploadedBy || 'Unknown'
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'file_uploaded',
                description: `${req.user.name} uploaded file "${req.file.originalname}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    filename: req.file.originalname,
                    fileSize: req.file.size,
                    operation: 'upload'
                }
            });
        }

        res.status(201).json({
            message: 'File uploaded successfully',
            file: fileInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Handle multiple files upload
exports.handleMultipleUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const filesInfo = req.files.map(file => ({
            id: `file-${Date.now()}-${Math.random()}`,
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            url: `/api/files/${file.filename}`,
            uploadedAt: new Date(),
            uploadedBy: req.body.uploadedBy || 'Unknown'
        }));

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'files_uploaded',
                description: `${req.user.name} uploaded ${req.files.length} files`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    fileCount: req.files.length,
                    operation: 'upload_multiple'
                }
            });
        }

        res.status(201).json({
            message: `${filesInfo.length} files uploaded successfully`,
            files: filesInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Serve uploaded files
exports.serveFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Set appropriate headers
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.txt': 'text/plain',
            '.csv': 'text/csv'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'file_downloaded',
                description: `${req.user.name} downloaded file "${filename}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    filename: filename,
                    operation: 'download'
                }
            });
        }

        // Send file
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete file
exports.deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Get file stats before deletion for logging
        const stats = fs.statSync(filePath);

        // Delete file
        fs.unlinkSync(filePath);

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'file_deleted',
                description: `${req.user.name} deleted file "${filename}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    filename: filename,
                    fileSize: stats.size,
                    operation: 'delete'
                }
            });
        }

        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get file info
exports.getFileInfo = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Get file stats
        const stats = fs.statSync(filePath);

        const fileInfo = {
            filename: filename,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
            url: `/api/files/${filename}`
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'file_info_viewed',
                description: `${req.user.name} viewed info for file "${filename}"`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    filename: filename,
                    operation: 'view_info'
                }
            });
        }

        res.json(fileInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List all uploaded files
exports.listFiles = async (req, res) => {
    try {
        const uploadsPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadsPath)) {
            // Log activity
            if (req.user) {
                await ActivityService.logActivity({
                    type: 'files_listed',
                    description: `${req.user.name} viewed files list (no uploads folder)`,
                    userId: req.user._id || req.user.id,
                    meta: {
                        category: 'file',
                        operation: 'list'
                    }
                });
            }

            return res.json({ files: [] });
        }

        const files = fs.readdirSync(uploadsPath);
        const fileList = files.map(filename => {
            const filePath = path.join(uploadsPath, filename);
            const stats = fs.statSync(filePath);

            return {
                filename: filename,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                url: `/api/files/${filename}`
            };
        });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'files_listed',
                description: `${req.user.name} viewed files list (${files.length} files)`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    fileCount: files.length,
                    operation: 'list'
                }
            });
        }

        res.json({ files: fileList });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search files
exports.searchFiles = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const uploadsPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadsPath)) {
            return res.json({ files: [] });
        }

        const files = fs.readdirSync(uploadsPath);
        const filteredFiles = files.filter(filename =>
            filename.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const fileList = filteredFiles.map(filename => {
            const filePath = path.join(uploadsPath, filename);
            const stats = fs.statSync(filePath);

            return {
                filename: filename,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                url: `/api/files/${filename}`
            };
        });

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'files_searched',
                description: `${req.user.name} searched files with term "${searchTerm}" (${filteredFiles.length} results)`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    searchTerm: searchTerm,
                    resultCount: filteredFiles.length,
                    operation: 'search'
                }
            });
        }

        res.json({ files: fileList });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get file statistics
exports.getFileStats = async (req, res) => {
    try {
        const uploadsPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadsPath)) {
            // Log activity
            if (req.user) {
                await ActivityService.logActivity({
                    type: 'file_stats_viewed',
                    description: `${req.user.name} viewed file statistics (no uploads folder)`,
                    userId: req.user._id || req.user.id,
                    meta: {
                        category: 'file',
                        operation: 'view_stats'
                    }
                });
            }

            return res.json({
                totalFiles: 0,
                totalSize: 0,
                averageSize: 0,
                fileTypeDistribution: {}
            });
        }

        const files = fs.readdirSync(uploadsPath);
        let totalSize = 0;
        const fileTypeDistribution = {};

        const fileStats = files.map(filename => {
            const filePath = path.join(uploadsPath, filename);
            const stats = fs.statSync(filePath);

            // Track file type distribution
            const ext = path.extname(filename).toLowerCase();
            fileTypeDistribution[ext] = (fileTypeDistribution[ext] || 0) + 1;

            totalSize += stats.size;
            return stats;
        });

        const stats = {
            totalFiles: files.length,
            totalSize: totalSize,
            averageSize: files.length > 0 ? totalSize / files.length : 0,
            fileTypeDistribution: fileTypeDistribution
        };

        // Log activity
        if (req.user) {
            await ActivityService.logActivity({
                type: 'file_stats_viewed',
                description: `${req.user.name} viewed file statistics`,
                userId: req.user._id || req.user.id,
                meta: {
                    category: 'file',
                    operation: 'view_stats'
                }
            });
        }

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};