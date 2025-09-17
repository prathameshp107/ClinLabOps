import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api/animals';

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

// Animal API functions
export const animalService = {
    // Get all animals
    getAllAnimals: async () => {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch animals');
        }
    },

    // Get animal by ID
    getAnimalById: async (id) => {
        try {
            const response = await apiClient.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch animal');
        }
    },

    // Create new animal
    createAnimal: async (animalData) => {
        try {
            const response = await apiClient.post('/', animalData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create animal');
        }
    },

    // Update animal
    updateAnimal: async (id, animalData) => {
        try {
            const response = await apiClient.put(`/${id}`, animalData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update animal');
        }
    },

    // Delete animal
    deleteAnimal: async (id) => {
        try {
            const response = await apiClient.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete animal');
        }
    },

    // Search animals
    searchAnimals: async (searchTerm) => {
        try {
            const response = await apiClient.get(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to search animals');
        }
    },
};

export default animalService;