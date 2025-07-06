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
export async function addProjectMember(projectId, memberData) {
  const response = await fetch(`${API_URL}/projects/${projectId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) {
    throw new Error('Failed to add member');
  }
  return response.json();
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
 * @param {string} projectId
 * @param {File} file
 * @param {Object} options (optional) - { uploadedBy, tags, status }
 * @returns {Promise<Object>} Uploaded document
 */
export async function uploadProjectDocument(projectId, file, options = {}) {
  const formData = new FormData();
  formData.append('file', file);
  if (options.uploadedBy) formData.append('uploadedBy', options.uploadedBy);
  if (options.status) formData.append('status', options.status);
  if (options.tags) {
    if (Array.isArray(options.tags)) {
      options.tags.forEach(tag => formData.append('tags', tag));
    } else {
      formData.append('tags', options.tags);
    }
  }
  const response = await fetch(`${API_URL}/projects/${projectId}/documents`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload document');
  }
  return response.json();
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
 * @param {string} projectId
 * @param {string} taskId
 * @returns {Promise<Object>} Deleted task
 */
export async function removeProjectTask(projectId, taskId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return response.json();
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

/**
 * Export project data in the specified format
 * @param {string} id - Project ID
 * @param {string} format - Export format (csv, xlsx, pdf, json)
 */
export async function exportProjectData(id, format = 'json') {
  const response = await fetch(`${API_URL}/projects/${id}/export?format=${format}`);
  if (!response.ok) {
    throw new Error('Failed to export project data');
  }
  // Get filename from Content-Disposition header
  const disposition = response.headers.get('Content-Disposition');
  let filename = `project_${id}.${format}`;
  if (disposition && disposition.includes('filename=')) {
    filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
  }
  const blob = await response.blob();
  // Trigger file download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
} 