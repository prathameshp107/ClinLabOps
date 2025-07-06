const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

module.exports = router; 