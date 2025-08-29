import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetch all protocols with pagination and filters
 * @param {Object} params - Query parameters (page, limit, category, search, isPublic)
 * @returns {Promise<Object>} Response with protocols data and pagination info
 */
export async function getProtocols(params = {}) {
  try {
    const response = await api.get('/protocols', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Fetch user's own protocols (both public and private)
 * @param {Object} params - Query parameters (page, limit, category, search)
 * @returns {Promise<Object>} Response with user's protocols data and pagination info
 */
export async function getMyProtocols(params = {}) {
  try {
    // Use the dedicated endpoint for user's own protocols
    const response = await api.get('/protocols/my-protocols', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching my protocols:', error);
    throw error.response?.data || error.message;
  }
}

/**
 * Fetch a protocol by ID
 * @param {string} id - Protocol ID
 * @returns {Promise<Object>} Protocol object
 */
export async function getProtocolById(id) {
  try {
    const response = await api.get(`/protocols/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Create a new protocol
 * @param {Object} protocol - Protocol data
 * @returns {Promise<Object>} Created protocol
 */
export async function createProtocol(protocol) {
  try {
    console.log('Creating protocol with data:', protocol);
    const response = await api.post('/protocols', protocol);
    console.log('Protocol created successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating protocol:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data || error.message;
  }
}

/**
 * Update an existing protocol
 * @param {string} id - Protocol ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated protocol
 */
export async function updateProtocol(id, updates) {
  try {
    const response = await api.put(`/protocols/${id}`, updates);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Delete a protocol
 * @param {string} id - Protocol ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProtocol(id) {
  try {
    await api.delete(`/protocols/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Duplicate a protocol
 * @param {string} id - Protocol ID to duplicate
 * @returns {Promise<Object>} Duplicated protocol
 */
export async function duplicateProtocol(id) {
  try {
    const response = await api.post(`/protocols/${id}/duplicate`);
    return response.data.data;
  } catch (error) {
    console.error(`Error duplicating protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Archive a protocol
 * @param {string} id - Protocol ID to archive
 * @returns {Promise<Object>} Archived protocol
 */
export async function archiveProtocol(id) {
  try {
    const response = await api.put(`/protocols/${id}/archive`);
    return response.data.data;
  } catch (error) {
    console.error(`Error archiving protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Restore an archived protocol
 * @param {string} id - Protocol ID to restore
 * @returns {Promise<Object>} Restored protocol
 */
export async function restoreProtocol(id) {
  try {
    const response = await api.put(`/protocols/${id}/restore`);
    return response.data.data;
  } catch (error) {
    console.error(`Error restoring protocol ${id}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get audit trail for a protocol
 * @param {string} protocolId - Protocol ID
 * @returns {Promise<Array>} Audit trail entries
 */
export async function getProtocolAuditTrail(protocolId) {
  try {
    const response = await api.get(`/protocols/${protocolId}/audit-trail`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching audit trail for protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get comments for a protocol
 * @param {string} protocolId - Protocol ID
 * @returns {Promise<Array>} Comments
 */
export async function getProtocolComments(protocolId) {
  try {
    const response = await api.get(`/protocols/${protocolId}/comments`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching comments for protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Add a comment to a protocol
 * @param {string} protocolId - Protocol ID
 * @param {Object} comment - Comment data
 * @returns {Promise<Object>} Added comment
 */
export async function addProtocolComment(protocolId, comment) {
  try {
    const response = await api.post(`/protocols/${protocolId}/comments`, comment);
    return response.data.data;
  } catch (error) {
    console.error(`Error adding comment to protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Delete a comment from a protocol
 * @param {string} commentId - Comment ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProtocolComment(commentId) {
  try {
    await api.delete(`/protocols/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Get files for a protocol
 * @param {string} protocolId - Protocol ID
 * @returns {Promise<Array>} Files
 */
export async function getProtocolFiles(protocolId) {
  try {
    const response = await api.get(`/protocols/${protocolId}/files`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching files for protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Add a file to a protocol
 * @param {string} protocolId - Protocol ID
 * @param {FormData} formData - File data
 * @returns {Promise<Object>} Added file
 */
export async function addProtocolFile(protocolId, formData) {
  try {
    const response = await api.post(`/protocols/${protocolId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error adding file to protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}

/**
 * Delete a file from a protocol
 * @param {string} protocolId - Protocol ID
 * @param {string} fileId - File ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProtocolFile(protocolId, fileId) {
  try {
    await api.delete(`/protocols/${protocolId}/files/${fileId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${fileId} from protocol ${protocolId}:`, error);
    throw error.response?.data || error.message;
  }
}