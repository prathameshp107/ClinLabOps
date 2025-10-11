import axios from 'axios';
import config from '@/config/config';

const REPORTS_API_URL = `${config.api.backendUrl}/api/reports`;
const UPLOADED_REPORTS_API_URL = `${config.api.backendUrl}/api/gridfs-reports`;

// Create axios instance with default config
const api = axios.create({
    baseURL: config.api.backendUrl,
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

// Get all reports
export const getReports = async (params = {}) => {
    try {
        const response = await api.get('/api/gridfs-reports', { params });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reports:', error);
        throw new Error(`Failed to fetch reports: ${error.message}`);
    }
};

// Create a new report
export const createReport = async (formData) => {
    try {
        const response = await api.post('/api/gridfs-reports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create report:', error);
        throw new Error(`Failed to create report: ${error.message}`);
    }
};

// Upload a report file
export const uploadReport = async (formData) => {
    try {
        const response = await api.post('/api/gridfs-reports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to upload report:', error);
        throw new Error(`Failed to upload report: ${error.message}`);
    }
};

// Update a report
export const updateReport = async (id, reportData) => {
    try {
        const response = await api.put(`/api/gridfs-reports/${id}`, reportData);
        return response.data;
    } catch (error) {
        console.error('Failed to update report:', error);
        throw new Error(`Failed to update report: ${error.message}`);
    }
};

// Delete a report
export const deleteReport = async (id) => {
    try {
        const response = await api.delete(`/api/gridfs-reports/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete report:', error);
        throw new Error(`Failed to delete report: ${error.message}`);
    }
};

// Generate a specific report
export const generateReport = async (reportType, params = {}) => {
    try {
        // Map the new report types to the existing backend endpoints
        let endpointType = reportType;
        if (reportType === "regulatory") endpointType = "compliance";
        if (reportType === "research") endpointType = "experiments";
        if (reportType === "miscellaneous") endpointType = "projects";

        const response = await api.get(`/api/reports/${endpointType}`, { params });
        return response.data;
    } catch (error) {
        console.error('Failed to generate report:', error);
        throw new Error(`Failed to generate report: ${error.message}`);
    }
};

// Download a report
export const downloadReport = async (id) => {
    try {
        // First, get the report details to get the original filename
        const reportResponse = await api.get(`/api/gridfs-reports/${id}`);
        const report = reportResponse.data;

        // Then download the file
        const response = await api.get(`/api/gridfs-reports/gridfs-download/${id}`, {
            responseType: 'blob'
        });

        // Check if response is successful
        if (response.status !== 200) {
            throw new Error(`Server returned status ${response.status}`);
        }

        // Use the original filename from the report
        let filename = report.title || report.fileName || 'report.pdf';

        if (!report.title) {
            // If we can access the Content-Disposition header, use it instead
            const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }
        }

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return response.data;
    } catch (error) {
        console.error('Failed to download report:', error);
        throw new Error(`Failed to download report: ${error.message}`);
    }
};

// Report service object with methods matching the frontend usage
export const reportService = {
    getAll: getReports,
    create: createReport,
    upload: uploadReport,
    update: updateReport,
    delete: deleteReport,
    generate: generateReport,
    download: downloadReport
};

export default {
    getReports,
    createReport,
    uploadReport,
    updateReport,
    deleteReport,
    generateReport,
    downloadReport,
    reportService
};