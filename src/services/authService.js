const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle API responses
 * @param {Response} response
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object and token
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
}

/**
 * Logs out the current user.
 */
export async function logout() {
  // We can also call a backend endpoint to invalidate the token if implemented
  localStorage.removeItem('user');
  return Promise.resolve();
}

/**
 * Registers a new user.
 * @param {Object} userData - name, email, password
 * @returns {Promise<Object>}
 */
export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

/**
 * Handles the forgot password request.
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
}

/**
 * Resets the password.
 * @param {string} token
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function resetPassword(token, password) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  return handleResponse(response);
}

/**
 * Gets the current user from localStorage.
 * @returns {Object|null}
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
}

/**
 * Checks if the user is authenticated.
 * @returns {boolean}
 */
export function isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const user = getCurrentUser();
    // A more robust check might involve validating the token (e.g., checking expiration)
    return !!user?.token;
}

/**
 * Gets the auth token from the current user.
 * @returns {string|null}
 */
export function getAuthToken() {
    const user = getCurrentUser();
    return user?.token || null;
}

/**
 * Returns auth headers for API requests.
 * @returns {Object}
 */
export function getAuthHeader() {
    const token = getAuthToken();
    if (token) {
        return { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };
    } else {
        return { 'Content-Type': 'application/json' };
    }
}

/**
 * Gets the user profile from the server.
 * @returns {Promise<Object>}
 */
export async function getProfile() {
    const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getAuthHeader(),
    });
    return handleResponse(response);
}

/**
 * Changes the user's password.
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<Object>}
 */
export async function changePassword(oldPassword, newPassword) {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ oldPassword, newPassword }),
    });
    return handleResponse(response);
} 