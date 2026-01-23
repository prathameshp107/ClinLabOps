const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'project-documents');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer with custom storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all projects
router.get('/', projectController.getAllProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Create new project
router.post('/', projectController.createProject);

// Update project
router.put('/:id', projectController.updateProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

// Export project data
router.get('/:id/export', auth.protect, /* auth.authorize('admin'), */ projectController.exportProject);

// Add a new task to a project
router.post('/:id/tasks', projectController.addProjectTask);

// Add a new member to a project
router.post('/:id/members', projectController.addProjectMember);

// Upload a document to a project
router.post('/:id/documents', upload.single('file'), projectController.uploadProjectDocument);

// Delete a task from a project
router.delete('/:id/tasks/:taskId', projectController.deleteProjectTask);

// Delete a document from a project
router.delete('/:id/documents/:docId', projectController.deleteProjectDocument);

// Download a document from a project
router.get('/:id/documents/:docId/download', projectController.downloadProjectDocument);

module.exports = router; 