"use client"

import { useState, useEffect } from "react"
import {
  BriefcaseMedical,
  Clock,
  Search,
  Plus,
  Filter,
  ListFilter,
  LayoutGrid,
  ListChecks,
  Users,
  Trash2,
  CalendarClock,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Pencil,// Add Pencil icon import
  EllipsisVertical
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isAfter, isBefore, parseISO } from "date-fns"

// Helper to safely get a Date object from string or Date
const getDueDate = (dueDate) => {
  if (typeof dueDate === 'string') {
    return parseISO(dueDate);
  }
  if (dueDate instanceof Date) {
    return dueDate;
  }
  return new Date(dueDate); // fallback for timestamps etc.
};
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SparklesCore } from "@/components/ui/aceternity/sparkles"
import { Checkbox } from "@/components/ui/checkbox" // Add this import for the Checkbox component

import { TaskTable } from "./task-table"
import { TaskBoard } from "./task-board"
import { TaskDetailsDialog } from "./task-details-dialog"
import { TaskFormDialog } from "./task-form-dialog"
import { TaskDeleteDialog } from "./task-delete-dialog"
import { TaskComments } from "./task-comments"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for tasks - in a real application this would come from an API
const mockTasks = [
  {
    id: 't1',
    name: 'Analyze blood samples for Project XYZ',
    experimentName: 'Compound A Toxicity Study',
    assignedTo: {
      id: 'u1',
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ'
    },
    priority: 'high',
    status: 'pending',
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    attachments: [
      { id: 'a1', name: 'protocol.pdf', type: 'pdf', size: '2.4 MB' }
    ],
    dependencies: [],
    activityLog: [
      {
        id: 'al1',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      }
    ]
  },
  {
    id: 't2',
    name: 'Prepare cell cultures for experiment',
    experimentName: 'Compound B Efficacy Test',
    assignedTo: {
      id: 'u3',
      name: 'Alex Wong',
      avatar: 'AW'
    },
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    attachments: [],
    dependencies: [],
    activityLog: [
      {
        id: 'al2',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al3',
        userId: 'u3',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Status changed from "pending" to "in-progress"'
      }
    ]
  },
  {
    id: 't3',
    name: 'Document experiment results',
    experimentName: 'Compound A Toxicity Study',
    assignedTo: {
      id: 'u4',
      name: 'Emily Chen',
      avatar: 'EC'
    },
    priority: 'low',
    status: 'completed',
    dueDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (past due)
    createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    attachments: [
      { id: 'a2', name: 'results.xlsx', type: 'excel', size: '1.2 MB' },
      { id: 'a3', name: 'images.zip', type: 'zip', size: '18.5 MB' }
    ],
    dependencies: ['t1'],
    activityLog: [
      {
        id: 'al4',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al5',
        userId: 'u4',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Status changed from "pending" to "in-progress"'
      },
      {
        id: 'al6',
        userId: 'u4',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Status changed from "in-progress" to "completed"'
      }
    ]
  },
  {
    id: 't4',
    name: 'Set up equipment for microscopy',
    experimentName: 'Compound C Cellular Study',
    assignedTo: {
      id: 'u5',
      name: 'James Wilson',
      avatar: 'JW'
    },
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    attachments: [
      { id: 'a4', name: 'equipment_manual.pdf', type: 'pdf', size: '4.8 MB' }
    ],
    dependencies: [],
    activityLog: [
      {
        id: 'al7',
        userId: 'u1',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al8',
        userId: 'u5',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Status changed from "pending" to "in-progress"'
      }
    ]
  },
  {
    id: 't5',
    name: 'Analyze data from previous experiment',
    experimentName: 'Compound B Efficacy Test',
    assignedTo: {
      id: 'u1',
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ'
    },
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    attachments: [],
    dependencies: ['t2'],
    activityLog: [
      {
        id: 'al9',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      }
    ]
  },
  {
    id: 't6',
    name: 'Prepare equipment for next experiment',
    experimentName: 'Compound C Cellular Study',
    assignedTo: {
      id: 'u3',
      name: 'Alex Wong',
      avatar: 'AW'
    },
    priority: 'high',
    status: 'pending',
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    attachments: [],
    dependencies: [],
    activityLog: [
      {
        id: 'al10',
        userId: 'u1',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      }
    ]
  }
];

// Mock data for users
const mockUsers = {
  'u1': { id: 'u1', name: 'Dr. Sarah Johnson', avatar: 'SJ', role: 'scientist' },
  'u2': { id: 'u2', name: 'Dr. Michael Lee', avatar: 'ML', role: 'admin' },
  'u3': { id: 'u3', name: 'Alex Wong', avatar: 'AW', role: 'technician' },
  'u4': { id: 'u4', name: 'Emily Chen', avatar: 'EC', role: 'scientist' },
  'u5': { id: 'u5', name: 'James Wilson', avatar: 'JW', role: 'technician' },
};

// Mock experiments data
const mockExperiments = [
  { id: 'e1', name: 'Compound A Toxicity Study' },
  { id: 'e2', name: 'Compound B Efficacy Test' },
  { id: 'e3', name: 'Compound C Cellular Study' },
  { id: 'e4', name: 'Biomarker Analysis Project' },
];

// Add this import at the top with other imports
import { useRouter } from "next/navigation"

export const TaskManagement = ({ view = "all", searchQuery = "" }) => {
  // Add router
  const router = useRouter();

  // State for tasks
  const [tasks, setTasks] = useState(mockTasks);

  // Add state for toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [isLoading, setIsLoading] = useState(true);

  // State for view mode
  const [viewMode, setViewMode] = useState("list");

  // State for dialogs
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false);
  const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create or edit

  // State for filters
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState(view !== "all" ? view : "all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [experimentFilter, setExperimentFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");

  // Sort functionality
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc"
  });

  // Task statistics
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    highPriority: 0
  });

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [view]);

  // Update search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Calculate task statistics
  useEffect(() => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length,
      overdue: tasks.filter(task => {
        const dueDate = getDueDate(task.dueDate);
        return isBefore(dueDate, new Date()) && task.status !== 'completed';
      }).length,
      highPriority: tasks.filter(task => task.priority === 'high').length
    };
    setTaskStats(stats);
  }, [tasks]);

  // Apply filters to tasks
  useEffect(() => {
    let result = [...tasks];

    // Apply view filter first (from parent component)
    if (view === "active") {
      result = result.filter(task => task.status === "pending" || task.status === "in-progress");
    } else if (view === "completed") {
      result = result.filter(task => task.status === "completed");
    } else if (view === "overdue") {
      result = result.filter(task => {
        const dueDate = getDueDate(task.dueDate);
        return isBefore(dueDate, new Date()) && task.status !== 'completed';
      });
    }

    // Apply search query filter
    if (localSearchQuery) {
      const lowerCaseQuery = localSearchQuery.toLowerCase();
      result = result.filter(task =>
        task.name.toLowerCase().includes(lowerCaseQuery) ||
        task.experimentName.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      result = result.filter(task => task.assignedTo.id === assigneeFilter);
    }

    // Apply experiment filter
    if (experimentFilter !== "all") {
      result = result.filter(task => task.experimentName === experimentFilter);
    }

    // Apply due date filter
    if (dueDateFilter !== "all") {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      result = result.filter(task => {
        const dueDate = getDueDate(task.dueDate);

        switch (dueDateFilter) {
          case "today":
            return format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          case "tomorrow":
            return format(dueDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
          case "week":
            return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
          case "overdue":
            return isBefore(dueDate, today) && task.status !== 'completed';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) {
        comparison = -1;
      } else if (valueA > valueB) {
        comparison = 1;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    setFilteredTasks(result);
  }, [tasks, localSearchQuery, statusFilter, priorityFilter, assigneeFilter, experimentFilter, dueDateFilter, sortConfig, view]);

  // Function to request sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle task action (view, edit, delete, etc.)
  const handleTaskAction = (action, task) => {
    setSelectedTask(task);

    switch (action) {
      case "view":
        // Navigate to the task detail page instead of showing dialog
        router.push(`/tasks/${task.id}`);
        break;
      case "edit":
        setFormMode("edit");
        setShowTaskFormDialog(true);
        break;
      case "delete":
        setShowDeleteTaskDialog(true);
        break;
      case "statusChange":
        updateTaskStatus(task.id, task.status);
        break;
      default:
        break;
    }
  };

  // Function to create a new task
  const createTask = (newTask) => {
    // In a real app, you would send this to your API

    // Format the assignee data to match the expected structure
    const assigneeData = (() => {
      // Check if we have an assignee from the form
      if (newTask.assigneeId) {
        // Try to find the user in the mockUsers object
        const user = Object.values(mockUsers).find(u => u.id === newTask.assigneeId);

        // If found in mockUsers, use that data
        if (user) {
          return {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
        }

        // For hardcoded users in the form that aren't in mockUsers
        const hardcodedUsers = {
          'user1': { id: 'user1', name: 'John Doe', avatar: 'JD' },
          'user2': { id: 'user2', name: 'Jane Smith', avatar: 'JS' },
          'user3': { id: 'user3', name: 'Sarah Johnson', avatar: 'SJ' },
          'user4': { id: 'user4', name: 'Jenny Parker', avatar: 'JP' },
          'user5': { id: 'user5', name: 'Harry Potter', avatar: 'HP' }
        };

        if (hardcodedUsers[newTask.assigneeId]) {
          return hardcodedUsers[newTask.assigneeId];
        }

        // Fallback if we can't find the user
        return {
          id: newTask.assigneeId,
          name: newTask.assigneeName || "Unknown User",
          avatar: newTask.assigneeId.substring(0, 2).toUpperCase()
        };
      }

      // Default to unassigned
      return {
        id: 'unassigned',
        name: 'Unassigned',
        avatar: 'UN'
      };
    })();

    const taskWithMeta = {
      ...newTask,
      id: `t${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      assignedTo: assigneeData, // Use the properly formatted assignee data
      activityLog: [
        {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'created',
          timestamp: new Date().toISOString(),
          details: 'Task created'
        }
      ]
    };

    // Add the new task to the tasks array
    setTasks(prevTasks => [...prevTasks, taskWithMeta]);
    setShowTaskFormDialog(false);

    // Show success notification
    setToastMessage({
      title: "Task created successfully",
      description: `Task "${newTask.name}" has been added to your task list.`,
      variant: "success",
      id: Date.now()
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Function to handle creating a new task
  const handleCreateNewTask = () => {
    setSelectedTask(null);
    setFormMode("create");
    setShowTaskFormDialog(true);
  };

  // Function to update an existing task
  const updateTask = (updatedTask) => {
    // Format the assignee data to match the expected structure
    const assigneeData = (() => {
      // Check if we have an assignee from the form
      if (updatedTask.assigneeId) {
        // Try to find the user in the mockUsers object
        const user = Object.values(mockUsers).find(u => u.id === updatedTask.assigneeId);

        // If found in mockUsers, use that data
        if (user) {
          return {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
        }

        // For hardcoded users in the form that aren't in mockUsers
        const hardcodedUsers = {
          'user1': { id: 'user1', name: 'John Doe', avatar: 'JD' },
          'user2': { id: 'user2', name: 'Jane Smith', avatar: 'JS' },
          'user3': { id: 'user3', name: 'Sarah Johnson', avatar: 'SJ' },
          'user4': { id: 'user4', name: 'Jenny Parker', avatar: 'JP' },
          'user5': { id: 'user5', name: 'Harry Potter', avatar: 'HP' }
        };

        if (hardcodedUsers[updatedTask.assigneeId]) {
          return hardcodedUsers[updatedTask.assigneeId];
        }

        // Fallback if we can't find the user
        return {
          id: updatedTask.assigneeId,
          name: updatedTask.assigneeName || "Unknown User",
          avatar: updatedTask.assigneeId.substring(0, 2).toUpperCase()
        };
      }

      // Default to unassigned
      return {
        id: 'unassigned',
        name: 'Unassigned',
        avatar: 'UN'
      };
    })();

    // In a real app, you would send this to your API
    const updatedTasks = tasks.map(task => {
      if (task.id === updatedTask.id) {
        // Add activity log entry for the update
        const newLog = {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'updated',
          timestamp: new Date().toISOString(),
          details: 'Task updated'
        };

        return {
          ...updatedTask,
          assignedTo: assigneeData, // Use the properly formatted assignee data
          activityLog: [...task.activityLog, newLog]
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setShowTaskFormDialog(false);
  };

  // Function to update task status
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newLog = {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'updated',
          timestamp: new Date().toISOString(),
          details: `Status changed from "${task.status}" to "${newStatus}"`
        };

        return {
          ...task,
          status: newStatus,
          activityLog: [...task.activityLog, newLog]
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    // In a real app, you would send this to your API for soft delete
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setShowDeleteTaskDialog(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setLocalSearchQuery("");
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
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
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
            onClick={handleCreateNewTask}
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
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
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
                    {Object.values(mockUsers).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
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
                onClick={handleCreateNewTask}
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
                              key={task.id}
                              className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <Checkbox className="border-border/50" />
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-mono bg-muted/50 px-2 py-1 rounded-md">
                                  {task.id}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="font-medium cursor-pointer hover:text-primary transition-colors"
                                  onClick={() => handleTaskAction("view", task)}
                                >
                                  {task.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm">{task.experimentName}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                                      {task.assignedTo?.avatar ?? "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{task.assignedTo?.name ?? "Unassigned"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${getPriorityColor(task.priority)} px-3 py-1 rounded-full`}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={`${getStatusColor(task.status)} px-3 py-1 rounded-full`}>
                                  {task.status === "in-progress"
                                    ? "In Progress"
                                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {format(getDueDate(task.dueDate), "MMM d, yyyy")}
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
                      users={mockUsers}
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
        users={mockUsers}
        experiments={mockExperiments}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={showTaskFormDialog}
        onOpenChange={setShowTaskFormDialog}
        task={selectedTask}
        mode={formMode}
        onSubmit={formMode === "create" ? createTask : updateTask}
        users={mockUsers}
        experiments={mockExperiments}
        tasks={tasks}
      />

      {/* Delete Task Dialog */}
      <TaskDeleteDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
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
