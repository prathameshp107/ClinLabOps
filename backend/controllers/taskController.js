const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityService = require('../services/activityService');
const mongoose = require('mongoose');

// Helper function to generate project initials from project name
const generateProjectInitials = (projectName) => {
    // Check if the project name contains an acronym in parentheses
    const acronymMatch = projectName.match(/\(([^)]+)\)/);
    if (acronymMatch && acronymMatch[1]) {
        // Use the acronym from parentheses if it exists
        return acronymMatch[1].toUpperCase();
    }

    // Fallback to the original logic if no parentheses found
    return projectName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .filter(char => /[A-Z]/.test(char)) // Only keep alphabetic characters
        .join('');
};

// Helper function to escape special regex characters
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper function to generate custom task ID with race condition handling
const generateCustomTaskId = async (projectId) => {
    try {
        // Get the project to extract name/initials
        const project = await Project.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // Generate project initials from project name
        const projectInitials = generateProjectInitials(project.name);

        // Find the highest existing task number for this project
        const escapedProjectInitials = escapeRegex(projectInitials);
        const existingTasks = await Task.find({
            projectId: projectId,
            customId: { $regex: `^${escapedProjectInitials}-\\d+$` }
        }).sort({ customId: -1 }).limit(1);

        let nextTaskNumber = 1;
        if (existingTasks.length > 0) {
            const lastCustomId = existingTasks[0].customId;
            const lastNumber = parseInt(lastCustomId.split('-')[1]);
            nextTaskNumber = lastNumber + 1;
        }

        // Generate the custom ID: ProjectInitials-TaskNumber
        const customId = `${projectInitials}-${nextTaskNumber}`;

        // Check if this ID already exists (race condition protection)
        const existingTask = await Task.findOne({ customId });
        if (existingTask) {
            // If it exists, try the next number
            return `${projectInitials}-${nextTaskNumber + 1}`;
        }

        return customId;
    } catch (error) {
        throw new Error(`Failed to generate custom task ID: ${error.message}`);
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const data = { ...req.body };

        // Set createdBy field if user is authenticated
        if (req.user) {
            data.createdBy = req.user._id || req.user.id;
        }

        let savedTask = null;

        // Generate custom task ID if projectId is provided
        if (data.projectId) {
            let attempts = 0;
            const maxAttempts = 5;

            while (attempts < maxAttempts) {
                try {
                    data.customId = await generateCustomTaskId(data.projectId);
                    const task = new Task(data);
                    savedTask = await task.save();

                    // Log activity
                    if (req.user) {
                        // Get project for activity logging
                        const project = await Project.findById(data.projectId);
                        await ActivityService.logTaskActivity('created', savedTask, req.user, project);
                    }

                    // Update the project document to include this task in the embedded tasks array
                    try {
                        await Project.findByIdAndUpdate(data.projectId, {
                            $push: {
                                tasks: {
                                    id: savedTask._id,
                                    name: savedTask.title, // Use 'name' to match embedded task structure
                                    status: savedTask.status,
                                    assignee: savedTask.assignee,
                                    dueDate: savedTask.dueDate,
                                    priority: savedTask.priority,
                                    progress: savedTask.progress || 0
                                }
                            }
                        });
                    } catch (projectUpdateError) {
                        console.error('Error updating project with new task:', projectUpdateError);
                    }

                    // Wrap task data in data property for frontend compatibility
                    return res.status(201).json({ data: savedTask });
                } catch (saveError) {
                    if (saveError.code === 11000 && saveError.keyPattern?.customId) {
                        // Duplicate customId error, try again with next number
                        attempts++;
                        if (attempts >= maxAttempts) {
                            throw new Error('Failed to generate unique task ID after multiple attempts');
                        }
                        continue;
                    }
                    throw saveError;
                }
            }
        } else {
            const task = new Task(data);
            savedTask = await task.save();

            // Log activity
            if (req.user) {
                await ActivityService.logTaskActivity('created', savedTask, req.user);
            }

            // Wrap task data in data property for frontend compatibility
            res.status(201).json({ data: savedTask });
        }
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(400).json({ error: err.message });
    }
};

// Get all tasks (optionally filter by projectId or createdBy)
exports.getTasks = async (req, res) => {
    try {
        console.log('TaskController: Received request with query:', req.query);
        const filter = {};
        if (req.query.projectId) {
            console.log('TaskController: Filtering by projectId:', req.query.projectId);
            // Try multiple approaches to match projectId
            const projectId = req.query.projectId;

            // Create an array of possible projectId matches
            const projectIdMatches = [
                projectId // Exact string match
            ];

            // If it looks like a valid ObjectId string, also try ObjectId match
            if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
                try {
                    projectIdMatches.push(mongoose.Types.ObjectId(projectId));
                    console.log('TaskController: Added ObjectId match to filter');
                } catch (e) {
                    console.log('TaskController: Could not convert to ObjectId:', e.message);
                }
            }

            // Use $in operator to match any of the possible projectId values
            filter.projectId = { $in: projectIdMatches };

            console.log('TaskController: Final filter:', JSON.stringify(filter, null, 2));
        }
        if (req.query.createdBy) {
            filter.createdBy = req.query.createdBy;
        }
        const tasks = await Task.find(filter);
        console.log('TaskController: Found tasks:', tasks.length);
        // Wrap tasks array in data property for frontend compatibility
        res.json({ data: tasks });
    } catch (err) {
        console.error('TaskController: Error fetching tasks:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get a single task by ID (either MongoDB _id or customId)
exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by MongoDB _id first (if it looks like a valid ObjectId)
        let task = null;
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            task = await Task.findById(id);
        }

        // If not found or not a valid ObjectId, try to find by customId
        if (!task) {
            task = await Task.findOne({ customId: id });
        }

        if (!task) return res.status(404).json({ error: 'Task not found' });
        // Wrap task data in data property for frontend compatibility
        res.json({ data: task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Log activity
        if (req.user) {
            // Get project for activity logging
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logTaskActivity('updated', task, req.user, project);
        }

        // Update the corresponding embedded task in the project document
        if (task.projectId) {
            try {
                await Project.updateOne(
                    { _id: task.projectId, "tasks.id": task._id },
                    {
                        $set: {
                            "tasks.$.name": task.title, // Use 'name' to match embedded task structure
                            "tasks.$.status": task.status,
                            "tasks.$.assignee": task.assignee,
                            "tasks.$.dueDate": task.dueDate,
                            "tasks.$.priority": task.priority,
                            "tasks.$.progress": task.progress || 0
                        }
                    }
                );
            } catch (projectUpdateError) {
                console.error('Error updating embedded task in project:', projectUpdateError);
            }
        }

        // Wrap task data in data property for frontend compatibility
        res.json({ data: task });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Log activity
        if (req.user) {
            // Get project for activity logging
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logTaskActivity('deleted', task, req.user, project);
        }

        // Remove the corresponding embedded task from the project document
        if (task.projectId) {
            try {
                await Project.updateOne(
                    { _id: task.projectId },
                    {
                        $pull: {
                            tasks: { id: task._id }
                        }
                    }
                );
            } catch (projectUpdateError) {
                console.error('Error removing embedded task from project:', projectUpdateError);
            }
        }

        // Wrap deleted task data in data property for frontend compatibility
        res.json({ success: true, data: task });
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'subtask_added',
                description: `${req.user.name} added subtask "${subtask.name || subtask.title}" to task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    subtaskId: subtask.id,
                    subtaskName: subtask.name || subtask.title,
                    operation: 'add_subtask'
                }
            });
        }

        // Wrap subtask data in data property for frontend compatibility
        res.status(201).json({ data: subtask });
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'subtask_updated',
                description: `${req.user.name} updated subtask "${subtask.name || subtask.title}" in task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    subtaskId: subtask.id,
                    subtaskName: subtask.name || subtask.title,
                    operation: 'update_subtask'
                }
            });
        }

        // Wrap subtask data in data property for frontend compatibility
        res.json({ data: subtask });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteSubtask = async (req, res) => {
    try {
        const { id, subtaskId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        const subtask = task.subtasks.id(subtaskId) || task.subtasks.find(st => st.id === subtaskId);
        if (!subtask) return res.status(404).json({ error: 'Subtask not found' });
        const subtaskName = subtask.name || subtask.title;
        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
        await task.save();

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'subtask_deleted',
                description: `${req.user.name} deleted subtask "${subtaskName}" from task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    subtaskId: subtaskId,
                    subtaskName: subtaskName,
                    operation: 'delete_subtask'
                }
            });
        }

        // Return success status for frontend compatibility
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'comment_added',
                description: `${req.user.name} added a comment to task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    commentId: comment.id,
                    operation: 'add_comment'
                }
            });
        }

        // Wrap comment data in data property for frontend compatibility
        res.status(201).json({ data: comment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        // Wrap comments array in data property for frontend compatibility
        res.json({ data: task.comments });
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'comment_updated',
                description: `${req.user.name} updated a comment in task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    commentId: commentId,
                    operation: 'update_comment'
                }
            });
        }

        // Wrap comment data in data property for frontend compatibility
        res.json({ data: comment });
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'comment_deleted',
                description: `${req.user.name} deleted a comment from task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    commentId: commentId,
                    operation: 'delete_comment'
                }
            });
        }

        // Return success status for frontend compatibility
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'file_added_to_task',
                description: `${req.user.name} uploaded file "${originalname}" to task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    fileName: originalname,
                    fileSize: size,
                    operation: 'add_file'
                }
            });
        }

        // Wrap file data in data property for frontend compatibility
        res.status(201).json({ data: file });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        // Wrap files array in data property for frontend compatibility
        res.json({ data: task.files });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { id, fileId } = req.params;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        const file = task.files.find(f => f.id === fileId);
        const fileName = file ? file.name : 'Unknown file';
        task.files = task.files.filter(f => f.id !== fileId);
        await task.save();

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'file_deleted_from_task',
                description: `${req.user.name} deleted file "${fileName}" from task "${task.name}"`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    fileName: fileName,
                    fileId: fileId,
                    operation: 'delete_file'
                }
            });
        }

        // Return success status for frontend compatibility
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

        // Log activity
        if (req.user) {
            const project = task.projectId ? await Project.findById(task.projectId) : null;
            await ActivityService.logActivity({
                type: 'task_assignee_updated',
                description: `${req.user.name} assigned task "${task.name}" to ${assignee || 'unassigned'}`,
                userId: req.user._id || req.user.id,
                projectId: task.projectId,
                meta: {
                    category: 'task',
                    taskId: task._id,
                    taskName: task.name,
                    assignee: assignee,
                    operation: 'update_assignee'
                }
            });
        }

        // Wrap task data in data property for frontend compatibility
        res.json({ data: task });
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

        // Wrap activity log array in data property for frontend compatibility
        res.json({ data: sortedActivities });
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
        // Wrap related tasks array in data property for frontend compatibility
        res.json({ data: task.relatedTasks });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get next available task ID for a project (for preview purposes)
exports.getNextTaskId = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: 'Project ID is required' });
        }

        const nextCustomId = await generateCustomTaskId(projectId);
        // Wrap nextTaskId in data property for frontend compatibility
        res.json({ data: { nextTaskId: nextCustomId } });
    } catch (err) {
        console.error('Error generating next task ID:', err);
        res.status(400).json({ error: err.message });
    }
};