"use client"

import { useState, useMemo } from "react"
import { Edit, MoreHorizontal, Plus, Search, Trash, UserPlus, Calendar, Clock, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProjectTasks({ tasks, team, onAddTask }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Filter and paginate tasks
  const filteredTasks = useMemo(() => {
    return tasks?.filter(task => {
      // Apply search filter
      const matchesSearch = searchQuery === "" || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Apply status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      
      // Apply priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    }) || []
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTasks.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTasks, currentPage, itemsPerPage])

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4)
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3)
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...")
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...")
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }, [currentPage, totalPages])

  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Project Tasks</CardTitle>
          <Button size="sm" onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-8 h-9" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by status" />
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
              setCurrentPage(1) // Reset to first page on filter change
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filter by priority" />
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
      <CardContent>
        {/* Task Grid Header */}
        <div className="grid grid-cols-12 gap-4 mb-2 px-3 py-2 bg-muted/30 rounded-md text-xs font-medium text-muted-foreground">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Task</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {/* Task Grid Items */}
        <div className="space-y-2">
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map((task, i) => (
              <div 
                key={task.id} 
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-background/40 border border-border/30 hover:bg-background/70 transition-colors"
              >
                {/* Task ID - showing actual position in the filtered list */}
                <div className="col-span-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </div>
                </div>
                
                {/* Rest of the task item remains the same */}
                <div className="col-span-4">
                  <div className="flex items-start gap-2">
                    <Checkbox id={`task-${task.id}`} checked={task.status === 'completed'} className="mt-1" />
                    <div>
                      <label htmlFor={`task-${task.id}`} className="text-sm font-medium cursor-pointer">
                        {task.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{task.description}</p>
                      <div className="w-full mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Badge variant={
                    task.status === 'completed' ? 'success' : 
                    task.status === 'in_progress' ? 'warning' : 'outline'
                  } className="text-xs">
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="col-span-1">
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'warning' : 'default'
                  } className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs">{task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate) < new Date() ? 
                        <span className="text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Overdue
                        </span> : 
                        "5 days left"
                      }
                    </span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={team?.find(m => m.id === task.assigneeId)?.avatar} alt={task.assignee} />
                      <AvatarFallback className="text-xs">{task.assignee.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignee}</span>
                  </div>
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Reassign
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No tasks found matching your filters.</p>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="flex items-center gap-2">
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1) // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              Showing {filteredTasks.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 p-0"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {pageNumbers.map((page, index) => (
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">...</span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              )
            ))}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 p-0"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}