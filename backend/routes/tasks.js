const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
    logTaskCreation,
    logTaskUpdate,
    logTaskDeletion,
    logSubtaskOperation,
    logCommentOperation,
    logFileOperation
} = require('../middleware/activityLogger');

// Create a new task
router.post('/', logTaskCreation, taskController.createTask);

// Get all tasks (optionally filter by projectId)
router.get('/', taskController.getTasks);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', logTaskUpdate, taskController.updateTask);

// Delete a task
router.delete('/:id', logTaskDeletion, taskController.deleteTask);

// --- SUBTASKS ---
router.post('/:id/subtasks', logSubtaskOperation('add'), taskController.addSubtask);
router.put('/:id/subtasks/:subtaskId', logSubtaskOperation('update'), taskController.updateSubtask);
router.delete('/:id/subtasks/:subtaskId', logSubtaskOperation('delete'), taskController.deleteSubtask);

// --- COMMENTS ---
router.post('/:id/comments', logCommentOperation('add'), taskController.addComment);
router.get('/:id/comments', taskController.getComments);
router.put('/:id/comments/:commentId', logCommentOperation('update'), taskController.updateComment);
router.delete('/:id/comments/:commentId', logCommentOperation('delete'), taskController.deleteComment);

// --- FILES ---
router.post('/:id/files', upload.single('file'), logFileOperation('add'), taskController.addFile);
router.get('/:id/files', taskController.getFiles);
router.delete('/:id/files/:fileId', logFileOperation('delete'), taskController.deleteFile);

// --- ASSIGNEE ---
router.patch('/:id/assignee', logTaskUpdate, taskController.updateAssignee);

// --- ACTIVITY LOG ---
router.get('/:id/activity', taskController.getActivityLog);

// --- RELATED TASKS ---
router.get('/:id/related', taskController.getRelatedTasks);

module.exports = router; 