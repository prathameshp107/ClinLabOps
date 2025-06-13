import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO, isAfter } from "date-fns"
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreHorizontal,
  Calendar,
  Users
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { HoverGlowCard } from "@/components/ui/aceternity/cards"

export function TaskList({ 
  tasks, 
  users, 
  experiments, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete 
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  
  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = 
      priorityFilter === "all" || 
      task.priority === priorityFilter;
    
    // Assignee filter
    const matchesAssignee = 
      assigneeFilter === "all" || 
      task.assigneeId === assigneeFilter;
    
    // Date filter
    let matchesDate = true;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    
    if (dateFilter === "overdue") {
      matchesDate = isAfter(today, dueDate) && task.status !== "completed";
    } else if (dateFilter === "today") {
      matchesDate = 
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === "upcoming") {
      matchesDate = isAfter(dueDate, today);
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDate;
  });
  
  // Format status for display
  const formatStatus = (status) => {
    switch(status) {
      case "pending": return "To Do";
      case "in-progress": return "In Progress";
      case "completed": return "Completed";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  // Navigate to task details
  const handleTaskClick = (taskId) => {
    router.push(`/tasks/${taskId}`);
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your laboratory tasks</p>
        </div>
        
        <Button className="sm:w-auto w-full" onClick={onTaskCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      
      {/* Filters and search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted/50 rounded-lg p-1 flex">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm"
            className="rounded-md"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm"
            className="rounded-md"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>
      
      {/* Task list */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const assignee = users.find(u => u.id === task.assigneeId) || { name: "Unassigned", avatarUrl: "" };
            const experiment = experiments.find(e => e.id === task.experimentId) || { name: "No Experiment" };
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <HoverGlowCard 
                  onClick={() => handleTaskClick(task.id)}
                  className="cursor-pointer border border-border/40 h-full"
                >
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(task.status)}>
                        {formatStatus(task.status)}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {format(parseISO(task.dueDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {assignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task.id);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onTaskDelete(task.id);
                          }} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </HoverGlowCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/40">
          <div className="divide-y divide-border">
            {filteredTasks.map(task => {
              const assignee = users.find(u => u.id === task.assigneeId) || { name: "Unassigned", avatarUrl: "" };
              const experiment = experiments.find(e => e.id === task.experimentId) || { name: "No Experiment" };
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div 
                    className="p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox 
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) => {
                          const updatedTask = {
                            ...task,
                            status: checked ? "completed" : "pending"
                          };
                          onTaskUpdate(updatedTask);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-medium",
                            task.status === "completed" && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </h3>
                          <Badge className={getStatusColor(task.status)}>
                            {formatStatus(task.status)}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{experiment.name}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>
                              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {assignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task.id);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onTaskDelete(task.id);
                            }} className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {filteredTasks.length === 0 && (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium mb-1">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or create a new task
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}