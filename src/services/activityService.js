import axios from 'axios';

const API_URL = '/api/activities';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
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

export async function getActivities(params = {}) {
  // params can include project for filtering
  const res = await api.get('/activities', { params });
  return res.data;
}

export async function getProjectActivities(projectId, params = {}) {
  // Fetch activities for a specific project
  const res = await api.get('/activities', {
    params: {
      projectId,
      ...params
    }
  });
  return res.data;
}

export async function createActivity(activityData) {
  const res = await api.post('/activities', activityData);
  return res.data;
}

export async function deleteActivity(id) {
  const res = await api.delete(`/activities/${id}`);
  return res.data;
}