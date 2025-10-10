"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart2,
  Users,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  OctagonAlert,
  List,
  Grid,
  PlusCircle,
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  Star,
  StarOff,
  Share,
  Activity,
  XCircle,
  ListChecks,
  LayoutGrid,
  Checkbox
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add this import at the top with other imports
import { useRouter } from "next/navigation"
import {
  getTasks,
  createTask as createTaskAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
  updateTaskStatus as updateTaskStatusAPI
} from "@/services/taskService"
import { getAllUsers } from "@/services/userService"
import { getExperiments } from "@/services/experimentService"
import {
  taskStatusConfig,
  taskPriorityConfig
} from "@/constants"

// Import dialog components
import { TaskDetailsDialog } from "./task-details-dialog"
import { TaskFormDialog } from "./task-form-dialog"
import { TaskDeleteDialog } from "./task-delete-dialog"
import { TaskBoard } from "./task-board"

const getDueDate = (dueDate) => {
  if (!dueDate) return "No due date";

  const date = new Date(dueDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString();
  }
};

export const TaskManagement = ({ view = "all" }) => {
  // Add router
  const router = useRouter();

  // State for tasks
  const [tasks, setTasks] = useState([]);

  // Add state for toast notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [experiments, setExperiments] = useState([]);

  // State for view mode
  const [viewMode, setViewMode] = useState("list");

  // State for dialogs
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showActivityLogDialog, setShowActivityLogDialog] = useState(false);

  // State for filters - map frontend view to backend status
  const getBackendStatus = (frontendStatus) => {
    const statusMap = {
      'pending': 'todo',
      'in-progress': 'in-progress',
      'completed': 'done',
      'review': 'review'
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  const getFrontendStatus = (backendStatus) => {
    const statusMap = {
      'todo': 'pending',
      'in-progress': 'in-progress',
      'done': 'completed',
      'review': 'review'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  const [statusFilter, setStatusFilter] = useState(view !== "all" ? view : "all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [experimentFilter, setExperimentFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'dueDate',
    direction: 'asc'
  });

  // State for task statistics
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, usersData, experimentsData] = await Promise.all([
          getTasks(),
          getAllUsers(),
          getExperiments()
        ]);

        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setExperiments(Array.isArray(experimentsData) ? experimentsData : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  // Calculate task statistics
  useEffect(() => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(task => getFrontendStatus(task.status) === 'pending').length,
      inProgress: tasks.filter(task => getFrontendStatus(task.status) === 'in-progress').length,
      completed: tasks.filter(task => getFrontendStatus(task.status) === 'completed').length,
      overdue: tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        return dueDate < now && getFrontendStatus(task.status) !== 'completed';
      }).length
    };
    setTaskStats(stats);
  }, [tasks]);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.customId || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => getFrontendStatus(task.status) === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(task => task.assignee === assigneeFilter);
    }

    // Apply experiment filter  
    if (experimentFilter !== "all") {
      filtered = filtered.filter(task => task.projectId === experimentFilter);
    }

    // Apply due date filter
    if (dueDateFilter !== "all") {
      const now = new Date();
      switch (dueDateFilter) {
        case "overdue":
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate < now && getFrontendStatus(task.status) !== 'completed';
          });
          break;
        case "today":
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            return dueDate.toDateString() === today.toDateString();
          });
          break;
        case "week":
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate <= weekFromNow && dueDate >= now;
          });
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (valueA instanceof Date && valueB instanceof Date) {
        return sortConfig.direction === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      return sortConfig.direction === 'asc'
        ? (valueA > valueB ? 1 : -1)
        : (valueA < valueB ? 1 : -1);
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter, experimentFilter, dueDateFilter, sortConfig]);

  // Sorting function
  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle task actions
  const handleTaskAction = (action, task) => {
    setSelectedTask(task);

    switch (action) {
      case "view":
        setShowTaskDetailsDialog(true);
        break;
      case "edit":
        setShowTaskFormDialog(true);
        break;
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "share":
        setShowShareDialog(true);
        break;
      case "activity":
        setShowActivityLogDialog(true);
        break;
      default:
        break;
    }
  };

  // Create new task
  const createTask = async (newTask) => {
    try {
      setIsLoading(true);

      // Convert frontend status to backend status
      const taskData = {
        ...newTask,
        status: getBackendStatus(newTask.status || 'pending')
      };

      const createdTask = await createTaskAPI(taskData);

      // Refresh tasks list
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);

      setShowTaskFormDialog(false);
      setToastMessage({
        title: "Success",
        description: "Task created successfully!",
        variant: "success"
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      setToastMessage({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing task
  const updateTask = async (updatedTask) => {
    try {
      setIsLoading(true);

      // Convert frontend status to backend status
      const taskData = {
        ...updatedTask,
        status: getBackendStatus(updatedTask.status || 'pending')
      };

      const updated = await updateTaskAPI(updatedTask._id || updatedTask.id, taskData);

      if (updated) {
        // Refresh tasks list
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);

        setShowTaskFormDialog(false);
        setToastMessage({
          title: "Success",
          description: "Task updated successfully!",
          variant: "success"
        });
      } else {
        setToastMessage({
          title: "Error",
          description: "Task not found.",
          variant: "error"
        });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      setToastMessage({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Convert frontend status to backend status
      const backendStatus = getBackendStatus(newStatus);
      const updated = await updateTaskStatusAPI(taskId, backendStatus);

      if (updated) {
        // Refresh tasks list
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);

        setToastMessage({
          title: "Success",
          description: "Task status updated successfully!",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      setToastMessage({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "error"
      });
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      setIsLoading(true);
      const success = await deleteTaskAPI(taskId);

      if (success) {
        // Refresh tasks list
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);

        setShowDeleteDialog(false);
        setToastMessage({
          title: "Success",
          description: "Task deleted successfully!",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      setToastMessage({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setExperimentFilter("all");
    setDueDateFilter("all");
  };

  const Toast = ({ message, onClose }) => {
    if (!message) return null;

    const bgColor = message.variant === "success"
      ? "bg-green-100 border-green-500 text-green-800"
      : message.variant === "error"
        ? "bg-red-100 border-red-500 text-red-800"
        : "bg-blue-100 border-blue-500 text-blue-800";

    return (
      <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg border-l-4 ${bgColor} z-50 max-w-md`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{message.title}</h3>
            <p className="text-sm mt-1">{message.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  // Get unique experiments from tasks
  const uniqueExperiments = [...new Set(tasks.map(task => task.experimentName))];

  // Function to refresh data
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const [tasksData, usersData, experimentsData] = await Promise.all([
        getTasks(),
        getUsers(),
        getExperiments()
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setExperiments(Array.isArray(experimentsData) ? experimentsData : []);

      setToastMessage({
        title: "Success",
        description: "Data refreshed successfully!",
        variant: "success"
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setToastMessage({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl shadow-lg border border-border/40 bg-background/80 backdrop-blur-sm overflow-hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className={`rounded-none h-11 w-11 ${viewMode === "list" ? 'bg-primary/10 text-primary' : ''}`}
                      onClick={() => setViewMode("list")}
                    >
                      <ListChecks className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={viewMode === "board" ? "secondary" : "ghost"}
                      size="icon"
                      className={`rounded-none h-11 w-11 border-l border-border/30 ${viewMode === "board" ? 'bg-primary/10 text-primary' : ''}`}
                      onClick={() => setViewMode("board")}
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Board View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 border-border/50 ml-2 hover:bg-primary/5"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <Button
            onClick={() => {
              setSelectedTask(null);
              setShowTaskFormDialog(true);
            }}
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-base px-8 py-2.5 rounded-xl font-medium"
          >
            <Plus className="h-5 w-5" /> New Task
          </Button>
        </div>

        <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <div className="p-8 border-b bg-gradient-to-r from-muted/20 to-muted/10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-12 bg-background/90 border-border/40 h-12 rounded-xl focus:ring-2 focus:ring-primary/30 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-background/90 border-border/40 h-12 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px] bg-background/90 border-border/40 h-12 rounded-xl">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-[180px] bg-background/90 border-border/40 h-12 rounded-xl">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={experimentFilter} onValueChange={setExperimentFilter}>
                  <SelectTrigger className="w-[180px] bg-background/90 border-border/40 h-12 rounded-xl">
                    <SelectValue placeholder="Experiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experiments</SelectItem>
                    {experiments.map(experiment => (
                      <SelectItem key={experiment._id || experiment.id} value={experiment._id || experiment.id}>
                        {experiment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                  <SelectTrigger className="w-[140px] bg-background/90 border-border/40 h-12 rounded-xl">
                    <SelectValue placeholder="Due Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  className="bg-background/90 border-border/40 h-12 w-12 rounded-xl hover:bg-primary/5"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="rounded-2xl bg-primary/10 p-4 mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Try adjusting your filters or create a new task to get started
              </p>
              <Button
                onClick={() => {
                  setSelectedTask(null);
                  setShowTaskFormDialog(true);
                }}
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary px-6 py-2.5 rounded-xl font-medium"
              >
                <Plus className="h-5 w-5" /> Create New Task
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === "list" ? (
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="w-[40px] px-4 py-4 text-left">
                              <Checkbox className="border-border/50" />
                            </th>
                            <th className="px-6 py-4 text-left font-medium text-sm">
                              Task ID
                            </th>
                            <th
                              className="px-6 py-4 text-left font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                              onClick={() => requestSort("name")}
                            >
                              <div className="flex items-center gap-2">
                                Task Name
                                {sortConfig.key === "name" && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left font-medium text-sm">Experiment</th>
                            <th className="px-6 py-4 text-left font-medium text-sm">Assigned To</th>
                            <th
                              className="px-6 py-4 text-left font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                              onClick={() => requestSort("priority")}
                            >
                              <div className="flex items-center gap-2">
                                Priority
                                {sortConfig.key === "priority" && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left font-medium text-sm">Status</th>
                            <th
                              className="px-6 py-4 text-left font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                              onClick={() => requestSort("dueDate")}
                            >
                              <div className="flex items-center gap-2">
                                Due Date
                                {sortConfig.key === "dueDate" && (
                                  <ArrowUpDown className="h-4 w-4" />
                                )}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left font-medium text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map((task) => (
                            <tr
                              key={task._id || task.id}
                              className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <Checkbox className="border-border/50" />
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-mono bg-muted/50 px-2 py-1 rounded-md">
                                  {task.customId || task._id || task.id}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="font-medium cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => handleTaskAction("view", task)}
                                >
                                  {task.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {experiments.find(exp => exp._id === task.projectId)?.title || "No Experiment"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                      {(() => {
                                        if (task.assignee) {
                                          const assignedUser = users.find(user => (user._id || user.id) === task.assignee);
                                          if (assignedUser) {
                                            const name = assignedUser.name || `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}`.trim();
                                            return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
                                          }
                                          return task.assignee.substring(0, 2).toUpperCase();
                                        }
                                        return "?";
                                      })()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {(() => {
                                      if (task.assignee) {
                                        const assignedUser = users.find(user => (user._id || user.id) === task.assignee);
                                        if (assignedUser) {
                                          return assignedUser.name || `${assignedUser.firstName || ''} ${assignedUser.lastName || ''}`.trim() || assignedUser.email;
                                        }
                                        return task.assignee;
                                      }
                                      return "Unassigned";
                                    })()}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${getPriorityColor(task.priority)} px-3 py-1 rounded-full`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${getStatusColor(getFrontendStatus(task.status))} px-3 py-1 rounded-full`}>
                                  {(() => {
                                    const frontendStatus = getFrontendStatus(task.status);
                                    return frontendStatus === "in-progress"
                                      ? "In Progress"
                                      : frontendStatus.charAt(0).toUpperCase() + frontendStatus.slice(1);
                                  })()}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {getDueDate(task.dueDate)}
                              </td>
                              <td className="px-6 py-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 hover:bg-primary/5"
                                    >
                                      <EllipsisVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
                                      <Search className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleTaskAction("edit", task)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Task
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleTaskAction("delete", task)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <TaskBoard
                      tasks={filteredTasks}
                      onAction={handleTaskAction}
                      onStatusChange={updateTaskStatus}
                      users={users}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between p-6 text-sm text-muted-foreground border-t bg-muted/5 gap-4">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3 bg-background/90 px-3 py-1 rounded-full">
                {filteredTasks.length}
              </Badge>
              <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Sort by:</span>
              <Select
                value={sortConfig.key}
                onValueChange={(value) => setSortConfig({ key: value, direction: sortConfig.direction })}
              >
                <SelectTrigger className="h-9 w-[140px] text-sm bg-background/90 border-border/50 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Task Name</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-primary/5"
                onClick={() => setSortConfig({
                  key: sortConfig.key,
                  direction: sortConfig.direction === "asc" ? "desc" : "asc"
                })}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task Details Dialog */}
      <TaskDetailsDialog
        open={showTaskDetailsDialog}
        onOpenChange={setShowTaskDetailsDialog}
        task={selectedTask}
        onAction={handleTaskAction}
        users={users}
        experiments={experiments}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={showTaskFormDialog}
        onOpenChange={setShowTaskFormDialog}
        task={selectedTask}
        mode="create"
        onSubmit={createTask}
        users={users}
        experiments={experiments}
        tasks={tasks}
      />

      {/* Delete Task Dialog */}
      <TaskDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        task={selectedTask}
        onDelete={deleteTask}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};
