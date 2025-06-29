import { mockTasks, taskTemplates, mockTaskUsers, mockActivityLog } from "@/data/tasks-data";

/**
 * Fetch all tasks
 * @returns {Promise<Array>} List of tasks
 */
export function getTasks() {
    return Promise.resolve([...mockTasks]);
}

/**
 * Fetch a single task by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Task object or null
 */
export function getTaskById(id) {
    const task = mockTasks.find(t => t.id === id || t._id === id) || null;
    return Promise.resolve(task);
}

/**
 * Create a new task
 * @param {Object} taskData
 * @returns {Promise<Object>} Created task
 */
export function createTask(taskData) {
    const newTask = { ...taskData, id: `t${Date.now()}` };
    return Promise.resolve(newTask);
}

/**
 * Update an existing task
 * @param {string} id
 * @param {Object} taskData
 * @returns {Promise<Object|null>} Updated task or null
 */
export function updateTask(id, taskData) {
    const task = mockTasks.find(t => t.id === id || t._id === id);
    if (!task) return Promise.resolve(null);
    const updated = { ...task, ...taskData };
    return Promise.resolve(updated);
}

/**
 * Delete a task
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteTask(id) {
    const exists = mockTasks.some(t => t.id === id || t._id === id);
    return Promise.resolve(exists);
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
export function addTaskSubtask(taskId, subtaskData) {
    return Promise.resolve({ taskId, subtaskData });
}

/**
 * Update a subtask in atask
 */
export function updateTaskSubtask(taskId, subtaskId, subtaskData) {
    return Promise.resolve({ taskId, subtaskId, subtaskData });
}

/**
 * Remove a subtask from a task
 */
export function removeTaskSubtask(taskId, subtaskId) {
    return Promise.resolve({ taskId, subtaskId });
}

/**
 * Add a comment to a task
 */
export function addTaskComment(taskId, comment) {
    return Promise.resolve({ taskId, comment });
}

/**
 * Remove a comment from a task
 */
export function removeTaskComment(taskId, commentId) {
    return Promise.resolve({ taskId, commentId });
}

/**
 * Get all comments for a task
 */
export function getTaskComments(taskId) {
    // In a real app, filter by taskId
    return Promise.resolve([]);
}

/**
 * Add an attachment to a task
 */
export function addTaskAttachment(taskId, file) {
    return Promise.resolve({ taskId, file });
}

/**
 * Remove an attachment from a task
 */
export function removeTaskAttachment(taskId, attachmentId) {
    return Promise.resolve({ taskId, attachmentId });
}

/**
 * Get the activity log for a task
 */
export function getTaskActivityLog(taskId) {
    // In a real app, filter by taskId
    return Promise.resolve([...mockActivityLog]);
}

/**
 * Get related tasks
 */
export function getRelatedTasks(taskId) {
    // In a real app, filter by relation
    return Promise.resolve([]);
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