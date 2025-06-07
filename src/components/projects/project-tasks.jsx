"use client"

import { useState, useMemo } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash, UserPlus, Calendar, Clock, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, LayoutList, GripVertical } from "lucide-react"
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

const TaskStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(status)}`}
    >
      {status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    </Badge>
  );
};

const TaskPriority = ({ priority }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityColor(priority)}`}
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

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTasks, currentPage, itemsPerPage])

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

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
            <LayoutList className="h-4 w-4 text-gray-500" />
            Project Tasks
          </CardTitle>
          <Button
            size="sm"
            onClick={onAddTask}
            className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="relative flex-1 min-w-[250px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 h-8 w-full text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
            <SelectTrigger className="h-8 w-[140px] text-sm border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
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
            <SelectTrigger className="h-8 w-[140px] text-sm border-gray-200">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {paginatedTasks.length > 0 ? (
          <div>
            <div className="grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr_2fr_2fr_0.5fr] gap-4 px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
              <div>#</div>
              <div>Task</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Due Date</div>
              <div>Assignee</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-100">
              {paginatedTasks.map((task, i) => (
                <div
                  key={task.id}
                  className="grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr_2fr_2fr_0.5fr] gap-4 items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.status === 'completed'}
                      className="h-4 w-4 rounded-sm border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div>
                      <label htmlFor={`task-${task.id}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {task.name}
                      </label>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  <div>
                    <TaskStatus status={task.status} />
                  </div>

                  <div>
                    <TaskPriority priority={task.priority} />
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.assigneeId && team?.find(m => m.id === task.assigneeId) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 border border-gray-200">
                              <AvatarImage src={team.find(m => m.id === task.assigneeId)?.avatar} alt={task.assignee} />
                              <AvatarFallback className="text-xs bg-gray-100 text-gray-600">{task.assignee.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent><p>{task.assignee}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200">
                        <UserPlus className="h-3 w-3" />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{task.assignee || 'Unassigned'}</span>
                  </div>

                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="text-sm">
                          <Edit className="h-4 w-4 mr-2 text-gray-500" />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm text-red-600">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 px-4 py-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0 border-gray-200"
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
                    className={`h-7 w-7 p-0 ${page === currentPage
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
                  className="h-7 w-7 p-0 border-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <LayoutList className="h-10 w-10 mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-900 mb-1">No tasks found</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or add a new task.</p>
            <Button
              onClick={onAddTask}
              className="h-8 px-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}