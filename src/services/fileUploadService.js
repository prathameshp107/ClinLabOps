import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (currently unused, kept for compatibility)
 * @returns {Promise<{url: string, filename: string, originalName: string}>}
 */
export const uploadFile = async (file, folder = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data.success && !response.data.file) {
            throw new Error(response.data.error || response.data.message || 'Upload failed');
        }

        // Return the file information in the expected format
        const fileData = response.data.file || response.data;
        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;

        return {
            url: `${baseUrl}${fileData.url}`,
            filename: fileData.filename,
            originalName: fileData.originalName,
            id: fileData.id
        };
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Upload failed');
    }
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - The folder to upload to (currently unused, kept for compatibility)
 * @returns {Promise<Array<{url: string, filename: string, originalName: string}>>}
 */
export const uploadMultipleFiles = async (files, folder = 'uploads') => {
    const formData = new FormData();

    Array.from(files).forEach((file, index) => {
        formData.append(`files`, file); // Changed from files[${index}] to just files
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/files/upload-multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data.success && !response.data.files) {
            throw new Error(response.data.error || response.data.message || 'Upload failed');
        }

        // Return the files information in the expected format
        const filesData = response.data.files || response.data;
        const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;

        return filesData.map(file => ({
            url: `${baseUrl}${file.url}`,
            filename: file.filename,
            originalName: file.originalName,
            id: file.id
        }));
    } catch (error) {
        console.error('Multiple file upload error:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Upload failed');
    }
};

/**
 * Delete a file
 * @param {string} filename - The name of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (filename) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/files/${filename}`);

        if (!response.data.success && !response.data.message) {
            throw new Error(response.data.error || response.data.message || 'Delete failed');
        }

        return response.data;
    } catch (error) {
        console.error('File delete error:', error);
        throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Delete failed');
    }
};