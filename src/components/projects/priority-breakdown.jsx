"use client"

import { BarChart3, Info, TrendingUp, AlertTriangle, Clock, CheckCircle2, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const priorityData = [
  { 
    name: "Lowest", 
    tasks: 50, 
    color: "#10b981", 
    gradient: "from-emerald-400 to-emerald-600",
    icon: CheckCircle2,
    percentage: 13.7,
    trend: "+5%"
  },
  { 
    name: "Low", 
    tasks: 75, 
    color: "#3b82f6", 
    gradient: "from-blue-400 to-blue-600",
    icon: Clock,
    percentage: 20.5,
    trend: "+2%"
  },
  { 
    name: "Medium", 
    tasks: 120, 
    color: "#f59e0b", 
    gradient: "from-amber-400 to-amber-600",
    icon: AlertTriangle,
    percentage: 32.9,
    trend: "-3%"
  },
  { 
    name: "High", 
    tasks: 90, 
    color: "#ef4444", 
    gradient: "from-red-400 to-red-600",
    icon: TrendingUp,
    percentage: 24.7,
    trend: "+8%"
  },
  { 
    name: "Highest", 
    tasks: 30, 
    color: "#8b5cf6", 
    gradient: "from-purple-400 to-purple-600",
    icon: Zap,
    percentage: 8.2,
    trend: "+12%"
  },
]

const totalTasks = priorityData.reduce((sum, item) => sum + item.tasks, 0)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const Icon = data.icon;
    
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 min-w-[220px] backdrop-blur-md">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("p-2.5 rounded-lg shadow-sm", `bg-gradient-to-br ${data.gradient}`)}>
            <Icon className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{data.name} Priority</div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs px-2 py-0.5 font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                {data.percentage}% of total
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 font-medium rounded",
                data.trend.startsWith('+') 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              )}>
                {data.trend} this week
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-xs">Current Tasks</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{data.tasks}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400 text-xs">Total Project</div>
            <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{totalTasks}</div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function PriorityBreakdown() {
  const highPriorityCount = priorityData.filter(p => p.name === 'High' || p.name === 'Highest')
    .reduce((sum, item) => sum + item.tasks, 0);
  
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
      
      <CardHeader className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur-sm">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text">
                Priority Breakdown
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Distribution of {totalTasks} total tasks
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">High Priority</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{highPriorityCount} tasks</div>
            </div>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Info className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Visual breakdown of task priorities across your project. Higher priorities may need immediate attention.</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 border border-red-200/50 dark:border-red-800/30">
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">Critical</div>
            <div className="text-lg font-bold text-red-700 dark:text-red-300">{highPriorityCount}</div>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10 border border-amber-200/50 dark:border-amber-800/30">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Medium</div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-300">120</div>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 border border-green-200/50 dark:border-green-800/30">
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Low</div>
            <div className="text-lg font-bold text-green-700 dark:text-green-300">125</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-6">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={priorityData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="currentColor"
                className="opacity-20"
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(0,0,0,0.05)', radius: 4 }}
                animationDuration={150}
              />
              <Bar 
                dataKey="tasks" 
                radius={[6, 6, 0, 0]}
                className="drop-shadow-sm"
              >
                {priorityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-90 transition-all duration-200 cursor-pointer hover:drop-shadow-md"
                    stroke={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}