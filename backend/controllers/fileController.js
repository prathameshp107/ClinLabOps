const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
exports.handleSingleUpload = (req, res) => {
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

        res.status(201).json({
            message: 'File uploaded successfully',
            file: fileInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Handle multiple files upload
exports.handleMultipleUpload = (req, res) => {
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

        res.status(201).json({
            message: `${filesInfo.length} files uploaded successfully`,
            files: filesInfo
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Serve uploaded files
exports.serveFile = (req, res) => {
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

        // Send file
        res.sendFile(filePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete file
exports.deleteFile = (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete file
        fs.unlinkSync(filePath);

        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get file info
exports.getFileInfo = (req, res) => {
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

        res.json(fileInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// List all uploaded files
exports.listFiles = (req, res) => {
    try {
        const uploadsPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadsPath)) {
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

        res.json({ files: fileList });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};