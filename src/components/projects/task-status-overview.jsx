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

const tasksData = [
    {
        name: "Completed",
        value: 40,
        color: "#22c55e",
        description: "Tasks that have been successfully finished",
        trend: "+5%",
        trendDirection: "up",
        count: 24,
        total: 60,
        icon: CheckCircle2,
        assignees: [
            { name: "Sarah Johnson", avatar: "", role: "Project Lead" },
            { name: "Michael Chen", avatar: "", role: "Developer" }
        ]
    },
    {
        name: "In Progress",
        value: 30,
        color: "#3b82f6",
        description: "Tasks currently being worked on",
        trend: "-2%",
        trendDirection: "down",
        count: 18,
        total: 60,
        icon: Clock,
        assignees: [
            { name: "Emily Rodriguez", avatar: "", role: "Designer" },
            { name: "David Kim", avatar: "", role: "QA Engineer" }
        ]
    },
    {
        name: "Failed",
        value: 15,
        color: "#ef4444",
        description: "Tasks that couldn't be completed",
        trend: "+3%",
        trendDirection: "up",
        count: 9,
        total: 60,
        icon: AlertCircle,
        assignees: [
            { name: "Lisa Wang", avatar: "", role: "Developer" }
        ]
    },
    {
        name: "Pending",
        value: 15,
        color: "#f59e0b",
        description: "Tasks waiting to be started",
        trend: "-1%",
        trendDirection: "down",
        count: 9,
        total: 60,
        icon: Clock,
        assignees: []
    },
]

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

export function TaskStatusOverview() {
    const [activeTab, setActiveTab] = useState("overview");
    const totalTasks = tasksData.reduce((sum, task) => sum + task.value, 0);
    const totalTaskCount = tasksData.reduce((sum, task) => sum + task.count, 0);
    const completionRate = Math.round((tasksData[0].count / totalTaskCount) * 100);
    const averageWorkload = Math.round(tasksData.reduce((sum, task) => sum + (task.count / task.total * 100), 0) / tasksData.length);

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
                                            data={tasksData}
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
                                            {tasksData.map((entry, index) => (
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
                                {tasksData.map((item, index) => (
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
                            {tasksData.map((item, index) => (
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

                                    {item.assignees.length > 0 ? (
                                        <div className="space-y-3">
                                            {item.assignees.map((assignee, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {assignee.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{assignee.name}</p>
                                                            <p className="text-xs text-muted-foreground">{assignee.role}</p>
                                                        </div>
                                                    </div>
                                                    <Progress
                                                        value={Math.random() * 100}
                                                        className="w-24 h-2"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground">
                                            <p className="text-sm">No assignees for this status</p>
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