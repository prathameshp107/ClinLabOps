"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { Plus, ChevronRight, LayoutGrid, ListFilter, Users, FileText, Clock, BarChart3, GripVertical } from "lucide-react"
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
        const data = await getTasks({ projectId: id });
        setTasks(data);
      } catch (err) {
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
      setTasks(prev => [...prev, newTask]);
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
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-20 w-full rounded" />
          <Skeleton className="h-8 w-2/3 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[200px] rounded col-span-2" />
            <Skeleton className="h-[200px] rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    // This case might be redundant if error is always set, but it's good practice.
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">Project not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/90">
        {/* Enhanced Breadcrumb */}
        <div className="px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-0 h-auto font-normal">
                Projects
              </Button>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <span className="font-semibold text-foreground">{project.name || project.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${project.status === "Completed" ? "bg-green-500" :
                project.status === "In Progress" ? "bg-blue-500" :
                  project.status === "On Hold" ? "bg-orange-500" :
                    project.status === "Pending" ? "bg-yellow-500" : "bg-gray-400"
                }`} />
              <span className="text-sm text-muted-foreground">{project.status}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Project Header */}
        <div className="bg-background/60 backdrop-blur-sm border-b border-border/30">
          <div className="px-6 py-6">
            <ProjectHeader
              project={project}
              onAddTask={handleAddTask}
              onAddMember={handleAddMember}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Modern Project Navigation */}
        <div className="bg-background/80 backdrop-blur-sm border-b border-border/30 sticky top-0 z-10">
          <div className="px-6">
            <div className="flex items-center justify-between py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50">
                    <TabsTrigger
                      value="overview"
                      className="px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="tasks"
                      className="px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                    >
                      <ListFilter className="h-4 w-4 mr-2" />
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="team"
                      className="px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Team
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger
                      value="timeline"
                      className="px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Enhanced Tab Content */}
                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="overview" className="mt-0">
                        {project && <ProjectOverview project={project} />}
                      </TabsContent>
                      <TabsContent value="tasks" className="mt-0">
                        {project && <ProjectTasks tasks={tasks} team={project.team} onAddTask={handleCreateTask} onDeleteTask={handleDeleteTask} />}
                      </TabsContent>
                      <TabsContent value="team" className="mt-0">
                        {project && <ProjectTeam team={project.team} onAddMember={handleAddMember} />}
                      </TabsContent>
                      <TabsContent value="documents" className="mt-0">
                        {project && <ProjectDocuments documents={project.documents} onUpload={handleUploadDocument} />}
                      </TabsContent>
                      <TabsContent value="timeline" className="mt-0">
                        {project && <ProjectTimeline timeline={project.timeline} />}
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Action Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAddTask}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add new task</p>
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
