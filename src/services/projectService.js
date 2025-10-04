import axios from 'axios';
import config from '../config/config.js';

const API_BASE_URL = config.api.baseUrl;

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
  return config;
});

/**
 * Fetch all projects
 * @returns {Promise<Array>} List of projects
 */
export async function getProjects(filter = {}) {
  try {
    const response = await api.get('/projects', { params: filter });
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Fetch a single project by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Project object or null
 */
export async function getProjectById(id) {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Create a new project
 * @param {Object} projectData
 * @returns {Promise<Object>} Created project
 */
export async function createProject(projectData) {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Update an existing project
 * @param {string} id
 * @param {Object} projectData
 * @returns {Promise<Object|null>} Updated project or null
 */
export async function updateProject(id, projectData) {
  try {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Delete a project
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteProject(id) {
  try {
    await api.delete(`/projects/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

/**
 * Add a member to a project
 * @param {string} projectId
 * @param {Object} memberData
 * @returns {Promise<Object>} Added member
 */
export async function addProjectMember(projectId, memberData) {
  try {
    const response = await api.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding project member:', error);
    throw error;
  }
}

/**
 * Remove a member from a project
 * @param {string} projectId
 * @param {string} memberId
 * @returns {Promise<boolean>} Success
 */
export async function removeProjectMember(projectId, memberId) {
  try {
    // This would need to be implemented in the backend
    // For now, we'll update the project by removing the member
    const project = await getProjectById(projectId);
    if (!project) return false;

    const updatedTeam = project.team.filter(member => member.id !== memberId);
    await updateProject(projectId, { ...project, team: updatedTeam });
    return true;
  } catch (error) {
    console.error('Error removing project member:', error);
    throw error;
  }
}

/**
 * Fetch project activities/logs
 * @param {string} projectId
 * @returns {Promise<Array>} List of activities
 */
export async function getProjectActivities(projectId) {
  try {
    const project = await getProjectById(projectId);
    return project?.activityLog || [];
  } catch (error) {
    console.error('Error fetching project activities:', error);
    throw error;
  }
}

/**
 * Fetch project milestones
 * @param {string} projectId
 * @returns {Promise<Array>} List of milestones
 */
export async function getProjectMilestones(projectId) {
  try {
    const project = await getProjectById(projectId);
    return project?.milestones || [];
  } catch (error) {
    console.error('Error fetching project milestones:', error);
    throw error;
  }
}

/**
 * Fetch project documents
 * @param {string} projectId
 * @returns {Promise<Array>} List of documents
 */
export async function getProjectDocuments(projectId) {
  try {
    const project = await getProjectById(projectId);
    return project?.documents || [];
  } catch (error) {
    console.error('Error fetching project documents:', error);
    throw error;
  }
}

/**
 * Change a project member's role
 */
export async function changeProjectMemberRole(projectId, memberId, newRole) {
  try {
    const project = await getProjectById(projectId);
    if (!project) return null;

    const updatedTeam = project.team.map(member =>
      member.id === memberId ? { ...member, role: newRole } : member
    );

    const updatedProject = await updateProject(projectId, { ...project, team: updatedTeam });
    return updatedProject;
  } catch (error) {
    console.error('Error changing project member role:', error);
    throw error;
  }
}

/**
 * Send a message to a project member
 */
export function sendProjectMessage(projectId, memberId, message) {
  // This would typically integrate with a messaging system
  return Promise.resolve({ projectId, memberId, message, sent: true });
}

/**
 * Get the team for a project
 */
export async function getProjectTeam(projectId) {
  try {
    const project = await getProjectById(projectId);
    return project?.team || [];
  } catch (error) {
    console.error('Error fetching project team:', error);
    throw error;
  }
}

/**
 * Add a tag to a project
 */
export async function addProjectTag(projectId, tag) {
  try {
    const project = await getProjectById(projectId);
    if (!project) return null;

    const updatedTags = [...(project.tags || []), tag];
    const updatedProject = await updateProject(projectId, { ...project, tags: updatedTags });
    return updatedProject;
  } catch (error) {
    console.error('Error adding project tag:', error);
    throw error;
  }
}

/**
 * Remove a tag from a project
 */
export async function removeProjectTag(projectId, tag) {
  try {
    const project = await getProjectById(projectId);
    if (!project) return null;

    const updatedTags = (project.tags || []).filter(t => t !== tag);
    const updatedProject = await updateProject(projectId, { ...project, tags: updatedTags });
    return updatedProject;
  } catch (error) {
    console.error('Error removing project tag:', error);
    throw error;
  }
}

/**
 * Add equipment to a project
 */
export function addProjectEquipment(projectId, equipment) {
  // This would need backend implementation
  return Promise.resolve({ projectId, equipment });
}

/**
 * Remove equipment from a project
 */
export function removeProjectEquipment(projectId, equipment) {
  // This would need backend implementation
  return Promise.resolve({ projectId, equipment });
}

/**
 * Add a document to a project
 */
export function addProjectDocument(projectId, document) {
  // This is handled by uploadProjectDocument
  return Promise.resolve({ projectId, document });
}

/**
 * Remove a document from a project
 */
export function removeProjectDocument(projectId, documentId) {
  // This would need backend implementation
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
  try {
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

    const response = await api.post(`/projects/${projectId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading project document:', error);
    throw error;
  }
}

/**
 * Download a document from a project
 */
export function downloadProjectDocument(projectId, documentId) {
  // This would need backend implementation
  return Promise.resolve({ projectId, documentId, url: '/mock-download-url' });
}

/**
 * Add a task to a project
 */
export async function addProjectTask(projectId, taskData) {
  try {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error adding project task:', error);
    throw error;
  }
}

/**
 * Remove a task from a project
 * @param {string} projectId
 * @param {string} taskId
 * @returns {Promise<Object>} Deleted task
 */
export async function removeProjectTask(projectId, taskId) {
  try {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing project task:', error);
    throw error;
  }
}

/**
 * Update a task in a project
 */
export function updateProjectTask(projectId, taskId, taskData) {
  // This would need backend implementation
  return Promise.resolve({ projectId, taskId, taskData });
}

/**
 * Get all tasks for a project
 */
export async function getProjectTasks(projectId) {
  try {
    const project = await getProjectById(projectId);
    return project?.tasks || [];
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
}

/**
 * Update a project's status
 */
export async function updateProjectStatus(projectId, status) {
  try {
    const updatedProject = await updateProject(projectId, { status });
    return updatedProject;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

/**
 * Update a project's priority
 */
export async function updateProjectPriority(projectId, priority) {
  try {
    const updatedProject = await updateProject(projectId, { priority });
    return updatedProject;
  } catch (error) {
    console.error('Error updating project priority:', error);
    throw error;
  }
}

/**
 * Toggle favorite for a project
 */
export async function toggleProjectFavorite(projectId) {
  try {
    const project = await getProjectById(projectId);
    if (!project) return null;

    const updatedProject = await updateProject(projectId, {
      isFavorite: !project.isFavorite
    });
    return updatedProject;
  } catch (error) {
    console.error('Error toggling project favorite:', error);
    throw error;
  }
}

/**
 * Export project data in the specified format
 * @param {string} id - Project ID
 * @param {string} format - Export format (csv, xlsx, pdf, json)
 */
export async function exportProjectData(id, format = 'json') {
  try {
    const response = await api.get(`/projects/${id}/export`, {
      params: { format },
      responseType: format !== 'json' ? 'blob' : 'json'
    });

    if (format !== 'json') {
      // Handle file download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project_${id}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Project data exported successfully' };
    }

    return response.data;
  } catch (error) {
    console.error('Error exporting project data:', error);
    throw error;
  }
}

// Legacy functions for backward compatibility
export function addProjectCollaborator(projectId, collaborator) {
  return addProjectMember(projectId, collaborator);
}

export function removeProjectCollaborator(projectId, collaborator) {
  return removeProjectMember(projectId, collaborator.id);
}

export function addProjectDependency(projectId, dependency) {
  return Promise.resolve({ projectId, dependency });
}

export function removeProjectDependency(projectId, dependencyId) {
  return Promise.resolve({ projectId, dependencyId });
}

export function getProjectDependencies(projectId) {
  return getProjectById(projectId).then(project => project?.dependencies || []);
}

export function addProjectActivity(projectId, activity) {
  return Promise.resolve({ projectId, activity });
}

export function getProjectActivityLog(projectId) {
  return getProjectActivities(projectId);
}

export function shareProject(projectId, invitedUsers) {
  return Promise.resolve({ projectId, invitedUsers });
}

export function getProjectTimeline(projectId) {
  return getProjectById(projectId).then(project => project?.timeline || []);
}

export function exportProjectGanttChart(projectId) {
  return Promise.resolve({ projectId, url: '/mock-gantt-export-url' });
}

export function addProjectReminder(projectId, reminderData) {
  return Promise.resolve({ projectId, reminderData });
}

export function removeProjectReminder(projectId, reminderId) {
  return Promise.resolve({ projectId, reminderId });
}

export function getProjectReminders(projectId) {
  return Promise.resolve([]);
}

export function markProjectComplete(projectId) {
  return updateProjectStatus(projectId, 'Completed');
}

export function markProjectIncomplete(projectId) {
  return updateProjectStatus(projectId, 'In Progress');
}

export function updateProjectProgress(projectId, progress) {
  return updateProject(projectId, { progress });
}

export function getProjectPerformance(projectId) {
  return Promise.resolve({ projectId, performance: {} });
}

export function getProjectReports(projectId) {
  return Promise.resolve([]);
} 