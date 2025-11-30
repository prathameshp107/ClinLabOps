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
    <div className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm flex items-center gap-2 w-fit", config.color)}>
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
      {config.label}
    </div>
  );
};

const TaskPriority = ({ priority }) => {
  const config = taskPriorityConfig[priority] || taskPriorityConfig.medium;

  return (
    <div className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm flex items-center gap-2 w-fit", config.color)}>
      <Zap className="h-3 w-3" />
      {config.label}
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
                <Avatar className="h-7 w-7 border-2 border-background shadow-sm">
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
                      "text-[10px] font-bold text-white",
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
        <span className="text-sm text-muted-foreground truncate max-w-[100px]">{assigneeName}</span>
      </div>
    )
  }

  return (
    <>
      <Card className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
        <CardHeader className="px-8 py-6 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                  <LayoutList className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">
                  Project Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs px-2.5 py-0.5 bg-background/50 border border-border/50">
                    {tasks?.length || 0} tasks
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>65% completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 rounded-xl w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 h-10 w-full text-sm bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
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
              <SelectTrigger className="h-10 w-[140px] text-sm bg-background/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(value) => {
                setPriorityFilter(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-10 w-[140px] text-sm bg-background/50 border-border/50 rounded-xl">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-11 w-[100px] text-sm bg-background/60 backdrop-blur-sm border-border/50 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm">
                  <SelectValue placeholder="Per Page" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="h-10 w-[140px] text-sm bg-background/50 border-border/50 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 bg-background/50 border-border/50 rounded-xl"
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedTasks.length > 0 ? (
            <div>
              {selectedTasks.length > 0 && (
                <div className="flex justify-between items-center px-8 py-3 bg-primary/5 border-b border-primary/10">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedTasks.length === paginatedTasks.length}
                      onCheckedChange={handleSelectAllTasks}
                      className="h-4 w-4 rounded-sm border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <span className="text-sm font-medium text-primary">
                      {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs hover:bg-primary/10 text-primary hover:text-primary"
                    onClick={() => setSelectedTasks([])}
                  >
                    Deselect All
                  </Button>
                </div>
              )}

              <ScrollArea className="h-[600px]">
                <div className="divide-y divide-border/50">
                  {paginatedTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className={cn(
                        "group grid grid-cols-[auto_1fr_auto] md:grid-cols-[40px_100px_1.5fr_120px_120px_140px_160px_60px] gap-4 items-center px-8 py-4 hover:bg-muted/30 transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary",
                        selectedTasks.includes(task.id) && "bg-primary/5 border-l-primary"
                      )}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => handleTaskSelection(task.id)}
                          className="h-4 w-4 rounded-sm border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all"
                        />
                      </div>

                      <div className="hidden md:flex flex-col">
                        <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors">
                          {task.customId || `TASK-${(task._id || task.id)?.substring(0, 6)}`}
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <label htmlFor={`task-${task.id}`} className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors truncate">
                          {task.title}
                        </label>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {task.description || "No description provided"}
                        </p>
                      </div>

                      <div className="hidden md:block">
                        <TaskStatus status={task.status} />
                      </div>

                      <div className="hidden md:block">
                        <TaskPriority priority={task.priority} />
                      </div>

                      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                      </div>

                      <div className="hidden md:flex items-center gap-2">
                        {renderAssignee(task)}
                      </div>

                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-sm">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1 bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl">
                            <DropdownMenuItem className="text-xs py-2 px-2 rounded-lg hover:bg-muted cursor-pointer">
                              <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-border/50" />
                            <DropdownMenuItem
                              className="text-xs py-2 px-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
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
                              <Trash className="h-3.5 w-3.5 mr-2" />
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
                <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-border/50 bg-muted/20">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-lg border-border/50"
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
                      className={cn(
                        "h-8 w-8 p-0 rounded-lg text-xs font-medium transition-all",
                        page === currentPage
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-background border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 rounded-lg border-border/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="bg-muted/30 p-6 rounded-full mb-6 border border-border/50">
                <LayoutList className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tasks found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">Try adjusting your filters or add a new task to get started.</p>
              <Button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="h-10 px-6 text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
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