const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.body.customId) {
            data.customId = req.body.customId;
        }
        const task = new Task(data);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all tasks (optionally filter by projectId)
exports.getTasks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.projectId) {
            filter.projectId = req.query.projectId;
        }
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true, deletedTask: task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- SUBTASKS ---
exports.addSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const subtask = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.subtasks.push(subtask);
        await task.save();
        res.status(201).json(subtask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateSubtask = async (req, res) => {
    try {
        const { id, subtaskId } = req.params;
        const updates = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        const subtask = task.subtasks.id(subtaskId) || task.subtasks.find(st => st.id === subtaskId);
        if (!subtask) return res.status(404).json({ error: 'Subtask not found' });
        Object.assign(subtask, updates);
        await task.save();
        res.json(subtask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteSubtask = async (req, res) => {
    try {
        const { id, subtaskId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        await task.save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- COMMENTS ---
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.comments.push(comment);
        await task.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task.comments);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const updates = req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        const comment = task.comments.id(commentId) || task.comments.find(c => c.id === commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        Object.assign(comment, updates);
        await task.save();
        res.json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.comments = task.comments.filter(c => c.id !== commentId);
        await task.save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- FILES ---
exports.addFile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { originalname, size, filename, path } = req.file;
        const file = {
            id: `file-${Date.now()}`,
            name: originalname,
            size: `${(size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: new Date(),
            uploadedBy: req.body.uploadedBy || 'Unknown',
            path,
        };
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.files.push(file);
        await task.save();
        res.status(201).json(file);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task.files);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { id, fileId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        task.files = task.files.filter(f => f.id !== fileId);
        await task.save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- ASSIGNEE ---
exports.updateAssignee = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignee } = req.body;
        const task = await Task.findByIdAndUpdate(id, { assignee }, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- ACTIVITY LOG ---
exports.getActivityLog = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Sort activities by timestamp (newest first)
        const sortedActivities = task.activity.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        res.json(sortedActivities);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// --- RELATED TASKS ---
exports.getRelatedTasks = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id).populate('relatedTasks');
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task.relatedTasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 