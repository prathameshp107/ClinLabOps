"use client"

import { useState, useMemo } from "react"
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  UserPlus,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  LayoutList,
  GripVertical,
  Filter,
  ArrowUpDown,
  ListFilter,
  LayoutGrid,
  ListChecks,
  RefreshCw,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddTaskModal } from "./add-task-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

const TaskStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'review':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(status)}`}
    >
      {status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </Badge>
  );
};

const TaskPriority = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(priority)}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export function ProjectTasks({ tasks, team, onAddTask }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedTasks, setSelectedTasks] = useState([])

  // Filter and paginate tasks
  const filteredTasks = useMemo(() => {
    return tasks?.filter(task => {
      const matchesSearch = searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    }) || []
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  // Sort tasks
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "dueDate":
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
          const statusOrder = { completed: 3, in_progress: 2, pending: 1 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = a[sortBy]?.localeCompare(b[sortBy]);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredTasks, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage)
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedTasks, currentPage, itemsPerPage])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }

      if (startPage > 2) {
        pages.push("...")
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [currentPage, totalPages])

  const handleAddTask = (taskData) => {
    onAddTask(taskData)
    setIsAddTaskModalOpen(false)
  }

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAllTasks = () => {
    setSelectedTasks(prev =>
      prev.length === paginatedTasks.length
        ? []
        : paginatedTasks.map(task => task.id)
    )
  }

  return (
    <>
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40 shadow-lg">
        <CardHeader className="px-6 py-4 border-b border-border/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <LayoutList className="h-5 w-5 text-primary" />
                </div>
                Project Tasks
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {tasks?.length || 0} tasks
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg shadow-sm border border-border/40 bg-background overflow-hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        className={`rounded-none h-9 w-9 ${viewMode === "list" ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => setViewMode("list")}
                      >
                        <ListChecks className="h-4 w-4" />
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
                        className={`rounded-none h-9 w-9 border-l border-border/30 ${viewMode === "board" ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => setViewMode("board")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Board View</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-9 px-4 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="relative flex-1 min-w-[250px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-9 h-9 w-full text-sm border-border/40 focus:border-primary/70 focus:ring-1 focus:ring-primary/70"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-[140px] text-sm border-border/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(value) => {
                setPriorityFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-[140px] text-sm border-border/40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="h-9 w-[140px] text-sm border-border/40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-border/40"
              onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedTasks.length > 0 ? (
            <div>
              {selectedTasks.length > 0 && (
                <div className="flex justify-between items-center px-6 py-2 bg-muted/50 border-b border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={handleSelectAllTasks}
                  >
                    {selectedTasks.length === paginatedTasks.length ? "Deselect All" : "Select All"}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="divide-y divide-border/30">
                  {paginatedTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr_2fr_2fr_0.5fr] gap-4 items-center px-6 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskSelection(task.id)}
                          className="h-4 w-4 rounded-sm border-border/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div>
                          <label htmlFor={`task-${task.id}`} className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                            {task.name}
                          </label>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                        </div>
                      </div>

                      <div>
                        <TaskStatus status={task.status} />
                      </div>

                      <div>
                        <TaskPriority priority={task.priority} />
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{task.dueDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {task.assigneeId && team?.find(m => m.id === task.assigneeId) ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-6 w-6 border border-border/40">
                                  <AvatarImage src={team.find(m => m.id === task.assigneeId)?.avatar} alt={task.assignee} />
                                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                    {task.assignee.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent><p>{task.assignee}</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border/40">
                            <UserPlus className="h-3 w-3" />
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">{task.assignee || 'Unassigned'}</span>
                      </div>

                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="text-sm">
                              <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-destructive">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 px-6 py-3 border-t border-border/30">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 border-border/40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {pageNumbers.map((page, index) => (
                    <Button
                      key={index}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof page === 'number' && goToPage(page)}
                      disabled={typeof page !== 'number'}
                      className={`h-8 w-8 p-0 ${page === currentPage
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'border-border/40 text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 border-border/40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <LayoutList className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No tasks found</p>
              <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters or add a new task.</p>
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-9 px-4 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
        project={{ team }}
        onAddTask={handleAddTask}
      />
    </>
  )
}