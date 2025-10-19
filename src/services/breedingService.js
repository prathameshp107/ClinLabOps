import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/breeding';

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

// Breeding API functions
export const breedingService = {
    // Get all breeding pairs
    getAllBreedingPairs: async () => {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch breeding pairs');
        }
    },

    // Get breeding pair by ID
    getBreedingPairById: async (id) => {
        try {
            const response = await apiClient.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch breeding pair');
        }
    },

    // Create new breeding pair
    createBreedingPair: async (breedingPairData) => {
        try {
            console.log('Sending breeding pair data to backend:', breedingPairData);
            const response = await apiClient.post('/', breedingPairData);
            console.log('Received response from backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in createBreedingPair:', error);
            throw new Error(error.response?.data?.message || 'Failed to create breeding pair');
        }
    },

    // Update breeding pair
    updateBreedingPair: async (id, breedingPairData) => {
        try {
            const response = await apiClient.put(`/${id}`, breedingPairData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update breeding pair');
        }
    },

    // Delete breeding pair
    deleteBreedingPair: async (id) => {
        try {
            const response = await apiClient.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete breeding pair');
        }
    },
};

export default breedingService;