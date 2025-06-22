"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Filter, Calendar, BarChart2, Users, SlidersHorizontal, RefreshCw, AlertCircle, Clock, CheckCircle2, Search, OctagonAlert } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/tasks-v2/data-table"
import { columns } from "@/components/tasks-v2/columns"
import { TasksLoading } from "@/components/tasks/tasks-loading"
import { fetchTasks } from "@/lib/api/tasks"
import { DataTableRowActions } from "@/components/tasks-v2/data-table-row-actions"
import { toast } from "@/components/ui/use-toast"

export default function TasksPage() {
  const [tasks, setTasks] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())

  const fetchTasksData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let statusFilter = selectedStatus
      if (activeTab === "active") {
        statusFilter = "in-progress,pending"
      } else if (activeTab === "completed") {
        statusFilter = "completed"
      } else if (activeTab === "all") {
        statusFilter = undefined
      }

      const tasksData = await fetchTasks({
        status: statusFilter,
        search: searchQuery || undefined,
        sortBy: 'dueDate',
        sortOrder: 'asc'
      })

      const transformedTasks = tasksData.map(task => ({
        ...task,
        assignedTo: {
          id: task.assignedTo,
          name: task.assignedToName,
          avatar: "/avatars/01.png" // Default avatar
        },
        project: {
          id: task.experiment,
          name: task.experimentName
        }
      }))

      setTasks(transformedTasks)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to load tasks. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, activeTab, selectedStatus])

  React.useEffect(() => {
    fetchTasksData()
  }, [fetchTasksData])

  const handleRefresh = () => {
    fetchTasksData()
  }

  const filteredTasks = React.useMemo(() => {
    return [...tasks]
  }, [tasks])

  const taskStats = React.useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === "completed").length
    const inProgress = tasks.filter((t) => t.status === "in-progress").length
    const pending = tasks.filter((t) => t.status === "pending").length

    return { total, completed, inProgress, pending }
  }, [tasks])

  const formattedLastRefreshed = React.useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(lastRefreshed)
  }, [lastRefreshed])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )

      // TODO: Call API to update task status
      // await updateTaskStatus(taskId, newStatus);

      toast({
        title: "Status updated",
        description: `Task status has been updated.`,
      })
    } catch (error) {
      // Revert on error
      fetchTasksData()
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task) => {
    // TODO: Implement edit task modal/dialog
    toast({
      title: "Edit task",
      description: `Editing task: ${task.title}`,
    })
  }

  const handleDeleteTask = async (taskId) => {
    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

      // TODO: Call API to delete task
      // await deleteTask(taskId);

      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      })
    } catch (error) {
      // Revert on error
      fetchTasksData()
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Memoize the columns to prevent unnecessary re-renders
  const tableColumns = React.useMemo(
    () => columns.map(col => ({
      ...col,
      cell: col.id === "actions"
        ? (props) => (
          <DataTableRowActions
            row={props.row}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )
        : col.cell,
    })),
    []
  )

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
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Try Again'}
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading && tasks.length === 0) {
    return (
      <DashboardLayout>
        <TasksLoading />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-background p-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your tasks today.
          </p>
        </motion.div>

        {/* Sticky header/toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 sticky top-0 z-30"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-[300px]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasksData}
              disabled={isLoading}
              className="h-10"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""
                  }`}
              />
              Refresh
            </Button>
            <Button size="sm" className="h-10">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="space-y-4">
          {isLoading ? (
            <TasksLoading />
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-medium">Error loading tasks</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message}
              </p>
              <Button variant="outline" onClick={fetchTasksData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          ) : (
            <>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <TabsList className="bg-background/50 backdrop-blur-sm">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  <DataTable columns={tableColumns} data={tasks} />
                </TabsContent>
                <TabsContent value="active" className="space-y-4">
                  <DataTable
                    columns={tableColumns}
                    data={tasks.filter(task =>
                      ['pending', 'in-progress'].includes(task.status)
                    )}
                  />
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <DataTable
                    columns={tableColumns}
                    data={tasks.filter(task => task.status === 'completed')}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
