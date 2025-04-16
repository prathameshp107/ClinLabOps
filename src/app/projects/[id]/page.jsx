"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, ChevronRight, LayoutGrid, ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

// Import our components
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectDocuments } from "@/components/projects/project-documents"
import { ProjectTimeline } from "@/components/projects/project-timeline"
import { AddTaskModal } from "@/components/projects/add-task-modal"
import { AddMemberModal } from "@/components/projects/add-member-modal"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"


export default function ProjectPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Fetch project data from API
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        // Get the authentication token from localStorage
        const token = localStorage.getItem('authToken');

        // If token doesn't exist, redirect to login
        if (!token) {
          router.push('/login?redirect=' + encodeURIComponent(`/projects/${id}`));
          return;
        }

        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('Project not found');
          } else if (response.status === 403) {
            throw new Error('Not authorized to access this project');
          } else {
            throw new Error('Failed to fetch project');
          }
        }

        const data = await response.json();
        setProject(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Handlers for actions
  const handleAddTask = async (taskData) => {
    try {
      // Get the authentication token
      const token = localStorage.getItem('authToken');

      // If token doesn't exist, redirect to login
      if (!token) {
        router.push('/login?redirect=' + encodeURIComponent(`/projects/${id}`));
        return;
      }

      // Implement API call to add task
      const taskResponse = await fetch(`http://localhost:5000/api/projects/${id}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (!taskResponse.ok) {
        throw new Error('Failed to add task');
      }

      // After successful API call, refresh project data
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const updatedProject = await response.json();
      setProject(updatedProject);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      // Get the authentication token
      const token = localStorage.getItem('authToken');

      // If token doesn't exist, redirect to login
      if (!token) {
        router.push('/login?redirect=' + encodeURIComponent(`/projects/${id}`));
        return;
      }

      // Rest of the add member logic
      // ...

      // Implement API call to add team member
      const response = await fetch(`http://localhost:5000/api/projects/${id}/team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: memberData.userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add team member');
      }

      // Refresh project data
      const projectResponse = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const updatedProject = await projectResponse.json();
      setProject(updatedProject);
      setShowAddMemberModal(false);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  // If there's an error, show error message
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md border-destructive/50">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/projects')}
              >
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen bg-gradient-to-br from-background to-background/80">
        {loading ? (
          <div className="flex-1 p-6 space-y-6">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/2 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Skeleton className="h-[250px] rounded-xl" />
              <Skeleton className="h-[250px] rounded-xl" />
              <Skeleton className="h-[250px] rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Project Header with glass effect */}
            <div className="bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-10 px-6 py-4">
              <ProjectHeader
                project={project}
                onAddTask={() => setShowAddTaskModal(true)}
                onAddMember={() => setShowAddMemberModal(true)}
              />

              {/* Breadcrumb navigation */}
              <div className="flex items-center text-sm text-muted-foreground mt-2">
                <span className="cursor-pointer hover:text-foreground" onClick={() => router.push('/projects')}>Projects</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="font-medium text-foreground">{project.title}</span>
              </div>
            </div>

            {/* Project Tabs with modern styling */}
            <div className="px-6 pt-4 bg-background/60">
              <div className="flex justify-between items-center">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-muted/50 p-1 rounded-lg">
                      <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                      <TabsTrigger value="tasks" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Tasks</TabsTrigger>
                      <TabsTrigger value="team" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Team</TabsTrigger>
                      <TabsTrigger value="documents" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Documents</TabsTrigger>
                      <TabsTrigger value="timeline" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Timeline</TabsTrigger>
                    </TabsList>

                    {/* View toggle buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("list")}
                      >
                        <ListFilter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content area with improved styling */}
                  <div className="overflow-auto pb-6 h-[calc(100vh-220px)]">
                    <TabsContent value="overview" className="mt-0 space-y-4">
                      <ProjectOverview project={project} viewMode={viewMode} />
                    </TabsContent>

                    <TabsContent value="tasks" className="mt-0 space-y-4">
                      <ProjectTasks
                        tasks={project.tasks || []}
                        team={project.teamMembers || []}
                        onAddTask={() => setShowAddTaskModal(true)}
                        viewMode={viewMode}
                      />
                    </TabsContent>

                    <TabsContent value="team" className="mt-0 space-y-4">
                      <ProjectTeam
                        team={project.teamMembers || []}
                        onAddMember={() => setShowAddMemberModal(true)}
                        viewMode={viewMode}
                      />
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0 space-y-4">
                      <ProjectDocuments documents={project.attachments || []} viewMode={viewMode} />
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-0 space-y-4">
                      <ProjectTimeline
                        timeline={project.timeline || []}
                        milestones={project.milestones || []}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* Modals */}
            <AddTaskModal
              open={showAddTaskModal}
              onOpenChange={setShowAddTaskModal}
              project={project}
              onAddTask={handleAddTask}
            />

            <AddMemberModal
              open={showAddMemberModal}
              onOpenChange={setShowAddMemberModal}
              onAddMember={handleAddMember}
            />

            {/* Floating Action Button with animation */}
            <div className="fixed bottom-6 right-6 z-50">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-background/80 backdrop-blur-sm border border-border/40">
                    <p>Quick Actions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
