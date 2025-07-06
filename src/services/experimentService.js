import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL and common headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch all experiments (full objects)
 * @param {Object} filters - Optional filters for querying experiments
 * @returns {Promise<Array>} List of experiments
 */
export async function getExperiments(filters = {}) {
  try {
    const { status, search, sortBy, sortOrder } = filters;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await api.get(`/experiments?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Fetch a simple list of experiments (id, name)
 * @returns {Promise<Array>} List of experiments (id, name)
 */
export async function getExperimentList() {
  try {
    const response = await api.get('/experiments');
    return response.data.map(exp => ({ id: exp._id, name: exp.title }));
  } catch (error) {
    console.error('Error fetching experiment list:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Fetch a single experiment by ID
 * @param {string} id - Experiment ID
 * @returns {Promise<Object>} Experiment object
 */
export async function getExperimentById(id) {
  try {
    const response = await api.get(`/experiments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching experiment ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Create a new experiment
 * @param {Object} experimentData - Experiment data
 * @returns {Promise<Object>} Created experiment
 */
export async function createExperiment(experimentData) {
  try {
    const response = await api.post('/experiments', experimentData);
    return response.data;
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Update an experiment
 * @param {string} id - Experiment ID
 * @param {Object} experimentData - Updated experiment data
 * @returns {Promise<Object>} Updated experiment
 */
export async function updateExperiment(id, experimentData) {
  try {
    const response = await api.put(`/experiments/${id}`, experimentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating experiment ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Delete an experiment
 * @param {string} id - Experiment ID
 * @returns {Promise<Object>} Success message
 */
export async function deleteExperiment(id) {
  try {
    const response = await api.delete(`/experiments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting experiment ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get experiment statistics
 * @returns {Promise<Array>} Experiment statistics
 */
export async function getExperimentStats() {
  try {
    const response = await api.get('/experiments/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching experiment stats:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get experiment types (for dashboard analytics)
 * @returns {Promise<Array>} Experiment types with counts
 */
export async function getExperimentTypes() {
  try {
    const response = await api.get('/experiments/stats');
    // Transform the stats into the format expected by the frontend
    return response.data.map(stat => ({
      name: stat.status,
      count: stat.count,
      color: getStatusColor(stat.status)
    }));
  } catch (error) {
    console.error('Error fetching experiment types:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get experiment dashboard summary
 * @returns {Promise<Object>} Dashboard data
 */
export async function getExperimentDashboard() {
  try {
    const [stats, experiments] = await Promise.all([
      getExperimentStats(),
      getExperiments()
    ]);

    // Transform data into the format expected by the dashboard
    const activeExperiments = experiments.filter(exp => exp.status === 'in-progress');
    const completedExperiments = experiments.filter(exp => exp.status === 'completed');
    const experimentTypes = await getExperimentTypes();

    return {
      activeExperiments: activeExperiments.map(exp => ({
        id: exp._id,
        title: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        status: exp.status,
        progress: calculateProgress(exp.startDate, exp.endDate),
        priority: exp.priority
      })),
      completedExperiments: completedExperiments.map(exp => ({
        id: exp._id,
        title: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        status: exp.status,
        progress: 100,
        priority: exp.priority
      })),
      experimentTypes,
      successRate: {
        overall: calculateSuccessRate(experiments),
        byType: experimentTypes.map(type => ({
          name: type.name,
          rate: Math.floor(Math.random() * 30) + 70 // Random success rate for demo
        }))
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// Helper function to calculate progress based on dates
function calculateProgress(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const total = end - start;
  const elapsed = now - start;
  return Math.min(Math.floor((elapsed / total) * 100), 100);
}

// Helper function to calculate overall success rate
function calculateSuccessRate(experiments) {
  if (!experiments.length) return 0;
  const completed = experiments.filter(exp => exp.status === 'completed').length;
  return Math.floor((completed / experiments.length) * 100);
}

// Helper function to get color based on status
function getStatusColor(status) {
  const colors = {
    'planning': '#3b82f6',    // blue
    'in-progress': '#8b5cf6', // purple
    'on-hold': '#f59e0b',     // amber
    'completed': '#10b981',   // emerald
    'archived': '#6b7280'     // gray
  };
  return colors[status] || '#6b7280';
}

/**
 * Get the team for a given experiment
 * @param {string} id - Experiment ID
 * @returns {Promise<Array>} Team members
 */
export async function getExperimentTeam(id) {
  try {
    const experiment = await getExperimentById(id);
    return experiment.teamMembers || [];
  } catch (error) {
    console.error(`Error fetching team for experiment ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get version history for a given experiment
 * @param {string} id - Experiment ID
 * @returns {Promise<Array>} Version history
 */
export async function getExperimentVersionHistory(id) {
  try {
    const experiment = await getExperimentById(id);
    return experiment.versionHistory || [];
  } catch (error) {
    console.error(`Error fetching version history for experiment ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get all active experiments
 */
export function getActiveExperiments() {
  return Promise.resolve([...experimentsDashboardData.activeExperiments]);
}

/**
 * Get all completed experiments
 */
export function getCompletedExperiments() {
  return Promise.resolve([...experimentsDashboardData.completedExperiments]);
} 