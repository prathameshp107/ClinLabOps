"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  PlusCircle, SearchIcon, FilterIcon, Grid3X3, List, 
  FolderPlus, ClipboardEdit, Trash2, MoreHorizontal, ArrowDownUp, Star,
  Users, Clock
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
import { ProjectTable } from "./project-management/project-table"
import { ProjectCardView } from "./project-management/project-card-view"
import { AddProjectDialog } from "./project-management/add-project-dialog"
import { EditProjectDialog } from "./project-management/edit-project-dialog"
import { DeleteProjectDialog } from "./project-management/delete-project-dialog"
import { ProjectDetailsDialog } from "./project-management/project-details-dialog"
import { ProjectShareDialog } from "./project-management/project-share-dialog"
import { ActivityLogDialog } from "./project-management/activity-log-dialog"
import { ProjectDependencies } from "./project-management/project-dependencies"
import { ProjectStatusTracking } from "./project-management/project-status-tracking"
import { ProjectGanttChart } from "./project-management/project-gantt-chart"

// Mock user data for activity logs
const mockUsers = {
  "u1": { name: "Dr. Sarah Johnson", avatar: "SJ" },
  "u2": { name: "Mark Williams", avatar: "MW" },
  "u3": { name: "Dr. Emily Chen", avatar: "EC" },
  "u4": { name: "James Rodriguez", avatar: "JR" },
  "u5": { name: "Olivia Taylor", avatar: "OT" },
  "u6": { name: "Robert Kim", avatar: "RK" }
};

// Sample project data
export const mockProjects = [
  {
    id: "p1",
    name: "Cancer Biomarker Discovery",
    description: "Identifying novel biomarkers for early detection of pancreatic cancer using proteomics approaches",
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "In Progress",
    priority: "High",
    progress: 45,
    isFavorite: true,
    team: [
      { id: "u1", name: "Dr. Sarah Johnson", role: "Principal Investigator", email: "s.johnson@example.com" },
      { id: "u2", name: "Mark Williams", role: "Research Scientist", email: "m.williams@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Lab Technician", email: "j.rodriguez@example.com" }
    ],
    tags: ["Oncology", "Proteomics", "Clinical"],
    dependencies: [
      { id: "dep1", sourceId: "p1", sourceName: "Cancer Biomarker Discovery", targetId: "p3", targetName: "Neuroimaging Data Analysis", type: "finish-to-start", created: "2025-01-20T14:15:00Z" }
    ],
    activityLog: [
      { id: "a1", userId: "u1", action: "created", timestamp: "2025-01-14T09:30:00Z", details: "Project created" },
      { id: "a2", userId: "u1", action: "updated", timestamp: "2025-01-20T14:15:00Z", details: "Updated project description" },
      { id: "a3", userId: "u2", action: "updated", timestamp: "2025-02-05T11:45:00Z", details: "Updated progress to 30%" },
      { id: "a4", userId: "u1", action: "added_member", timestamp: "2025-02-10T10:00:00Z", details: "Added James Rodriguez to the team" }
    ]
  },
  {
    id: "p2",
    name: "Antibiotic Resistance Testing",
    description: "Evaluating resistance patterns of bacterial strains against new antibiotic compounds",
    startDate: "2025-02-10",
    endDate: "2025-05-10",
    status: "In Progress",
    priority: "Medium",
    progress: 68,
    isFavorite: false,
    team: [
      { id: "u3", name: "Dr. Emily Chen", role: "Project Lead", email: "e.chen@example.com" },
      { id: "u5", name: "Olivia Taylor", role: "Microbiologist", email: "o.taylor@example.com" }
    ],
    tags: ["Microbiology", "Drug Development"],
    dependencies: [
      { id: "dep2", sourceId: "p2", sourceName: "Antibiotic Resistance Testing", targetId: "p6", targetName: "Lab Equipment Validation", type: "start-to-start", created: "2025-02-15T10:30:00Z" }
    ],
    activityLog: []
  },
  {
    id: "p3",
    name: "Neuroimaging Data Analysis",
    description: "Processing and analyzing fMRI data from Alzheimer's patients to identify early markers",
    startDate: "2024-11-20",
    endDate: "2025-06-30",
    status: "On Hold",
    priority: "Medium",
    progress: 32,
    isFavorite: false,
    team: [
      { id: "u1", name: "Dr. Sarah Johnson", role: "Supervisor", email: "s.johnson@example.com" },
      { id: "u2", name: "Mark Williams", role: "Data Analyst", email: "m.williams@example.com" }
    ],
    tags: ["Neuroscience", "Data Analysis", "Clinical"],
    activityLog: []
  },
  {
    id: "p4",
    name: "Vaccine Stability Study",
    description: "Evaluating long-term stability of mRNA vaccine formulations under various storage conditions",
    startDate: "2025-03-01",
    endDate: "2025-09-01",
    status: "Pending",
    priority: "High",
    progress: 0,
    isFavorite: false,
    team: [
      { id: "u6", name: "Robert Kim", role: "Equipment Specialist", email: "r.kim@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Lab Technician", email: "j.rodriguez@example.com" }
    ],
    tags: ["Vaccines", "Stability", "mRNA"],
    activityLog: []
  },
  {
    id: "p5",
    name: "Genetic Screening Protocol Development",
    description: "Developing a rapid genetic screening protocol for rare genetic disorders",
    startDate: "2024-12-05",
    endDate: "2025-04-15",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    isFavorite: true,
    team: [
      { id: "u3", name: "Dr. Emily Chen", role: "Quality Control", email: "e.chen@example.com" },
      { id: "u5", name: "Olivia Taylor", role: "Genetic Analyst", email: "o.taylor@example.com" }
    ],
    tags: ["Genetics", "Protocol", "Screening"],
    activityLog: []
  },
  {
    id: "p6",
    name: "Lab Equipment Validation",
    description: "Validation of new mass spectrometry equipment for clinical sample analysis",
    startDate: "2025-02-20",
    endDate: "2025-03-20",
    status: "In Progress",
    priority: "Low",
    progress: 85,
    isFavorite: false,
    team: [
      { id: "u6", name: "Robert Kim", role: "Lead Technician", email: "r.kim@example.com" },
      { id: "u4", name: "James Rodriguez", role: "Assistant", email: "j.rodriguez@example.com" }
    ],
    tags: ["Equipment", "Validation", "Mass Spec"],
    activityLog: []
  }
]

export function ProjectManagement() {
  // Load projects from localStorage or use mockProjects as default
  const [projects, setProjects] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects ? JSON.parse(savedProjects) : mockProjects;
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
  const [currentUser, setCurrentUser] = useState({ id: "u1", name: "Dr. Sarah Johnson" }); // Mock current user

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
    // In a real application, you would call an API here
    const projectWithId = {
      ...newProject,
      id: `p${projects.length + 1}`,
      isFavorite: false,
      activityLog: [
        {
          id: `a${Date.now()}`,
          userId: currentUser.id,
          action: "created",
          timestamp: new Date().toISOString(),
          details: "Project created"
        }
      ],
      team: [
        { id: currentUser.id, name: currentUser.name, role: "Owner", email: "s.johnson@example.com" }
      ]
    }
    
    setProjects(prev => [...prev, projectWithId]);
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
