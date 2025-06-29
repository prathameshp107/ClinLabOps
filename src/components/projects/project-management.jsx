"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  PlusCircle, SearchIcon, FilterIcon, Grid3X3, List,
  FolderPlus, ClipboardEdit, Trash2, MoreHorizontal, ArrowDownUp, Star,
  Users, Clock,
  Card, CardContent, CardHeader, CardTitle,
  Avatar, AvatarFallback, AvatarImage,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ProjectTable } from "./project-table"
import { ProjectCardView } from "./project-card-view"
import { AddProjectDialog } from "./add-project-dialog"
import { EditProjectDialog } from "./edit-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { ProjectDetailsDialog } from "./project-details-dialog"
import { ProjectShareDialog } from "./project-share-dialog"
import { ActivityLogDialog } from "./activity-log-dialog"
import { ProjectDependencies } from "./project-dependencies"
import { ProjectStatusTracking } from "./project-status-tracking"
import { ProjectGanttChart } from "./project-gantt-chart"
import { mockProjects, mockUsers } from "@/data/projects-data"

export function ProjectManagement() {
  // Initialize projects state with data from localStorage or default mock data
  const [projects, setProjects] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        return JSON.parse(savedProjects);
      }
    }
    return mockProjects;
  });

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeTab, setActiveTab] = useState("all"); // "all" or "favorites"
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeView, setActiveView] = useState("projects"); // "projects", "status", "gantt", "dependencies"

  // Dialog states
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [showProjectDetailsDialog, setShowProjectDetailsDialog] = useState(false);
  const [showShareProjectDialog, setShowShareProjectDialog] = useState(false);
  const [showActivityLogDialog, setShowActivityLogDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(mockUsers.u1); // Use centralized mock user

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Apply filters, search, and favorites tab when they change
  useEffect(() => {
    let filtered = [...projects];

    // Apply favorites filter if on favorites tab
    if (activeTab === "favorites") {
      filtered = filtered.filter(project => project.isFavorite);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    // Apply timeframe filter
    const now = new Date();
    if (timeframeFilter === "active") {
      filtered = filtered.filter(
        project => new Date(project.startDate) <= now && new Date(project.endDate) >= now
      );
    } else if (timeframeFilter === "upcoming") {
      filtered = filtered.filter(project => new Date(project.startDate) > now);
    } else if (timeframeFilter === "past") {
      filtered = filtered.filter(project => new Date(project.endDate) < now);
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, priorityFilter, timeframeFilter, activeTab]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Apply sorting
    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (a[key] < b[key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredProjects(sortedProjects);
  };

  const handleProjectAction = (action, project) => {
    setSelectedProject(project);

    switch (action) {
      case "view":
        // Navigate to the project details page instead of opening a modal
        window.location.href = `/projects/${project.id}`;
        break;
      case "edit":
        // Redirect to the dedicated edit page
        window.location.href = `/projects/edit/${project.id}`;
        break;
      case "delete":
        setShowDeleteProjectDialog(true);
        break;
      case "toggleFavorite":
        toggleProjectFavorite(project.id);
        break;
      case "share":
        setShowShareProjectDialog(true);
        break;
      case "viewActivity":
        setShowActivityLogDialog(true);
        break;
      default:
        break;
    }
  }

  const toggleProjectFavorite = (projectId) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? {
          ...project,
          isFavorite: !project.isFavorite,
          activityLog: [
            ...project.activityLog || [],
            {
              id: `a${Date.now()}`,
              userId: currentUser.id,
              action: !project.isFavorite ? "marked_favorite" : "unmarked_favorite",
              timestamp: new Date().toISOString(),
              details: !project.isFavorite ? "Marked as favorite" : "Removed from favorites"
            }
          ]
        }
        : project
    );

    setProjects(updatedProjects);
  }

  const handleAddProject = (newProject) => {
    // Clean up description if it contains HTML tags
    const cleanedProject = {
      ...newProject,
      description: newProject.description?.replace(/<\/?[^>]+(>|$)/g, "") || ""
    };

    // Add the new project to the projects array
    const updatedProjects = [...projects, cleanedProject];

    // Update state with the new projects array
    setProjects(updatedProjects);

    // Close the dialog
    setShowAddProjectDialog(false);

    // Show a success message or notification (you can implement this later)
    console.log("Project added successfully:", cleanedProject);
  }

  const handleEditProject = (editedProject) => {
    const updatedProjects = projects.map(project =>
      project.id === editedProject.id
        ? {
          ...editedProject,
          activityLog: [
            ...project.activityLog || [],
            {
              id: `a${Date.now()}`,
              userId: currentUser.id,
              action: "updated",
              timestamp: new Date().toISOString(),
              details: "Project updated"
            }
          ]
        }
        : project
    );

    setProjects(updatedProjects);
  }

  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  }

  const handleShareProject = (projectId, invitedUsers) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const newTeamMembers = invitedUsers.map(user => ({
          id: user.id,
          name: user.name,
          role: user.projectRole.charAt(0).toUpperCase() + user.projectRole.slice(1),
          email: user.email
        }));

        // Add new activity log entries
        const newActivityLogs = invitedUsers.map(user => ({
          id: `a${Date.now()}-${user.id}`,
          userId: currentUser.id,
          action: "added_member",
          timestamp: new Date().toISOString(),
          details: `Added ${user.name} as ${user.projectRole}`
        }));

        return {
          ...project,
          team: [...(project.team || []), ...newTeamMembers],
          activityLog: [...(project.activityLog || []), ...newActivityLogs]
        };
      }
      return project;
    });

    setProjects(updatedProjects);
  }

  // Update project dependencies
  const handleUpdateProjectDependencies = (dependencies) => {
    // In a real app, you would update this via an API
    // For now, we'll just update the local state
    console.log("Updated dependencies:", dependencies);

    // For demo purposes, we'll update the first project
    const updatedProjects = projects.map(p => {
      if (p.id === "p1") {
        return { ...p, dependencies };
      }
      return p;
    });

    setProjects(updatedProjects);
  };

  // Update project status
  const handleUpdateProjectStatus = (projectId, newStatus) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        // Add a new activity log entry for status change
        const newActivityLog = [
          ...(p.activityLog || []),
          {
            id: `a${Date.now()}`,
            userId: currentUser.id,
            action: "updated_status",
            timestamp: new Date().toISOString(),
            details: `Updated status from ${p.status} to ${newStatus}`
          }
        ];

        return {
          ...p,
          status: newStatus,
          // If completed, set progress to 100%
          progress: newStatus === "Completed" ? 100 : p.progress,
          activityLog: newActivityLog
        };
      }
      return p;
    });

    setProjects(updatedProjects);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <Button onClick={() => setShowAddProjectDialog(true)} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* View Selector Tabs */}
      <div className="border-b">
        <Tabs
          value={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="bg-transparent w-full justify-start border-b-0 h-auto pb-0">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
            >
              Status Tracking
            </TabsTrigger>
            <TabsTrigger
              value="gantt"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
            >
              Gantt Chart
            </TabsTrigger>
            <TabsTrigger
              value="dependencies"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
            >
              Dependencies
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      {activeView === "projects" && (
        <>
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects Display */}
          <ProjectDisplay
            projects={filteredProjects}
            viewMode={viewMode}
            handleProjectAction={handleProjectAction}
            sortConfig={sortConfig}
            requestSort={requestSort}
          />
        </>
      )}

      {activeView === "status" && (
        <ProjectStatusTracking
          projects={projects}
          onUpdateProjectStatus={handleUpdateProjectStatus}
        />
      )}

      {activeView === "gantt" && (
        <ProjectGanttChart
          projects={projects}
          dependencies={projects.reduce((acc, project) => {
            if (project.dependencies) {
              return [...acc, ...project.dependencies];
            }
            return acc;
          }, [])}
        />
      )}

      {activeView === "dependencies" && (
        <ProjectDependencies
          projects={projects}
          onUpdateProjectDependencies={handleUpdateProjectDependencies}
        />
      )}

      {/* Dialogs */}
      <AddProjectDialog
        open={showAddProjectDialog}
        onOpenChange={setShowAddProjectDialog}
        onSubmit={handleAddProject}
      />

      <DeleteProjectDialog
        open={showDeleteProjectDialog}
        onOpenChange={setShowDeleteProjectDialog}
        project={selectedProject}
        onDelete={handleDeleteProject}
      />

      <ProjectDetailsDialog
        open={showProjectDetailsDialog}
        onOpenChange={setShowProjectDetailsDialog}
        project={selectedProject}
        onAction={handleProjectAction}
      />

      <ProjectShareDialog
        open={showShareProjectDialog}
        onOpenChange={setShowShareProjectDialog}
        project={selectedProject}
        onShare={handleShareProject}
      />

      <ActivityLogDialog
        open={showActivityLogDialog}
        onOpenChange={setShowActivityLogDialog}
        project={selectedProject}
        users={mockUsers}
      />
    </div>
  );
}

// ProjectDisplay component to avoid duplicate code
function ProjectDisplay({ projects, viewMode, handleProjectAction, sortConfig, requestSort }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FilterIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: "easeInOut" }
        }
      }}
      key={viewMode} // This will trigger animation when view mode changes
    >
      {viewMode === "grid" ? (
        <ProjectCardView
          projects={projects}
          onAction={handleProjectAction}
        />
      ) : (
        <ProjectTable
          projects={projects}
          onAction={handleProjectAction}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
      )}
    </motion.div>
  );
}
