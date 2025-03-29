import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Paperclip,
  Link,
  Users,
  AlertTriangle,
  BarChart,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Star,
  Flag
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Mock users for development
const mockUsers = [
  { id: "1", name: "John Doe", role: "Lab Manager", email: "john@example.com", avatar: "JD" },
  { id: "2", name: "Jane Smith", role: "Senior Researcher", email: "jane@example.com", avatar: "JS" },
  { id: "3", name: "Robert Johnson", role: "Lab Technician", email: "robert@example.com", avatar: "RJ" },
  { id: "4", name: "Emily Davis", role: "Research Assistant", email: "emily@example.com", avatar: "ED" },
];

// Mock activity log
const mockActivityLog = [
  {
    id: "act1",
    userId: "2",
    action: "created",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    details: "Created the task and assigned to Robert Johnson"
  },
  {
    id: "act2",
    userId: "3",
    action: "updated",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    details: "Changed status from 'Pending' to 'In Progress'"
  },
  {
    id: "act3",
    userId: "1",
    action: "commented",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    details: "Please make sure to document all findings in the shared lab notebook."
  },
  {
    id: "act4",
    userId: "3",
    action: "updated",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    details: "Completed subtask: 'Clean optical components'"
  },
];

// Mock attachments
const mockAttachments = [
  {
    id: "att1",
    name: "Experiment Protocol.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "2",
    uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    id: "att2",
    name: "Sample Images.zip",
    type: "zip",
    size: "14.8 MB",
    uploadedBy: "1",
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: "att3",
    name: "Equipment Manual.pdf",
    type: "pdf",
    size: "5.1 MB",
    uploadedBy: "3",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
];

// Add these new imports for the date picker
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function TaskDetails({
  taskId,
  task,
  onBack,
  onUpdate,
  onDelete,
  relatedTasks,
  experiments
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [activityLog, setActivityLog] = useState(mockActivityLog);
  const [attachments, setAttachments] = useState(mockAttachments);

  // Get related tasks (same experiment)
  const relatedTasksList = relatedTasks
    .filter(t => t.experimentId === task.experimentId && t.id !== task.id)
    .slice(0, 3);

  // Get experiment name
  const experimentName = experiments.find(e => e.id === task.experimentId)?.name || "Unknown Experiment";

  // Get assignee details
  const assignee = mockUsers.find(u => u.id === task.assigneeId) || {
    name: "Unassigned",
    role: "Not assigned",
    avatar: "UA"
  };

  // Handle due date change
  const handleDueDateChange = (date) => {
    if (!date) return;
    
    const updatedTask = { ...task, dueDate: date.toISOString() };
    onUpdate(updatedTask);
    
    // Add to activity log
    addActivityEntry("3", "updated", `Changed due date to ${format(date, "MMM d, yyyy")}`);
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    onUpdate(updatedTask);

    // Add to activity log
    addActivityEntry("3", "updated", `Changed status from '${formatStatus(task.status)}' to '${formatStatus(newStatus)}'`);
  };

  // Handle priority change
  const handlePriorityChange = (newPriority) => {
    const updatedTask = { ...task, priority: newPriority };
    onUpdate(updatedTask);

    // Add to activity log
    addActivityEntry("3", "updated", `Changed priority from '${formatPriority(task.priority)}' to '${formatPriority(newPriority)}'`);
  };

  // Handle subtask toggle
  const handleSubtaskToggle = (subtaskId, completed) => {
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed } : st
    );

    const updatedTask = { ...task, subtasks: updatedSubtasks };
    onUpdate(updatedTask);

    // Add to activity log
    const subtask = task.subtasks.find(st => st.id === subtaskId);
    addActivityEntry(
      "3",
      "updated",
      `${completed ? 'Completed' : 'Reopened'} subtask: '${subtask.description}'`
    );
  };

  // Add new subtask
  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj = {
      id: `subtask-${Date.now()}`,
      description: newSubtask,
      completed: false
    };

    const updatedTask = {
      ...task,
      subtasks: [...task.subtasks, newSubtaskObj]
    };

    onUpdate(updatedTask);
    setNewSubtask("");

    // Add to activity log
    addActivityEntry("3", "added", `Added new subtask: '${newSubtask}'`);
  };

  // Add comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Add to activity log
    addActivityEntry("3", "commented", newComment);
    setNewComment("");
  };

  // Add activity entry
  const addActivityEntry = (userId, action, details) => {
    const newEntry = {
      id: `act-${Date.now()}`,
      userId,
      action,
      timestamp: new Date(),
      details
    };

    setActivityLog([newEntry, ...activityLog]);
  };

  // Format status for display
  const formatStatus = (status) => {
    switch (status) {
      case "pending": return "To Do";
      case "in-progress": return "In Progress";
      case "completed": return "Completed";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Format priority for display
  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container max-w-7xl mx-auto py-6 px-4 sm:px-6"
    >
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{experimentName}</span>
              <span>•</span>
              <span>Created {formatDistanceToNow(new Date(task.createdAt))} ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <Star className="mr-2 h-4 w-4" />
                <span>Add to favorites</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link className="mr-2 h-4 w-4" />
                <span>Copy task link</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete task</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Task details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task details card */}
          <Card className="overflow-hidden border-border/40 shadow-md">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-semibold">Task Details</CardTitle>
              <CardDescription>View and manage task information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Status and Priority */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Select
                    value={task.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className={cn(
                      "w-[140px] h-8 text-sm font-medium border",
                      getStatusColor(task.status)
                    )}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <Select
                    value={task.priority}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className={cn(
                      "w-[140px] h-8 text-sm font-medium border",
                      getPriorityColor(task.priority)
                    )}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] h-8 justify-start text-left font-normal",
                          "flex items-center gap-2"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseISO(task.dueDate)}
                        onSelect={handleDueDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Description */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="min-h-[120px]"
                  />
                ) : (
                  <div className="p-3 rounded-md bg-muted/30 text-sm">
                    {task.description}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {assignee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{assignee.name}</p>
                    <p className="text-xs text-muted-foreground">{assignee.role}</p>
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Subtasks</p>
                  <Badge variant="outline" className="text-xs">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                  </Badge>
                </div>

                <div className="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-start gap-3 p-3 rounded-md bg-muted/30"
                    >
                      <Checkbox
                        id={subtask.id}
                        checked={subtask.completed}
                        onCheckedChange={(checked) => handleSubtaskToggle(subtask.id, checked)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={subtask.id}
                        className={cn(
                          "text-sm flex-1 cursor-pointer",
                          subtask.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {subtask.description}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Add new subtask */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a new subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddSubtask}
                    disabled={!newSubtask.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Comments and Attachments */}
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="activity">Activity & Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4">
              <Card className="border-border/40 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
                  <CardDescription>Recent updates and comments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add comment */}
                  <div className="flex items-start gap-3 mb-6">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        ME
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <Button
                        size="sm"
                        disabled={!newComment.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Activity list - placeholder for now */}
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs mt-1">Be the first to comment on this task</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="mt-4">
              <Card className="border-border/40 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Attachments</CardTitle>
                  <CardDescription>Files related to this task</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center border-2 border-dashed border-border/60 rounded-lg p-6 mb-4">
                    <div className="text-center">
                      <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Support for documents, images, and archives</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="h-4 w-4 mr-1" /> Upload Files
                      </Button>
                    </div>
                  </div>

                  {/* Placeholder for no attachments */}
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No attachments yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Related info */}
        <div className="space-y-6">
          {/* Related Tasks */}
          <Card className="border-border/40 shadow-md">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg font-semibold">Related Tasks</CardTitle>
              <CardDescription>Other tasks in this experiment</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {relatedTasksList.length > 0 ? (
                <div className="space-y-3">
                  {relatedTasksList.map((relatedTask) => (
                    <div key={relatedTask.id} className="border border-border/40 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(relatedTask.status)}>
                            {formatStatus(relatedTask.status)}
                          </Badge>
                          <Badge className={getPriorityColor(relatedTask.priority)}>
                            {formatPriority(relatedTask.priority)}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{relatedTask.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {relatedTask.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Due {format(parseISO(relatedTask.dueDate), "MMM d")}</span>
                          </div>
                          <div>
                            {relatedTask.subtasks.filter(st => st.completed).length}/{relatedTask.subtasks.length} subtasks
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No related tasks found</p>
                </div>
              )}

              {relatedTasksList.length > 0 && (
                <Button variant="ghost" className="w-full mt-3 text-sm">
                  View All Related Tasks
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Task Timeline */}
          <Card className="border-border/40 shadow-md">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg font-semibold">Task Timeline</CardTitle>
              <CardDescription>Important dates and milestones</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="relative pl-6 pb-3 border-l border-border">
                  <div className="absolute top-0 left-0 w-3 h-3 -translate-x-1.5 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(task.createdAt), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="relative pl-6 pb-3 border-l border-border">
                  <div className="absolute top-0 left-0 w-3 h-3 -translate-x-1.5 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(task.updatedAt), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="relative pl-6 pb-3 border-l border-border">
                  <div className="absolute top-0 left-0 w-3 h-3 -translate-x-1.5 rounded-full bg-amber-500"></div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(task.dueDate), "MMM d, yyyy")}
                  </p>
                </div>

                {task.status === "completed" && (
                  <div className="relative pl-6">
                    <div className="absolute top-0 left-0 w-3 h-3 -translate-x-1.5 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(task.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/40 shadow-md">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg font-semibold">Task Stats</CardTitle>
              <CardDescription>Progress and metrics</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Subtask Completion</p>
                    <p className="text-xs font-medium">
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${task.subtasks.length > 0
                          ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
                          : 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                    <p className="text-lg font-semibold">
                      {new Date(task.dueDate) > new Date()
                        ? formatDistanceToNow(parseISO(task.dueDate))
                        : "Overdue"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Task Age</p>
                    <p className="text-lg font-semibold">
                      {formatDistanceToNow(new Date(task.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}