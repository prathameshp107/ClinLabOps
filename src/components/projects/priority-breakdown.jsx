"use client"

import { BarChart3, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
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

const priorityData = [
  { name: "Lowest", tasks: 50, color: "#22c55e" },
  { name: "Low", tasks: 75, color: "#3b82f6" },
  { name: "Medium", tasks: 120, color: "#f59e0b" },
  { name: "High", tasks: 90, color: "#ef4444" },
  { name: "Highest", tasks: 30, color: "#8b5cf6" },
]

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  Lowest: {
    label: "Lowest Priority",
    color: "#22c55e",
  },
  Low: {
    label: "Low Priority",
    color: "#3b82f6",
  },
  Medium: {
    label: "Medium Priority",
    color: "#f59e0b",
  },
  High: {
    label: "High Priority",
    color: "#ef4444",
  },
  Highest: {
    label: "Highest Priority",
    color: "#8b5cf6",
  },
};

const CustomBarTooltip = ({ active, payload }) => {
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
                    <div>Tasks: {data.tasks}</div>
                </div>
            </div>
        );
    }
    return null;
};

export function PriorityBreakdown() {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            Priority Breakdown
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Get a holistic view of how work is being prioritized.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip content={<CustomBarTooltip />} />
              <ChartLegend content={<ChartLegendContent />} className="mt-4" />
              <Bar 
                dataKey="tasks" 
                fill="currentColor" 
                radius={[4, 4, 0, 0]}
                className="fill-blue-500 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 