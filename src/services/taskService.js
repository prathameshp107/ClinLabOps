import { mockTasks, taskTemplates, mockTaskUsers, mockActivityLog } from "@/data/tasks-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all tasks (optionally filter by projectId)
 * @param {Object} filter
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasks(filter = {}) {
    const params = new URLSearchParams(filter).toString();
    const response = await fetch(`${API_URL}/tasks${params ? `?${params}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
}

/**
 * Fetch a single task by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Task object or null
 */
export async function getTaskById(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
}

/**
 * Create a new task
 * @param {Object} taskData
 * @returns {Promise<Object>} Created task
 */
export async function createTask(taskData) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
}

/**
 * Update an existing task
 * @param {string} id
 * @param {Object} taskData
 * @returns {Promise<Object|null>} Updated task or null
 */
export async function updateTask(id, taskData) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
}

/**
 * Delete a task
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return true;
}

/**
 * Assign a user to a task
 */
export function assignTaskUser(taskId, userId) {
    const user = Object.values(mockTaskUsers).find(u => u.id === userId);
    return Promise.resolve({ taskId, user });
}

/**
 * Unassign a user from a task
 */
export function unassignTaskUser(taskId, userId) {
    return Promise.resolve({ taskId, userId });
}

/**
 * Update a task's status
 */
export function updateTaskStatus(taskId, status) {
    return Promise.resolve({ taskId, status });
}

/**
 * Update a task's priority
 */
export function updateTaskPriority(taskId, priority) {
    return Promise.resolve({ taskId, priority });
}

/**
 * Add a subtask to a task
 */
export async function addTaskSubtask(taskId, subtaskData) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtaskData),
    });
    if (!response.ok) throw new Error('Failed to add subtask');
    return response.json();
}

/**
 * Update a subtask in atask
 */
export async function updateTaskSubtask(taskId, subtaskId, subtaskData) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtaskData),
    });
    if (!response.ok) throw new Error('Failed to update subtask');
    return response.json();
}

/**
 * Remove a subtask from a task
 */
export async function removeTaskSubtask(taskId, subtaskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete subtask');
    return true;
}

/**
 * Add a comment to a task
 */
export async function addTaskComment(taskId, comment) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
}

/**
 * Remove a comment from a task
 */
export async function removeTaskComment(taskId, commentId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return true;
}

/**
 * Get all comments for a task
 */
export async function getTaskComments(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
}

/**
 * Add an attachment to a task
 */
export async function addTaskAttachment(taskId, file, uploadedBy) {
    const formData = new FormData();
    formData.append('file', file);
    if (uploadedBy) formData.append('uploadedBy', uploadedBy);
    const response = await fetch(`${API_URL}/tasks/${taskId}/files`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
}

/**
 * Remove an attachment from a task
 */
export async function removeTaskAttachment(taskId, attachmentId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/files/${attachmentId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete file');
    return true;
}

/**
 * Get the activity log for a task
 */
export async function getTaskActivityLog(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/activity`);
    if (!response.ok) throw new Error('Failed to fetch activity log');
    return response.json();
}

/**
 * Get related tasks
 */
export async function getRelatedTasks(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/related`);
    if (!response.ok) throw new Error('Failed to fetch related tasks');
    return response.json();
}

/**
 * Get all task templates
 */
export function getTaskTemplates() {
    return Promise.resolve([...taskTemplates]);
}

/**
 * Mark a task as complete
 */
export function markTaskComplete(taskId) {
    return Promise.resolve({ taskId, status: 'completed' });
}

/**
 * Mark a task as incomplete
 */
export function markTaskIncomplete(taskId) {
    return Promise.resolve({ taskId, status: 'incomplete' });
}

/**
 * Add a tag to a task
 */
export function addTaskTag(taskId, tag) {
    return Promise.resolve({ taskId, tag });
}

/**
 * Remove a tag from a task
 */
export function removeTaskTag(taskId, tag) {
    return Promise.resolve({ taskId, tag });
}

/**
 * Start time tracking for a task
 * @param {string} taskId
 * @returns {Promise<{taskId: string, startedAt: Date}>}
 */
export function startTaskTimer(taskId) {
    return Promise.resolve({ taskId, startedAt: new Date() });
}

/**
 * Stop time tracking for a task
 * @param {string} taskId
 * @returns {Promise<{taskId: string, stoppedAt: Date, timeSpent: number}>}
 */
export function stopTaskTimer(taskId) {
    return Promise.resolve({ taskId, stoppedAt: new Date(), timeSpent: Math.floor(Math.random() * 3600) });
}

/**
 * Get/set time spent on a task
 * @param {string} taskId
 * @param {number} [timeSpent] Optional, set time spent
 * @returns {Promise<{taskId: string, timeSpent: number}>}
 */
export function setTaskTimeSpent(taskId, timeSpent) {
    return Promise.resolve({ taskId, timeSpent });
}

export function getTaskTimeSpent(taskId) {
    // In a real app, fetch from backend
    return Promise.resolve({ taskId, timeSpent: Math.floor(Math.random() * 3600) });
}

/**
 * Add a watcher to a task
 */
export function addTaskWatcher(taskId, userId) {
    return Promise.resolve({ taskId, userId });
}

/**
 * Remove a watcher from a task
 */
export function removeTaskWatcher(taskId, userId) {
    return Promise.resolve({ taskId, userId });
}

/**
 * Get all watchers for a task
 */
export function getTaskWatchers(taskId) {
    // In a real app, fetch from backend
    return Promise.resolve([]);
}

/**
 * Duplicate a task
 */
export function duplicateTask(taskId) {
    const original = mockTasks.find(t => t.id === taskId || t._id === taskId);
    if (!original) return Promise.resolve(null);
    const copy = { ...original, id: `t${Date.now()}`, title: `${original.title} (Copy)` };
    return Promise.resolve(copy);
}

/**
 * Archive a task
 */
export function archiveTask(taskId) {
    return Promise.resolve({ taskId, archived: true });
}

/**
 * Restore an archived task
 */
export function restoreTask(taskId) {
    return Promise.resolve({ taskId, archived: false });
}

/**
 * Export a task (returns JSON string)
 */
export function exportTask(taskId) {
    const task = mockTasks.find(t => t.id === taskId || t._id === taskId);
    return Promise.resolve(task ? JSON.stringify(task, null, 2) : null);
}

/**
 * Share a task (returns a mock shareable link)
 */
export function shareTask(taskId) {
    return Promise.resolve({ taskId, link: `https://labtasker.app/tasks/share/${taskId}` });
}

/**
 * Add a dependency to a task
 */
export function addTaskDependency(taskId, dependencyTaskId) {
    return Promise.resolve({ taskId, dependencyTaskId });
}

/**
 * Remove a dependency from a task
 */
export function removeTaskDependency(taskId, dependencyTaskId) {
    return Promise.resolve({ taskId, dependencyTaskId });
}

/**
 * Get dependencies for a task
 */
export function getTaskDependencies(taskId) {
    // In a real app, fetch from backend
    return Promise.resolve([]);
}

/**
 * Update task progress
 */
export function updateTaskProgress(taskId, progress) {
    return Promise.resolve({ taskId, progress });
}

/**
 * Get task progress
 */
export function getTaskProgress(taskId) {
    // In a real app, fetch from backend
    return Promise.resolve({ taskId, progress: Math.floor(Math.random() * 100) });
}

/**
 * Update task assignee
 */
export async function updateTaskAssignee(taskId, assignee) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/assignee`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee }),
    });
    if (!response.ok) throw new Error('Failed to update assignee');
    return response.json();
}

/**
 * Update task comment
 */
export async function updateTaskComment(taskId, commentId, comment) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
}

/**
 * Get task attachments
 */
export async function getTaskAttachments(taskId) {
    const response = await fetch(`${API_URL}/tasks/${taskId}/files`);
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
} 