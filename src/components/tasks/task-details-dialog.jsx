"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Calendar,
  AlarmClock,
  ClipboardEdit,
  Trash2,
  FileText,
  CheckCircle2,
  Users,
  CalendarClock,
  Paperclip,
  Link2,
  AlertTriangle,
  User,
  X,
  ChevronDown,
  Plus,
  MessageSquare,
  Check,
  MoreHorizontal,
  Tag,
  CheckCircle,
  Circle,
  FileUp,
  Image as ImageIcon,
  File as FileIcon,
  Download,
  FileCheck,
  FileX,
  ChevronRight,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Paperclip as PaperclipIcon,
  MessageSquare as MessageSquareIcon,
  Clock as ClockIcon,
  List as ListIcon,
  Edit2,
  ListChecks
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isToday, isTomorrow, isYesterday, isPast, isAfter, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

// Helper to format relative date (e.g., "Today", "Tomorrow", "Yesterday")
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  const now = new Date();

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';

  // If within the next 7 days, show day name
  const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (diffInDays > 0 && diffInDays <= 7) {
    return format(date, 'EEEE'); // Day name
  }

  return format(date, 'MMM d, yyyy');
};

// Helper to check if a date is in the past
const isPastDue = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const now = new Date();
  return dueDate < now;
};

// Helper to get priority options
const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
];

// Helper to get status options
const statusOptions = [
  { value: 'pending', label: 'To Do', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200' },
];

// Helper component for avatar with tooltip
const UserAvatar = ({ user, className = '' }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Avatar className={cn('h-8 w-8 cursor-pointer', className)}>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback className="text-xs">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </TooltipTrigger>
    <TooltipContent>
      <p>{user?.name}</p>
    </TooltipContent>
  </Tooltip>
);

export const TaskDetailsDialog = ({ open, onOpenChange, task, onAction, users = [], experiments = [] }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task?.priority || 'medium');
  const [selectedStatus, setSelectedStatus] = useState(task?.status || 'pending');
  const [selectedAssignees, setSelectedAssignees] = useState(task?.assignedTo ? [task.assignedTo] : []);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(task?.tags || []);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [isDragging, setIsDragging] = useState(false);

  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const newSubtaskInputRef = useRef(null);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || '');
      setEditedDescription(task.description || '');
      setSelectedPriority(task.priority || 'medium');
      setSelectedStatus(task.status || 'pending');
      setSelectedAssignees(task.assignedTo ? [task.assignedTo] : []);
      setTags(task.tags || []);
      setSubtasks(task.subtasks || []);
      setAttachments(task.attachments || []);
      setDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task]);

  // Get current status and priority info
  const currentStatus = statusOptions.find(s => s.value === selectedStatus) || statusOptions[0];
  const currentPriority = priorityOptions.find(p => p.value === selectedPriority) || priorityOptions[1];

  if (!task) return null;

  // Handle save changes
  const handleSaveChanges = () => {
    try {
      setIsSubmitting(true);
      const updatedTask = {
        ...task,
        title: editedTitle,
        description: editedDescription,
        status: selectedStatus,
        priority: selectedPriority,
        assignedTo: selectedAssignees[0] || null,
        tags,
        subtasks,
        attachments,
        dueDate: date ? date.toISOString() : null,
      };

      onAction('update', updatedTask);
      toast({
        title: "Task updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete task
  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onAction('delete', task);
    }
  };

  // Handle title edit
  const handleTitleEdit = () => {
    if (isEditingTitle) {
      // Save changes
      handleSaveChanges();
    }
    setIsEditingTitle(!isEditingTitle);
  };

  // Handle description edit
  const handleDescriptionEdit = () => {
    if (isEditingDescription) {
      // Save changes
      handleSaveChanges();
    }
    setIsEditingDescription(!isEditingDescription);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    'text-xs font-medium',
                    currentStatus.color,
                    'px-2 py-0.5 rounded-md'
                  )}
                >
                  {currentStatus.label}
                </Badge>
                <Badge
                  className={cn(
                    'text-xs font-medium',
                    currentPriority.color,
                    'px-2 py-0.5 rounded-md'
                  )}
                >
                  {currentPriority.label}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDeleteTask}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Task Title */}
          <div className="mt-4 flex items-start gap-2">
            {isEditingTitle ? (
              <div className="flex-1 flex gap-2">
                <Input
                  ref={titleInputRef}
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTitleEdit();
                    } else if (e.key === 'Escape') {
                      setEditedTitle(task.title || '');
                      setIsEditingTitle(false);
                    }
                  }}
                  className="text-xl font-semibold px-0 border-0 shadow-none focus-visible:ring-1"
                  autoFocus
                />
              </div>
            ) : (
              <h2
                className="text-xl font-semibold leading-none tracking-tight cursor-text hover:bg-accent/50 px-2 py-1 rounded -ml-2"
                onClick={() => setIsEditingTitle(true)}
              >
                {editedTitle || 'Untitled Task'}
              </h2>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="rounded-none border-b px-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="subtasks" className="flex items-center gap-2">
                <ListIcon className="h-4 w-4" />
                <span>Subtasks</span>
                {subtasks.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                    {subtasks.filter(st => st.completed).length}/{subtasks.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex items-center gap-2">
                <PaperclipIcon className="h-4 w-4" />
                <span>Attachments</span>
                {attachments.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                    {attachments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                <TabsContent value="details" className="m-0 p-0">
                  <div className="space-y-6">
                    {/* Description Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        {!isEditingDescription && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground"
                            onClick={() => setIsEditingDescription(true)}
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                      {isEditingDescription ? (
                        <div className="space-y-2">
                          <Textarea
                            ref={descriptionInputRef}
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="min-h-[120px]"
                            placeholder="Add a detailed description..."
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditedDescription(task.description || '');
                                setIsEditingDescription(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleDescriptionEdit();
                                handleSaveChanges();
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none p-3 rounded-md border bg-muted/20 min-h-[120px] cursor-text"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          {editedDescription ? (
                            <div className="whitespace-pre-wrap">{editedDescription}</div>
                          ) : (
                            <p className="text-muted-foreground italic">Add a description...</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Status */}
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                              <Button
                                key={status.value}
                                variant={selectedStatus === status.value ? 'secondary' : 'outline'}
                                size="sm"
                                className={`text-xs ${selectedStatus === status.value ? status.color : ''}`}
                                onClick={() => {
                                  setSelectedStatus(status.value);
                                  handleSaveChanges();
                                }}
                              >
                                {status.icon && <status.icon className="h-3.5 w-3.5 mr-1.5" />}
                                {status.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Priority */}
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
                          <div className="flex flex-wrap gap-2">
                            {priorityOptions.map((priority) => (
                              <Button
                                key={priority.value}
                                variant={selectedPriority === priority.value ? 'secondary' : 'outline'}
                                size="sm"
                                className={`text-xs ${selectedPriority === priority.value ? priority.color : ''}`}
                                onClick={() => {
                                  setSelectedPriority(priority.value);
                                  handleSaveChanges();
                                }}
                              >
                                {priority.icon && <priority.icon className="h-3.5 w-3.5 mr-1.5" />}
                                {priority.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Due Date */}
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                          <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''} ${date && isPast(new Date(date)) && !isToday(new Date(date)) ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''
                                  }`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {date ? (
                                  <span>{format(date, 'PPP')}</span>
                                ) : (
                                  <span>Pick a due date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selectedDate) => {
                                  setDate(selectedDate || null);
                                  setOpenDatePicker(false);
                                  handleSaveChanges();
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* Assignee */}
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h3>
                          <div className="flex items-center gap-2">
                            {selectedAssignees.length > 0 ? (
                              <div className="flex -space-x-2">
                                {selectedAssignees.map((user) => (
                                  <UserAvatar
                                    key={user.id}
                                    user={user}
                                    className="ring-2 ring-background hover:ring-primary transition-all cursor-pointer"
                                    onClick={() => {
                                      setSelectedAssignees(selectedAssignees.filter(u => u.id !== user.id));
                                      handleSaveChanges();
                                    }}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search team..." />
                                  <CommandEmpty>No members found.</CommandEmpty>
                                  <CommandGroup className="max-h-[200px] overflow-y-auto">
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user.id}
                                        onSelect={() => {
                                          if (!selectedAssignees.some(u => u.id === user.id)) {
                                            setSelectedAssignees([...selectedAssignees, user]);
                                            handleSaveChanges();
                                          }
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <UserAvatar user={user} className="h-6 w-6" />
                                        <span>{user.name}</span>
                                        {selectedAssignees.some(u => u.id === user.id) && (
                                          <Check className="ml-auto h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-1 text-xs font-medium flex items-center gap-1.5"
                              >
                                <span>{tag}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 rounded-full hover:bg-background/50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newTags = [...tags];
                                    newTags.splice(index, 1);
                                    setTags(newTags);
                                    handleSaveChanges();
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0" align="start">
                                <Command>
                                  <CommandInput
                                    placeholder="Add a tag..."
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && newTag.trim()) {
                                        setTags([...tags, newTag.trim()]);
                                        setNewTag('');
                                        handleSaveChanges();
                                      }
                                    }}
                                  />
                                  <CommandEmpty>Type to create a new tag</CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem
                                      className="flex items-center gap-2"
                                      onSelect={() => {
                                        if (newTag.trim()) {
                                          setTags([...tags, newTag.trim()]);
                                          setNewTag('');
                                          handleSaveChanges();
                                        }
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                      <span>Add "{newTag}"</span>
                                    </CommandItem>
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Subtasks Tab */}
                <TabsContent value="subtasks" className="m-0 p-0">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    {subtasks.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Progress</h3>
                          <span className="text-xs text-muted-foreground">
                            {subtasks.filter(st => st.completed).length} of {subtasks.length} tasks
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{
                              width: `${(subtasks.filter(st => st.completed).length / subtasks.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Add Subtask */}
                    <div className="flex items-center gap-2">
                      <Input
                        ref={newSubtaskInputRef}
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newSubtask.trim()) {
                            const newSubtasks = [...subtasks, { id: Date.now().toString(), title: newSubtask.trim(), completed: false }];
                            setSubtasks(newSubtasks);
                            setNewSubtask('');
                            handleSaveChanges();
                          }
                        }}
                        placeholder="Add a subtask..."
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          if (newSubtask.trim()) {
                            const newSubtasks = [...subtasks, { id: Date.now().toString(), title: newSubtask.trim(), completed: false }];
                            setSubtasks(newSubtasks);
                            setNewSubtask('');
                            handleSaveChanges();
                          }
                        }}
                        disabled={!newSubtask.trim()}
                      >
                        Add
                      </Button>
                    </div>

                    {/* Subtasks List */}
                    <div className="space-y-2">
                      {subtasks.length > 0 ? (
                        <div className="space-y-2">
                          {subtasks.map((subtask, index) => {
                            const [isEditing, setIsEditing] = useState(false);
                            const [editValue, setEditValue] = useState(subtask.title);
                            const editInputRef = useRef(null);

                            // Focus the input when editing starts
                            useEffect(() => {
                              if (isEditing && editInputRef.current) {
                                editInputRef.current.focus();
                                const length = editValue.length;
                                editInputRef.current.setSelectionRange(length, length);
                              }
                            }, [isEditing]);

                            return (
                              <div
                                key={subtask.id}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 group"
                              >
                                <Checkbox
                                  id={`subtask-${subtask.id}`}
                                  checked={subtask.completed}
                                  onCheckedChange={(checked) => {
                                    const newSubtasks = [...subtasks];
                                    newSubtasks[index] = { ...subtask, completed: !!checked };
                                    setSubtasks(newSubtasks);
                                    handleSaveChanges();
                                  }}
                                  className="h-4 w-4 rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />

                                {isEditing ? (
                                  <div className="flex-1 flex items-center gap-2">
                                    <Input
                                      ref={editInputRef}
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && editValue.trim()) {
                                          const newSubtasks = [...subtasks];
                                          newSubtasks[index] = { ...subtask, title: editValue.trim() };
                                          setSubtasks(newSubtasks);
                                          setIsEditing(false);
                                          handleSaveChanges();
                                        } else if (e.key === 'Escape') {
                                          setEditValue(subtask.title);
                                          setIsEditing(false);
                                        }
                                      }}
                                      onBlur={() => {
                                        if (editValue.trim()) {
                                          const newSubtasks = [...subtasks];
                                          newSubtasks[index] = { ...subtask, title: editValue.trim() };
                                          setSubtasks(newSubtasks);
                                          handleSaveChanges();
                                        } else {
                                          setEditValue(subtask.title);
                                        }
                                        setIsEditing(false);
                                      }}
                                      className="h-8 px-2 py-1 text-sm border-0 shadow-none focus-visible:ring-1"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => {
                                        if (editValue.trim()) {
                                          const newSubtasks = [...subtasks];
                                          newSubtasks[index] = { ...subtask, title: editValue.trim() };
                                          setSubtasks(newSubtasks);
                                          handleSaveChanges();
                                        }
                                        setIsEditing(false);
                                      }}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <label
                                    htmlFor={`subtask-${subtask.id}`}
                                    className={`flex-1 text-sm cursor-pointer select-none ${subtask.completed ? 'line-through text-muted-foreground' : ''
                                      }`}
                                    onDoubleClick={() => {
                                      setEditValue(subtask.title);
                                      setIsEditing(true);
                                    }}
                                  >
                                    {subtask.title}
                                  </label>
                                )}

                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                      setEditValue(subtask.title);
                                      setIsEditing(!isEditing);
                                    }}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                      const newSubtasks = subtasks.filter((_, i) => i !== index);
                                      setSubtasks(newSubtasks);
                                      handleSaveChanges();
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <ListChecks className="h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium mb-1">No subtasks yet</h3>
                          <p className="text-xs text-muted-foreground max-w-xs">
                            Add subtasks to break down your work into smaller, manageable pieces.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="m-0 p-0">
                  <p className="text-muted-foreground">Attachments will be listed here.</p>
                </TabsContent>

                <TabsContent value="activity" className="m-0 p-0">
                  <p className="text-muted-foreground">Activity log will be shown here.</p>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Function to get the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-200 border-yellow-200 text-yellow-700">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 hover:bg-green-200 border-green-200 text-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 hover:bg-red-200 border-red-200 text-red-700">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-orange-100 hover:bg-orange-200 border-orange-200 text-orange-700">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 hover:bg-green-200 border-green-200 text-green-700">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Format action for the activity log
  const formatAction = (action) => {
    switch (action) {
      case "created":
        return "Created task";
      case "updated":
        return "Updated task";
      case "status_change":
        return "Changed status";
      default:
        return action;
    }
  };

  // Get action icon for the activity log
  const getActionIcon = (action) => {
    switch (action) {
      case "created":
        return <FileText className="h-4 w-4" />;
      case "updated":
        return <ClipboardEdit className="h-4 w-4" />;
      case "status_change":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.name}
            {getStatusBadge(task.status)}
          </DialogTitle>
          <DialogDescription>
            Task ID: {task.id} • Created {formatDate(task.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" />
              <span>Attachments</span>
              {task.attachments?.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 flex items-center justify-center">
                  {task.attachments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="flex items-center gap-1">
              <Link2 className="h-4 w-4" />
              <span>Dependencies</span>
              {task.dependencies?.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 flex items-center justify-center">
                  {task.dependencies.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Activity</span>
              {task.activityLog?.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 flex items-center justify-center">
                  {task.activityLog.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="details" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Experiment
                    </h3>
                    <p>{task.experimentName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Priority
                    </h3>
                    <div>{getPriorityBadge(task.priority)}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </h3>
                    <div>{getStatusBadge(task.status)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Assigned To
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{task.assignedTo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {users[task.assignedTo.id]?.role || "Unknown Role"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Due Date
                    </h3>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span className={isPastDue(task.dueDate) && task.status !== "completed" ? "text-red-500 font-medium" : ""}>
                        {formatDate(task.dueDate)}
                      </span>
                      {isPastDue(task.dueDate) && task.status !== "completed" && (
                        <Badge variant="destructive" className="ml-1">Past Due</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Created
                    </h3>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <div className="p-3 rounded-md border bg-muted/30">
                  <p className="text-sm">
                    {task.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Task Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {task.status !== "completed" && (
                    <>
                      {task.status === "pending" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                          onAction("statusChange", { ...task, status: "in-progress" });
                        }}>
                          <Clock className="h-4 w-4" />
                          Mark as In Progress
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                          onAction("statusChange", { ...task, status: "completed" });
                        }}>
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Completed
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4 mt-0">
              {task.attachments?.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getAttachmentIcon(attachment.type)}
                        <span>{attachment.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{attachment.size}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <Paperclip className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No attachments</h3>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    This task doesn't have any attachments yet
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dependencies" className="space-y-4 mt-0">
              {task.dependencies?.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    This task depends on:
                  </h3>
                  {task.dependencies.map((depId) => {
                    // In a real app, you would fetch the actual dependent task by ID
                    // Here we'll just show the ID for demo purposes
                    return (
                      <div
                        key={depId}
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span>Task {depId}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            // In a real app, this would navigate to the dependent task
                            // or show it in a dialog
                            console.log(`View dependent task ${depId}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <Link2 className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No dependencies</h3>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    This task doesn't depend on any other tasks
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0">
              {task.activityLog?.length > 0 ? (
                <div className="space-y-3">
                  {task.activityLog
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-md border"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{users[log.userId]?.avatar || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{users[log.userId]?.name || 'Unknown User'}</p>
                            <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            {getActionIcon(log.action)}
                            <span className="text-sm">{formatAction(log.action)}</span>
                          </div>
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <Clock className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No activity logs</h3>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    This task doesn't have any activity logs yet
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex gap-2 items-center justify-between sm:justify-between flex-row pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => onAction("edit", task)}>
              <ClipboardEdit className="h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" className="gap-2" onClick={() => onAction("delete", task)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
