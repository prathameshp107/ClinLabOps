// Service layer for Enquiries
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const enquiryService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/enquiries`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch enquiries');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/enquiries/${id}`, { credentials: 'include' });
    if (!response.ok) return null;
    return response.json();
  },

  create: async (enquiry) => {
    const response = await fetch(`${API_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(enquiry),
    });
    if (!response.ok) throw new Error('Failed to create enquiry');
    return response.json();
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update enquiry');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/enquiries/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.ok;
  },

  addComment: async (id, comment) => {
    const response = await fetch(`${API_URL}/enquiries/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  assignTo: async (id, user) => {
    const response = await fetch(`${API_URL}/enquiries/${id}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ assignedTo: user }),
    });
    if (!response.ok) throw new Error('Failed to assign enquiry');
    return response.json();
  },

  addActivity: async (id, activity) => {
    const response = await fetch(`${API_URL}/enquiries/${id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(activity),
    });
    if (!response.ok) throw new Error('Failed to add activity');
    return response.json();
  },

  uploadDocument: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/enquiries/${id}/documents`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  export: async (format = "xlsx") => {
    const response = await fetch(`${API_URL}/enquiries/export?format=${format}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to export enquiries');
    return response.blob();
  },
}; 