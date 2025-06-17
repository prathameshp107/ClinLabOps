"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  Calendar,
  Clock,
  AlertTriangle,
  CalendarClock,
  Paperclip,
  Plus,
  Search,
  Filter,
  X,
  Star,
  MessageSquare,
  FileText,
  Users,
  Flag,
  ArrowRightCircle,
  CheckCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Helper to check if a date is in the past
const isPastDue = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return dueDate < now;
};

// Priority indicator component
const PriorityIndicator = ({ priority }) => {
  const priorityMap = {
    high: { color: 'bg-red-500', label: 'High' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    low: { color: 'bg-blue-500', label: 'Low' },
    none: { color: 'bg-gray-300', label: 'None' }
  };

  const { color, label } = priorityMap[priority?.toLowerCase()] || priorityMap.none;

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

// Task card component
const TaskCard = ({ task, onAction, users }) => {
  const [isHovered, setIsHovered] = useState(false);
  const assignee = users?.find(user => user.id === task.assigneeId);
  const isOverdue = isPastDue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow border-border/50 hover:border-primary/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm leading-snug line-clamp-2">
                  {task.title}
                </h4>
                {task.isPinned && (
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-destructive"
                  )}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(task.dueDate)}</span>
                    {isOverdue && <AlertTriangle className="h-3 w-3 ml-1" />}
                  </div>
                )}

                {task.priority && task.priority !== 'none' && (
                  <PriorityIndicator priority={task.priority} />
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
                    isHovered && "opacity-100"
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onAction('edit', task)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAction('togglePin', task)}
                  className="flex items-center gap-2"
                >
                  {task.isPinned ? 'Unpin' : 'Pin to top'}
                  <Star className={cn(
                    "h-3.5 w-3.5 ml-auto",
                    task.isPinned ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                  )} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAction('delete', task)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center -space-x-2">
              {assignee && (
                <Avatar className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback>
                    {assignee.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              {task.labels?.slice(0, 2).map((label, i) => (
                <div
                  key={i}
                  className="h-5 px-2 text-xs rounded-full border flex items-center"
                  style={{
                    backgroundColor: `${label.color}20`,
                    borderColor: label.color,
                    color: label.color
                  }}
                >
                  {label.name}
                </div>
              ))}
              {task.labels?.length > 2 && (
                <div className="h-5 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{task.labels.length - 2}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {task.commentsCount > 0 && (
                <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{task.commentsCount}</span>
                </div>
              )}

              {task.attachmentsCount > 0 && (
                <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>{task.attachmentsCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const TaskBoard = ({
  tasks = [],
  onAction,
  onStatusChange,
  users = [],
  onAddTask,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: [],
    assignee: [],
    label: []
  });

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filters.priority.length === 0 ||
      (task.priority && filters.priority.includes(task.priority));

    const matchesAssignee = filters.assignee.length === 0 ||
      (task.assigneeId && filters.assignee.includes(task.assigneeId));

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Group tasks by status
  const taskGroups = {
    "pending": {
      title: "To Do",
      tasks: filteredTasks.filter(task => task.status === "pending"),
      color: "bg-blue-500"
    },
    "in-progress": {
      title: "In Progress",
      tasks: filteredTasks.filter(task => task.status === "in-progress"),
      color: "bg-yellow-500"
    },
    "completed": {
      title: "Completed",
      tasks: filteredTasks.filter(task => task.status === "completed"),
      color: "bg-green-500"
    },
  };

  // Get priority color class
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Handler for drag start
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  // Handler for drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handler for dropping a task in a column
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== targetStatus) {
      onStatusChange(taskId, targetStatus);
    }
  };

  // Column configurations
  const columns = [
    {
      id: "pending",
      title: "Pending",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: "border-yellow-500",
      emptyMessage: "No pending tasks"
    },
    {
      id: "in-progress",
      title: "In Progress",
      icon: <ArrowRightCircle className="h-5 w-5 text-blue-500" />,
      color: "border-blue-500",
      emptyMessage: "No tasks in progress"
    },
    {
      id: "completed",
      title: "Completed",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      color: "border-green-500",
      emptyMessage: "No completed tasks"
    }
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Priority</DropdownMenuLabel>
            {["high", "medium", "low"].map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={filters.priority.includes(priority)}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    priority: checked
                      ? [...prev.priority, priority]
                      : prev.priority.filter(p => p !== priority)
                  }));
                }}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Assignee</DropdownMenuLabel>
            {users.map((user) => (
              <DropdownMenuCheckboxItem
                key={user.id}
                checked={filters.assignee.includes(user.id)}
                onCheckedChange={(checked) => {
                  setFilters(prev => ({
                    ...prev,
                    assignee: checked
                      ? [...prev.assignee, user.id]
                      : prev.assignee.filter(id => id !== user.id)
                  }));
                }}
              >
                {user.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {(filters.priority.length > 0 || filters.assignee.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.priority.map(priority => (
            <Badge key={priority} variant="secondary" className="gap-1 font-normal capitalize">
              {priority}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  priority: prev.priority.filter(p => p !== priority)
                }))}
              />
            </Badge>
          ))}
          {filters.assignee.map(assigneeId => {
            const user = users.find(u => u.id === assigneeId);
            if (!user) return null;
            return (
              <Badge key={assigneeId} variant="secondary" className="gap-1 font-normal">
                <Avatar className="h-3.5 w-3.5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    assignee: prev.assignee.filter(id => id !== assigneeId)
                  }))}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Board Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${column.color}`}>
              {column.icon}
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="outline" className="ml-auto">
                {taskGroups[column.id].tasks.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 pr-2 -mr-2">
              <div className="space-y-3 pb-4">
                <AnimatePresence>
                  {taskGroups[column.id].tasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center"
                    >
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {column.emptyMessage}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                        onClick={() => onAddTask?.(column.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Create task
                      </Button>
                    </motion.div>
                  ) : (
                    taskGroups[column.id].tasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onAction={onAction}
                        users={users}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
