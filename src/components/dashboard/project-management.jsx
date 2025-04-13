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
// Replace the toast import with a simple implementation
// import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

// Simple toast implementation
const useToast = () => {
  const showToast = ({ title, description, variant }) => {
    // Simple alert for now
    const message = `${title}: ${description}`;
    console.log(message);
    if (typeof window !== 'undefined') {
      if (variant === 'destructive') {
        console.error(message);
      } else {
        console.log(message);
      }
    }
  };

  return { toast: showToast };
};

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Mock user data for activity logs (will be replaced with real data later)
const mockUsers = {
  "u1": { name: "Dr. Sarah Johnson", avatar: "SJ" },
  "u2": { name: "Mark Williams", avatar: "MW" },
  "u3": { name: "Dr. Emily Chen", avatar: "EC" },
  "u4": { name: "James Rodriguez", avatar: "JR" },
  "u5": { name: "Olivia Taylor", avatar: "OT" },
  "u6": { name: "Robert Kim", avatar: "RK" }
};

// Sample project data (will be used as fallback)
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeTab, setActiveTab] = useState("all"); // "all" or "favorites"
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [activeView, setActiveView] = useState("projects"); // "projects", "status", "gantt", "dependencies"

  // Dialog states
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [showProjectDetailsDialog, setShowProjectDetailsDialog] = useState(false);
  const [showShareProjectDialog, setShowShareProjectDialog] = useState(false);
  const [showActivityLogDialog, setShowActivityLogDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // User state (will be replaced with auth context)
  const [currentUser, setCurrentUser] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  // Get current user from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Transform backend data to match frontend structure
      const transformedProjects = response.data.map(project => ({
        id: project._id,
        name: project.title,
        description: project.description,
        startDate: project.startDate.split('T')[0],
        endDate: project.endDate.split('T')[0],
        status: project.status.charAt(0).toUpperCase() + project.status.slice(1), // Capitalize status
        priority: project.priority.charAt(0).toUpperCase() + project.priority.slice(1), // Capitalize priority
        progress: project.progress || 0,
        isFavorite: project.isFavorite || false,
        team: project.teamMembers.map(member => ({
          id: member._id,
          name: member.fullName,
          role: member.role || "Team Member",
          email: member.email
        })),
        tags: project.tags || [],
        dependencies: project.dependencies || [],
        activityLog: project.activityLog || [],
        department: project.department,
        budget: project.budget
      }));

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      setLoading(false);

      // Show error toast
      toast({
        title: "Error",
        description: err.message || "Failed to load projects",
        variant: "destructive"
      });

      // Use mock data as fallback
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

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

  const toggleProjectFavorite = async (projectId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Find the project to get current favorite status
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Update project in backend
      await axios.put(`${API_URL}/projects/${projectId}`,
        { isFavorite: !project.isFavorite },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      const updatedProjects = projects.map(project =>
        project.id === projectId
          ? {
            ...project,
            isFavorite: !project.isFavorite,
            activityLog: [
              ...project.activityLog || [],
              {
                id: `a${Date.now()}`,
                userId: currentUser?._id,
                action: !project.isFavorite ? "marked_favorite" : "unmarked_favorite",
                timestamp: new Date().toISOString(),
                details: !project.isFavorite ? "Marked as favorite" : "Removed from favorites"
              }
            ]
          }
          : project
      );

      setProjects(updatedProjects);

      // Show success toast
      toast({
        title: "Success",
        description: project.isFavorite ? "Removed from favorites" : "Added to favorites",
      });
    } catch (err) {
      console.error("Error toggling favorite:", err);

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      });
    }
  }

  const handleAddProject = async (newProject) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Transform frontend data to match backend structure
      const projectData = {
        title: newProject.name,
        description: newProject.description,
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        status: newProject.status.toLowerCase(),
        priority: newProject.priority.toLowerCase(),
        department: newProject.department || "",
        tags: newProject.tags || [],
        budget: newProject.budget || 0,
        teamMembers: newProject.teamMembers?.map(member => member.id) || []
      };
      console.log("Sending project data to API:", projectData);

      // Create project in backend
      const response = await axios.post(`${API_URL}/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Transform response data to match frontend structure
      const createdProject = {
        id: response.data._id,
        name: response.data.title,
        description: response.data.description,
        startDate: response.data.startDate.split('T')[0],
        endDate: response.data.endDate.split('T')[0],
        status: response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1),
        priority: response.data.priority.charAt(0).toUpperCase() + response.data.priority.slice(1),
        progress: response.data.progress || 0,
        isFavorite: response.data.isFavorite || false,
        team: response.data.teamMembers ? response.data.teamMembers.map(member => ({
          id: member._id,
          name: member.fullName,
          role: member.role || "Team Member",
          email: member.email
        })) : [],
        tags: response.data.tags || [],
        dependencies: response.data.dependencies || [],
        activityLog: response.data.activityLog || [],
        department: response.data.department,
        budget: response.data.budget
      };

      // Update local state
      setProjects(prev => [...prev, createdProject]);

      // Show success toast
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (err) {
      console.error("Error creating project:", err);

      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create project",
        variant: "destructive"
      });
    }
  }

  const handleEditProject = async (editedProject) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Transform frontend data to match backend structure
      const projectData = {
        title: editedProject.name,
        description: editedProject.description,
        startDate: editedProject.startDate,
        endDate: editedProject.endDate,
        status: editedProject.status.toLowerCase(),
        priority: editedProject.priority.toLowerCase(),
        progress: editedProject.progress,
        department: editedProject.department || "",
        tags: editedProject.tags || [],
        budget: editedProject.budget || 0
      };

      // Update project in backend
      await axios.put(`${API_URL}/projects/${editedProject.id}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state
      const updatedProjects = projects.map(project =>
        project.id === editedProject.id
          ? {
            ...editedProject,
            activityLog: [
              ...project.activityLog || [],
              {
                id: `a${Date.now()}`,
                userId: currentUser?._id,
                action: "updated",
                timestamp: new Date().toISOString(),
                details: "Project updated"
              }
            ]
          }
          : project
      );

      setProjects(updatedProjects);

      // Show success toast
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (err) {
      console.error("Error updating project:", err);

      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update project",
        variant: "destructive"
      });
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Delete project in backend
      await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state
      setProjects(prev => prev.filter(project => project.id !== projectId));

      // Show success toast
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting project:", err);

      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  }

  const handleShareProject = async (projectId, invitedUsers) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Add team members one by one
      for (const user of invitedUsers) {
        await axios.post(`${API_URL}/projects/${projectId}/team`,
          { userId: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Fetch updated project to get the latest team members
      const response = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Transform response data
      const updatedProject = {
        ...projects.find(p => p.id === projectId),
        team: response.data.teamMembers.map(member => ({
          id: member._id,
          name: member.fullName,
          role: member.role || "Team Member",
          email: member.email
        }))
      };

      // Update local state
      const updatedProjects = projects.map(project =>
        project.id === projectId ? updatedProject : project
      );

      setProjects(updatedProjects);

      // Show success toast
      toast({
        title: "Success",
        description: "Team members added successfully",
      });
    } catch (err) {
      console.error("Error sharing project:", err);

      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add team members",
        variant: "destructive"
      });
    }
  }

  // Update project status
  const handleUpdateProjectStatus = async (projectId, newStatus) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Find the project to get current status
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Update project in backend
      await axios.put(`${API_URL}/projects/${projectId}`,
        {
          status: newStatus.toLowerCase(),
          // If completed, set progress to 100%
          progress: newStatus === "Completed" ? 100 : project.progress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
          // Add a new activity log entry for status change
          const newActivityLog = [
            ...(p.activityLog || []),
            {
              id: `a${Date.now()}`,
              userId: currentUser?._id,
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

      // Show success toast
      toast({
        title: "Success",
        description: `Project status updated to ${newStatus}`,
      });
    } catch (err) {
      console.error("Error updating project status:", err);

      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update project status",
        variant: "destructive"
      });
    }
  };

  // The rest of the component remains the same
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

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center p-12 border border-red-200 bg-red-50 rounded-lg">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-red-500">!</span>
          </div>
          <h3 className="text-lg font-medium text-red-800">Error loading projects</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={fetchProjects}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      {!loading && !error && activeView === "projects" && (
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

      {/* Other views remain the same */}
      {!loading && !error && activeView === "status" && (
        <ProjectStatusTracking
          projects={projects}
          onUpdateProjectStatus={handleUpdateProjectStatus}
        />
      )}

      {!loading && !error && activeView === "gantt" && (
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

      {!loading && !error && activeView === "dependencies" && (
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
