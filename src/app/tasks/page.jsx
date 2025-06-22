"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Filter, Calendar, BarChart2, Users, SlidersHorizontal, RefreshCw, AlertCircle, Clock, CheckCircle2, Search, AlertCircle as AlertIcon } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/tasks-v2/data-table"
import { columns } from "@/components/tasks-v2/columns"
import { TasksLoading } from "@/components/tasks/tasks-loading"
import { fetchTasks } from "@/lib/api/tasks"

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="bg-red-50 p-4 rounded-lg flex items-center max-w-md">
            <AlertIcon className="h-5 w-5 text-red-500 mr-2" />
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
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-11 h-12 bg-background/80 border-border/40 rounded-lg focus:ring-1 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchTasksData()
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchTasksData}
              disabled={isLoading}
              className="h-12 w-12"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <div className="text-xs text-muted-foreground hidden md:block">
              Last updated: {formattedLastRefreshed}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300 h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                    <h3 className="text-2xl font-bold mt-1">{taskStats.total}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/5">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300 h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-2xl font-bold mt-1">{taskStats.completed}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/5">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300 h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <h3 className="text-2xl font-bold mt-1">{taskStats.inProgress}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-yellow-500/5">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300 h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <h3 className="text-2xl font-bold mt-1">{taskStats.pending}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/5">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tasks Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all duration-300 rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
                  <p className="text-sm text-muted-foreground">
                    {taskStats.total} tasks • {taskStats.completed} completed • {taskStats.inProgress} in progress • {taskStats.pending} pending
                  </p>
                </div>
                <Button className="h-10">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>

              <Tabs
                defaultValue="all"
                className="mt-4"
                onValueChange={(value) => {
                  setActiveTab(value)
                }}
              >
                <TabsList className="bg-background/50 backdrop-blur-sm border border-border/30">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/5">All Tasks</TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-primary/5">Active</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-primary/5">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable
                columns={columns}
                data={filteredTasks}
                className="border-0"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
