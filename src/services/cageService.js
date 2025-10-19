import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/cages';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if needed
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Cage API functions
export const cageService = {
    // Get all cages
    getAllCages: async () => {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch cages');
        }
    },

    // Get available cages (cages with status 'available' and currentOccupancy < capacity)
    getAvailableCages: async () => {
        try {
            const response = await apiClient.get('/');
            // Filter cages that are available and have space
            const availableCages = response.data.filter(cage =>
                cage.status === 'available' && cage.currentOccupancy < cage.capacity
            );
            return availableCages;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch available cages');
        }
    },

    // Get cage by ID
    getCageById: async (id) => {
        try {
            const response = await apiClient.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch cage');
        }
    },

    // Create new cage
    createCage: async (cageData) => {
        try {
            const response = await apiClient.post('/', cageData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create cage');
        }
    },

    // Update cage
    updateCage: async (id, cageData) => {
        try {
            const response = await apiClient.put(`/${id}`, cageData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update cage');
        }
    },

    // Delete cage
    deleteCage: async (id) => {
        try {
            const response = await apiClient.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete cage');
        }
    },
};

export default cageService;