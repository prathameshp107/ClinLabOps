const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all projects
 * @returns {Promise<Array>} List of projects
 */
export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

/**
 * Fetch a single project by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Project object or null
 */
export async function getProjectById(id) {
  const response = await fetch(`${API_URL}/projects/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch project');
  }
  return response.json();
}

/**
 * Create a new project
 * @param {Object} projectData
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
}

/**
 * Update an existing project
 * @param {string} id
 * @param {Object} projectData
 * @returns {Promise<Object|null>} Updated project or null
 */
export async function updateProject(id, projectData) {
  const response = await fetch(`${API__URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
}

/**
 * Delete a project
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
  return true; // Or handle as per API response
}

/**
 * Add a member to a project
 * @param {string} projectId
 * @param {Object} memberData
 * @returns {Promise<Object>} Added member
 */
export function addProjectMember(projectId, memberData) {
  // In a real app, this would POST to an API
  return Promise.resolve({ ...memberData, id: `u${Date.now()}` });
}

/**
 * Remove a member from a project
 * @param {string} projectId
 * @param {string} memberId
 * @returns {Promise<boolean>} Success
 */
export function removeProjectMember(projectId, memberId) {
  // In a real app, this would DELETE from an API
  return Promise.resolve(true);
}

/**
 * Fetch project activities/logs
 * @param {string} projectId
 * @returns {Promise<Array>} List of activities
 */
export function getProjectActivities(projectId) {
  // Filter mockActivities by projectId if available
  return Promise.resolve([...mockActivities]);
}

/**
 * Fetch project milestones
 * @param {string} projectId
 * @returns {Promise<Array>} List of milestones
 */
export function getProjectMilestones(projectId) {
  // Filter mockMilestones by projectId if available
  return Promise.resolve([...mockMilestones]);
}

/**
 * Fetch project documents
 * @param {string} projectId
 * @returns {Promise<Array>} List of documents
 */
export function getProjectDocuments(projectId) {
  // Filter mockDocuments by projectId if available
  return Promise.resolve([...mockDocuments || []]);
}

/**
 * Change a project member's role
 */
export function changeProjectMemberRole(projectId, memberId, newRole) {
  return Promise.resolve({ projectId, memberId, newRole });
}

/**
 * Send a message to a project member
 */
export function sendProjectMessage(projectId, memberId, message) {
  return Promise.resolve({ projectId, memberId, message });
}

/**
 * Get the team for a project
 */
export function getProjectTeam(projectId) {
  const project = mockProjects.find(p => p.id === projectId);
  return Promise.resolve(project?.team || []);
}

/**
 * Add a tag to a project
 */
export function addProjectTag(projectId, tag) {
  return Promise.resolve({ projectId, tag });
}

/**
 * Remove a tag from a project
 */
export function removeProjectTag(projectId, tag) {
  return Promise.resolve({ projectId, tag });
}

/**
 * Add equipment to a project
 */
export function addProjectEquipment(projectId, equipment) {
  return Promise.resolve({ projectId, equipment });
}

/**
 * Remove equipment from a project
 */
export function removeProjectEquipment(projectId, equipment) {
  return Promise.resolve({ projectId, equipment });
}

/**
 * Add a document to a project
 */
export function addProjectDocument(projectId, document) {
  return Promise.resolve({ projectId, document });
}

/**
 * Remove a document from a project
 */
export function removeProjectDocument(projectId, documentId) {
  return Promise.resolve({ projectId, documentId });
}

/**
 * Upload a document to a project
 */
export function uploadProjectDocument(projectId, file) {
  return Promise.resolve({ projectId, file });
}

/**
 * Download a document from a project
 */
export function downloadProjectDocument(projectId, documentId) {
  return Promise.resolve({ projectId, documentId, url: '/mock-download-url' });
}

/**
 * Add a collaborator to a project
 */
export function addProjectCollaborator(projectId, collaborator) {
  return Promise.resolve({ projectId, collaborator });
}

/**
 * Remove a collaborator from a project
 */
export function removeProjectCollaborator(projectId, collaborator) {
  return Promise.resolve({ projectId, collaborator });
}

/**
 * Add a dependency to a project
 */
export function addProjectDependency(projectId, dependency) {
  return Promise.resolve({ projectId, dependency });
}

/**
 * Remove a dependency from a project
 */
export function removeProjectDependency(projectId, dependencyId) {
  return Promise.resolve({ projectId, dependencyId });
}

/**
 * Get dependencies for a project
 */
export function getProjectDependencies(projectId) {
  // In a real app, filter by projectId
  return Promise.resolve([]);
}

/**
 * Add a task to a project
 */
export function addProjectTask(projectId, taskData) {
  return Promise.resolve({ projectId, taskData });
}

/**
 * Remove a task from a project
 */
export function removeProjectTask(projectId, taskId) {
  return Promise.resolve({ projectId, taskId });
}

/**
 * Update a task in a project
 */
export function updateProjectTask(projectId, taskId, taskData) {
  return Promise.resolve({ projectId, taskId, taskData });
}

/**
 * Get all tasks for a project
 */
export function getProjectTasks(projectId) {
  const project = mockProjects.find(p => p.id === projectId);
  return Promise.resolve(project?.tasks || []);
}

/**
 * Update a project's status
 */
export function updateProjectStatus(projectId, status) {
  return Promise.resolve({ projectId, status });
}

/**
 * Update a project's priority
 */
export function updateProjectPriority(projectId, priority) {
  return Promise.resolve({ projectId, priority });
}

/**
 * Toggle favorite for a project
 */
export function toggleProjectFavorite(projectId) {
  return Promise.resolve({ projectId });
}

/**
 * Add an activity to a project
 */
export function addProjectActivity(projectId, activity) {
  return Promise.resolve({ projectId, activity });
}

/**
 * Get the activity log for a project
 */
export function getProjectActivityLog(projectId) {
  // In a real app, filter by projectId
  return Promise.resolve([]);
}

/**
 * Share a project with users
 */
export function shareProject(projectId, invitedUsers) {
  return Promise.resolve({ projectId, invitedUsers });
}

/**
 * Get the timeline (Gantt data) for a project
 */
export function getProjectTimeline(projectId) {
  // In a real app, return Gantt/timeline data
  return Promise.resolve([]);
}

/**
 * Export the Gantt chart for a project
 */
export function exportProjectGanttChart(projectId) {
  // In a real app, return a file URL or blob
  return Promise.resolve({ projectId, url: '/mock-gantt-export-url' });
}

/**
 * Add a reminder to a project
 */
export function addProjectReminder(projectId, reminderData) {
  return Promise.resolve({ projectId, reminderData });
}

/**
 * Remove a reminder from a project
 */
export function removeProjectReminder(projectId, reminderId) {
  return Promise.resolve({ projectId, reminderId });
}

/**
 * Get all reminders for a project
 */
export function getProjectReminders(projectId) {
  return Promise.resolve([]);
}

/**
 * Mark a project as complete
 */
export function markProjectComplete(projectId) {
  return Promise.resolve({ projectId, status: 'completed' });
}

/**
 * Mark a project as incomplete
 */
export function markProjectIncomplete(projectId) {
  return Promise.resolve({ projectId, status: 'incomplete' });
}

/**
 * Update a project's progress (0-100)
 */
export function updateProjectProgress(projectId, progress) {
  return Promise.resolve({ projectId, progress });
}

/**
 * Get performance analytics for a project
 */
export function getProjectPerformance(projectId) {
  return Promise.resolve({ projectId, performance: {} });
}

/**
 * Get reports for a project
 */
export function getProjectReports(projectId) {
  return Promise.resolve([]);
} 