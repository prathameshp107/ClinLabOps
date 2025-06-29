"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Filter, Calendar, BarChart2, Users, SlidersHorizontal, RefreshCw, AlertCircle, Clock, CheckCircle2, Search, OctagonAlert, List, Grid, PlusCircle, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { mockTasks } from "@/data/tasks-data"

// Mock data for tasks
const mockTasksData = mockTasks;

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
  
  const [tasks, setTasks] = React.useState(() => {
    // Transform mockTasks to processedTasks shape
    return mockTasksData.map(task => ({
      id: task._id || task.id,
      title: task.title || task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: {
        id: task.assignedTo?.id || task.assigneeId,
        name: task.assignedTo?.name || task.assignedToName,
        avatar: task.assignedTo?.avatar || "/avatars/01.png"
      },
      project: {
        id: task.experiment || task.experimentId,
        name: task.experimentName
      },
      createdAt: task.createdAt
    }));
  });

  const fetchTasksData = React.useCallback(async () => {
    try {
      setError(null)

      // Use mock data instead of API call
      let filteredTasks = [...mockTasksData];

      // Apply status filter
      if (selectedStatus !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
      }

      // Transform to match expected format
      const processedTasks = filteredTasks.map(task => ({
        id: task._id || task.id,
        title: task.title || task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: {
          id: task.assignedTo?.id || task.assigneeId,
          name: task.assignedTo?.name || task.assignedToName,
          avatar: task.assignedTo?.avatar || "/avatars/01.png"
        },
        project: {
          id: task.experiment || task.experimentId,
          name: task.experimentName
        },
        createdAt: task.createdAt
      }));

      setTasks(processedTasks);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error processing tasks:", err);
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
    const completed = tasks.filter((t) => t.status === "completed").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const pending = tasks.filter((t) => t.status === "pending").length
    const overdue = tasks.filter(t =>
      new Date(t.dueDate) < new Date() && t.status !== 'completed'
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
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      })
    } catch (error) {
      fetchTasksData()
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return

    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} selected tasks?`)) {
      setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)))
      setSelectedTasks([])
      toast({
        title: "Tasks deleted",
        description: `${selectedTasks.length} tasks have been removed.`,
      })
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
      filtered = filtered.filter(task => ['pending', 'in-progress'].includes(task.status))
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed')
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
              onDelete={(taskId) => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  setTasks(prev => prev.filter(t => t.id !== taskId));
                  toast({
                    title: "Task deleted",
                    description: "The task has been successfully deleted.",
                  });
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
  }, [setTasks, setSelectedTask, setShowTaskDetails])

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
          <div className="w-full px-6 py-6">
            <div className="max-w-[2000px] mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                      Manage and track your laboratory tasks
                    </p>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard
                    title="Total"
                    value={taskStats.total}
                    icon={<List className="h-4 w-4" />}
                    variant="default"
                  />
                  <StatCard
                    title="Pending"
                    value={taskStats.pending}
                    icon={<Clock className="h-4 w-4 text-amber-500" />}
                    variant="pending"
                  />
                  <StatCard
                    title="In Progress"
                    value={taskStats.inProgress}
                    icon={<Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                    variant="inProgress"
                  />
                  <StatCard
                    title="Completed"
                    value={taskStats.completed}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                    variant="completed"
                  />
                  <StatCard
                    title="Overdue"
                    value={taskStats.overdue}
                    icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                    variant="overdue"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full px-6 py-6">
          <div className="max-w-[2000px] mx-auto">
            {/* Toolbar */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1"></div> {/* Spacer for left alignment */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'table' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground bg-transparent hover:bg-primary/10'} border-r border-gray-200 dark:border-gray-800`}
                      style={{ borderTopLeftRadius: '9999px', borderBottomLeftRadius: '9999px' }}
                    >
                      <List className="mr-2 h-4 w-4" />
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground bg-transparent hover:bg-primary/10'}`}
                      style={{ borderTopRightRadius: '9999px', borderBottomRightRadius: '9999px' }}
                    >
                      <Grid className="mr-2 h-4 w-4" />
                      Grid
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-10 ml-2 shadow-sm border border-gray-200 dark:border-gray-800"
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedTasks.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-md border">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{selectedTasks.length} selected</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTasks([])}
                      className="h-8"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleBulkStatusChange('in-progress')}
                    >
                      <Loader2 className="mr-2 h-3.5 w-3.5" />
                      Mark In Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleBulkStatusChange('completed')}
                    >
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                      Mark Completed
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="w-full overflow-x-auto">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} found
                </div>
              </div>

              {viewMode === 'table' ? (
                <div className="cursor-pointer">
                  <DataTable
                    columns={tableColumns}
                    data={filteredTasks}
                    onRowSelectionChange={setSelectedTasks}
                    selectedRows={selectedTasks}
                    onRowClick={handleTaskClick}
                  />
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
    <div className={`flex items-center p-4 rounded-lg border ${variantClasses[variant]}`}>
      <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
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
