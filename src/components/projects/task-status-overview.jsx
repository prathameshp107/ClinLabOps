"use client"

import { ChartPie, Info } from "lucide-react"
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

const tasksData = [
    { name: "Completed", value: 40, color: "#22c55e", description: "Tasks that have been successfully finished" },
    { name: "In Progress", value: 30, color: "#3b82f6", description: "Tasks currently being worked on" },
    { name: "Failed", value: 15, color: "#ef4444", description: "Tasks that couldn't be completed" },
    { name: "Pending", value: 15, color: "#f59e0b", description: "Tasks waiting to be started" },
]

const chartConfig = {
    Completed: {
        label: "Completed",
        color: "#22c55e",
    },
    "In Progress": {
        label: "In Progress",
        color: "#3b82f6",
    },
    Failed: {
        label: "Failed",
        color: "#ef4444",
    },
    Pending: {
        label: "Pending",
        color: "#f59e0b",
    },
}

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
                </div>
            </div>
        );
    }
    return null;
};

export function TaskStatusOverview() {
    const totalTasks = tasksData.reduce((sum, task) => sum + task.value, 0);

    return (
        <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
                        <ChartPie className="h-4 w-4 text-gray-500" />
                        Task Status Overview
                    </CardTitle>
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
            </CardHeader>
            <CardContent className="p-4">
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
                            <div key={index} className="flex items-center gap-2 p-2 rounded-lg">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div className="flex-1">
                                    <div className="text-sm text-gray-600">{item.name}</div>
                                    <div className="text-sm font-medium text-gray-900">{item.value}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 