const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks (optionally filter by projectId)
router.get('/', taskController.getTasks);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// --- SUBTASKS ---
router.post('/:id/subtasks', taskController.addSubtask);
router.put('/:id/subtasks/:subtaskId', taskController.updateSubtask);
router.delete('/:id/subtasks/:subtaskId', taskController.deleteSubtask);

// --- COMMENTS ---
router.post('/:id/comments', taskController.addComment);
router.get('/:id/comments', taskController.getComments);
router.put('/:id/comments/:commentId', taskController.updateComment);
router.delete('/:id/comments/:commentId', taskController.deleteComment);

// --- FILES ---
router.post('/:id/files', upload.single('file'), taskController.addFile);
router.get('/:id/files', taskController.getFiles);
router.delete('/:id/files/:fileId', taskController.deleteFile);

// --- ASSIGNEE ---
router.patch('/:id/assignee', taskController.updateAssignee);

// --- ACTIVITY LOG ---
router.get('/:id/activity', taskController.getActivityLog);

// --- RELATED TASKS ---
router.get('/:id/related', taskController.getRelatedTasks);

module.exports = router; 