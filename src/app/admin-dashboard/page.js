"use client";

import { useState } from "react";
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
  FileText,
  Plus,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleCheck,
  CirclePause,
  CirclePlay,
  CircleDot
} from "lucide-react";

// Charts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TeamPerformance from "@/components/dashboard/TeamPerformance";

// Icons
import { BarChart2, Activity, TrendingUp } from 'lucide-react';

// Data
import { tasksOverviewData } from "@/data/dashboard-data";

// Utility functions for task status
const getStatusColor = (status) => {
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
  const statusLower = status.toLowerCase();
  if (statusLower.includes('complete')) return <CircleCheck className={className} />;
  if (statusLower.includes('progress')) return <CirclePlay className={className} />;
  if (statusLower.includes('pending')) return <CirclePause className={className} />;
  if (statusLower.includes('overdue')) return <AlertTriangle className={className} />;
  return <CircleDot className={className} />;
};

const getStatusVariant = (status) => {
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

/**
 * Task distribution data for the pie chart
 * @type {Array<{name: string, value: number, color: string}>}
 */
const taskDistributionData = [
  { name: 'Completed', value: tasksOverviewData.completed, color: '#10b981' },
  { name: 'In Progress', value: tasksOverviewData.inProgress, color: '#3b82f6' },
  { name: 'Pending', value: tasksOverviewData.pending, color: '#f59e0b' },
  { name: 'Overdue', value: tasksOverviewData.overdue, color: '#ef4444' },
];

/**
 * Stats data for the dashboard cards
 * @type {Array<{title: string, value: string|number, change: string, icon: React.ComponentType, variant?: string}>}
 */
const stats = [
  {
    title: "Total Tasks",
    value: tasksOverviewData.total.toString(),
    change: "",
    icon: FileText
  },
  {
    title: "Completed",
    value: tasksOverviewData.completed.toString(),
    change: `${Math.round((tasksOverviewData.completed / tasksOverviewData.total) * 100)}% of total`,
    icon: CheckCircle2,
    variant: "success"
  },
  {
    title: "In Progress",
    value: tasksOverviewData.inProgress.toString(),
    change: `${Math.round((tasksOverviewData.inProgress / tasksOverviewData.total) * 100)}% of total`,
    icon: Clock,
    variant: "warning"
  },
  {
    title: "Overdue",
    value: tasksOverviewData.overdue.toString(),
    change: "Needs attention",
    icon: AlertTriangle,
    variant: "destructive"
  },
];

/**
 * Main dashboard page component
 * @returns {JSX.Element} The rendered dashboard page
 */
export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  /**
   * Handles the refresh action
   * Simulates an API call with a loading state
   */
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Stats data
  const stats = [
    { title: 'Total Tasks', value: '128', icon: FileText, change: '+12% from last month' },
    { title: 'Completed', value: '84', icon: CheckCircle2, change: '+8% from last month', variant: 'green' },
    { title: 'In Progress', value: '32', icon: Clock, change: '+5% from last month', variant: 'blue' },
    { title: 'Overdue', value: '12', icon: AlertTriangle, change: '-3% from last month', variant: 'red' },
  ];

  // Chart data
  const taskDistributionData = [
    { name: 'Completed', value: 84, color: '#10B981' },
    { name: 'In Progress', value: 32, color: '#3B82F6' },
    { name: 'Pending', value: 12, color: '#F59E0B' },
    { name: 'Overdue', value: 12, color: '#EF4444' },
  ];

  // Recent tasks data
  const recentTasks = [
    { id: 1, title: 'Update project documentation', status: 'completed', priority: 'high', dueDate: '2023-06-20' },
    { id: 2, title: 'Fix authentication bug', status: 'in progress', priority: 'high', dueDate: '2023-06-22' },
    { id: 3, title: 'Design new dashboard layout', status: 'in progress', priority: 'medium', dueDate: '2023-06-25' },
    { id: 4, title: 'Write unit tests', status: 'pending', priority: 'high', dueDate: '2023-06-18' },
    { id: 5, title: 'Update dependencies', status: 'pending', priority: 'low', dueDate: '2023-06-30' },
  ];

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
                  <RefreshCw className="h-4 w-4" />
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
                <Activity className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} className="h-full transition-all hover:shadow-md">
                    <CardHeader className="p-3 sm:p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <div className="bg-muted p-1.5 rounded-md">
                          <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
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
                ))}
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <TeamPerformance />
                  <RecentActivity />

                  {/* Upcoming Deadlines */}
                  <Card className="h-fit">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                          <CardDescription className="text-sm">Tasks due soon</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground">
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {recentTasks
                          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                          .slice(0, 3)
                          .map((task) => (
                            <div key={`deadline-${task.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Due {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={getStatusVariant(task.status).variant} className="text-xs">
                                {task.status}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTabs />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
                <div className="text-center space-y-2">
                  <BarChart2 className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Reports coming soon</p>
                  <Button size="sm" variant="outline">
                    Generate Report
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

