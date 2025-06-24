"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  ListChecks,
  Eye,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  CircleDashed,
  Square,
  Play,
  Save,
  Copy,
  Keyboard,
  Loader2,
  CheckSquare,
  Square as SquareIcon,
  PlusCircle,
  Minus,
  Maximize2,
  Minimize2,
  Clock3,
  Timer,
  TimerOff,
  TimerReset,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarPlus,
  CalendarMinus,
  CalendarCheck,
  CalendarX,
  CalendarClock as CalendarClockIcon,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  Bug,
  Sparkles,
  Zap,
  EyeOff,
  MoreVertical,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

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

// Enhanced status and priority options with icons and colors
const statusOptions = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: CircleDashed,
    color: 'text-muted-foreground bg-muted hover:bg-muted/80',
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-muted-foreground/20'
  },
  {
    value: 'todo',
    label: 'To Do',
    icon: Circle,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200'
  },
  {
    value: 'in_review',
    label: 'In Review',
    icon: Eye,
    color: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 hover:bg-green-100',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
];

const priorityOptions = [
  {
    value: 'none',
    label: 'None',
    icon: CircleDashed,
    color: 'text-muted-foreground bg-muted hover:bg-muted/80',
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-muted-foreground/20'
  },
  {
    value: 'low',
    label: 'Low',
    icon: ArrowDown,
    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: ArrowRight,
    color: 'text-amber-600 bg-amber-50 hover:bg-amber-100',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200'
  },
  {
    value: 'high',
    label: 'High',
    icon: ArrowUp,
    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 hover:bg-red-100',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
];

// Format time for display (HH:MM:SS)
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

export const TaskDetailsDialog = ({ open, onOpenChange, task, onAction, users = [], experiments = [] }) => {
  // State for task details
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task?.priority || 'none');
  const [selectedStatus, setSelectedStatus] = useState(task?.status || 'backlog');
  const [selectedAssignees, setSelectedAssignees] = useState(task?.assignedTo ? [task.assignedTo] : []);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(task?.tags || []);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [isDragging, setIsDragging] = useState(false);

  // Time tracking state
  const [timeSpent, setTimeSpent] = useState(task?.timeSpent || 0);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Other enhanced features state
  const [customFields, setCustomFields] = useState(task?.customFields || []);
  const [dependencies, setDependencies] = useState(task?.dependencies || []);
  const [showDependencyPicker, setShowDependencyPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCustomField, setIsAddingCustomField] = useState(false);
  const [newCustomField, setNewCustomField] = useState({ name: '', type: 'text', value: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const newSubtaskInputRef = useRef(null);
  const commentInputRef = useRef(null);
  const fileUploadRef = useRef(null);

  // Toast notifications
  const { toast } = useToast();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.1 } }
  };

  const slideIn = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  // Time tracking effect
  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          // Auto-save every 30 seconds
          if (newTime % 30 === 0) {
            handleSaveChanges();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  // Toggle time tracking
  const toggleTimeTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      // Save the updated time when stopping
      handleSaveChanges();
    } else {
      setStartTime(new Date());
      setIsTracking(true);
      toast({
        title: "Time tracking started",
        description: "Your time is now being tracked for this task.",
      });
    }
  };

  // Handle save changes
  const handleSaveChanges = useCallback(() => {
    try {
      if (!task) return;

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
        timeSpent,
        updatedAt: new Date().toISOString()
      };

      onAction('update', updatedTask);

      toast({
        title: "Task updated",
        description: "Your changes have been saved.",
      });

      return updatedTask;
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [task, editedTitle, editedDescription, selectedStatus, selectedPriority, selectedAssignees, tags, subtasks, attachments, date, timeSpent, onAction, toast]);

  // Handle delete task
  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onAction('delete', task);
    }
  };

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
      setTimeSpent(task.timeSpent || 0);
    }
  }, [task]);

  // Get current status and priority info
  const currentStatus = statusOptions.find(s => s.value === selectedStatus) || statusOptions[0];
  const currentPriority = priorityOptions.find(p => p.value === selectedPriority) || priorityOptions[1];

  if (!task) return null;

  // Handle title edit
  const handleTitleEdit = () => {
    if (isEditingTitle) {
      handleSaveChanges();
    }
    setIsEditingTitle(!isEditingTitle);
  };

  // Handle description edit
  const handleDescriptionEdit = () => {
    if (isEditingDescription) {
      handleSaveChanges();
    }
    setIsEditingDescription(!isEditingDescription);
  };

  // Using the formatTime function from the top of the file

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Close modal on Escape
      if (e.key === 'Escape' && !isEditingTitle && !isEditingDescription) {
        onOpenChange(false);
      }
      // Save on Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveChanges();
      }
      // Toggle time tracking on Ctrl+Space
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        toggleTimeTracking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingTitle, isEditingDescription]);

  // Calculate task progress based on subtasks
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Format due date with relative time and detailed information
  const getDueDateInfo = () => {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = format(dueDate, 'MMM d, yyyy');
    const isOverdue = diffDays < 0;

    let status = '';
    let statusClass = '';
    let icon = null;

    if (isOverdue) {
      status = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
      statusClass = 'bg-red-50 border-red-200 text-red-700';
      icon = <AlertTriangle className="h-3.5 w-3.5 mr-1 -mt-0.5" />;
    } else if (diffDays === 0) {
      status = `Today • ${formattedDate}`;
      statusClass = 'bg-amber-50 border-amber-200 text-amber-700';
      icon = <Clock3 className="h-3.5 w-3.5 mr-1 -mt-0.5" />;
    } else if (diffDays === 1) {
      status = `Tomorrow • ${formattedDate}`;
      statusClass = 'bg-blue-50 border-blue-200 text-blue-700';
      icon = <CalendarDays className="h-3.5 w-3.5 mr-1 -mt-0.5" />;
    } else if (diffDays <= 7) {
      status = `In ${diffDays} days • ${formattedDate}`;
      statusClass = 'bg-green-50 border-green-200 text-green-700';
      icon = <CalendarClockIcon className="h-3.5 w-3.5 mr-1 -mt-0.5" />;
    } else {
      status = formattedDate;
      statusClass = 'bg-muted border-border text-muted-foreground';
      icon = <CalendarIcon className="h-3.5 w-3.5 mr-1 -mt-0.5" />;
    }

    return { status, statusClass, icon, isOverdue };
  };

  // Task type options
  const taskTypes = [
    { id: 'task', label: 'Task', icon: <FileText className="h-3.5 w-3.5" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'bug', label: 'Bug', icon: <Bug className="h-3.5 w-3.5" />, color: 'bg-red-100 text-red-700' },
    { id: 'feature', label: 'Feature', icon: <Sparkles className="h-3.5 w-3.5" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'improvement', label: 'Improvement', icon: <Zap className="h-3.5 w-3.5" />, color: 'bg-amber-100 text-amber-700' },
  ];

  const [taskType, setTaskType] = useState(task?.type || 'task');
  const [isWatching, setIsWatching] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const dueDateInfo = getDueDateInfo();

  // Toggle watch status
  const toggleWatch = () => {
    const newWatchStatus = !isWatching;
    setIsWatching(newWatchStatus);
    toast({
      title: newWatchStatus ? 'Watching task' : 'Stopped watching',
      description: newWatchStatus
        ? 'You will be notified of updates to this task.'
        : 'You will no longer receive updates about this task.',
    });
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const newFullscreenStatus = !isMaximized;
    setIsMaximized(newFullscreenStatus);
    // Additional fullscreen toggle logic can be added here
  };

  // Copy task link to clipboard
  const copyTaskLink = () => {
    const taskLink = `${window.location.origin}/tasks/${task?.id || '123'}`;
    navigator.clipboard.writeText(taskLink);
    toast({
      title: 'Link copied to clipboard',
      description: 'Task link has been copied to your clipboard.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-background",
        isMaximized && "max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]"
      )}>
        <DialogHeader className="sr-only">
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="sticky top-0 z-20 bg-background border-b px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left side: Back button and task type */}
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -ml-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>

              <div className="h-5 w-px bg-border" />

              {/* Task Type Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 px-3 text-sm font-medium rounded-md',
                      'flex items-center gap-2',
                      taskTypes.find(t => t.id === taskType)?.color,
                      'hover:bg-opacity-80 transition-colors'
                    )}
                  >
                    {taskTypes.find(t => t.id === taskType)?.icon}
                    {taskTypes.find(t => t.id === taskType)?.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-1">
                  {taskTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      className={cn(
                        'text-sm px-2 py-1.5 rounded-md',
                        taskType === type.id && 'bg-accent',
                        'flex items-center gap-2 cursor-pointer'
                      )}
                      onClick={() => setTaskType(type.id)}
                    >
                      <span className={cn('h-3.5 w-3.5', type.color.split(' ')[0])}>
                        {type.icon}
                      </span>
                      <span>{type.label}</span>
                      {taskType === type.id && <Check className="h-3.5 w-3.5 ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Task ID */}
              <div className="text-sm text-muted-foreground font-mono">
                {task?.id || 'TASK-123'}
              </div>
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Watch button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={toggleWatch}
                  >
                    {isWatching ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">{isWatching ? 'Unwatch' : 'Watch'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isWatching ? 'Stop watching' : 'Watch task'}
                </TooltipContent>
              </Tooltip>

              {/* Copy link button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={copyTaskLink}
                  >
                    <Link2 className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Copy task link</TooltipContent>
              </Tooltip>

              {/* Time tracking button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isTracking ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 gap-1.5',
                      isTracking ? 'bg-red-50 text-red-700 hover:bg-red-100' : ''
                    )}
                    onClick={toggleTimeTracking}
                  >
                    {isTracking ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs">{formatTime(timeSpent)}</span>
                      </>
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">{isTracking ? 'Stop tracking' : 'Start tracking'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isTracking ? 'Stop time tracking' : 'Start time tracking'}
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-5 mx-1" />

              {/* Fullscreen toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={toggleFullscreen}
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">{isMaximized ? 'Minimize' : 'Maximize'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isMaximized ? 'Minimize' : 'Maximize'}
                </TooltipContent>
              </Tooltip>

              {/* More options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Save changes</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyTaskLink}>
                    <Link2 className="mr-2 h-4 w-4" />
                    <span>Copy link</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘L</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleWatch}>
                    {isWatching ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    <span>{isWatching ? 'Unwatch' : 'Watch'}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleFullscreen}>
                    {isMaximized ? (
                      <Minimize2 className="mr-2 h-4 w-4" />
                    ) : (
                      <Maximize2 className="mr-2 h-4 w-4" />
                    )}
                    <span>{isMaximized ? 'Minimize' : 'Maximize'}</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘⇧F</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleDeleteTask}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete task</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘⌫</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress bar */}
          {subtasks.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}% ({completedSubtasks} of {subtasks.length} tasks)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
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
};
