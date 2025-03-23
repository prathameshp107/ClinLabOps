"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { ClipboardList, Clock, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Mock data for tasks
const taskData = [
  { name: 'Pending', value: 12, color: '#f87171' }, // Red
  { name: 'In Progress', value: 18, color: '#facc15' }, // Yellow
  { name: 'Completed', value: 24, color: '#4ade80' }, // Green
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export const TasksOverview = () => {
  const totalTasks = taskData.reduce((sum, task) => sum + task.value, 0)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Total Active Tasks</CardTitle>
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Overview of all task statuses</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{totalTasks}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500 font-medium">12%</span>
                <span className="ml-1">from last week</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-red-100 hover:bg-red-200 border-red-200 text-red-700">Pending: {taskData[0].value}</Badge>
              <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-200 border-yellow-200 text-yellow-700">In Progress: {taskData[1].value}</Badge>
              <Badge variant="outline" className="bg-green-100 hover:bg-green-200 border-green-200 text-green-700">Completed: {taskData[2].value}</Badge>
            </div>
          </div>
          
          <div className="h-[180px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Avg. completion: 3.2 days</span>
            </div>
            <Button variant="outline" size="sm">
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
