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

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8 pt-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome back! Here&#39;s what&#39;s happening with your lab today.
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} className={`h-full transition-all hover:shadow-md ${stat.variant ? `border-${stat.variant}/20` : ""}`}>
                    <CardHeader className="p-3 sm:p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <div className={stat.variant ? `bg-${stat.variant}/10 p-1.5 rounded-md` : ""}>
                          <stat.icon
                            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.variant ? `text-${stat.variant}` : 'text-muted-foreground'}`}
                          />
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</div>
                        <p className={`text-xs ${stat.variant ? `text-${stat.variant} font-medium` : 'text-muted-foreground'}`}>
                          {stat.change}
                        </p>
                      </CardContent>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Chart and Recent Tasks Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 sm:gap-6">
                {/* Task Distribution Chart */}
                <Card className="lg:col-span-4 h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Task Distribution</CardTitle>
                    <CardDescription className="text-sm">Breakdown of tasks by status</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[280px] sm:h-[320px] p-2 sm:p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          innerRadius={30}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {taskDistributionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              className="outline-none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<CustomTooltip />}
                          wrapperStyle={{ zIndex: 10 }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            paddingTop: '12px',
                          }}
                          formatter={(value, entry, index) => {
                            const data = taskDistributionData[index];
                            return (
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {value}: <span className="font-medium">{data.value}</span>
                              </span>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Tasks */}
                <Card className="lg:col-span-3 h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Tasks</CardTitle>
                    <CardDescription className="text-sm">Latest tasks in the system</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <div className="space-y-2 p-2 sm:p-4 overflow-y-auto h-full max-h-[300px] sm:max-h-[350px] custom-scrollbar">
                      {tasksOverviewData.recentTasks.slice(0, 5).map((task, i) => (
                        <div
                          key={i}
                          className="group flex items-start gap-3 p-2 sm:p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ${getStatusColor(task.status).bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                              {getStatusIcon(task.status, "h-3.5 w-3.5 sm:h-4 sm:w-4 text-white")}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm sm:text-base font-medium leading-tight line-clamp-1">
                                {task.title}
                              </p>
                              <Badge
                                variant={getStatusVariant(task.status)}
                                className="text-[10px] sm:text-xs px-1.5 py-0.5 h-5 flex-shrink-0"
                              >
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                                  Due: {task.dueDate}
                                </span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-muted-foreground">
                                Priority: {task.priority || 'Normal'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTabs />
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and view reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Reports will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

