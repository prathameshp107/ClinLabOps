import * as dashboardData from "@/data/dashboard-data";
import * as userDashboard from "@/data/mock-user-dashboard";

/**
 * Get tasks overview data
 */
export function getTasksOverview() {
    return Promise.resolve(dashboardData.tasksOverviewData);
}

/**
 * Get task distribution data
 */
export function getTaskDistribution() {
    return Promise.resolve(dashboardData.taskDistributionData);
}

/**
 * Get dashboard stats
 */
export function getDashboardStats() {
    return Promise.resolve(dashboardData.dashboardStats);
}

/**
 * Get recent activities
 */
export function getRecentActivities() {
    return Promise.resolve(dashboardData.recentActivities);
}

/**
 * Get team performance data
 */
export function getTeamPerformance() {
    return Promise.resolve(dashboardData.teamPerformance);
}

/**
 * Get all reports
 */
export function getReports() {
    return Promise.resolve(dashboardData.reportsData);
}

/**
 * Get report types
 */
export function getReportTypes() {
    return Promise.resolve(dashboardData.reportTypes);
}

/**
 * Get report formats
 */
export function getReportFormats() {
    return Promise.resolve(dashboardData.reportFormats);
}

/**
 * Get pending approvals
 */
export function getPendingApprovals() {
    return Promise.resolve(dashboardData.pendingApprovalsData);
}

/**
 * Get user activity data
 */
export function getUserActivity() {
    return Promise.resolve(dashboardData.userActivityData);
}

/**
 * Get daily active users data
 */
export function getDailyActiveUsers() {
    return Promise.resolve(dashboardData.dailyActiveUsersData);
}

/**
 * Get experiment progress data
 */
export function getExperimentProgress() {
    return Promise.resolve(dashboardData.experimentProgressData);
}

/**
 * Get task heatmap data
 */
export function getTaskHeatmap() {
    return Promise.resolve(dashboardData.taskHeatmapData);
}

/**
 * Get compliance alerts data
 */
export function getComplianceAlerts() {
    return Promise.resolve(dashboardData.complianceAlertsData);
}

/**
 * Get notification center data
 */
export function getNotificationCenter() {
    return Promise.resolve(dashboardData.notificationCenterData);
}

/**
 * Get system logs data
 */
export function getSystemLogs() {
    return Promise.resolve(dashboardData.systemLogsData);
}

/**
 * Get smart insights data
 */
export function getSmartInsights() {
    return Promise.resolve(dashboardData.smartInsightsData);
}

/**
 * Get tasks dashboard data
 */
export function getTasksDashboard() {
    return Promise.resolve(dashboardData.tasksDashboardData);
}

/**
 * Get experiments dashboard data
 */
export function getExperimentsDashboard() {
    return Promise.resolve(dashboardData.experimentsDashboardData);
}

/**
 * Get task overview data
 */
export function getTaskOverview() {
    return Promise.resolve(dashboardData.taskOverviewData);
}

// --- User Dashboard Service Functions ---

/**
 * Get tasks assigned to the user
 */
export function getUserAssignedTasks() {
    return Promise.resolve(userDashboard.mockAssignedTasks);
}

/**
 * Get tasks created by the user
 */
export function getUserCreatedTasks() {
    return Promise.resolve(userDashboard.mockCreatedTasks);
}

/**
 * Get projects where user is a member
 */
export function getUserMemberProjects() {
    return Promise.resolve(userDashboard.mockMemberProjects);
}

/**
 * Get projects owned by the user
 */
export function getUserOwnedProjects() {
    return Promise.resolve(userDashboard.mockOwnedProjects);
}

/**
 * Get user dashboard activities
 */
export function getUserDashboardActivities() {
    return Promise.resolve(userDashboard.mockActivities);
}

/**
 * Get user dashboard notifications
 */
export function getUserDashboardNotifications() {
    return Promise.resolve(userDashboard.mockNotifications);
}

/**
 * Get user dashboard upcoming deadlines
 */
export function getUserDashboardUpcomingDeadlines() {
    return Promise.resolve(userDashboard.mockUpcomingDeadlines);
}

/**
 * Get user dashboard performance data
 */
export function getUserDashboardPerformance() {
    return Promise.resolve(userDashboard.mockPerformanceData);
} 