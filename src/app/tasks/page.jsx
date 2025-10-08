"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Filter, Calendar, BarChart2, Users, SlidersHorizontal, RefreshCw, AlertCircle, Clock, CheckCircle2, Search, OctagonAlert, List, Grid, PlusCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar as CalendarIcon, Folder, Target, Flag, User, Sparkles } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/tasks-v2/data-table"
import { TaskGrid } from "@/components/tasks-v2/task-grid"
import { columns } from "@/components/tasks-v2/columns"
import { DataTableRowActions } from "@/components/tasks-v2/data-table-row-actions"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getTasks, createTask, getNextTaskId, deleteTask } from "@/services/taskService"
import { getProjects, getProjectById } from "@/services/projectService"
import { getAllUsers } from "@/services/userService"

export default function TasksPage() {
  const [error, setError] = React.useState(null)
  const [activeTab, setActiveTab] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [viewMode, setViewMode] = React.useState("table") // 'table' or 'grid'
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedTasks, setSelectedTasks] = React.useState([])
  const [selectedTask, setSelectedTask] = React.useState(null)
  const [showTaskDetails, setShowTaskDetails] = React.useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = React.useState(false)

  const [tasks, setTasks] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [team, setTeam] = React.useState([]);
  const [nextTaskId, setNextTaskId] = React.useState("");

  // Helper to generate acronym from project name (letters only, no brackets)
  function getProjectAcronym(name) {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  // Helper to get the next custom task number for a project
  function getNextTaskNumberForProject(tasks, projectAcronym) {
    const numbers = tasks
      .filter(t => t.customId && t.customId.startsWith(projectAcronym + '-'))
      .map(t => parseInt(t.customId.split('-')[1], 10))
      .filter(n => !isNaN(n));
    return numbers.length ? Math.max(...numbers) + 1 : 1;
  }

  function mapTask(task, projects = [], allTasks = [], users = []) {
    const project = projects.find(p => (p._id || p.id) === (task.projectId || task.project?._id || task.project?.id));
    let customId = undefined;
    if (project && project.name) {
      const acronym = getProjectAcronym(project.name);
      // If the task already has a customId, keep it; otherwise, generate
      if (task.customId) {
        customId = task.customId;
      } else {
        // Find the next available number for this project
        const nextNum = getNextTaskNumberForProject(allTasks, acronym);
        customId = `${acronym}-${nextNum}`;
      }
    }

    // Resolve assignee name from users array if possible
    let assignedToName = 'Unassigned';
    if (task.assignee) {
      // First try to find by ID match
      const assigneeUser = users.find(user =>
        (user._id || user.id) === task.assignee
      );

      // If not found by ID, use the assignee value directly (might be a name)
      if (assigneeUser) {
        assignedToName = assigneeUser.name || `${assigneeUser.firstName || ''} ${assigneeUser.lastName || ''}`.trim() || assigneeUser.email || task.assignee;
      } else {
        assignedToName = task.assignee;
      }
    }

    return {
      ...task,
      id: task._id || task.id,
      customId,
      assignedTo: { name: assignedToName },
      project: project || { name: '-' },
    };
  }

  const fetchTasksData = React.useCallback(async () => {
    try {
      setError(null)
      const [data, allProjects, allUsers] = await Promise.all([
        getTasks(selectedStatus !== 'all' ? { status: selectedStatus } : {}),
        getProjects(),
        getAllUsers()
      ]);
      setProjects(allProjects);
      setTeam(allUsers || []);
      // Map all tasks and assign customId
      let mappedTasks = [];
      for (const task of data?.data) {
        mappedTasks.push(mapTask(task, allProjects, mappedTasks, allUsers || []));
      }
      setTasks(mappedTasks);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedStatus]);

  React.useEffect(() => {
    fetchTasksData()
  }, [fetchTasksData])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchTasksData()
  }

  const taskStats = React.useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "done").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const pending = tasks.filter((t) => t.status === "todo").length
    const overdue = tasks.filter(t =>
      new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length

    return { total, completed, inProgress, pending, overdue }
  }, [tasks])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )

      toast({
        title: "Status updated",
        description: `Task marked as ${newStatus}.`,
      })
    } catch (error) {
      fetchTasksData()
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task) => {
    toast({
      title: "Edit task",
      description: `Editing task: ${task.title}`,
    })
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    } catch (error) {
      fetchTasksData();
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected tasks?`)) {
      try {
        // Delete all selected tasks
        await Promise.all(selectedTasks.map(taskId => deleteTask(taskId)));
        setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
        setSelectedTasks([]);
        toast({
          title: "Tasks deleted",
          description: `${selectedTasks.length} tasks have been removed.`,
        });
      } catch (error) {
        fetchTasksData();
        toast({
          title: "Error deleting tasks",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }

  const handleBulkStatusChange = (status) => {
    if (selectedTasks.length === 0) return

    setTasks(prev =>
      prev.map(task =>
        selectedTasks.includes(task.id) ? { ...task, status } : task
      )
    )
    setSelectedTasks([])
    toast({
      title: "Status updated",
      description: `${selectedTasks.length} tasks marked as ${status}.`,
    })
  }

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleOpenChange = (isOpen) => {
    setShowTaskDetails(isOpen);
    if (!isOpen) {
      // Optional: Clear the selected task when dialog is closed
      setSelectedTask(null);
    }
  };

  const handleTaskAction = (task, action) => {
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this task?')) {
        setTasks(prev => prev.filter(t => t.id !== task.id))
        setShowTaskDetails(false)
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        })
      }
    } else if (action === 'edit') {
      // Handle edit action if needed
      console.log('Edit task:', task.id)
    } else if (action === 'statusChange') {
      // Handle status change
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      )
    }
  }

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    if (activeTab === 'active') {
      filtered = filtered.filter(task => ['todo', 'in-progress'].includes(task.status))
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(task => task.status === 'done')
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()

  const tableColumns = React.useMemo(() => {
    return columns.map(col => {
      if (col.id === 'actions') {
        return {
          ...col,
          cell: ({ row }) => (
            <DataTableRowActions
              row={row}
              onView={(task) => {
                setSelectedTask(task);
                setShowTaskDetails(true);
              }}
              onEdit={(task) => {
                // Handle edit action
                console.log('Edit task:', task.id);
                // You can implement edit functionality here
                // For example: setEditingTask(task); setShowTaskForm(true);
              }}
              onDelete={async (taskId) => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  try {
                    await deleteTask(taskId);
                    setTasks(prev => prev.filter(t => t.id !== taskId));
                    toast({
                      title: "Task deleted",
                      description: "The task has been successfully deleted.",
                    });
                  } catch (error) {
                    fetchTasksData();
                    toast({
                      title: "Error deleting task",
                      description: error.message,
                      variant: "destructive",
                    });
                  }
                }
              }}
              onStatusChange={(taskId, status) => {
                setTasks(prev =>
                  prev.map(t =>
                    t.id === taskId ? { ...t, status } : t
                  )
                );
                toast({
                  title: "Status updated",
                  description: `Task marked as ${status}.`,
                });
              }}
            />
          )
        };
      }
      return col;
    });
  }, [setTasks, setSelectedTask, setShowTaskDetails, fetchTasksData, toast]);

  const handleAddTask = async (taskData) => {
    try {
      let customId = undefined;
      let project = null;
      if (taskData.projectId) {
        const allProjects = projects.length ? projects : await getProjects();
        project = allProjects.find(p => (p._id || p.id) === taskData.projectId);
        if (project && project.name) {
          const acronym = getProjectAcronym(project.name);
          // Use current tasks to determine next customId
          const nextNum = getNextTaskNumberForProject(tasks, acronym);
          customId = `${acronym}-${nextNum}`;
        }
      }
      const newTask = await createTask({ ...taskData, customId });
      const allProjects = projects.length ? projects : await getProjects();
      setTasks(prev => {
        const mapped = mapTask(newTask, allProjects, prev);
        return [...prev, mapped];
      });
      setShowAddTaskModal(false);
      toast({ title: "Task created", description: `Task '${newTask.title}' was created.` });
    } catch (err) {
      toast({ title: "Error creating task", description: err.message, variant: "destructive" });
    }
  };

  // Fetch all projects when modal opens
  React.useEffect(() => {
    if (showAddTaskModal) {
      getProjects().then(setProjects);
      setSelectedProjectId("");
      setSelectedProject(null);
      setTeam([]);
    }
  }, [showAddTaskModal]);

  // Fetch selected project details (including team)
  React.useEffect(() => {
    if (selectedProjectId) {
      getProjectById(selectedProjectId).then((proj) => {
        setSelectedProject(proj);
        setTeam(proj.team || []);
      });
    } else {
      setSelectedProject(null);
      setTeam([]);
    }
  }, [selectedProjectId]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="bg-red-50 p-4 rounded-lg flex items-center max-w-md">
            <OctagonAlert className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen w-full bg-background">
        {/* Header with Stats */}
        <div className="w-full border-b">
          <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
            <div className="w-full">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Manage and track your laboratory tasks
                    </p>
                  </div>
                  <Button className="w-full sm:w-auto" onClick={() => setShowAddTaskModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Task
                  </Button>
                </div>

                {/* Stats Grid - Responsive */}

              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full px-4 sm:px-6 py-4 sm:py-6">
          <div className="w-full">
            {/* Toolbar */}
            <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 hidden sm:block"></div> {/* Spacer for left alignment */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                  <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center justify-center whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'table' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground bg-transparent hover:bg-primary/10'} border-r border-gray-200 dark:border-gray-800`}
                      style={{ borderTopLeftRadius: '9999px', borderBottomLeftRadius: '9999px' }}
                    >
                      <List className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Table</span>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`inline-flex items-center justify-center whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground bg-transparent hover:bg-primary/10'}`}
                      style={{ borderTopRightRadius: '9999px', borderBottomRightRadius: '9999px' }}
                    >
                      <Grid className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Grid</span>
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-9 sm:h-10 px-2 sm:px-3 shadow-sm border border-gray-200 dark:border-gray-800"
                  >
                    <RefreshCw
                      className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedTasks.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-accent/30 rounded-md border">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{selectedTasks.length} selected</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTasks([])}
                      className="h-7 sm:h-8 px-2 text-xs sm:text-sm"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm flex-1 sm:flex-none"
                      onClick={() => handleBulkStatusChange('in-progress')}
                    >
                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Mark </span>In Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm flex-1 sm:flex-none"
                      onClick={() => handleBulkStatusChange('done')}
                    >
                      <CheckCircle2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Mark </span>Done
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} found
                </div>
              </div>

              {viewMode === 'table' ? (
                <div className="w-full overflow-hidden rounded-lg sm:rounded-2xl border shadow-lg bg-white dark:bg-gray-950">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <DataTable
                      columns={tableColumns}
                      data={filteredTasks}
                      onRowSelectionChange={setSelectedTasks}
                      selectedRows={selectedTasks}
                      onRowClick={handleTaskClick}
                    />
                  </div>
                </div>
              ) : (
                <TaskGrid
                  tasks={filteredTasks}
                  selectedTasks={selectedTasks}
                  onTaskSelect={handleTaskSelect}
                  onTaskClick={handleTaskClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Dialog */}
      {selectedTask && (
        <TooltipProvider>
          <TaskDetailsDialog
            open={showTaskDetails}
            onOpenChange={handleOpenChange}
            task={selectedTask}
            onAction={handleTaskAction}
            users={[
              { id: 'user1', name: 'John Doe', avatar: 'JD' },
              { id: 'user2', name: 'Jane Smith', avatar: 'JS' },
              { id: 'user3', name: 'Robert Johnson', avatar: 'RJ' },
            ]}
            experiments={[
              { id: 'exp1', name: 'Cell Culture' },
              { id: 'exp2', name: 'DNA Sequencing' },
              { id: 'exp3', name: 'Protein Analysis' },
            ]}
          />
        </TooltipProvider>
      )}

      <AddTaskModalForTasks
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onAddTask={handleAddTask}
      />
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, variant = 'default' }) {
  const variantClasses = {
    default: 'bg-background',
    pending: 'bg-amber-50 dark:bg-amber-900/20',
    inProgress: 'bg-blue-50 dark:bg-blue-900/20',
    completed: 'bg-green-50 dark:bg-green-900/20',
    overdue: 'bg-red-50 dark:bg-red-900/20',
  }

  return (
    <div className={`flex items-center p-3 sm:p-4 rounded-lg border ${variantClasses[variant]}`}>
      <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-background shadow-sm">
        {icon}
      </div>
      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

// Add missing icon component
function Trash2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

// Custom AddTaskModal for tasks page (inline definition)
function AddTaskModalForTasks({ open, onOpenChange, onAddTask }) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: null,
    status: "todo",
    labels: [],
    attachments: []
  });
  const [focusedField, setFocusedField] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectId, setSelectedProjectId] = React.useState("");
  const [team, setTeam] = React.useState([]);
  const [nextTaskId, setNextTaskId] = React.useState("");
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        assignee: "",
        priority: "",
        dueDate: null,
        status: "todo",
        labels: [],
        attachments: []
      });
      setSelectedProjectId("");
      setTeam([]);
      getProjects().then(setProjects);
    }
  }, [open]);
  React.useEffect(() => {
    if (selectedProjectId) {
      getProjectById(selectedProjectId).then((proj) => {
        setTeam(proj.team || []);
      });
      // Fetch next task ID for preview
      getNextTaskId(selectedProjectId).then((taskId) => {
        setNextTaskId(taskId);
      }).catch((error) => {
        console.error('Error fetching next task ID:', error);
        setNextTaskId('');
      });
    } else {
      setTeam([]);
      setNextTaskId('');
    }
  }, [selectedProjectId]);
  const handleSubmit = () => {
    if (!formData.title.trim() || !selectedProjectId) return;
    let taskToSend = { ...formData, projectId: selectedProjectId };
    if (formData.assignee && team.length) {
      const member = team.find(m => m.id === formData.assignee);
      if (member) {
        taskToSend.assignee = member.name;
      }
    }
    onAddTask(taskToSend);
    onOpenChange(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSubmit();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden p-0 gap-0 border-0 bg-white/95 dark:bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col">
        <DialogHeader className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-b border-slate-200/50 dark:border-border/50">
          <div className="absolute inset-0 bg-white/60 dark:bg-background/60 backdrop-blur-sm"></div>
          <div className="relative">
            <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-foreground flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              Create New Task
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-muted-foreground mt-2 flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/70 border border-slate-200 rounded text-xs font-mono">⌘</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-white/70 border border-slate-200 rounded text-xs font-mono">Enter</kbd>
              <span className="ml-1">to save</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="px-6 py-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          {/* Project Selector */}
          <div className="space-y-3">
            <Label htmlFor="task-project" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
              <Folder className="h-4 w-4 text-indigo-500" />
              Project*
            </Label>
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger id="task-project" className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 dark:bg-muted/20 transition-all duration-200">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-slate-200 dark:border-border shadow-xl">
                {projects.map((proj) => (
                  <SelectItem key={proj.id || proj._id} value={proj.id || proj._id}>
                    {proj.name || proj.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task ID Preview */}
          {selectedProjectId && nextTaskId && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <Label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Task ID Preview</Label>
              </div>
              <div className="font-mono text-lg font-semibold text-indigo-800 dark:text-indigo-200 bg-white/70 dark:bg-muted/20 px-3 py-2 rounded border border-indigo-200 dark:border-indigo-500/30">
                {nextTaskId}
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">This ID will be automatically assigned to your task</p>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-3">
            <Label htmlFor="task-name" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-500" />
              Title*
            </Label>
            <div className="relative">
              <Input
                id="task-name"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "h-11 text-base border-2 transition-all duration-200 bg-white/50 dark:bg-muted/20",
                  focusedField === 'title'
                    ? "border-indigo-300 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30"
                    : "border-slate-200 hover:border-slate-300 dark:border-border/50 dark:hover:border-border"
                )}
              />
              {focusedField === 'title' && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md blur-sm opacity-50"></div>
              )}
            </div>
          </div>
          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="task-description" className="text-sm font-medium text-slate-700 dark:text-foreground">
              Description
            </Label>
            <Textarea
              id="task-description"
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "min-h-[100px] resize-none border-2 transition-all duration-200 bg-white/50 dark:bg-muted/20",
                focusedField === 'description'
                  ? "border-indigo-300 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30"
                  : "border-slate-200 hover:border-slate-300 dark:border-border/50 dark:hover:border-border"
              )}
            />
          </div>
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee */}
            <div className="space-y-3">
              <Label htmlFor="task-assignee" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Assignee
              </Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                disabled={!selectedProjectId || team.length === 0}
              >
                <SelectTrigger
                  id="task-assignee"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 dark:bg-muted/20 transition-all duration-200"
                >
                  <SelectValue placeholder={selectedProjectId ? (team.length ? "Select team member" : "No team members") : "Select project first"} />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-slate-200 dark:border-border shadow-xl">
                  {team.map((member, i) => (
                    <SelectItem key={i} value={member.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Priority */}
            <div className="space-y-3">
              <Label htmlFor="task-priority" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
                <Flag className="h-4 w-4 text-indigo-500" />
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger
                  id="task-priority"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 dark:bg-muted/20 transition-all duration-200"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-slate-200 dark:border-border shadow-xl">
                  <SelectItem value="high" className="dark:hover:bg-muted/20">High</SelectItem>
                  <SelectItem value="medium" className="dark:hover:bg-muted/20">Medium</SelectItem>
                  <SelectItem value="low" className="dark:hover:bg-muted/20">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div className="space-y-3">
              <Label htmlFor="task-status" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger
                  id="task-status"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 dark:bg-muted/20 transition-all duration-200"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-slate-200 dark:border-border shadow-xl">
                  <SelectItem value="todo" className="dark:hover:bg-muted/20">To Do</SelectItem>
                  <SelectItem value="in-progress" className="dark:hover:bg-muted/20">In Progress</SelectItem>
                  <SelectItem value="review" className="dark:hover:bg-muted/20">Review</SelectItem>
                  <SelectItem value="done" className="dark:hover:bg-muted/20">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Due Date */}
          <div className="space-y-3">
            <Label htmlFor="task-due-date" className="text-sm font-medium text-slate-700 dark:text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500" />
              Due Date
            </Label>
            <DatePicker
              selectedDate={formData.dueDate}
              onDateChange={(date) => setFormData({ ...formData, dueDate: date })}
              placeholder="Pick a due date"
              className="w-full h-11"
              popoverClassName="min-w-[320px]"
              disabled={false}
              showClearButton={true}
              showTodayButton={true}
              enableYearNavigation={true}
              mode="single"
            />
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-muted/20 border-t border-slate-200/50 dark:border-border/50 flex justify-end flex-shrink-0">
          <Button onClick={handleSubmit} disabled={!formData.title.trim() || !selectedProjectId}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
