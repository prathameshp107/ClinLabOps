import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
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

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
    try {
        const response = await api.get('/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}

/**
 * Get task distribution data
 */
export async function getTaskDistribution() {
    try {
        const response = await api.get('/dashboard/task-distribution');
        return response.data;
    } catch (error) {
        console.error('Error fetching task distribution:', error);
        throw error;
    }
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit = 10) {
    try {
        const response = await api.get('/dashboard/recent-activities', { params: { limit } });
        return response.data;
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        throw error;
    }
}

/**
 * Get team performance data
 */
export async function getTeamPerformance() {
    try {
        const response = await api.get('/dashboard/team-performance');
        const rawData = response.data;

        // Transform the raw performance data into the expected format
        const transformedData = {
            taskCompletion: rawData.map(item => ({
                name: item.assignee || 'Unknown',
                completed: item.completedTasks || 0,
                pending: (item.totalTasks || 0) - (item.completedTasks || 0),
                overdue: 0 // This would need to be calculated from actual overdue tasks
            })),
            timeTracking: [], // Would need additional data from backend
            taskDistribution: rawData.map(item => ({
                name: item.assignee || 'Unknown',
                value: item.totalTasks || 0
            })),
            trends: [], // Would need historical data from backend
            summary: {
                completionRate: rawData.length > 0 ?
                    Math.round(rawData.reduce((acc, item) => acc + (item.completionRate || 0), 0) / rawData.length) : 0,
                completionRateChange: 0, // Would need historical data to calculate
                onTimeRate: 85, // Placeholder - would need actual data
                onTimeRateChange: 2,
                efficiencyScore: 78, // Placeholder - would need actual calculation
                efficiencyScoreChange: -1
            }
        };

        return transformedData;
    } catch (error) {
        console.error('Error fetching team performance:', error);
        throw error;
    }
}

/**
 * Get project health data
 */
export async function getProjectHealth() {
    try {
        const response = await api.get('/dashboard/project-health');
        return response.data;
    } catch (error) {
        console.error('Error fetching project health:', error);
        throw error;
    }
}

/**
 * Get experiment progress data
 */
export async function getExperimentProgress() {
    try {
        const response = await api.get('/dashboard/experiment-progress');
        return response.data;
    } catch (error) {
        console.error('Error fetching experiment progress:', error);
        throw error;
    }
}

/**
 * Get user activity data
 */
export async function getUserActivity() {
    try {
        const response = await api.get('/dashboard/user-activity');
        return response.data;
    } catch (error) {
        console.error('Error fetching user activity:', error);
        throw error;
    }
}

/**
 * Get compliance alerts data
 */
export async function getComplianceAlerts() {
    try {
        const response = await api.get('/dashboard/compliance-alerts');
        return response.data;
    } catch (error) {
        console.error('Error fetching compliance alerts:', error);
        throw error;
    }
}

/**
 * Get system logs data
 */
export async function getSystemLogs(params = {}) {
    try {
        const response = await api.get('/dashboard/system-logs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching system logs:', error);
        throw error;
    }
}

/**
 * Get task heatmap data
 */
export async function getTaskHeatmap() {
    try {
        const response = await api.get('/dashboard/task-heatmap');
        return response.data;
    } catch (error) {
        console.error('Error fetching task heatmap:', error);
        throw error;
    }
}

// REPORT GENERATION

/**
 * Generate and download project report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateProjectReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/projects', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            // Handle file download
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `project_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating project report:', error);
        throw error;
    }
}

/**
 * Generate and download task report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateTaskReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/tasks', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `task_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating task report:', error);
        throw error;
    }
}

/**
 * Generate and download inventory report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateInventoryReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/inventory', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `inventory_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating inventory report:', error);
        throw error;
    }
}

/**
 * Generate and download user report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateUserReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/users', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `user_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating user report:', error);
        throw error;
    }
}

/**
 * Generate and download compliance report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateComplianceReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/compliance', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compliance_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating compliance report:', error);
        throw error;
    }
}

/**
 * Generate and download experiment report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateExperimentReport(format = 'json', filters = {}) {
    try {
        const response = await api.get('/reports/experiments', {
            params: { format, ...filters },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `experiment_report.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating experiment report:', error);
        throw error;
    }
}

/**
 * Generate and download dashboard summary report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 */
export async function generateDashboardReport(format = 'json') {
    try {
        const response = await api.get('/reports/dashboard', {
            params: { format },
            responseType: format !== 'json' ? 'blob' : 'json'
        });

        if (format !== 'json') {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dashboard_summary.${format}`;
            link.click();
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'Report downloaded successfully' };
        }

        return response.data;
    } catch (error) {
        console.error('Error generating dashboard report:', error);
        throw error;
    }
}

// Legacy function aliases for backward compatibility
export function getTasksOverview() {
    return getDashboardStats();
}

export function getReports() {
    return Promise.resolve([
        {
            id: 'projects',
            title: 'Project Report',
            type: 'projects',
            format: 'pdf',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['projects', 'analytics']
        },
        {
            id: 'tasks',
            title: 'Task Report',
            type: 'tasks',
            format: 'xlsx',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['tasks', 'productivity']
        },
        {
            id: 'inventory',
            title: 'Inventory Report',
            type: 'inventory',
            format: 'csv',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['inventory', 'stock']
        },
        {
            id: 'users',
            title: 'User Report',
            type: 'users',
            format: 'pdf',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['users', 'management']
        },
        {
            id: 'compliance',
            title: 'Compliance Report',
            type: 'compliance',
            format: 'pdf',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['compliance', 'audit']
        },
        {
            id: 'experiments',
            title: 'Experiment Report',
            type: 'experiments',
            format: 'xlsx',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['experiments', 'research']
        },
        {
            id: 'dashboard',
            title: 'Dashboard Summary',
            type: 'dashboard',
            format: 'pdf',
            created: new Date().toISOString(),
            generatedBy: 'System',
            tags: ['dashboard', 'summary']
        }
    ]);
}

export function getReportTypes() {
    return Promise.resolve([
        'projects', 'tasks', 'inventory', 'users', 'compliance', 'experiments', 'dashboard'
    ]);
}

export function getReportFormats() {
    return Promise.resolve(['json', 'csv', 'xlsx', 'pdf']);
}

export function getPendingApprovals() {
    return getComplianceAlerts();
}

export function getDailyActiveUsers() {
    return getUserActivity();
}

export function getNotificationCenter() {
    return getComplianceAlerts();
}

export function getSmartInsights() {
    return getDashboardStats();
}

export function getTasksDashboard() {
    return getTaskDistribution();
}

export function getExperimentsDashboard() {
    return getExperimentProgress();
}

export function getTaskOverview() {
    return getTaskDistribution();
}

// User Dashboard Functions - These would need user-specific endpoints
export function getUserAssignedTasks() {
    // This would need a user-specific endpoint
    return Promise.resolve([]);
}

export function getUserCreatedTasks() {
    // This would need a user-specific endpoint
    return Promise.resolve([]);
}

export function getUserMemberProjects() {
    // This would need a user-specific endpoint
    return Promise.resolve([]);
}

export function getUserOwnedProjects() {
    // This would need a user-specific endpoint
    return Promise.resolve([]);
}

export function getUserDashboardActivities() {
    return getRecentActivities();
}

export function getUserDashboardNotifications() {
    return getComplianceAlerts();
}

export function getUserDashboardUpcomingDeadlines() {
    // This would need a specific endpoint for deadlines
    return Promise.resolve([]);
}

export function getUserDashboardPerformance() {
    return getTeamPerformance();
} 