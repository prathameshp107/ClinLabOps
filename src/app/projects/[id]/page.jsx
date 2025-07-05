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
import { getProjectById } from "@/services/projectService"
import { TaskStatusOverview } from "@/components/projects/task-status-overview"

export default function ProjectPage({ params }) {
  const { id } = params;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

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

  // Handlers for actions
  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

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
      <div className="flex flex-col min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Projects</span>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="font-medium text-gray-900">{project.name ? project.name : project.title}</span>
            </div>
          </div>
        </div>

        {/* Project Header */}
        <div className="border-b border-gray-200">
          <div className="px-6">
            <ProjectHeader
              project={project}
              onAddTask={handleAddTask}
              onAddMember={handleAddMember}
            />
          </div>
        </div>

        {/* Project Navigation */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="px-6">
            <div className="flex items-center justify-between py-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-gray-50 p-1 rounded-md">
                    <TabsTrigger
                      value="overview"
                      className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="tasks"
                      className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <ListFilter className="h-4 w-4 mr-2" />
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="team"
                      className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Team
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger
                      value="timeline"
                      className="px-3 py-1.5 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>

                  {/* View Toggle */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="h-8 w-8 p-0"
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Grid View</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="h-8 w-8 p-0"
                          >
                            <GripVertical className="h-4 w-4 rotate-90" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>List View</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                  <TabsContent value="overview" className="mt-0">
                    {project && <ProjectOverview project={project} />}
                  </TabsContent>
                  <TabsContent value="tasks" className="mt-0">
                    {project && <ProjectTasks tasks={project.tasks} team={project.team} onAddTask={handleAddTask} />}
                  </TabsContent>
                  <TabsContent value="team" className="mt-0">
                    {project && <ProjectTeam team={project.team} onAddMember={handleAddMember} />}
                  </TabsContent>
                  <TabsContent value="documents" className="mt-0">
                    {project && <ProjectDocuments documents={project.documents} />}
                  </TabsContent>
                  <TabsContent value="timeline" className="mt-0">
                    {project && <ProjectTimeline timeline={project.timeline} />}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddTask}
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-md"
        >
          <Plus className="h-5 w-5" />
        </Button>

        {/* Modals */}
        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          projectId={project?.id}
        />

        <AddMemberModal
          open={showAddMemberModal}
          onOpenChange={setShowAddMemberModal}
          projectId={project?.id}
        />
      </div>
    </DashboardLayout>
  )
}
