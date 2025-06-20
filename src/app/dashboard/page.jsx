'use client'

import * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample data
const recentTasks = [
  {
    id: 'TASK-1',
    title: 'Prepare experiment protocol for study X',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2023-06-15',
    project: 'Study X - Phase 1',
    assignee: {
      name: 'Jane Smith',
      avatar: '/avatars/01.png',
    },
  },
  {
    id: 'TASK-2',
    title: 'Review lab results',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-06-20',
    project: 'Study Y - Analysis',
    assignee: {
      name: 'John Doe',
      avatar: '/avatars/02.png',
    },
  },
  {
    id: 'TASK-3',
    title: 'Order new lab supplies',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-06-10',
    project: 'Lab Operations',
    assignee: {
      name: 'Alex Johnson',
      avatar: '/avatars/03.png',
    },
  },
]

const projects = [
  {
    id: 'PROJ-1',
    name: 'Study X - Phase 1',
    progress: 65,
    status: 'on_track',
    tasks: {
      total: 24,
      completed: 16,
    },
    dueDate: '2023-08-30',
  },
  {
    id: 'PROJ-2',
    name: 'Study Y - Analysis',
    progress: 30,
    status: 'at_risk',
    tasks: {
      total: 18,
      completed: 6,
    },
    dueDate: '2023-07-15',
  },
  {
    id: 'PROJ-3',
    name: 'Lab Operations',
    progress: 90,
    status: 'on_track',
    tasks: {
      total: 10,
      completed: 9,
    },
    dueDate: '2023-06-25',
  },
]

// Define variant types
const statusVariant = {
  todo: 'outline',
  in_progress: 'default',
  review: 'secondary',
  done: 'success',
}

const priorityVariant = {
  low: 'outline',
  medium: 'secondary',
  high: 'destructive',
}

const projectStatusVariant = {
  on_track: 'default',
  at_risk: 'warning',
  delayed: 'destructive',
  completed: 'success',
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [tasks, setTasks] = useState(recentTasks)
  const [projectList, setProjectList] = useState(projects)

  const handleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'done' }
        : task
    ))
  }

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>New Project</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Tasks
                  </CardTitle>
                  <Icons.list className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Progress
                  </CardTitle>
                  <Icons.activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last week
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">765</div>
                  <p className="text-xs text-muted-foreground">
                    +19.8% from last month
                  </p>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Overdue
                  </CardTitle>
                  <Icons.alert className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">13</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tasks and Projects */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Recent Tasks */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>
                    You have {tasks.filter(t => t.status !== 'done').length} tasks to complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={task.status === 'done'}
                            onChange={() => handleTaskComplete(task.id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {task.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {task.project}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={statusVariant[task.status]}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Project Progress */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                  <CardDescription>
                    Track your project status and completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectList.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{project.name}</p>
                          <Badge variant={projectStatusVariant[project.status]}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{project.tasks.completed} of {project.tasks.total} tasks</span>
                          <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View detailed analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <Icons.barChart2 className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Analytics coming soon</h3>
                    <p className="mb-4 mt-1 text-sm text-muted-foreground">
                      We're working on bringing you detailed analytics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
