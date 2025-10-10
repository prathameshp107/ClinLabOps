import axios from 'axios';
import config from '@/config/config';

const REPORTS_API_URL = `${config.api.backendUrl}/api/reports`;

// Get all reports
export const getReports = async () => {
    try {
        const response = await axios.get(REPORTS_API_URL);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reports:', error);
        throw new Error(`Failed to fetch reports: ${error.message}`);
    }
};

// Create a new report
export const createReport = async (reportData) => {
    try {
        const response = await axios.post(REPORTS_API_URL, reportData);
        return response.data;
    } catch (error) {
        console.error('Failed to create report:', error);
        throw new Error(`Failed to create report: ${error.message}`);
    }
};

// Upload a report file
export const uploadReport = async (formData) => {
    try {
        const response = await axios.post(`${REPORTS_API_URL}/upload`, formData, {
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
        const response = await axios.put(`${REPORTS_API_URL}/${id}`, reportData);
        return response.data;
    } catch (error) {
        console.error('Failed to update report:', error);
        throw new Error(`Failed to update report: ${error.message}`);
    }
};

// Delete a report
export const deleteReport = async (id) => {
    try {
        const response = await axios.delete(`${REPORTS_API_URL}/${id}`);
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

        const response = await axios.get(`${REPORTS_API_URL}/${endpointType}`, { params });
        return response.data;
    } catch (error) {
        console.error('Failed to generate report:', error);
        throw new Error(`Failed to generate report: ${error.message}`);
    }
};

// Download a report
export const downloadReport = async (reportType, format = 'pdf') => {
    try {
        const response = await axios.get(`${REPORTS_API_URL}/${reportType}?format=${format}`, {
            responseType: 'blob'
        });

        // Create a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report.${format}`);
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);

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