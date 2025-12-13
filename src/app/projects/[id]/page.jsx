"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { Plus, ChevronRight, LayoutGrid, ListFilter, Users, FileText, Clock, BarChart3, GripVertical, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

// Import our new components
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectDocuments } from "@/components/projects/project-documents"
import { ProjectTimeline } from "@/components/projects/project-timeline"
import { AddTaskModal } from "@/components/projects/add-task-modal"
import { AddMemberModal } from "@/components/projects/add-member-modal"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import UserAvatar from "@/components/tasks/user-avatar"
import { getProjectById, exportProjectData, addProjectMember, uploadProjectDocument } from "@/services/projectService"
import { TaskStatusOverview } from "@/components/projects/task-status-overview"
import { getTasks, createTask, deleteTask } from "@/services/taskService"

export default function ProjectPage({ params }) {
  const { id } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [exporting, setExporting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Add useEffect to fetch project data
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        if (data) {
          // The backend uses _id, but frontend components might expect id.
          const adaptedData = { ...data, id: data._id };
          setProject(adaptedData);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Fetch tasks for this project
  useEffect(() => {
    if (!id) return;
    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        console.log('Fetching tasks for project ID:', id);
        const data = await getTasks({ projectId: id });
        console.log('Received tasks data:', data);
        // Ensure tasks have the correct structure for display
        const formattedTasks = (data.data || data).map(task => ({
          ...task,
          id: task._id || task.id,
          customId: task.customId || `TASK-${(task._id || task.id)?.substring(0, 6)}`
        }));
        console.log('Formatted tasks:', formattedTasks);
        setTasks(formattedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, [id]);

  // Handlers for actions
  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  // Export handler
  const handleExport = async (format) => {
    if (!project) return;
    setExporting(true);
    try {
      await exportProjectData(project.id, format);
      // Optionally show a toast/alert for success
      alert(`Exported project "${project.name}" as ${format.toUpperCase()}`);
    } catch (err) {
      alert(`Failed to export project: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  // Create task using new backend
  const handleCreateTask = async (taskData) => {
    if (!project) return;
    try {
      const newTask = await createTask({ ...taskData, projectId: project.id });
      // Ensure the task has the correct structure for display
      const formattedTask = {
        ...newTask,
        id: newTask._id || newTask.id,
        customId: newTask.customId || `TASK-${(newTask._id || newTask.id)?.substring(0, 6)}`,
        assignee: newTask.assignee || 'Unassigned'
      };
      setTasks(prev => [...prev, formattedTask]);
      setShowAddTaskModal(false);
    } catch (err) {
      alert("Failed to create task: " + err.message);
    }
  };

  // Add member handler
  const handleAddMemberToProject = async (members) => {
    if (!project) return;
    try {
      const addedMembers = [];
      for (const member of members) {
        const added = await addProjectMember(project.id, member);
        addedMembers.push(added);
      }
      setProject(prev => ({
        ...prev,
        team: [...(prev.team || []), ...addedMembers],
      }));
      setShowAddMemberModal(false);
    } catch (err) {
      alert("Failed to add member: " + err.message);
    }
  };

  // Upload document handler
  const handleUploadDocument = async (file, options) => {
    if (!project) return;
    const uploadedDoc = await uploadProjectDocument(project.id, file, options)
    setProject(prev => ({
      ...prev,
      documents: [...(prev.documents || []), uploadedDoc],
    }))
  }

  // Delete task using new backend
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId && t.id !== taskId));
    } catch (err) {
      alert("Failed to delete task: " + err.message);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-8 space-y-8 bg-background/50 min-h-screen">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] rounded-2xl col-span-2" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-screen bg-background/50">
          <div className="text-center space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full inline-flex">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{error}</h3>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-screen">
          <p className="text-lg text-muted-foreground">Project not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-background/50">
        {/* Enhanced Breadcrumb */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="px-6 py-3 max-w-[1600px] mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 h-auto rounded-lg transition-colors" onClick={() => window.location.href = '/projects'}>
                  <Home className="h-4 w-4 mr-1.5" />
                  Projects
                </Button>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                <span className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50 text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {project.name || project.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${project.status === "Completed" ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20" :
                    project.status === "In Progress" ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20" :
                      project.status === "On Hold" ? "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20" :
                        project.status === "Pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-500/20" :
                          "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/20"
                  }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${project.status === "Completed" ? "bg-green-500" :
                      project.status === "In Progress" ? "bg-blue-500" :
                        project.status === "On Hold" ? "bg-orange-500" :
                          project.status === "Pending" ? "bg-yellow-500" : "bg-gray-400"
                    }`} />
                  {project.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 space-y-8">
          {/* Enhanced Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl overflow-hidden border border-border/50 shadow-xl bg-card/40 backdrop-blur-sm"
          >
            <ProjectHeader
              project={project}
              onAddTask={handleAddTask}
              onAddMember={handleAddMember}
              onExport={handleExport}
            />
          </motion.div>

          {/* Modern Project Navigation */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="sticky top-[60px] z-20 bg-background/95 backdrop-blur-xl py-2 -mx-6 px-6 border-b border-border/50 shadow-sm">
                <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-border/50 w-full sm:w-auto inline-flex h-auto">
                  {[
                    { id: "overview", icon: LayoutGrid, label: "Overview" },
                    { id: "tasks", icon: ListFilter, label: "Tasks" },
                    { id: "team", icon: Users, label: "Team" },
                    { id: "documents", icon: FileText, label: "Documents" },
                    { id: "timeline", icon: Clock, label: "Timeline" }
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="px-5 py-2.5 text-sm font-medium rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Enhanced Tab Content */}
              <div className="mt-6 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                      {project && <ProjectOverview project={project} />}
                    </TabsContent>
                    <TabsContent value="tasks" className="mt-0 focus-visible:outline-none">
                      {project && <ProjectTasks tasks={tasks} team={project.team} onAddTask={handleCreateTask} onDeleteTask={handleDeleteTask} />}
                    </TabsContent>
                    <TabsContent value="team" className="mt-0 focus-visible:outline-none">
                      {project && <ProjectTeam team={project.team} onAddMember={handleAddMember} />}
                    </TabsContent>
                    <TabsContent value="documents" className="mt-0 focus-visible:outline-none">
                      {project && <ProjectDocuments documents={project.documents} onUpload={handleUploadDocument} />}
                    </TabsContent>
                    <TabsContent value="timeline" className="mt-0 focus-visible:outline-none">
                      {project && <ProjectTimeline timeline={project.timeline} />}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Enhanced Floating Action Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTask}
                className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl shadow-primary/30 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center z-40 border-4 border-background/20 backdrop-blur-sm"
              >
                <Plus className="h-8 w-8" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left" className="mr-2">
              <p className="font-semibold">Add New Task</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Modals */}
        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          project={project}
          onAddTask={handleCreateTask}
        />

        <AddMemberModal
          open={showAddMemberModal}
          onOpenChange={setShowAddMemberModal}
          projectId={project?.id}
          onAddMember={handleAddMemberToProject}
        />
      </div>
    </DashboardLayout>
  )
}
