"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  PlusCircle, SearchIcon, FilterIcon, Grid3X3, List, LayoutGrid,
  FolderPlus, ClipboardEdit, Trash2, MoreHorizontal, ArrowDownUp, Star,
  Users, Clock, FlaskConical, FileText, Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ProjectTable } from "./project-table"
import { ProjectCardView } from "./project-card-view"
import { CategorizedProjects, getProjectCategory } from "./categorized-projects"
import { AddProjectDialog } from "./add-project-dialog"
import { EditProjectDialog } from "./edit-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { ProjectDetailsDialog } from "./project-details-dialog"
import { ProjectShareDialog } from "./project-share-dialog"
import { ActivityLogDialog } from "./activity-log-dialog"
import { ProjectDependencies } from "./project-dependencies"
import { ProjectStatusTracking } from "./project-status-tracking"
import { ProjectGanttChart } from "./project-gantt-chart"
import { getUsers } from "@/services/userService"
import { getCurrentUser } from "@/services/authService"
import { getProjects, createProject, updateProject, deleteProject } from "@/services/projectService"
import { createActivity } from "@/services/activityService"
import { getSettings } from "@/services/settingsService"
import { ProjectsLoading } from "@/components/projects/projects-loading"
import { ErrorState } from "@/components/ui/error-state"

// Icon mapping
const ICON_COMPONENTS = {
  FlaskConical,
  FileText,
  Layers,
  FolderPlus,
  ClipboardEdit
}

export function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeTab, setActiveTab] = useState("all"); // "all" or "favorites"
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeView, setActiveView] = useState("projects"); // "projects", "status", "gantt", "dependencies"
  const [activeCategory, setActiveCategory] = useState("all"); // "all", "research", "regulatory", "miscellaneous"
  const [projectCategories, setProjectCategories] = useState([]);

  // Load project categories from settings
  useEffect(() => {
    const loadProjectCategories = async () => {
      try {
        const settings = await getSettings();
        if (settings.project?.categories && settings.project.categories.length > 0) {
          setProjectCategories(settings.project.categories);
        } else {
          // Fallback to default categories
          setProjectCategories([
            {
              id: "research",
              name: "Research",
              description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
              icon: "FlaskConical",
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
              borderColor: "border-blue-500/20",
              keywords: ["research", "exploratory", "proof-of-concept", "scientific", "study", "experiment", "innovation", "discovery", "laboratory", "genomics", "drug-discovery", "ai", "machine-learning"]
            },
            {
              id: "regulatory",
              name: "Regulatory",
              description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
              icon: "FileText",
              color: "text-amber-500",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/20",
              keywords: ["regulatory", "iso", "oecd", "fda", "guideline", "compliance", "authority", "submission", "validation", "testing", "environmental", "monitoring", "biomedical", "device-testing", "safety"]
            },
            {
              id: "miscellaneous",
              name: "Miscellaneous",
              description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
              icon: "Layers",
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
              borderColor: "border-purple-500/20",
              keywords: ["pilot", "academic", "client", "miscellaneous", "other", "general", "management", "platform", "system"]
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading project categories:', error);
        // Fallback to default categories on error
        setProjectCategories([
          {
            id: "research",
            name: "Research",
            description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
            icon: "FlaskConical",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            keywords: ["research", "exploratory", "proof-of-concept", "scientific", "study", "experiment", "innovation", "discovery", "laboratory", "genomics", "drug-discovery", "ai", "machine-learning"]
          },
          {
            id: "regulatory",
            name: "Regulatory",
            description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
            icon: "FileText",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            keywords: ["regulatory", "iso", "oecd", "fda", "guideline", "compliance", "authority", "submission", "validation", "testing", "environmental", "monitoring", "biomedical", "device-testing", "safety"]
          },
          {
            id: "miscellaneous",
            name: "Miscellaneous",
            description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
            icon: "Layers",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
            keywords: ["pilot", "academic", "client", "miscellaneous", "other", "general", "management", "platform", "system"]
          }
        ]);
      }
    };

    loadProjectCategories();
  }, []);

  // Dialog states
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [showProjectDetailsDialog, setShowProjectDetailsDialog] = useState(false);
  const [showShareProjectDialog, setShowShareProjectDialog] = useState(false);
  const [showActivityLogDialog, setShowActivityLogDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState({});

  // Fetch users and current user
  useEffect(() => {
    const fetchUsersAndCurrentUser = async () => {
      try {
        const [fetchedUsersResponse, currentUserData] = await Promise.all([
          getUsers(),
          getCurrentUser()
        ]);

        // Handle both paginated and non-paginated responses
        const fetchedUsers = Array.isArray(fetchedUsersResponse)
          ? fetchedUsersResponse
          : (fetchedUsersResponse.users || []);

        // Convert users array to object for easier lookup
        const usersObj = {};
        fetchedUsers.forEach(user => {
          usersObj[user._id] = {
            id: user._id,
            name: user.name,
            avatar: user.name.charAt(0).toUpperCase(),
            role: user.role,
            department: user.department,
            email: user.email
          };
        });
        setUsers(usersObj);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsersAndCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        // The backend uses _id, but frontend components might expect id.
        // We map _id to id for consistency.
        const adaptedData = data.map(p => ({ ...p, id: p._id }));
        setProjects(adaptedData);
        setError(null);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Memoized filtered projects to avoid sorting issues
  const filteredProjects = useMemo(() => {
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
          (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
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

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(project => getProjectCategory(project, projectCategories) === activeCategory);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        // Handle special cases for sorting
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date comparisons
        if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle progress comparisons
        if (sortConfig.key === 'progress') {
          aValue = aValue || 0;
          bValue = bValue || 0;
        }

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

        // Compare values
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [projects, searchQuery, statusFilter, priorityFilter, timeframeFilter, activeTab, activeCategory, sortConfig, projectCategories]);

  // Sorting function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleProjectAction = (action, project) => {
    console.log('Project action triggered:', action, 'for project:', project);
    setSelectedProject(project);

    switch (action) {
      case "view":
        // Navigate to the project details page using projectKey instead of ID
        router.push(`/projects/${project.projectKey || project.id}`);
        break;
      case "edit":
        // Open the edit project dialog
        console.log('Opening edit dialog for project:', project);
        setShowEditProjectDialog(true);
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

  const handleAddProject = async (newProjectData) => {
    try {
      const newProject = await createProject(newProjectData);
      const adaptedProject = { ...newProject, id: newProject._id };
      setProjects(prev => [...prev, adaptedProject]);
      setShowAddProjectDialog(false);
      // Create activity for project creation
      await createActivity({
        type: 'project_created',
        description: `Project '${adaptedProject.name}' was created`,
        projectId: adaptedProject.id
      });
    } catch (error) {
      console.error("Failed to add project:", error);
      // Handle duplicate name error
      if (error.response?.data?.error === 'Duplicate project name') {
        // The error is now handled in the form validation, so we don't need to show an alert here
        // The form will display the error message and keep the dialog open
      }
    }
  };

  const handleEditProject = async (editedProjectData) => {
    if (!selectedProject) return;
    try {
      const updated = await updateProject(selectedProject.id, editedProjectData);
      const adaptedUpdated = { ...updated, id: updated._id };
      setProjects(prev => prev.map(p => p.id === adaptedUpdated.id ? adaptedUpdated : p));
      setShowEditProjectDialog(false);
      setSelectedProject(null);
      // Create activity for project update
      await createActivity({
        type: 'project_updated',
        description: `Project '${adaptedUpdated.name}' was updated`,
        projectId: adaptedUpdated.id
      });
    } catch (error) {
      console.error("Failed to edit project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setShowDeleteProjectDialog(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Failed to delete project:", error);
      // Optionally, show an error message to the user
    }
  };

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
  };

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

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setTimeframeFilter("all");
    setActiveCategory("all");
  };

  if (loading) return <ProjectsLoading />;
  if (error) {
    return (
      <ErrorState
        title="Unable to Load Projects"
        message="We encountered an issue while loading your projects. This might be due to a network connection or server issue."
        error={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          // Re-fetch projects
          const fetchProjects = async () => {
            try {
              const data = await getProjects();
              const adaptedData = data.map(p => ({ ...p, id: p._id }));
              setProjects(adaptedData);
              setError(null);
            } catch (err) {
              setError("Failed to load projects. Please try again later.");
              console.error(err);
            } finally {
              setLoading(false);
            }
          };
          fetchProjects();
        }}
        onContinue={() => {
          setError(null);
          setProjects([]);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <LayoutGrid className="h-4 w-4 mr-1.5" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
            >
              <List className="h-4 w-4 mr-1.5" />
              List
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>
        <Button
          onClick={() => setShowAddProjectDialog(true)}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Enhanced View Selector Tabs */}
      <div className="border-b border-border/50">
        <Tabs
          value={activeView}
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="bg-transparent w-full justify-start border-b-0 h-auto pb-0 gap-6">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
            >
              Status Tracking
            </TabsTrigger>
            <TabsTrigger
              value="gantt"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
            >
              Gantt Chart
            </TabsTrigger>
            <TabsTrigger
              value="dependencies"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
            >
              Dependencies
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Category Filter Tabs */}
      <div className="border-b border-border/50">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="bg-transparent w-full justify-start border-b-0 h-auto pb-0 gap-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
            >
              All Projects
            </TabsTrigger>
            {projectCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent rounded-none px-0 py-3 h-auto font-medium text-muted-foreground data-[state=active]:text-primary transition-colors"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      {activeView === "projects" && (
        <>
          {/* Enhanced Search & Filter Controls */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name, description, or tags..."
                  className="pl-9 bg-background/80 border-border/50 focus:bg-background transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-background/80">
                    <SelectValue placeholder="Status" />
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
                  <SelectTrigger className="w-full sm:w-[140px] bg-background/80">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-background/80">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Timeframes</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={activeCategory} onValueChange={setActiveCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon && (
                            (() => {
                              const IconComponent = ICON_COMPONENTS[category.icon] || FlaskConical;
                              return <IconComponent className={`h-4 w-4 ${category.color}`} />;
                            })()
                          )}
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects Display */}
          <Tabs defaultValue="categorized" className="mt-0">
            <TabsContent value="categorized" className="mt-0">
              <CategorizedProjects
                projects={filteredProjects}
                viewMode={viewMode}
                handleProjectAction={handleProjectAction}
                sortConfig={sortConfig}
                requestSort={requestSort}
                searchQuery={searchQuery}
                onClearFilters={clearFilters}
                projectCategories={projectCategories}
              />
            </TabsContent>
          </Tabs>
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

      <EditProjectDialog
        open={showEditProjectDialog}
        onOpenChange={setShowEditProjectDialog}
        project={selectedProject}
        onSave={handleEditProject}
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
        users={users}
      />
    </div>
  );
}

// ProjectDisplay component to avoid duplicate code
function ProjectDisplay({ projects, viewMode, handleProjectAction, sortConfig, requestSort, onClearFilters }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <FolderPlus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Get started by creating your first project. Projects help you organize and track your research work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="gap-2"
            onClick={() => {
              // In a real app, this would open the add project dialog
              document.dispatchEvent(new CustomEvent('openAddProjectDialog'));
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Create Project
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={onClearFilters}
          >
            <FilterIcon className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
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
          transition: { duration: 0.4, ease: "easeInOut" }
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
