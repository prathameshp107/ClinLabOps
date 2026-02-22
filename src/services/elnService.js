// ELN API Service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };
};

// Get all ELN entries
export const getELNEntries = async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/elns${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
        headers: getHeaders()
    });

    return response.json();
};

// Get ELN entry by ID
export const getELNEntryById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}`, {
        headers: getHeaders()
    });

    return response.json();
};

// Create new ELN entry
export const createELNEntry = async (elnData) => {
    const response = await fetch(`${API_BASE_URL}/elns`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(elnData)
    });

    return response.json();
};

// Update ELN entry
export const updateELNEntry = async (id, elnData) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(elnData)
    });

    return response.json();
};

// Delete ELN entry
export const deleteELNEntry = async (id) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });

    return response.json();
};

// Get ELN versions
export const getELNVersions = async (id) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}/versions`, {
        headers: getHeaders()
    });

    return response.json();
};

// Add collaborator
export const addCollaborator = async (id, userId) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}/collaborators`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId })
    });

    return response.json();
};

// Remove collaborator
export const removeCollaborator = async (id, userId) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}/collaborators`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ userId })
    });

    return response.json();
};

// Add comment
export const addComment = async (id, content, parentId = null) => {
    const response = await fetch(`${API_BASE_URL}/elns/${id}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, parentCommentId: parentId })
    });

    return response.json();
};

// Search ELN entries
export const searchELNEntries = async (query) => {
    const response = await fetch(`${API_BASE_URL}/elns/search?q=${encodeURIComponent(query)}`, {
        headers: getHeaders()
    });

    return response.json();
};

// Add user to ELN entry (for collaboration)
export const addUserToELN = async (elnId, userId) => {
    const response = await fetch(`${API_BASE_URL}/elns/${elnId}/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId })
    });

    return response.json();
};