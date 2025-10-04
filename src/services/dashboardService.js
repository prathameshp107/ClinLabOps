import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    // First get the task distribution data to count in-progress tasks
    const taskDistResponse = await api.get('/dashboard/task-distribution');
    const taskDistData = taskDistResponse.data;

    // Count in-progress tasks from task distribution
    let inProgressCount = 0;
    if (taskDistData && Array.isArray(taskDistData.byStatus)) {
        const inProgressItem = taskDistData.byStatus.find(item =>
            item._id?.toLowerCase() === 'in-progress');
        inProgressCount = inProgressItem ? inProgressItem.count : 0;
    }

    // Get the main stats data
    const response = await api.get('/dashboard/stats');
    const data = response.data;

    // Transform the backend data structure to match frontend expectations
    if (data && typeof data === 'object') {
        return [
            {
                title: "Total Tasks",
                value: data.tasks?.total?.toString() || "0",
                change: "+0%",
                icon: "FileText",
                trend: "up"
            },
            {
                title: "Completed",
                value: data.tasks?.completed?.toString() || "0",
                change: data.tasks?.completionRate ? `+${data.tasks.completionRate}%` : "+0%",
                icon: "CheckCircle2",
                trend: "up"
            },
            {
                title: "In Progress",
                value: inProgressCount.toString() || "0",
                change: "+0%",
                icon: "Clock",
                trend: "up"
            },
            {
                title: "Overdue",
                value: "0", // This would need to be calculated from actual overdue tasks
                change: "+0%",
                icon: "AlertTriangle",
                trend: "down"
            }
        ];
    }

    // Return default data structure if no data
    return [
        {
            title: "Total Tasks",
            value: "0",
            change: "+0%",
            icon: "FileText",
            trend: "up"
        },
        {
            title: "Completed",
            value: "0",
            change: "+0%",
            icon: "CheckCircle2",
            trend: "up"
        },
        {
            title: "In Progress",
            value: "0",
            change: "+0%",
            icon: "Clock",
            trend: "up"
        },
        {
            title: "Overdue",
            value: "0",
            change: "+0%",
            icon: "AlertTriangle",
            trend: "down"
        }
    ];
}

/**
 * Get task distribution data
 */
export async function getTaskDistribution() {
    const response = await api.get('/dashboard/task-distribution');
    const data = response.data;

    // Transform the backend data structure to match frontend expectations
    if (data && typeof data === 'object') {
        const distribution = [];

        // Process tasks by status
        if (Array.isArray(data.byStatus)) {
            data.byStatus.forEach(item => {
                let color = '#3b82f6'; // Default blue for in progress
                let displayName = item._id || 'Unknown';

                // Transform backend status names to frontend display names
                switch (item._id?.toLowerCase()) {
                    case 'done':
                    case 'completed':
                        displayName = 'Completed';
                        color = '#10b981'; // Green for completed
                        break;
                    case 'in-progress':
                    case 'in progress':
                        displayName = 'In Progress';
                        color = '#3b82f6'; // Blue for in progress
                        break;
                    case 'todo':
                    case 'pending':
                        displayName = 'Pending';
                        color = '#f59e0b'; // Amber for pending
                        break;
                    case 'review':
                        displayName = 'Review';
                        color = '#8b5cf6'; // Purple for review
                        break;
                    case 'overdue':
                        displayName = 'Overdue';
                        color = '#ef4444'; // Red for overdue
                        break;
                }

                distribution.push({
                    name: displayName,
                    value: item.count || 0,
                    color: color
                });
            });
        }

        // Add missing categories with 0 values if not present
        const existingCategories = distribution.map(item => item.name.toLowerCase());
        if (!existingCategories.includes('completed')) {
            distribution.push({ name: 'Completed', value: 0, color: '#10b981' });
        }
        if (!existingCategories.includes('in progress')) {
            distribution.push({ name: 'In Progress', value: 0, color: '#3b82f6' });
        }
        if (!existingCategories.includes('pending')) {
            distribution.push({ name: 'Pending', value: 0, color: '#f59e0b' });
        }
        if (!existingCategories.includes('overdue')) {
            distribution.push({ name: 'Overdue', value: 0, color: '#ef4444' });
        }

        return distribution;
    }

    // Return default data structure if no data
    return [
        { name: 'Completed', value: 0, color: '#10b981' },
        { name: 'In Progress', value: 0, color: '#3b82f6' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
        { name: 'Overdue', value: 0, color: '#ef4444' }
    ];
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
    const response = await api.get('/dashboard/team-performance');
    const rawData = response.data;

    // Check if rawData is an object with the expected structure
    if (!rawData || typeof rawData !== 'object') {
        throw new Error('Invalid data format received from server');
    }

    // Transform the raw performance data into the expected format
    let taskCompletionData = [];

    // Handle different possible data structures
    if (Array.isArray(rawData)) {
        // If rawData is already an array
        taskCompletionData = rawData;
    } else if (Array.isArray(rawData.taskCompletion)) {
        // If rawData has a taskCompletion property that's an array
        taskCompletionData = rawData.taskCompletion;
    } else if (Array.isArray(rawData.tasksByAssignee)) {
        // If rawData has a tasksByAssignee property (from backend controller)
        taskCompletionData = rawData.tasksByAssignee.map(item => ({
            name: item._id || 'Unknown',
            completed: item.completedTasks || 0,
            pending: (item.totalTasks || 0) - (item.completedTasks || 0),
            overdue: 0 // This would need to be calculated from actual overdue tasks
        }));
    } else {
        // Return empty array if no valid data structure
        taskCompletionData = [];
    }

    const transformedData = {
        taskCompletion: taskCompletionData,
        timeTracking: [], // Would need additional data from backend
        taskDistribution: taskCompletionData.map(item => ({
            name: item.name || item._id || 'Unknown',
            value: item.totalTasks || (item.completed + item.pending) || 0
        })),
        trends: [], // Would need historical data from backend
        summary: {
            completionRate: taskCompletionData.length > 0 ?
                Math.round(taskCompletionData.reduce((acc, item) => acc + (item.completedTasks || item.completed || 0), 0) /
                    taskCompletionData.reduce((acc, item) => acc + (item.totalTasks || (item.completed + item.pending) || 1), 0) * 100) : 0,
            completionRateChange: 0, // Would need historical data to calculate
            onTimeRate: 85, // Placeholder - would need actual data
            onTimeRateChange: 2,
            efficiencyScore: 78, // Placeholder - would need actual calculation
            efficiencyScoreChange: -1
        }
    };

    return transformedData;
}

/**
 * Get project health data
 */
export async function getProjectHealth() {
    const response = await api.get('/dashboard/project-health');
    return response.data;
}

/**
 * Get experiment progress data
 */
export async function getExperimentProgress() {
    const response = await api.get('/dashboard/experiment-progress');
    return response.data;
}

/**
 * Get user activity data
 */
export async function getUserActivity() {
    const response = await api.get('/dashboard/user-activity');
    return response.data;
}

/**
 * Get compliance alerts data
 */
export async function getComplianceAlerts() {
    const response = await api.get('/dashboard/compliance-alerts');
    return response.data;
}

/**
 * Get system logs data
 */
export async function getSystemLogs(params = {}) {
    const response = await api.get('/dashboard/system-logs', { params });
    return response.data;
}

/**
 * Get task heatmap data
 */
export async function getTaskHeatmap() {
    const response = await api.get('/dashboard/task-heatmap');
    return response.data;
}

// REPORT GENERATION

/**
 * Generate and download project report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateProjectReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download task report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateTaskReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download inventory report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateInventoryReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download user report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateUserReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download compliance report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateComplianceReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download experiment report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 * @param {Object} filters - Report filters
 */
export async function generateExperimentReport(format = 'json', filters = {}) {
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
}

/**
 * Generate and download dashboard summary report
 * @param {string} format - Report format (json, csv, xlsx, pdf)
 */
export async function generateDashboardReport(format = 'json') {
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
}

/**
 * Get reports data
 */
export async function getReports() {
    const response = await api.get('/reports');
    return response.data;
}

/**
 * Get report types
 */
export async function getReportTypes() {
    const response = await api.get('/reports/types');
    return response.data;
}

/**
 * Get report formats
 */
export async function getReportFormats() {
    const response = await api.get('/reports/formats');
    return response.data;
}

/**
 * Get pending approvals
 */
export async function getPendingApprovals() {
    // Fetch pending protocols (protocols with isPublic: false)
    const response = await api.get('/protocols/pending');
    const protocols = response.data.data || [];

    // Transform protocols to match the expected approval format
    const approvals = protocols.map(protocol => ({
        id: protocol._id,
        type: 'Protocol Approval',
        requester: protocol.createdBy?.name || 'Unknown User',
        requesterEmail: protocol.createdBy?.email || 'unknown@example.com',
        date: protocol.createdAt,
        status: 'pending',
        details: `Protocol: ${protocol.name}`,
        dateRequested: protocol.createdAt,
        priority: 'medium',
        additionalInfo: {
            protocolName: protocol.name,
            protocolDescription: protocol.description,
            protocolCategory: protocol.category,
            protocolVersion: protocol.version,
            protocolStatus: protocol.status
        },
        attachments: protocol.files || [],
        protocolId: protocol._id
    }));

    return approvals;
}

/**
 * Get daily active users
 */
export async function getDailyActiveUsers() {
    try {
        const response = await api.get('/dashboard/daily-active-users');
        return response.data;
    } catch (error) {
        console.error('Error fetching daily active users:', error);
        return getUserActivity();
    }
}

/**
 * Get notification center data
 */
export async function getNotificationCenter() {
    try {
        const response = await api.get('/dashboard/notification-center');
        return response.data;
    } catch (error) {
        console.error('Error fetching notification center data:', error);
        return getComplianceAlerts();
    }
}

/**
 * Get smart insights
 */
export async function getSmartInsights() {
    try {
        const response = await api.get('/dashboard/smart-insights');
        return response.data;
    } catch (error) {
        console.error('Error fetching smart insights:', error);
        return getDashboardStats();
    }
}

/**
 * Get tasks dashboard data
 */
export async function getTasksDashboard() {
    try {
        const response = await api.get('/dashboard/tasks');
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks dashboard data:', error);
        return getTaskDistribution();
    }
}

/**
 * Get experiments dashboard data
 */
export async function getExperimentsDashboard() {
    try {
        const response = await api.get('/dashboard/experiments');
        return response.data;
    } catch (error) {
        console.error('Error fetching experiments dashboard data:', error);
        return getExperimentProgress();
    }
}

/**
 * Get task overview data
 */
export async function getTaskOverview() {
    try {
        const response = await api.get('/dashboard/task-overview');
        return response.data;
    } catch (error) {
        console.error('Error fetching task overview data:', error);
        return getTaskDistribution();
    }
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