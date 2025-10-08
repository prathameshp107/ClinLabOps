import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user info for activity logging
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
        config.headers['x-user-id'] = user.id;
        config.headers['x-user-name'] = user.name || user.username || 'Unknown User';
    }

    return config;
});

/**
 * Fetch all tasks (optionally filter by projectId or createdBy)
 * @param {Object} filter
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasks(filter = {}) {
    try {
        const response = await api.get('/tasks', { params: filter });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

/**
 * Fetch a single task by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Task object or null
 */
export async function getTaskById(id) {
    try {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching task:', error);
        throw error;
    }
}

/**
 * Get next available task ID for a project
 * @param {string} projectId
 * @returns {Promise<string>} Next task ID
 */
export async function getNextTaskId(projectId) {
    try {
        const response = await api.get(`/tasks/project/${projectId}/next-id`);
        return response.data.nextTaskId;
    } catch (error) {
        console.error('Error getting next task ID:', error);
        throw error;
    }
}

/**
 * Create a new task
 * @param {Object} taskData
 * @returns {Promise<Object>} Created task
 */
export async function createTask(taskData) {
    try {
        const response = await api.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

/**
 * Update an existing task
 * @param {string} id
 * @param {Object} taskData
 * @returns {Promise<Object|null>} Updated task or null
 */
export async function updateTask(id, taskData) {
    try {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating task:', error);
        throw error;
    }
}

/**
 * Delete a task
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteTask(id) {
    try {
        await api.delete(`/tasks/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

/**
 * Assign a user to a task
 */
export async function assignTaskUser(taskId, userId) {
    try {
        const response = await api.patch(`/tasks/${taskId}/assignee`, { assignee: userId });
        return response.data;
    } catch (error) {
        console.error('Error assigning task user:', error);
        throw error;
    }
}

/**
 * Unassign a user from a task
 */
export async function unassignTaskUser(taskId) {
    try {
        const response = await api.patch(`/tasks/${taskId}/assignee`, { assignee: null });
        return response.data;
    } catch (error) {
        console.error('Error unassigning task user:', error);
        throw error;
    }
}

/**
 * Update a task's status
 */
export async function updateTaskStatus(taskId, status) {
    try {
        const response = await api.put(`/tasks/${taskId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
    }
}

/**
 * Update a task's priority
 */
export async function updateTaskPriority(taskId, priority) {
    try {
        const response = await api.put(`/tasks/${taskId}`, { priority });
        return response.data;
    } catch (error) {
        console.error('Error updating task priority:', error);
        throw error;
    }
}

/**
 * Add a subtask to a task
 */
export async function addTaskSubtask(taskId, subtaskData) {
    try {
        const response = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
        return response.data;
    } catch (error) {
        console.error('Error adding subtask:', error);
        throw error;
    }
}

/**
 * Update a subtask in a task
 */
export async function updateTaskSubtask(taskId, subtaskId, subtaskData) {
    try {
        const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, subtaskData);
        return response.data;
    } catch (error) {
        console.error('Error updating subtask:', error);
        throw error;
    }
}

/**
 * Remove a subtask from a task
 */
export async function removeTaskSubtask(taskId, subtaskId) {
    try {
        await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
        return true;
    } catch (error) {
        console.error('Error removing subtask:', error);
        throw error;
    }
}

/**
 * Add a comment to a task
 */
export async function addTaskComment(taskId, comment) {
    try {
        const response = await api.post(`/tasks/${taskId}/comments`, comment);
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

/**
 * Remove a comment from a task
 */
export async function removeTaskComment(taskId, commentId) {
    try {
        await api.delete(`/tasks/${taskId}/comments/${commentId}`);
        return true;
    } catch (error) {
        console.error('Error removing comment:', error);
        throw error;
    }
}

/**
 * Get all comments for a task
 */
export async function getTaskComments(taskId) {
    try {
        const response = await api.get(`/tasks/${taskId}/comments`);
        return response?.data?.data ? response.data.data : response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

/**
 * Add an attachment to a task
 */
export async function addTaskAttachment(taskId, file, uploadedBy) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (uploadedBy) formData.append('uploadedBy', uploadedBy);

        const response = await api.post(`/tasks/${taskId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding attachment:', error);
        throw error;
    }
}

/**
 * Remove an attachment from a task
 */
export async function removeTaskAttachment(taskId, attachmentId) {
    try {
        await api.delete(`/tasks/${taskId}/files/${attachmentId}`);
        return true;
    } catch (error) {
        console.error('Error removing attachment:', error);
        throw error;
    }
}

/**
 * Get the activity log for a task
 */
export async function getTaskActivityLog(taskId) {
    try {
        // Try frontend API first (which will proxy to backend)
        const frontendResponse = await fetch(`/api/tasks/${taskId}/activity`);
        if (frontendResponse.ok) {
            const result = await frontendResponse.json();
            return result.data || [];
        }

        // Fallback to direct backend API
        const response = await api.get(`/tasks/${taskId}/activity`);
        return response.data;
    } catch (error) {
        console.error('Error fetching activity log:', error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
    }
}

/**
 * Get related tasks
 */
export async function getRelatedTasks(taskId) {
    try {
        const response = await api.get(`/tasks/${taskId}/related`);
        return response.data;
    } catch (error) {
        console.error('Error fetching related tasks:', error);
        throw error;
    }
}

/**
 * Get all task templates
 */
export function getTaskTemplates() {
    // This would need backend implementation
    const defaultTemplates = [
        {
            id: 'template-1',
            name: 'Bug Fix',
            description: 'Template for bug fixing tasks',
            priority: 'high',
            labels: ['bug', 'fix']
        },
        {
            id: 'template-2',
            name: 'Feature Request',
            description: 'Template for new feature development',
            priority: 'medium',
            labels: ['feature', 'enhancement']
        },
        {
            id: 'template-3',
            name: 'Research Task',
            description: 'Template for research and investigation tasks',
            priority: 'low',
            labels: ['research', 'investigation']
        }
    ];
    return Promise.resolve(defaultTemplates);
}

/**
 * Mark a task as complete
 */
export async function markTaskComplete(taskId) {
    return updateTaskStatus(taskId, 'done');
}

/**
 * Mark a task as incomplete
 */
export async function markTaskIncomplete(taskId) {
    return updateTaskStatus(taskId, 'todo');
}

/**
 * Add a tag to a task
 */
export async function addTaskTag(taskId, tag) {
    try {
        const task = await getTaskById(taskId);
        if (!task) return null;

        const updatedLabels = [...(task.labels || []), tag];
        const updatedTask = await updateTask(taskId, { labels: updatedLabels });
        return updatedTask;
    } catch (error) {
        console.error('Error adding task tag:', error);
        throw error;
    }
}

/**
 * Remove a tag from a task
 */
export async function removeTaskTag(taskId, tag) {
    try {
        const task = await getTaskById(taskId);
        if (!task) return null;

        const updatedLabels = (task.labels || []).filter(label => label !== tag);
        const updatedTask = await updateTask(taskId, { labels: updatedLabels });
        return updatedTask;
    } catch (error) {
        console.error('Error removing task tag:', error);
        throw error;
    }
}

/**
 * Update task assignee
 */
export async function updateTaskAssignee(taskId, assignee) {
    try {
        const response = await api.patch(`/tasks/${taskId}/assignee`, { assignee });
        return response.data;
    } catch (error) {
        console.error('Error updating task assignee:', error);
        throw error;
    }
}

/**
 * Update task comment
 */
export async function updateTaskComment(taskId, commentId, comment) {
    try {
        const response = await api.put(`/tasks/${taskId}/comments/${commentId}`, comment);
        return response.data;
    } catch (error) {
        console.error('Error updating task comment:', error);
        throw error;
    }
}

/**
 * Get task attachments
 */
export async function getTaskAttachments(taskId) {
    try {
        const response = await api.get(`/tasks/${taskId}/files`);
        return response.data;
    } catch (error) {
        console.error('Error fetching task attachments:', error);
        throw error;
    }
}

// Legacy functions for backward compatibility
export function startTaskTimer(taskId) {
    return Promise.resolve({ taskId, startedAt: new Date() });
}

export function stopTaskTimer(taskId) {
    return Promise.resolve({ taskId, stoppedAt: new Date(), timeSpent: Math.floor(Math.random() * 3600) });
}

export function setTaskTimeSpent(taskId, timeSpent) {
    return Promise.resolve({ taskId, timeSpent });
}

export function getTaskTimeSpent(taskId) {
    return Promise.resolve({ taskId, timeSpent: Math.floor(Math.random() * 3600) });
}

export function addTaskWatcher(taskId, userId) {
    return Promise.resolve({ taskId, userId });
}

export function removeTaskWatcher(taskId, userId) {
    return Promise.resolve({ taskId, userId });
}

export function getTaskWatchers(taskId) {
    return Promise.resolve([]);
}

export async function duplicateTask(taskId) {
    try {
        const original = await getTaskById(taskId);
        if (!original) return null;

        const copy = {
            ...original,
            title: `${original.title} (Copy)`,
            status: 'todo'
        };
        delete copy._id;
        delete copy.id;

        return await createTask(copy);
    } catch (error) {
        console.error('Error duplicating task:', error);
        throw error;
    }
}

export function archiveTask(taskId) {
    return Promise.resolve({ taskId, archived: true });
}

export function restoreTask(taskId) {
    return Promise.resolve({ taskId, archived: false });
}

export async function exportTask(taskId) {
    try {
        const task = await getTaskById(taskId);
        return task ? JSON.stringify(task, null, 2) : null;
    } catch (error) {
        console.error('Error exporting task:', error);
        throw error;
    }
}

export function shareTask(taskId) {
    return Promise.resolve({ taskId, link: `${window.location.origin}/tasks/${taskId}` });
}

export function addTaskDependency(taskId, dependencyTaskId) {
    return Promise.resolve({ taskId, dependencyTaskId });
}

export function removeTaskDependency(taskId, dependencyTaskId) {
    return Promise.resolve({ taskId, dependencyTaskId });
}

export function getTaskDependencies(taskId) {
    return Promise.resolve([]);
}

export function updateTaskProgress(taskId, progress) {
    return updateTask(taskId, { progress });
}

export function getTaskProgress(taskId) {
    return getTaskById(taskId).then(task => ({ taskId, progress: task?.progress || 0 }));
} 