"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Folder,
  ListTodo,
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

import TaskList from "@/components/my-page/task-list";
import ProjectGrid from "@/components/my-page/project-grid";
import ActivityTimeline from "@/components/my-page/activity-timeline";
import NotificationsPanel from "@/components/my-page/notifications-panel";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import UserAvatar from "@/components/tasks/user-avatar";

// Dashboard and profile data will be fetched from API
import { getTasks } from "@/services/taskService"
import { getProjects } from "@/services/projectService"
import { getCurrentUser } from "@/services/authService"
import {
  getUserDashboardActivities,
  getUserDashboardNotifications
} from "@/services/dashboardService"
import { MyPageLoading } from "@/components/my-page/my-page-loading"

export default function MyPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // State for data
  const [profileData, setProfileData] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [memberProjects, setMemberProjects] = useState([]);
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();

        // Fetch all tasks and projects, then filter on frontend
        const [
          tasks,
          projects,
          activities,
          notifications
        ] = await Promise.all([
          getTasks(),
          getProjects(),
          getUserDashboardActivities().catch(() => []),
          getUserDashboardNotifications().catch(() => [])
        ]);

        // Set profile data
        setProfileData({
          personal: {
            name: currentUser.name,
            email: currentUser.email,
            // Add other profile fields as needed
          },
          professional: {
            role: currentUser.role,
            department: currentUser.department || 'Unknown'
          }
        });

        // Filter tasks by current user
        const userTasks = tasks.filter(task => task.assignedTo?._id === currentUser._id);
        const userCreatedTasks = tasks.filter(task => task.createdBy === currentUser._id);

        setAssignedTasks(userTasks);
        setCreatedTasks(userCreatedTasks);

        // Filter projects by current user
        const userProjects = projects.filter(project =>
          project.team?.some(member => member.id === currentUser._id)
        );
        const userOwnedProjects = projects.filter(project => project.createdBy === currentUser._id);

        setMemberProjects(userProjects);
        setOwnedProjects(userOwnedProjects);

        // Set dashboard data
        setActivities(activities);
        setNotifications(notifications);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <MyPageLoading />;
  }

  if (!profileData) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Failed to load profile data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <UserAvatar user={profileData.personal} size="xl" />
            <div>
              <h1 className="text-2xl font-bold">{profileData.personal.name}</h1>
              <p className="text-muted-foreground">{profileData.professional.role} • {profileData.professional.department}</p>
              <p className="text-sm text-muted-foreground">{profileData.personal.email}</p>
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
          <TabsList className="grid grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
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
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back, {profileData.personal.name.split(' ')[0]}</h2>
                  <p className="text-muted-foreground">Here's what's happening with your projects today.</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span>{assignedTasks.filter(t => t.status === "Completed").length} tasks completed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                      <span>{assignedTasks.filter(t => t.status === "In Progress").length} in progress</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      <span>{assignedTasks.filter(t => t.status === "Overdue").length} overdue</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-1.5 h-9 px-4">
                    <Calendar size={16} />
                    <span>View Calendar</span>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Notifications and Activity Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Notifications Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="col-span-1"
              >
                <NotificationsPanel notifications={notifications} />
              </motion.div>

              {/* Activity Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="col-span-1 md:col-span-2"
              >
                <ActivityTimeline activities={activities} />
              </motion.div>
            </div>

            {/* Second row - Recent tasks and projects */}
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
                      {createdTasks.slice(0, 5).map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 * index }}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 rounded-full p-1 ${task.status === "Completed" ? "bg-green-100 text-green-600" :
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
                      {ownedProjects.slice(0, 3).map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 * index }}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${project.color || 'bg-primary/10'
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
                                    <UserAvatar key={i} user={member} size="sm" />
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


          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6 mt-6">
            <Tabs defaultValue="created">
              <TabsList>
                <TabsTrigger value="created">Created by Me</TabsTrigger>
                <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              </TabsList>
              <TabsContent value="created" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Tasks Created by Me</CardTitle>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                    </div>
                    <CardDescription>
                      View and manage all tasks you've created
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={createdTasks} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="assigned" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Tasks Assigned to Me</CardTitle>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                    </div>
                    <CardDescription>
                      Manage and track all tasks assigned to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={assignedTasks} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6 mt-6">
            <Tabs defaultValue="owned">
              <TabsList>
                <TabsTrigger value="owned">Created by Me</TabsTrigger>
                <TabsTrigger value="member">Member Of</TabsTrigger>
              </TabsList>
              <TabsContent value="owned" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Projects Created by Me</CardTitle>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter size={16} />
                        <span>Filter</span>
                      </Button>
                    </div>
                    <CardDescription>
                      Projects you've created and own
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProjectGrid projects={ownedProjects} />
                  </CardContent>
                </Card>
              </TabsContent>
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
                    <ProjectGrid projects={memberProjects} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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