import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User data and token
 */
export async function login(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    const { user, token } = response.data;

    // Store token in localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register new user
 * @param {Object} userData - { name, email, password, roles }
 * @returns {Promise<Object>} Success message
 */
export async function register(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Logout user
 * @returns {Promise<Object>} Success message
 */
export async function logout() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return { message: 'Logged out successfully' };
  } catch (error) {
    // Even if API call fails, clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile
 */
export async function getProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

/**
 * Change user password
 * @param {Object} passwordData - { oldPassword, newPassword }
 * @returns {Promise<Object>} Success message
 */
export async function changePassword(passwordData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.post('/auth/change-password', passwordData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
}

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} Whether user has the role
 */
export function hasRole(role) {
  const user = getCurrentUser();
  return user?.roles?.includes(role) || false;
}

/**
 * Check if user has any of the specified roles
 * @param {Array<string>} roles - Roles to check
 * @returns {boolean} Whether user has any of the roles
 */
export function hasAnyRole(roles) {
  const user = getCurrentUser();
  if (!user?.roles) return false;
  return roles.some(role => user.roles.includes(role));
}

/**
 * Refresh authentication token (if implemented on backend)
 * @returns {Promise<Object>} New token data
 */
export async function refreshToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // This would need to be implemented on the backend
    const response = await api.post('/auth/refresh', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { token: newToken } = response.data;
    if (newToken) {
      localStorage.setItem('token', newToken);
    }

    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

/**
 * Forgot password - send reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export async function forgotPassword(email) {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

/**
 * Reset password with token
 * @param {Object} resetData - { token, newPassword }
 * @returns {Promise<Object>} Success message
 */
export async function resetPassword(resetData) {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}