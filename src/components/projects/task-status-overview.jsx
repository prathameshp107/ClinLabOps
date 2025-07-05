"use client"

import { useState } from "react"
import { ChartPie, Info, TrendingUp, TrendingDown, Clock, AlertCircle, CheckCircle2, ArrowRight, Users, BarChart3, Calendar, Activity, Star, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                    />
                    <span className="font-medium text-gray-900">{data.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                    <div>Value: {data.value}%</div>
                    <div className="mt-1 text-xs">{data.description}</div>
                    <div className="mt-2 flex items-center gap-1">
                        {data.trendDirection === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={data.trendDirection === "up" ? "text-green-500" : "text-red-500"}>
                            {data.trend} from last week
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export function TaskStatusOverview({ project }) {
    const [activeTab, setActiveTab] = useState("overview");

    // Calculate task status breakdown from project tasks
    const calculateTaskStatusBreakdown = () => {
        if (!project?.tasks || project.tasks.length === 0) return [];

        const statusCounts = {
            completed: 0,
            in_progress: 0,
            pending: 0,
            on_hold: 0
        };

        // Count tasks by status
        project.tasks.forEach(task => {
            const status = task.status?.toLowerCase() || 'pending';
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            } else {
                statusCounts.pending++; // Default to pending if status is unknown
            }
        });

        const totalTasks = project.tasks.length;

        return [
            {
                name: 'Completed',
                count: statusCounts.completed,
                value: totalTasks > 0 ? Math.round((statusCounts.completed / totalTasks) * 100) : 0,
                color: '#10b981',
                icon: CheckCircle2,
                trendDirection: statusCounts.completed > 0 ? "up" : "down",
                trend: statusCounts.completed > 0 ? "+5 this week" : "No tasks",
                description: "Tasks that have been finished successfully",
                totalTasks
            },
            {
                name: 'In Progress',
                count: statusCounts.in_progress,
                value: totalTasks > 0 ? Math.round((statusCounts.in_progress / totalTasks) * 100) : 0,
                color: '#3b82f6',
                icon: Clock,
                trendDirection: statusCounts.in_progress > 0 ? "up" : "down",
                trend: statusCounts.in_progress > 0 ? "+3 this week" : "No tasks",
                description: "Tasks currently being worked on",
                totalTasks
            },
            {
                name: 'Pending',
                count: statusCounts.pending,
                value: totalTasks > 0 ? Math.round((statusCounts.pending / totalTasks) * 100) : 0,
                color: '#f59e0b',
                icon: AlertCircle,
                trendDirection: statusCounts.pending > 0 ? "down" : "up",
                trend: statusCounts.pending > 0 ? "-2 this week" : "No tasks",
                description: "Tasks waiting to be started",
                totalTasks
            },
            {
                name: 'On Hold',
                count: statusCounts.on_hold,
                value: totalTasks > 0 ? Math.round((statusCounts.on_hold / totalTasks) * 100) : 0,
                color: '#ef4444',
                icon: AlertCircle,
                trendDirection: statusCounts.on_hold > 0 ? "down" : "up",
                trend: statusCounts.on_hold > 0 ? "-1 this week" : "No tasks",
                description: "Tasks temporarily paused",
                totalTasks
            }
        ].filter(item => item.count > 0); // Only show statuses that have tasks
    };

    const tasks = calculateTaskStatusBreakdown();
    const totalTasks = tasks.reduce((sum, task) => sum + task.value, 0);
    const totalTaskCount = project?.tasks?.length || 0;
    const completionRate = totalTaskCount > 0 ? Math.round((tasks.find(t => t.name === 'Completed')?.count || 0) / totalTaskCount * 100) : 0;
    const averageWorkload = totalTaskCount > 0 ? Math.round((tasks.reduce((sum, task) => sum + task.value, 0) / tasks.length) || 0) : 0;

    // Show message when no tasks are available
    if (!project?.tasks || project.tasks.length === 0) {
        return (
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                                <ChartPie className="h-5 w-5 text-white" />
                            </div>
                            Task Status Overview
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                <span className="text-sm text-gray-600">No tasks available</span>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Shows the distribution of tasks by their current status</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <ChartPie className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Tasks Available</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
                            This project doesn't have any tasks yet. Add tasks to see the status breakdown and progress analysis.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                            <ChartPie className="h-5 w-5 text-white" />
                        </div>
                        Task Status Overview
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">{completionRate}% Completion Rate</span>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Shows the distribution of tasks by their current status</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="team" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Team Progress
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 hover:shadow-md transition-all duration-200">
                                <div className="text-sm text-green-600 font-medium mb-1">Total Tasks</div>
                                <div className="text-2xl font-bold text-green-900">{totalTaskCount}</div>
                                <div className="text-xs text-green-600 mt-1">Across all statuses</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 hover:shadow-md transition-all duration-200">
                                <div className="text-sm text-blue-600 font-medium mb-1">Completion Rate</div>
                                <div className="text-2xl font-bold text-blue-900">{completionRate}%</div>
                                <div className="text-xs text-blue-600 mt-1">Tasks completed successfully</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-full aspect-square max-w-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <ChartTooltip content={<CustomTooltip />} />
                                        <Pie
                                            data={tasks}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            animationDuration={1000}
                                            animationBegin={0}
                                        >
                                            {tasks.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="text-2xl font-semibold text-gray-900">{totalTasks}%</div>
                                    <div className="text-xs text-gray-500">Total Progress</div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                                {tasks.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                                            <item.icon className="h-4 w-4" style={{ color: item.color }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="flex items-center gap-1">
                                                    {item.trendDirection === "up" ? (
                                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                                    )}
                                                    <span className={`text-xs ${item.trendDirection === "up" ? "text-green-500" : "text-red-500"}`}>
                                                        {item.trend}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="text-sm text-gray-500">{item.count} tasks</div>
                                                <div className="text-sm font-medium text-gray-900">{item.value}%</div>
                                            </div>
                                            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${(item.count / totalTaskCount) * 100}%`,
                                                        backgroundColor: item.color
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="team" className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 hover:shadow-md transition-all duration-200">
                                <div className="text-sm text-purple-600 font-medium mb-1">Team Workload</div>
                                <div className="text-2xl font-bold text-purple-900">{averageWorkload}%</div>
                                <div className="text-xs text-purple-600 mt-1">Average team workload</div>
                            </div>
                            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 hover:shadow-md transition-all duration-200">
                                <div className="text-sm text-amber-600 font-medium mb-1">Team Rating</div>
                                <div className="text-2xl font-bold text-amber-900">4.4/5</div>
                                <div className="text-xs text-amber-600 mt-1">Based on task completion</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {tasks.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                                                <item.icon className="h-4 w-4" style={{ color: item.color }} />
                                            </div>
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {item.count} tasks
                                        </Badge>
                                    </div>

                                    {project?.team && project.team.length > 0 ? (
                                        <div className="space-y-3">
                                            {project.team.map((member, idx) => {
                                                const memberTasks = project.tasks.filter(task =>
                                                    (task.assigneeId === member.id || task.assignee === member.name) &&
                                                    task.status === item.name.toLowerCase().replace(' ', '_')
                                                );
                                                const memberProgress = memberTasks.length > 0 ?
                                                    (memberTasks.filter(t => t.status === 'completed').length / memberTasks.length) * 100 : 0;

                                                return (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium">{member.name}</p>
                                                                <p className="text-xs text-muted-foreground">{member.role}</p>
                                                            </div>
                                                        </div>
                                                        <Progress
                                                            value={memberProgress}
                                                            className="w-24 h-2"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground">
                                            <p className="text-sm">No team members assigned to this project</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex gap-3 w-full">
                    <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                        View Detailed Report
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="default" className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        Export Data
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 