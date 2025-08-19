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

// Import API services
import {
  getExperiments,
  createExperiment,
  updateExperiment,
  deleteExperiment
} from "@/services/experimentService"
import { getCurrentUser, logout } from "@/services/authService"


export function ExperimentManagement() {
  const [view, setView] = useState("grid")
  const [experiments, setExperiments] = useState([])
  const [filteredExperiments, setFilteredExperiments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedExperiment, setSelectedExperiment] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Load current user and experiments on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const user = getCurrentUser()
        setCurrentUser(user)

        if (user) {
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
  }, [experiments, searchQuery, statusFilter, sortBy, sortOrder])

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
    setSortBy("updatedAt")
    setSortOrder("desc")
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
    <div className="space-y-6">
      {/* Filters and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search experiments..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("planning")}>
                  Planning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("archived")}>
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort
                  <ChevronDown className="ml-2 h-4 w-4" />
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

            <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-between md:justify-end items-center">
          {/* User info and logout */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Welcome, {currentUser?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 px-2 text-xs"
            >
              Logout
            </Button>
          </div>

          <div className="flex border rounded-md p-1">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
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
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "planning" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("planning")}
          >
            Planning
          </Button>
          <Button
            variant={statusFilter === "in-progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("in-progress")}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("archived")}
          >
            Archived
          </Button>
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

      {/* Experiments Display */}
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
        <>
          {filteredExperiments.length === 0 ? (
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
          ) : (
            view === "grid" ? (
              <ExperimentGrid
                experiments={filteredExperiments}
                onView={handleViewExperiment}
              />
            ) : (
              <ExperimentList
                experiments={filteredExperiments}
                onView={handleViewExperiment}
              />
            )
          )}
        </>
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