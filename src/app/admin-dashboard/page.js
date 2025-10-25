"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AnalyticsTabs from "@/components/dashboard/AnalyticsTabs";

// Icons
import {
  FileText as FileTextIcon,
  Plus,
  RefreshCw as RefreshCwIcon,
  Loader2,
  CheckCircle2 as CheckCircle2Icon,
  Clock as ClockIcon,
  AlertTriangle as AlertTriangleIcon,
  CircleCheck as CircleCheckIcon,
  CirclePause as CirclePauseIcon,
  CirclePlay as CirclePlayIcon,
  CircleDot as CircleDotIcon,
  BarChart2 as BarChart2Icon,
  Activity as ActivityIcon,
  TrendingUp as TrendingUpIcon,
  Eye,
  Download
} from "lucide-react";

// Charts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TeamPerformance from "@/components/dashboard/TeamPerformance";

// Services
import {
  getDashboardStats,
  getTaskDistribution,
  getRecentActivities,
  getTeamPerformance,
  getReports,
  getReportTypes,
  getReportFormats
} from "@/services/dashboardService";
import { getProjects } from "@/services/projectService";
import { getTasks } from "@/services/taskService";
import { reportService } from "@/services/reportService"; // Add this import

// Components
import { ReportsTab } from "@/components/dashboard/ReportsTab";
import { RecentSystemLogs } from "@/components/dashboard/RecentSystemLogs";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";

// Utility functions for task status
const getStatusColor = (status) => {
  if (!status) return { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-200' };
  switch (status.toLowerCase()) {
    case 'completed':
      return { bg: 'bg-green-500', text: 'text-green-800', border: 'border-green-200' };
    case 'in progress':
      return { bg: 'bg-blue-500', text: 'text-blue-800', border: 'border-blue-200' };
    case 'pending':
      return { bg: 'bg-amber-500', text: 'text-amber-800', border: 'border-amber-200' };
    case 'overdue':
      return { bg: 'bg-red-500', text: 'text-red-800', border: 'border-red-200' };
    default:
      return { bg: 'bg-gray-500', text: 'text-gray-800', border: 'border-gray-200' };
  }
};

const getStatusIcon = (status, className = '') => {
  if (!status) return <CircleDotIcon className={className} />;
  const statusLower = status.toLowerCase();
  if (statusLower.includes('complete')) return <CircleCheckIcon className={className} />;
  if (statusLower.includes('progress')) return <CirclePlayIcon className={className} />;
  if (statusLower.includes('pending')) return <CirclePauseIcon className={className} />;
  if (statusLower.includes('overdue')) return <AlertTriangleIcon className={className} />;
  return <CircleDotIcon className={className} />;
};

const getStatusVariant = (status) => {
  if (!status) return 'default';
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'warning';
    case 'pending':
      return 'secondary';
    case 'overdue':
      return 'destructive';
    default:
      return 'default';
  }
};

/**
 * Custom tooltip component for the pie chart
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the tooltip is active
 * @param {Array} props.payload - The data payload for the tooltip
 * @returns {JSX.Element|null} The tooltip component or null if not active
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">{data.value} tasks</p>
        <p className="text-xs text-muted-foreground">
          {Math.round((data.value / tasksOverviewData.total) * 100)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// Imported from dashboard-data.js

/**
 * Main dashboard page component
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState([]);
  const [taskDistributionData, setTaskDistributionData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [reportFormats, setReportFormats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recentReports, setRecentReports] = useState([]); // Add this state for recent reports

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          statsData,
          taskDistData,
          activitiesData,
          teamPerfData,
          reportsListData,
          reportTypesData,
          reportFormatsData,
          projectsData,
          tasksData
        ] = await Promise.all([
          getDashboardStats().catch(() => []),
          getTaskDistribution().catch(() => []),
          getRecentActivities().catch(() => []),
          getTeamPerformance().catch(() => []),
          getReports().catch(() => []),
          getReportTypes().catch(() => []),
          getReportFormats().catch(() => []),
          getProjects().catch(() => []),
          getTasks().catch(() => [])
        ]);

        // Also fetch recent reports for the dashboard
        const recentReportsData = await fetchRecentReports();

        // Ensure dashboardStats is an array with fallback data
        const processedStats = Array.isArray(statsData) ? statsData : [
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

        // Ensure taskDistributionData is an array with fallback data
        const processedTaskDist = Array.isArray(taskDistData) ? taskDistData : [
          { name: 'Completed', value: 0, color: '#10b981' },
          { name: 'In Progress', value: 0, color: '#3b82f6' },
          { name: 'Pending', value: 0, color: '#f59e0b' },
          { name: 'Overdue', value: 0, color: '#ef4444' }
        ];

        setDashboardStats(processedStats);
        setTaskDistributionData(processedTaskDist);
        setRecentActivities(activitiesData);
        setTeamPerformance(teamPerfData);
        setReportsData(reportsListData);
        setReportTypes(reportTypesData);
        setReportFormats(reportFormatsData);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setRecentReports(recentReportsData); // Set recent reports
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to fetch the 10 most recent reports
  const fetchRecentReports = async () => {
    try {
      const response = await reportService.getAll({ limit: 10 });
      const reports = response.reports || (Array.isArray(response) ? response : []);
      // The backend already sorts by createdAt descending, so we just need to limit to 10
      return reports.slice(0, 10);
    } catch (error) {
      console.error('Failed to fetch recent reports:', error);
      return [];
    }
  };

  /**
   * Handles the refresh action
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [
        statsData,
        taskDistData,
        activitiesData,
        teamPerfData,
        projectsData,
        tasksData
      ] = await Promise.all([
        getDashboardStats().catch(() => []),
        getTaskDistribution().catch(() => []),
        getRecentActivities().catch(() => []),
        getTeamPerformance().catch(() => []),
        getProjects().catch(() => []),
        getTasks().catch(() => [])
      ]);

      // Also refresh recent reports
      const recentReportsData = await fetchRecentReports();

      // Ensure dashboardStats is an array with fallback data
      const processedStats = Array.isArray(statsData) ? statsData : [
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

      // Ensure taskDistributionData is an array with fallback data
      const processedTaskDist = Array.isArray(taskDistData) ? taskDistData : [
        { name: 'Completed', value: 0, color: '#10b981' },
        { name: 'In Progress', value: 0, color: '#3b82f6' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
        { name: 'Overdue', value: 0, color: '#ef4444' }
      ];

      setDashboardStats(processedStats);
      setTaskDistributionData(processedTaskDist);
      setRecentActivities(activitiesData);
      setTeamPerformance(teamPerfData);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setRecentReports(recentReportsData); // Update recent reports
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle report download
  const handleDownloadReport = async (reportId) => {
    try {
      await reportService.download(reportId);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  // Handle report view
  const handleViewReport = (report) => {
    // For now, we'll just download the report when "View" is clicked
    // In a more complex implementation, this could open a preview modal
    handleDownloadReport(report._id);
  };

  // Function to get file icon based on format
  const getFileIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return <FileTextIcon className="h-4 w-4 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileTextIcon className="h-4 w-4 text-green-500" />;
      case 'csv':
        return <FileTextIcon className="h-4 w-4 text-blue-500" />;
      case 'docx':
      case 'doc':
        return <FileTextIcon className="h-4 w-4 text-blue-700" />;
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Create tasksOverviewData structure for backward compatibility
  const tasksOverviewData = {
    recentTasks: Array.isArray(recentActivities)
      ? recentActivities.filter(activity => activity?.type === 'task').slice(0, 5)
      : [],
    stats: {
      total: dashboardStats.find(stat => stat.title === 'Total Tasks')?.value || '0',
      completed: dashboardStats.find(stat => stat.title === 'Completed')?.value || '0',
      inProgress: dashboardStats.find(stat => stat.title === 'In Progress')?.value || '0',
      overdue: dashboardStats.find(stat => stat.title === 'Overdue')?.value || '0'
    }
  };

  // Function to check if a date is in the current month
  const isDateInCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  // Function to get upcoming deadlines for the current month
  const getUpcomingDeadlines = () => {
    const upcomingDeadlines = [];

    // Add tasks with due dates in the current month
    if (Array.isArray(tasks)) {
      tasks
        .filter(task => task?.dueDate && isDateInCurrentMonth(task.dueDate))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5)
        .forEach(task => {
          upcomingDeadlines.push({
            id: `task-${task.id}`,
            title: task.title,
            dueDate: task.dueDate,
            status: task.status,
            type: 'task'
          });
        });
    }

    // Add projects with end dates in the current month
    if (Array.isArray(projects)) {
      projects
        .filter(project => project?.endDate && isDateInCurrentMonth(project.endDate))
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 5 - upcomingDeadlines.length) // Fill remaining slots
        .forEach(project => {
          upcomingDeadlines.push({
            id: `project-${project.id}`,
            title: project.name,
            dueDate: project.endDate,
            status: project.status,
            type: 'project'
          });
        });
    }

    // Sort all deadlines by date
    return upcomingDeadlines
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const recentTasks = getUpcomingDeadlines();

  // Format time for system logs
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for system logs
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-6">
          {/* Header Section Skeleton */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-80 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-6">
            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-24 bg-muted rounded-t-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-muted rounded-t-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-muted rounded-t-lg animate-pulse"></div>
              </div>

              {/* Overview Tab Content Skeleton */}
              <div className="space-y-6">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-24 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>

                {/* Main Grid Layout Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left Column Skeleton */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Task Distribution Chart Skeleton */}
                    <div className="h-80 bg-muted rounded-xl animate-pulse"></div>

                    {/* Recent Tasks Skeleton */}
                    <div className="h-64 bg-muted rounded-xl animate-pulse"></div>

                    {/* Recent Reports Section Skeleton */}
                    <div className="h-64 bg-muted rounded-xl animate-pulse"></div>

                    {/* Recent Activity Skeleton */}
                    <div className="h-64 bg-muted rounded-xl animate-pulse"></div>

                    {/* Upcoming Deadlines Skeleton */}
                    <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
                  </div>

                  {/* Right Column Skeleton */}
                  <div className="space-y-6">
                    {/* Pending Approvals Skeleton */}
                    <div className="h-64 bg-muted rounded-xl animate-pulse"></div>

                    {/* Team Performance Skeleton */}
                    <div className="h-80 bg-muted rounded-xl animate-pulse"></div>
                  </div>

                  {/* System Logs Section Skeleton */}
                  <div className="lg:col-span-3">
                    <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your lab today.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2"
              aria-label={isRefreshing ? 'Refreshing...' : 'Refresh'}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only sm:not-sr-only sm:inline">Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCwIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:inline">Refresh</span>
                </>
              )}
            </Button>
            <Button size="sm" className="flex-1 sm:flex-initial flex items-center gap-2" aria-label="New Task">
              <Plus className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2Icon className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {dashboardStats.map((stat, index) => {
                  // Map icon names to their corresponding components
                  const iconMap = {
                    'FileText': FileTextIcon,
                    'CheckCircle2': CheckCircle2Icon,
                    'Clock': ClockIcon,
                    'AlertTriangle': AlertTriangleIcon
                  };
                  const Icon = iconMap[stat.icon] || FileTextIcon;

                  return (
                    <Card key={index} className="h-full transition-all hover:shadow-md">
                      <CardHeader className="p-3 sm:p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                          <div className="bg-muted p-1.5 rounded-md">
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <CardContent className="p-0">
                          <div className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            {stat.change}
                          </p>
                        </CardContent>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Task Distribution Chart */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Task Distribution</CardTitle>
                          <CardDescription className="text-sm">Breakdown of tasks by status</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[280px] -mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={taskDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={70}
                            innerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {taskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{ paddingTop: '10px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Recent Tasks */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Recent Tasks</CardTitle>
                          <CardDescription className="text-sm">Your most recent tasks</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {recentTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                {getStatusIcon(task.status, 'h-4 w-4')}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{task.title}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    Due {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                  {task.priority === 'high' && (
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusVariant(task.status)} className="text-xs">
                                {task.status}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Reports Section - Add this new section */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Recent Reports</CardTitle>
                          <CardDescription className="text-sm">Your 10 most recently uploaded reports</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 text-muted-foreground"
                          onClick={() => router.push('/reports')}
                        >
                          See Reports
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {recentReports.length > 0 ? (
                        <div className="space-y-2">
                          {recentReports.map((report) => (
                            <div key={report._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {getFileIcon(report.format)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{report.title}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {report.type?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-muted/50"
                                  onClick={() => handleViewReport(report)}
                                  title="View report"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-muted/50"
                                  onClick={() => handleDownloadReport(report._id)}
                                  title="Download report"
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <FileTextIcon className="h-12 w-12 text-muted-foreground mb-2" />
                          <h3 className="text-lg font-medium">No reports found</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Get started by uploading your first report.
                          </p>
                          <Button onClick={() => router.push('/reports')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Report
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <RecentActivity data={recentActivities} />
                  {/* Upcoming Deadlines */}
                  <Card className="h-fit">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                          <CardDescription className="text-sm">Tasks and projects due this month</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {recentTasks
                          .filter(item => item?.dueDate)
                          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                          .slice(0, 5)
                          .map((item) => (
                            <div key={`deadline-${item.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex-shrink-0">
                                <div className={`h-2 w-2 rounded-full ${item.type === 'project' ? 'bg-purple-500' : 'bg-primary'}`}></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Due {new Date(item.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={getStatusVariant(item.status)} className="text-xs">
                                {item.status || 'Unknown'}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <PendingApprovals />
                  <TeamPerformance data={teamPerformance} />
                </div>
                {/* System Logs Section */}
                <div className="lg:col-span-3">
                  <RecentSystemLogs
                    formatTime={formatTime}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTabs teamPerformance={teamPerformance} projects={projects} />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ReportsTab
                reports={reportsData}
                reportTypes={reportTypes}
                reportFormats={reportFormats}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

