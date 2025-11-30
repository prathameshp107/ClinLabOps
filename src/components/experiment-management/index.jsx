"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Beaker,
  ChevronDown,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  SlidersHorizontal
} from "lucide-react"
import { ExperimentForm } from "./experiment-form"
import { ExperimentDetails } from "./experiment-details"
import { ExperimentGrid } from "./experiment-grid"
import { ExperimentList } from "./experiment-list"
import { getProjects } from "@/services/projectService"

// Import API services
import {
  getExperiments,
  createExperiment,
  updateExperiment,
  deleteExperiment
} from "@/services/experimentService"
import { getCurrentUser, logout } from "@/services/authService"
import { motion, AnimatePresence } from "framer-motion"
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Loader2,
  LayoutList,
  MoreVertical,
  FileText,
  Calendar as CalendarIcon
} from "lucide-react"
import { cn } from "@/lib/utils"


export function ExperimentManagement() {
  const [view, setView] = useState("grid")
  const [experiments, setExperiments] = useState([])
  const [filteredExperiments, setFilteredExperiments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all") // Add project filter state
  const [sortBy, setSortBy] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [projects, setProjects] = useState([])

  // Load current user, projects, and experiments on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const user = getCurrentUser()
        setCurrentUser(user)

        if (user) {
          // Load projects first
          const projectData = await getProjects()
          setProjects(projectData)

          // Then load experiments
          await loadExperiments()
        }
      } catch (error) {
        console.error('Failed to initialize component:', error)
        setError('Failed to load data. Please try again.')
      }
    }

    initializeComponent()
  }, [])

  // Load experiments from API
  const loadExperiments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getExperiments()
      setExperiments(data)
    } catch (error) {
      console.error('Failed to load experiments:', error)
      setError('Failed to load experiments. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and sort experiments
  useEffect(() => {
    let result = [...experiments]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        exp =>
          exp.title.toLowerCase().includes(query) ||
          exp.description.toLowerCase().includes(query) ||
          exp.protocol.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(exp => exp.status === statusFilter)
    }

    // Apply project filter
    if (projectFilter !== "all") {
      result = result.filter(exp => {
        if (projectFilter === "unassigned") {
          return !exp.projectId
        } else {
          // Handle different possible structures for projectId
          const experimentProjectId = exp.projectId?._id || exp.projectId?.id || exp.projectId
          return experimentProjectId && experimentProjectId.toString() === projectFilter.toString()
        }
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortBy]
      let valueB = b[sortBy]

      // Handle date fields
      if (typeof valueA === 'string' && valueA.includes('T')) {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredExperiments(result)
  }, [experiments, searchQuery, statusFilter, projectFilter, sortBy, sortOrder]) // Add projectFilter to dependencies

  // Handle experiment creation
  const handleCreateExperiment = async (experimentData) => {
    try {
      setError(null)
      const newExperiment = await createExperiment(experimentData)
      setExperiments([newExperiment, ...experiments])
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create experiment:', error)
      setError('Failed to create experiment. Please try again.')
    }
  }

  // Handle experiment update
  const handleUpdateExperiment = async (updatedExperiment) => {
    try {
      setError(null)
      const updated = await updateExperiment(updatedExperiment._id || updatedExperiment.id, updatedExperiment)
      setExperiments(experiments.map(exp =>
        (exp._id === updated._id || exp.id === updated.id) ? updated : exp
      ))
      setSelectedExperiment(null)
      setIsDetailsDialogOpen(false)
    } catch (error) {
      console.error('Failed to update experiment:', error)
      setError('Failed to update experiment. Please try again.')
    }
  }

  // Handle experiment deletion
  const handleDeleteExperiment = async (id) => {
    try {
      setError(null)
      console.log('Attempting to delete experiment with ID:', id)
      const result = await deleteExperiment(id)
      console.log('Delete result:', result)
      setExperiments(experiments.filter(exp => exp._id !== id && exp.id !== id))
      setSelectedExperiment(null)
      setIsDetailsDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete experiment:', error)
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to delete experiment. Please try again.'
      setError(errorMessage)
    }
  }

  // Handle experiment selection for viewing details
  const handleViewExperiment = (experiment) => {
    setSelectedExperiment(experiment)
    setIsDetailsDialogOpen(true)
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    setExperiments([])
    setFilteredExperiments([])
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setProjectFilter("all")
    setSortBy("updatedAt")
    setSortOrder("desc")
  }

  // Group experiments by project
  const groupExperimentsByProject = () => {
    const grouped = {
      unassigned: [],
      projects: {}
    }

    filteredExperiments.forEach(experiment => {
      if (experiment.projectId) {
        const projectId = experiment.projectId._id || experiment.projectId
        if (!grouped.projects[projectId]) {
          const project = projects.find(p => p._id === projectId || p.id === projectId)
          grouped.projects[projectId] = {
            project: project || { name: 'Unknown Project' },
            experiments: []
          }
        }
        grouped.projects[projectId].experiments.push(experiment)
      } else {
        grouped.unassigned.push(experiment)
      }
    })

    return grouped
  }

  const groupedExperiments = groupExperimentsByProject()

  // Calculate stats
  const stats = {
    total: experiments.length,
    planning: experiments.filter(e => e.status === 'planning').length,
    inProgress: experiments.filter(e => e.status === 'in-progress').length,
    completed: experiments.filter(e => e.status === 'completed').length
  }

  // Show loading state if no current user yet
  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="rounded-full bg-muted p-3 mb-4 mx-auto w-fit">
              <Beaker className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Loading Experiments</h3>
            <p className="text-muted-foreground">Please wait while we load your data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats Section */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Experiments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage laboratory experiments, protocols, and results
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  <Plus className="mr-2 h-5 w-5" />
                  New Experiment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Experiment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new laboratory experiment.
                  </DialogDescription>
                </DialogHeader>
                <ExperimentForm onSubmit={handleCreateExperiment} onCancel={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Experiments"
            value={stats.total}
            icon={<FlaskConical className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
          />
          <StatCard
            title="Planning"
            value={stats.planning}
            icon={<FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
            className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<Loader2 className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-spin-slow" />}
            className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />}
            className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800"
          />
        </motion.div>
      </div>

      {/* Filters and Actions Bar */}
      <div className="flex flex-col space-y-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 rounded-2xl border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search experiments..."
              className="w-full pl-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* View Toggle & Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Button
                variant={view === "grid" ? "white" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  view === "grid" ? "bg-white dark:bg-gray-700 shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setView("grid")}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={view === "list" ? "white" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 px-3 rounded-md transition-all",
                  view === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 px-3 bg-white dark:bg-gray-950">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setSortBy("title"); setSortOrder("asc"); }}>
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("title"); setSortOrder("desc"); }}>
                  Title (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("createdAt"); setSortOrder("desc"); }}>
                  Created (Newest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("createdAt"); setSortOrder("asc"); }}>
                  Created (Oldest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("updatedAt"); setSortOrder("desc"); }}>
                  Updated (Recent)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortBy("priority"); setSortOrder("desc"); }}>
                  Priority (High-Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-2 w-full">
            <span className="text-sm font-medium text-muted-foreground self-center mr-2">Status:</span>
            {["all", "planning", "in-progress", "completed", "archived"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "h-8 rounded-full px-4 text-xs font-medium transition-all",
                  statusFilter === status
                    ? "bg-primary/10 text-primary hover:bg-primary/20 ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Project:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-full bg-white dark:bg-gray-950 border-dashed">
                  {projectFilter === "all" ? "All Projects" :
                    projectFilter === "unassigned" ? "Unassigned" :
                      projects.find(p => (p._id || p.id) === projectFilter)?.name || "Project"}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProjectFilter("all")}>All Projects</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProjectFilter("unassigned")}>Unassigned</DropdownMenuItem>
                {projects.length > 0 && <DropdownMenuSeparator />}
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project._id || project.id}
                    onClick={() => setProjectFilter(project._id || project.id)}
                  >
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchQuery || statusFilter !== "all" || projectFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-auto p-1 text-destructive hover:bg-destructive/10"
              onClick={() => setError(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Experiments Display - Grouped by Project */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-48 rounded-none" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="px-6 py-4 bg-muted/50">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Unassigned Experiments */}
          {groupedExperiments.unassigned.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Unassigned Experiments</h3>
              {view === "grid" ? (
                <ExperimentGrid
                  experiments={groupedExperiments.unassigned}
                  onView={handleViewExperiment}
                />
              ) : (
                <ExperimentList
                  experiments={groupedExperiments.unassigned}
                  onView={handleViewExperiment}
                />
              )}
            </div>
          )}

          {/* Project Groups */}
          {Object.keys(groupedExperiments.projects).length > 0 ? (
            Object.entries(groupedExperiments.projects).map(([projectId, projectGroup]) => (
              <div key={projectId}>
                <h3 className="text-xl font-semibold mb-4">{projectGroup.project?.name || 'Unknown Project'}</h3>
                {view === "grid" ? (
                  <ExperimentGrid
                    experiments={projectGroup.experiments}
                    onView={handleViewExperiment}
                  />
                ) : (
                  <ExperimentList
                    experiments={projectGroup.experiments}
                    onView={handleViewExperiment}
                  />
                )}
              </div>
            ))
          ) : (
            groupedExperiments.unassigned.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Beaker className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No experiments found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters or search query to find what you're looking for."
                      : "Get started by creating your first experiment."}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Experiment
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}

      {/* Experiment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Experiment Details</DialogTitle>
          </DialogHeader>
          {selectedExperiment && (
            <ExperimentDetails
              experiment={selectedExperiment}
              onUpdate={handleUpdateExperiment}
              onDelete={handleDeleteExperiment}
              onClose={() => setIsDetailsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ title, value, icon, className }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className={cn(
        "flex items-center p-4 rounded-xl border shadow-sm transition-all duration-200",
        className
      )}
    >
      <div className="flex-shrink-0 p-3 rounded-lg bg-white dark:bg-gray-950 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
        {icon}
      </div>
      <div className="ml-4 min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}