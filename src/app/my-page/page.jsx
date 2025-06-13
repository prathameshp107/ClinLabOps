"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  Folder, 
  FolderPlus, 
  ListTodo, 
  PlusCircle, 
  User, 
  Bell, 
  Activity, 
  ChevronRight, 
  BarChart2,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";

import TaskList from "@/components/dashboard/my-page/task-list";
import ProjectGrid from "@/components/dashboard/my-page/project-grid";
import ActivityTimeline from "@/components/dashboard/my-page/activity-timeline";
import PerformanceMetrics from "@/components/dashboard/my-page/performance-metrics";
import NotificationsPanel from "@/components/dashboard/my-page/notifications-panel";
import UpcomingDeadlines from "@/components/dashboard/my-page/upcoming-deadlines";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

// Mock data - would be fetched from API in real app
import { 
  mockAssignedTasks, 
  mockCreatedTasks, 
  mockMemberProjects, 
  mockOwnedProjects,
  mockActivities,
  mockNotifications,
  mockUpcomingDeadlines,
  mockPerformanceData
} from "@/data/mock-user-dashboard";

export default function MyPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock user data
  const user = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@labtasker.com",
    role: "Senior Researcher",
    department: "Oncology Research",
    avatar: "/avatars/sarah-johnson.jpg"
  };

  return (
    <DashboardLayout>
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with user info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.role} • {user.department}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="gap-1">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <User size={16} />
            <span className="hidden sm:inline">Edit Profile</span>
          </Button>
        </div>
      </motion.div>

      {/* Main dashboard tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8 mt-6">
          {/* Hero section with summary */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-background to-background p-6 border shadow-sm"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
                <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    <span>{mockAssignedTasks.filter(t => t.status === "Completed").length} tasks completed</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                    <span>{mockAssignedTasks.filter(t => t.status === "In Progress").length} in progress</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    <span>{mockAssignedTasks.filter(t => t.status === "Overdue").length} overdue</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="default" size="sm" className="gap-1.5 h-9 px-4">
                  <PlusCircle size={16} />
                  <span>New Task</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 h-9 px-4">
                  <Calendar size={16} />
                  <span>View Calendar</span>
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats - Improved with hover effects */}
            {/* Redesigned Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-1 md:col-span-2 relative"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left side - 3D Stats Card */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Performance Overview
                  </h3>

                  <div className="relative h-[180px] w-full perspective-[1000px] group cursor-pointer">
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-blue-500/80 shadow-xl transform-style-3d rotate-y-[-5deg] rotate-x-[5deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-transform duration-500"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                      <div className="absolute inset-0 p-6 text-white flex flex-col justify-between">
                        <div>
                          <h4 className="text-xl font-bold">Task Completion</h4>
                          <p className="text-white/80 text-sm">This week's progress</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{mockPerformanceData.summary.completionRate}%</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${mockPerformanceData.summary.completionRate}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-white/90"></div>
                              <span className="text-xs">Completed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-white/30"></div>
                              <span className="text-xs">Remaining</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-background/80 backdrop-blur-sm border-muted hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 flex items-center justify-center gap-2 py-2.5 rounded-xl shadow-sm hover:shadow-md"
                    >
                      <BarChart2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Weekly Report</span>
                    </Button>

                  </div>
                </div>

                {/* Right side - Stat Tiles */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-primary" />
                    Task Statistics
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Active Tasks Tile */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden rounded-xl p-4 bg-blue-500/10 border border-blue-200 dark:border-blue-900/30 shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <ListTodo className="h-12 w-12 text-blue-500" />
                      </div>
                      <div className="relative">
                        <p className="text-sm text-muted-foreground">Active Tasks</p>
                        <h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                          {mockAssignedTasks.filter(t => t.status !== "Completed").length}
                        </h3>
                        <div className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                          +2 this week
                        </div>
                      </div>
                    </motion.div>

                    {/* Projects Tile */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden rounded-xl p-4 bg-purple-500/10 border border-purple-200 dark:border-purple-900/30 shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Folder className="h-12 w-12 text-purple-500" />
                      </div>
                      <div className="relative">
                        <p className="text-sm text-muted-foreground">Projects</p>
                        <h3 className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                          {mockMemberProjects.length}
                        </h3>
                        <div className="mt-2 inline-flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                          Active
                        </div>
                      </div>
                    </motion.div>

                    {/* Completed Tile */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden rounded-xl p-4 bg-green-500/10 border border-green-200 dark:border-green-900/30 shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      </div>
                      <div className="relative">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <h3 className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                          {mockAssignedTasks.filter(t => t.status === "Completed").length}
                        </h3>
                        <div className="mt-2 inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                          +5 this week
                        </div>
                      </div>
                    </motion.div>

                    {/* Overdue Tile */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="relative overflow-hidden rounded-xl p-4 bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Clock className="h-12 w-12 text-amber-500" />
                      </div>
                      <div className="relative">
                        <p className="text-sm text-muted-foreground">Overdue</p>
                        <h3 className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                          {mockAssignedTasks.filter(t => t.status === "Overdue").length}
                        </h3>
                        <div className="mt-2 inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                          -1 this week
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <NotificationsPanel notifications={mockNotifications} />
            </motion.div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-span-1"
            >
              <UpcomingDeadlines deadlines={mockUpcomingDeadlines} />
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="col-span-1 md:col-span-2"
            >
              <ActivityTimeline activities={mockActivities} />
            </motion.div>
          </div>

          {/* Third row - Improved with better spacing and hover effects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary" />
                      Recent Tasks
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ChevronRight size={16} />
                      <span className="text-sm">View All</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {mockAssignedTasks.slice(0, 5).map((task, index) => (
                      <motion.div 
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 * index }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 rounded-full p-1 ${
                              task.status === "Completed" ? "bg-green-100 text-green-600" : 
                              task.status === "Overdue" ? "bg-red-100 text-red-600" : 
                              "bg-blue-100 text-blue-600"
                            }`}>
                              {task.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : 
                               task.status === "Overdue" ? <AlertCircle className="h-4 w-4" /> : 
                               <Clock className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <span>{task.projectName}</span>
                                <span>•</span>
                                <span>Due {task.dueDate}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            task.priority === "High" ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30" :
                            task.priority === "Medium" ? "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30" :
                            "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30"
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      Recent Projects
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ChevronRight size={16} />
                      <span className="text-sm">View All</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {mockMemberProjects.slice(0, 3).map((project, index) => (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 * index }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            project.color || 'bg-primary/10'
                          }`}>
                            <Folder className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{project.name}</h4>
                              <Badge variant={project.status === "Active" ? "default" : "outline"}>
                                {project.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                              <span>{project.dueDate}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-1.5" />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex -space-x-2">
                                {project.team && project.team.slice(0, 3).map((member, i) => (
                                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {project.team && project.team.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                    +{project.team.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Fourth row - New Weekly Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="pb-3 bg-muted/50">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="h-[200px] w-full">
                      {/* This would be a chart in a real implementation */}
                      <div className="h-full w-full bg-gradient-to-r from-primary/5 to-primary/20 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Task completion chart would go here</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">This Week's Highlights</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Productivity up 12%</p>
                          <p className="text-xs text-muted-foreground">Compared to last week</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">5 tasks completed</p>
                          <p className="text-xs text-muted-foreground">2 more than average</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">On-time delivery: 95%</p>
                          <p className="text-xs text-muted-foreground">3% improvement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6 mt-6">
          <Tabs defaultValue="assigned">
            <TabsList>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              <TabsTrigger value="created">Created by Me</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Tasks Assigned to Me</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <PlusCircle size={16} />
                        <span>New Task</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Manage and track all tasks assigned to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={mockAssignedTasks} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="created" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Tasks Created by Me</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <PlusCircle size={16} />
                        <span>New Task</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    View and manage all tasks you've created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={mockCreatedTasks} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6 mt-6">
          <Tabs defaultValue="member">
            <TabsList>
              <TabsTrigger value="member">Member Of</TabsTrigger>
              <TabsTrigger value="owned">Created by Me</TabsTrigger>
            </TabsList>
            <TabsContent value="member" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Projects I'm a Member Of</CardTitle>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter size={16} />
                      <span>Filter</span>
                    </Button>
                  </div>
                  <CardDescription>
                    Projects where you are a team member or collaborator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectGrid projects={mockMemberProjects} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="owned" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Projects Created by Me</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                      <Button size="sm" className="gap-1">
                        <FolderPlus size={16} />
                        <span>New Project</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Projects you've created and own
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectGrid projects={mockOwnedProjects} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Track your productivity and task completion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics data={mockPerformanceData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}

// Quick Stat Card Component
function QuickStatCard({ icon, title, value, trend, trendUp, bgColor = "bg-muted" }) {
  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
      <CardContent className="p-0">
        <div className={`p-4 ${bgColor} group-hover:saturate-150 transition-all`}>
          <div className="flex justify-between items-start">
            <div className="rounded-full p-2 bg-white/80 dark:bg-black/20 shadow-sm">{icon}</div>
            {trend && (
              <Badge variant="outline" className={`
                ${trendUp === true ? "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30" : 
                  trendUp === false ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30" : 
                  "bg-gray-50 dark:bg-gray-900"}
              `}>
                {trend}
              </Badge>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1 group-hover:scale-105 transition-transform">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}