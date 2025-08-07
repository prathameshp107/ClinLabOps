import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
 * Get all enquiries
 * @returns {Promise<Array>} List of enquiries
 */
export async function getEnquiries() {
  try {
    const response = await api.get('/enquiries');
    return response.data;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
}

export const enquiryService = {
  getAll: async () => {
    return getEnquiries();
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/enquiries/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching enquiry:', error);
      throw error;
    }
  },

  create: async (enquiry) => {
    try {
      const response = await api.post('/enquiries', enquiry);
      return response.data;
    } catch (error) {
      console.error('Error creating enquiry:', error);
      throw error;
    }
  },

  update: async (id, updates) => {
    try {
      const response = await api.put(`/enquiries/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating enquiry:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/enquiries/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      return false;
    }
  },

  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/enquiries/${id}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  assignTo: async (id, user) => {
    try {
      const response = await api.put(`/enquiries/${id}/assign`, { assignedTo: user });
      return response.data;
    } catch (error) {
      console.error('Error assigning enquiry:', error);
      throw error;
    }
  },

  addActivity: async (id, activity) => {
    try {
      const response = await api.post(`/enquiries/${id}/activities`, activity);
      return response.data;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  },

  uploadDocument: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/enquiries/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  export: async (format = "xlsx") => {
    try {
      const response = await api.get(`/enquiries/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting enquiries:', error);
      throw error;
    }
  },
}; 