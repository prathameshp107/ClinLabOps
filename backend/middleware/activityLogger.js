const Activity = require('../models/Activity');
const Task = require('../models/Task');

/**
 * Activity logging middleware for task operations
 * Logs all CRUD operations on tasks and related entities
 */

// Helper function to get user info from request
const getUserInfo = (req) => {
    // Try to get user from auth middleware
    if (req.user) {
        return {
            id: req.user._id || req.user.id,
            name: req.user.name || req.user.username || 'Unknown User'
        };
    }

    // Fallback to request body or headers
    const userId = req.body.userId || req.headers['x-user-id'] || 'anonymous';
    const userName = req.body.userName || req.headers['x-user-name'] || 'Unknown User';

    return { id: userId, name: userName };
};

// Helper function to create activity log entry
const createActivityLog = async (taskId, type, description, user, details = null, meta = {}) => {
    try {
        // Create activity in global activities collection
        const globalActivity = new Activity({
            type,
            description,
            user: user.id,
            meta: {
                taskId,
                details,
                ...meta
            }
        });
        await globalActivity.save();

        // Also add to task's activity array for quick access
        const task = await Task.findById(taskId);
        if (task) {
            const taskActivity = {
                id: globalActivity._id.toString(),
                userId: user.id,
                action: type,
                timestamp: new Date(),
                details: details || description,
                user: user.name
            };

            task.activity.push(taskActivity);
            await task.save();
        }

        return globalActivity;
    } catch (error) {
        console.error('Error creating activity log:', error);
    }
};

// Middleware for task creation
const logTaskCreation = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 201 && data) {
            const user = getUserInfo(req);
            const taskData = typeof data === 'string' ? JSON.parse(data) : data;

            if (taskData._id || taskData.id) {
                createActivityLog(
                    taskData._id || taskData.id,
                    'task_created',
                    `Task "${taskData.title}" was created`,
                    user,
                    null,
                    { taskTitle: taskData.title, priority: taskData.priority, status: taskData.status }
                );
            }
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for task updates
const logTaskUpdate = async (req, res, next) => {
    const taskId = req.params.id;
    let originalTask = null;

    try {
        originalTask = await Task.findById(taskId);
    } catch (error) {
        console.error('Error fetching original task:', error);
    }

    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 200 && data && originalTask) {
            const user = getUserInfo(req);
            const updatedTask = typeof data === 'string' ? JSON.parse(data) : data;
            const updates = req.body;

            // Log specific field changes
            Object.keys(updates).forEach(field => {
                const oldValue = originalTask[field];
                const newValue = updates[field];

                if (oldValue !== newValue) {
                    let description = '';
                    let activityType = 'task_updated';

                    switch (field) {
                        case 'status':
                            description = `Status changed from "${oldValue}" to "${newValue}"`;
                            activityType = 'status_changed';
                            break;
                        case 'priority':
                            description = `Priority changed from "${oldValue}" to "${newValue}"`;
                            activityType = 'priority_changed';
                            break;
                        case 'assignee':
                            description = `Assignee changed to "${newValue}"`;
                            activityType = 'task_assigned';
                            break;
                        case 'dueDate':
                            description = `Due date updated to ${new Date(newValue).toLocaleDateString()}`;
                            activityType = 'due_date_updated';
                            break;
                        case 'title':
                            description = `Title changed from "${oldValue}" to "${newValue}"`;
                            activityType = 'title_updated';
                            break;
                        case 'description':
                            description = `Description was updated`;
                            activityType = 'description_updated';
                            break;
                        default:
                            description = `${field} was updated`;
                            activityType = 'task_updated';
                    }

                    createActivityLog(
                        taskId,
                        activityType,
                        description,
                        user,
                        newValue,
                        { field, oldValue, newValue }
                    );
                }
            });
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for task deletion
const logTaskDeletion = async (req, res, next) => {
    const taskId = req.params.id;
    let taskToDelete = null;

    try {
        taskToDelete = await Task.findById(taskId);
    } catch (error) {
        console.error('Error fetching task to delete:', error);
    }

    const originalSend = res.send;

    res.send = function (data) {
        if (res.statusCode === 200 && taskToDelete) {
            const user = getUserInfo(req);

            createActivityLog(
                taskId,
                'task_deleted',
                `Task "${taskToDelete.title}" was deleted`,
                user,
                null,
                { taskTitle: taskToDelete.title }
            );
        }
        originalSend.call(this, data);
    };

    next();
};

// Middleware for subtask operations
const logSubtaskOperation = (operation) => {
    return async (req, res, next) => {
        const taskId = req.params.id;
        const originalSend = res.send;

        res.send = function (data) {
            if ((res.statusCode === 201 || res.statusCode === 200) && data) {
                const user = getUserInfo(req);
                const subtaskData = typeof data === 'string' ? JSON.parse(data) : data;

                let description = '';
                let activityType = '';

                switch (operation) {
                    case 'add':
                        description = `Subtask "${subtaskData.title || req.body.title}" was added`;
                        activityType = 'subtask_added';
                        break;
                    case 'update':
                        if (req.body.status === 'completed') {
                            description = `Subtask "${subtaskData.title || req.body.title}" was completed`;
                            activityType = 'subtask_completed';
                        } else {
                            description = `Subtask "${subtaskData.title || req.body.title}" was updated`;
                            activityType = 'subtask_updated';
                        }
                        break;
                    case 'delete':
                        description = `A subtask was removed`;
                        activityType = 'subtask_deleted';
                        break;
                }

                createActivityLog(
                    taskId,
                    activityType,
                    description,
                    user,
                    subtaskData.title || req.body.title,
                    { subtaskId: subtaskData.id || req.params.subtaskId, operation }
                );
            }
            originalSend.call(this, data);
        };

        next();
    };
};

// Middleware for comment operations
const logCommentOperation = (operation) => {
    return async (req, res, next) => {
        const taskId = req.params.id;
        const originalSend = res.send;

        res.send = function (data) {
            if ((res.statusCode === 201 || res.statusCode === 200) && data) {
                const user = getUserInfo(req);

                let description = '';
                let activityType = '';

                switch (operation) {
                    case 'add':
                        description = `Added a comment`;
                        activityType = 'comment_added';
                        break;
                    case 'update':
                        description = `Updated a comment`;
                        activityType = 'comment_updated';
                        break;
                    case 'delete':
                        description = `Deleted a comment`;
                        activityType = 'comment_deleted';
                        break;
                }

                createActivityLog(
                    taskId,
                    activityType,
                    description,
                    user,
                    operation === 'add' ? req.body.text : null,
                    { commentId: req.params.commentId, operation }
                );
            }
            originalSend.call(this, data);
        };

        next();
    };
};

// Middleware for file operations
const logFileOperation = (operation) => {
    return async (req, res, next) => {
        const taskId = req.params.id;
        const originalSend = res.send;

        res.send = function (data) {
            if ((res.statusCode === 201 || res.statusCode === 200) && data) {
                const user = getUserInfo(req);

                let description = '';
                let activityType = '';
                let fileName = '';

                switch (operation) {
                    case 'add':
                        fileName = req.file ? req.file.originalname : 'Unknown file';
                        description = `Uploaded file "${fileName}"`;
                        activityType = 'file_uploaded';
                        break;
                    case 'delete':
                        description = `Deleted a file`;
                        activityType = 'file_deleted';
                        break;
                }

                createActivityLog(
                    taskId,
                    activityType,
                    description,
                    user,
                    fileName,
                    { fileId: req.params.fileId, operation, fileName }
                );
            }
            originalSend.call(this, data);
        };

        next();
    };
};

module.exports = {
    logTaskCreation,
    logTaskUpdate,
    logTaskDeletion,
    logSubtaskOperation,
    logCommentOperation,
    logFileOperation,
    createActivityLog
};