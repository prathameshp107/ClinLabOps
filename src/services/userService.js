import { mockUsers } from "@/data/projects-data";

/**
 * Fetch all users
 * @returns {Promise<Array>} List of users
 */
export function getUsers() {
    return Promise.resolve(Object.values(mockUsers));
}

/**
 * Fetch a user by ID
 * @param {string} id
 * @returns {Promise<Object|null>} User object or null
 */
export function getUserById(id) {
    return Promise.resolve(mockUsers[id] || null);
}

/**
 * Create a new user
 * @param {Object} user
 * @returns {Promise<Object>} Created user
 */
export function createUser(user) {
    const newUser = {
        ...user,
        id: `u${Date.now().toString().slice(-6)}`,
        status: "Invited",
        lastLogin: null,
    };
    mockUsers[newUser.id] = newUser;
    return Promise.resolve(newUser);
}

/**
 * Update an existing user
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>} Updated user or null
 */
export function updateUser(id, updates) {
    if (!mockUsers[id]) return Promise.resolve(null);
    mockUsers[id] = { ...mockUsers[id], ...updates };
    return Promise.resolve(mockUsers[id]);
}

/**
 * Delete a user
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function deleteUser(id) {
    if (!mockUsers[id]) return Promise.resolve(false);
    delete mockUsers[id];
    return Promise.resolve(true);
}

/**
 * Activate a user
 * @param {string} id
 * @returns {Promise<Object|null>} Activated user or null
 */
export function activateUser(id) {
    if (!mockUsers[id]) return Promise.resolve(null);
    mockUsers[id].status = "Active";
    return Promise.resolve(mockUsers[id]);
}

/**
 * Deactivate a user
 * @param {string} id
 * @returns {Promise<Object|null>} Deactivated user or null
 */
export function deactivateUser(id) {
    if (!mockUsers[id]) return Promise.resolve(null);
    mockUsers[id].status = "Inactive";
    return Promise.resolve(mockUsers[id]);
}

/**
 * Lock a user
 * @param {string} id
 * @returns {Promise<Object|null>} Locked user or null
 */
export function lockUser(id) {
    if (!mockUsers[id]) return Promise.resolve(null);
    mockUsers[id].status = "Locked";
    return Promise.resolve(mockUsers[id]);
}

/**
 * Unlock a user
 * @param {string} id
 * @returns {Promise<Object|null>} Unlocked user or null
 */
export function unlockUser(id) {
    if (!mockUsers[id]) return Promise.resolve(null);
    mockUsers[id].status = "Active";
    return Promise.resolve(mockUsers[id]);
}

/**
 * Invite a user
 * @param {Object} user
 * @returns {Promise<Object>} Invited user
 */
export function inviteUser(user) {
    const newUser = {
        ...user,
        id: `u${Date.now().toString().slice(-6)}`,
        status: "Invited",
        lastLogin: null,
    };
    mockUsers[newUser.id] = newUser;
    return Promise.resolve(newUser);
}

/**
 * Reset a user's password
 * @param {string} id
 * @returns {Promise<boolean>} Success
 */
export function resetUserPassword(id) {
    if (!mockUsers[id]) return Promise.resolve(false);
    // In a real app, trigger password reset email
    return Promise.resolve(true);
} 