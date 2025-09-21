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
  Sparkles,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Users
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
import { cn } from "@/lib/utils"
import {
  avatarColors,
  taskStatusConfig,
  taskPriorityConfig,
  priorityOrder,
  statusOrder
} from "@/constants"

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRandomColor = (name) => {
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  return avatarColors[Math.abs(hash) % avatarColors.length]
}

const TaskStatus = ({ status }) => {
  const config = taskStatusConfig[status] || taskStatusConfig.pending;

  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${config.color}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-current"></div>
        {config.label}
      </div>
    </div>
  );
};

const TaskPriority = ({ priority }) => {
  const config = taskPriorityConfig[priority] || taskPriorityConfig.medium;

  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${config.color}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-current"></div>
        {config.label}
      </div>
    </div>
  );
};

export function ProjectTasks({ tasks = [], team = [], onAddTask, onDeleteTask }) {
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
  const [deletingTaskId, setDeletingTaskId] = useState(null)

  const filteredTasks = useMemo(() => {
    return tasks?.filter(task => {
      const matchesSearch = searchQuery === "" ||
        (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    }) || []
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "dueDate":
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case "priority":
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
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

  const renderAssignee = (task) => {
    const assignee = team?.find(m => m.id === task.assigneeId)
    const assigneeName = assignee?.name || task.assignee || 'Unassigned'
    const initials = getInitials(assigneeName)
    const bgColor = getRandomColor(assigneeName)

    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-6 w-6 border border-border/40">
                  {assignee?.avatar ? (
                    <AvatarImage
                      src={assignee.avatar}
                      alt={assigneeName}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <AvatarFallback
                    className={cn(
                      "text-xs font-medium text-white",
                      bgColor
                    )}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{assigneeName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-sm text-muted-foreground">{assigneeName}</span>
      </div>
    )
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/20 dark:via-blue-950/30 dark:to-indigo-950/20 border border-border/50 backdrop-blur-sm">
        <CardHeader className="px-6 py-6 border-b border-border/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                  <LayoutList className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Project Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs px-3 py-1 bg-background/60 backdrop-blur-sm border border-border/50">
                    {tasks?.length || 0} tasks
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4" />
                    <span>65% completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-11 px-6 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="relative flex-1 min-w-[250px] max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-11 h-11 w-full text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
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
              <SelectTrigger className="h-11 w-[160px] text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
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
              <SelectTrigger className="h-11 w-[160px] text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
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
              <SelectTrigger className="h-11 w-[160px] text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 bg-background/60 backdrop-blur-sm border-border/50 hover:bg-muted rounded-xl shadow-sm"
              onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedTasks.length > 0 ? (
            <div>
              {selectedTasks.length > 0 && (
                <div className="flex justify-between items-center px-6 py-3 bg-background/60 backdrop-blur-sm border-b border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm hover:bg-muted rounded-lg"
                    onClick={handleSelectAllTasks}
                  >
                    {selectedTasks.length === paginatedTasks.length ? "Deselect All" : "Select All"}
                  </Button>
                  <span className="text-sm text-muted-foreground font-medium">
                    {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="divide-y divide-gray-200/50">
                  {paginatedTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr_2fr_2fr_0.5fr] gap-4 items-center px-6 py-4 hover:bg-background/60 backdrop-blur-sm transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskSelection(task.id)}
                          className="h-4 w-4 rounded-sm border-gray-300"
                        />
                        <span className="text-sm text-gray-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <label htmlFor={`task-${task.id}`} className="text-sm font-semibold text-foreground cursor-pointer hover:text-blue-600 transition-colors">
                            {task.name}
                          </label>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                        </div>
                      </div>

                      <div>
                        <TaskStatus status={task.status} />
                      </div>

                      <div>
                        <TaskPriority priority={task.priority} />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{task.dueDate}</span>
                      </div>

                      {renderAssignee(task)}

                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 p-2 bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
                            <DropdownMenuItem className="text-sm py-3 px-3 rounded-lg hover:bg-blue-50 transition-colors">
                              <Edit className="h-4 w-4 mr-3 text-blue-600" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-sm py-3 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this task?')) {
                                  setDeletingTaskId(task.id)
                                  try {
                                    await onDeleteTask?.(task.id)
                                  } finally {
                                    setDeletingTaskId(null)
                                  }
                                }
                              }}
                              disabled={deletingTaskId === task.id}
                            >
                              <Trash className="h-4 w-4 mr-3" />
                              {deletingTaskId === task.id ? 'Deleting...' : 'Delete Task'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-border/50 bg-background/60 backdrop-blur-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0 rounded-lg bg-background/60 backdrop-blur-sm border-border/50 hover:bg-muted"
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
                      className={`h-9 w-9 p-0 rounded-lg ${page === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                        : 'bg-background/60 backdrop-blur-sm border-border/50 hover:bg-muted text-muted-foreground'
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
                    className="h-9 w-9 p-0 rounded-lg bg-background/60 backdrop-blur-sm border-border/50 hover:bg-muted"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl mb-6">
                <LayoutList className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">Try adjusting your filters or add a new task to get started.</p>
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-11 px-6 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
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