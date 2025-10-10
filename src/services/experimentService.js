import axios from 'axios';
import { getProjects } from './projectService';

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
  return config;
});

/**
 * Fetch all experiments
 * @param {Object} params - Query parameters (status, search, sortBy, sortOrder)
 * @returns {Promise<Array>} List of experiments
 */
export async function getExperiments(params = {}) {
  try {
    const response = await api.get('/experiments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    // Return empty array if there's an auth error or no experiments
    if (error.response?.status === 401 || error.response?.status === 403) {
      return [];
    }
    throw error;
  }
}

/**
 * Fetch experiment statistics
 * @returns {Promise<Object>} Experiment statistics
 */
export async function getExperimentStats() {
  try {
    const response = await api.get('/experiments/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching experiment stats:', error);
    throw error;
  }
}

/**
 * Fetch an experiment by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Experiment object or null
 */
export async function getExperimentById(id) {
  try {
    const response = await api.get(`/experiments/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching experiment:', error);
    throw error;
  }
}

/**
 * Create a new experiment
 * @param {Object} experimentData
 * @returns {Promise<Object>} Created experiment
 */
export async function createExperiment(experimentData) {
  try {
    const response = await api.post('/experiments', experimentData);
    return response.data;
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
}

/**
 * Update an existing experiment
 * @param {string} id
 * @param {Object} experimentData
 * @returns {Promise<Object|null>} Updated experiment or null
 */
export async function updateExperiment(id, experimentData) {
  try {
    const response = await api.put(`/experiments/${id}`, experimentData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error updating experiment:', error);
    throw error;
  }
}

/**
 * Delete an experiment
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteExperiment(id) {
  try {
    await api.delete(`/experiments/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting experiment:', error);
    throw error;
  }
}

/**
 * Export experiment data
 * @param {string} id - Experiment ID
 * @param {string} format - Export format (json, csv, xlsx, pdf)
 * @returns {Promise<Object>} Export result
 */
export async function exportExperiment(id, format = 'json') {
  try {
    const response = await api.get(`/experiments/${id}/export`, {
      params: { format },
      responseType: format !== 'json' ? 'blob' : 'json'
    });

    if (format !== 'json') {
      // Handle file download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiment_${id}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Experiment data exported successfully' };
    }

    return response.data;
  } catch (error) {
    console.error('Error exporting experiment:', error);
    throw error;
  }
}

/**
 * Add a team member to an experiment
 * @param {string} experimentId
 * @param {string} memberName
 * @returns {Promise<Object>} Updated experiment
 */
export async function addExperimentMember(experimentId, memberName) {
  try {
    const experiment = await getExperimentById(experimentId);
    if (!experiment) return null;

    const updatedMembers = [...(experiment.teamMembers || []), memberName];
    const updatedExperiment = await updateExperiment(experimentId, {
      ...experiment,
      teamMembers: updatedMembers
    });

    return updatedExperiment;
  } catch (error) {
    console.error('Error adding experiment member:', error);
    throw error;
  }
}

/**
 * Remove a team member from an experiment
 * @param {string} experimentId
 * @param {string} memberName
 * @returns {Promise<Object>} Updated experiment
 */
export async function removeExperimentMember(experimentId, memberName) {
  try {
    const experiment = await getExperimentById(experimentId);
    if (!experiment) return null;

    const updatedMembers = (experiment.teamMembers || []).filter(member => member !== memberName);
    const updatedExperiment = await updateExperiment(experimentId, {
      ...experiment,
      teamMembers: updatedMembers
    });

    return updatedExperiment;
  } catch (error) {
    console.error('Error removing experiment member:', error);
    throw error;
  }
}

/**
 * Update experiment status
 * @param {string} experimentId
 * @param {string} status
 * @returns {Promise<Object>} Updated experiment
 */
export async function updateExperimentStatus(experimentId, status) {
  try {
    const updatedExperiment = await updateExperiment(experimentId, { status });
    return updatedExperiment;
  } catch (error) {
    console.error('Error updating experiment status:', error);
    throw error;
  }
}

/**
 * Update experiment priority
 * @param {string} experimentId
 * @param {string} priority
 * @returns {Promise<Object>} Updated experiment
 */
export async function updateExperimentPriority(experimentId, priority) {
  try {
    const updatedExperiment = await updateExperiment(experimentId, { priority });
    return updatedExperiment;
  } catch (error) {
    console.error('Error updating experiment priority:', error);
    throw error;
  }
}

/**
 * Duplicate an experiment
 * @param {string} experimentId
 * @returns {Promise<Object>} Duplicated experiment
 */
export async function duplicateExperiment(experimentId) {
  try {
    const original = await getExperimentById(experimentId);
    if (!original) return null;

    const copy = {
      ...original,
      title: `${original.title} (Copy)`,
      status: 'planning'
    };
    delete copy._id;
    delete copy.id;
    delete copy.createdAt;
    delete copy.updatedAt;
    delete copy.versionHistory;

    return await createExperiment(copy);
  } catch (error) {
    console.error('Error duplicating experiment:', error);
    throw error;
  }
}

/**
 * Archive an experiment
 * @param {string} experimentId
 * @returns {Promise<Object>} Updated experiment
 */
export async function archiveExperiment(experimentId) {
  try {
    const updatedExperiment = await updateExperiment(experimentId, { status: 'archived' });
    return updatedExperiment;
  } catch (error) {
    console.error('Error archiving experiment:', error);
    throw error;
  }
}

/**
 * Restore an archived experiment
 * @param {string} experimentId
 * @returns {Promise<Object>} Updated experiment
 */
export async function restoreExperiment(experimentId) {
  try {
    const updatedExperiment = await updateExperiment(experimentId, { status: 'planning' });
    return updatedExperiment;
  } catch (error) {
    console.error('Error restoring experiment:', error);
    throw error;
  }
}

/**
 * Get experiment version history
 * @param {string} experimentId
 * @returns {Promise<Array>} Version history
 */
export async function getExperimentVersionHistory(experimentId) {
  try {
    const experiment = await getExperimentById(experimentId);
    return experiment?.versionHistory || [];
  } catch (error) {
    console.error('Error fetching experiment version history:', error);
    throw error;
  }
}

/**
 * Search experiments
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Search results
 */
export async function searchExperiments(query, filters = {}) {
  try {
    const params = { search: query, ...filters };
    const response = await api.get('/experiments', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching experiments:', error);
    throw error;
  }
}

/**
 * Get experiments by status
 * @param {string} status
 * @returns {Promise<Array>} Experiments with specified status
 */
export async function getExperimentsByStatus(status) {
  try {
    const response = await api.get('/experiments', { params: { status } });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments by status:', error);
    throw error;
  }
}

/**
 * Get experiments by priority
 * @param {string} priority
 * @returns {Promise<Array>} Experiments with specified priority
 */
export async function getExperimentsByPriority(priority) {
  try {
    const response = await api.get('/experiments', { params: { priority } });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments by priority:', error);
    throw error;
  }
}

/**
 * Fetch all projects for experiment form
 * @returns {Promise<Array>} List of projects
 */
export async function getProjectsForExperimentForm() {
  try {
    const projects = await getProjects();
    return projects;
  } catch (error) {
    console.error('Error fetching projects for experiment form:', error);
    throw error;
  }
}

/**
 * Add comment to experiment
 * @param {string} experimentId
 * @param {string} text
 * @returns {Promise<Object>} Updated comments
 */
export async function addCommentToExperiment(experimentId, text) {
  try {
    const response = await api.post(`/experiments/${experimentId}/comments`, { text });
    return response.data;
  } catch (error) {
    console.error('Error adding comment to experiment:', error);
    throw error;
  }
}

/**
 * Add reply to comment in experiment
 * @param {string} experimentId
 * @param {string} commentId
 * @param {string} text
 * @param {string} replyToReplyId
 * @returns {Promise<Object>} Updated comments
 */
export async function addReplyToComment(experimentId, commentId, text, replyToReplyId = null) {
  try {
    const response = await api.post(`/experiments/${experimentId}/comments/${commentId}/replies`, {
      text,
      replyToReplyId
    });
    return response.data;
  } catch (error) {
    console.error('Error adding reply to comment in experiment:', error);
    throw error;
  }
}

/**
 * Delete comment from experiment
 * @param {string} experimentId
 * @param {string} commentId
 * @returns {Promise<Object>} Updated comments
 */
export async function deleteCommentFromExperiment(experimentId, commentId) {
  try {
    const response = await api.delete(`/experiments/${experimentId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment from experiment:', error);
    throw error;
  }
}

/**
 * Delete reply from comment in experiment
 * @param {string} experimentId
 * @param {string} commentId
 * @param {string} replyId
 * @returns {Promise<Object>} Updated comments
 */
export async function deleteReplyFromComment(experimentId, commentId, replyId) {
  try {
    const response = await api.delete(`/experiments/${experimentId}/comments/${commentId}/replies/${replyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reply from comment in experiment:', error);
    throw error;
  }
}
