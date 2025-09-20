import axios from 'axios';

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
 * Fetch all equipment
 * @returns {Promise<Array>} List of equipment
 */
export async function getEquipments() {
    try {
        const response = await api.get('/equipments');
        return response.data;
    } catch (error) {
        console.error('Error fetching equipments:', error);
        throw error;
    }
}

/**
 * Fetch equipment by ID
 * @param {string} id
 * @returns {Promise<Object|null>} Equipment object or null
 */
export async function getEquipmentById(id) {
    try {
        const response = await api.get(`/equipments/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching equipment:', error);
        throw error;
    }
}

/**
 * Create new equipment
 * @param {Object} equipment
 * @returns {Promise<Object>} Created equipment
 */
export async function createEquipment(equipment) {
    try {
        const response = await api.post('/equipments', equipment);
        return response.data;
    } catch (error) {
        console.error('Error creating equipment:', error);
        throw error;
    }
}

/**
 * Update existing equipment
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export async function updateEquipment(id, updates) {
    try {
        const response = await api.put(`/equipments/${id}`, updates);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating equipment:', error);
        throw error;
    }
}

/**
 * Delete equipment
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export async function deleteEquipment(id) {
    try {
        await api.delete(`/equipments/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting equipment:', error);
        return false;
    }
}

/**
 * Update equipment status
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object|null>} Updated equipment or null
 */
export async function updateEquipmentStatus(id, status) {
    try {
        const response = await api.put(`/equipments/${id}`, { status });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error updating equipment status:', error);
        throw error;
    }
}

/**
 * Get maintenance history for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Maintenance records
 */
export async function getEquipmentMaintenanceHistory(equipmentId) {
    try {
        const response = await api.get(`/equipments/${equipmentId}/maintenance-history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching maintenance history:', error);
        throw error;
    }
}

/**
 * Add a maintenance record to equipment
 * @param {string} equipmentId
 * @param {Object} record
 * @returns {Promise<Object>} Added record
 */
export async function addEquipmentMaintenanceRecord(equipmentId, record) {
    try {
        const response = await api.post(`/equipments/${equipmentId}/maintenance-history`, record);
        return response.data;
    } catch (error) {
        console.error('Error adding maintenance record:', error);
        throw error;
    }
}

/**
 * Get files for equipment
 * @param {string} equipmentId
 * @returns {Promise<Array>} Files
 */
export async function getEquipmentFiles(equipmentId) {
    try {
        const response = await api.get(`/equipments/${equipmentId}/files`);
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment files:', error);
        throw error;
    }
}

/**
 * Upload file to equipment
 * @param {string} id
 * @param {File} file
 * @returns {Promise<Object>} Upload result
 */
export async function uploadEquipmentFile(id, file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/equipments/${id}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading equipment file:', error);
        throw error;
    }
}

/**
 * Delete equipment file
 * @param {string} equipmentId
 * @param {string} fileName
 * @returns {Promise<boolean>} Success
 */
export async function deleteEquipmentFile(equipmentId, fileName) {
    try {
        await api.delete(`/equipments/${equipmentId}/files/${fileName}`);
        return true;
    } catch (error) {
        console.error('Error deleting equipment file:', error);
        return false;
    }
}

/**
 * Get equipment statistics
 * @returns {Promise<Object>} Equipment statistics
 */
export async function getEquipmentStats() {
    try {
        const response = await api.get('/equipments/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching equipment stats:', error);
        throw error;
    }
}

/**
 * Search equipment
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Search results
 */
export async function searchEquipment(query, filters = {}) {
    try {
        const params = { search: query, ...filters };
        const response = await api.get('/equipments', { params });
        return response.data;
    } catch (error) {
        console.error('Error searching equipment:', error);
        throw error;
    }
}