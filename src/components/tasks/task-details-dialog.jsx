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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentSection } from "@/components/common/comment-section"
import {
  Clock,
  Calendar,
  AlarmClock,
  ClipboardEdit,
  Trash2,
  FileText,
  FileIcon,
  FileArchive,
  ImageIcon,
  Download,
  UploadCloud,
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
  Smile
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isToday, isTomorrow, isYesterday, isPast, isAfter, addDays, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import TaskDetailsSection from "./task-details-section"
import UserAvatar from "@/components/tasks/user-avatar"
import { TaskSubtasks } from "./task-subtasks"
import { TaskComments } from "./task-comments"
import { TaskFiles } from "./task-files"

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
  const { toast } = useToast();
  // Refs
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const mentionSuggestionsRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const newSubtaskInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  // State for task details
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(task?.priority || 'none');
  // Task state
  const [selectedStatus, setSelectedStatus] = useState(task?.status || 'backlog');
  const [selectedAssignees, setSelectedAssignees] = useState(task?.assignedTo ? [task.assignedTo] : []);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(task?.tags || []);

  // Time tracking state
  const [timeSpent, setTimeSpent] = useState(task?.timeSpent || 0);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  // Subtask state
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

  // Attachments state
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Activity/comment state
  const [comments, setComments] = useState(task?.comments || []);

  // Mention state for comment input
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [newComment, setNewComment] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle file selection for comment attachments
  const handleCommentFileSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length === 0) return;

    // Filter out files larger than 10MB
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      toast.error(`Some files exceed the 10MB limit and were not attached.`);
    }

    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        id: `comment-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        progress: 0,
        status: 'pending'
      }));

      setAttachedFiles(prev => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach(fileObj => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            setAttachedFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id
                  ? { ...f, status: 'done', progress: 100 }
                  : f
              )
            );
          } else {
            setAttachedFiles(prev =>
              prev.map(f =>
                f.id === fileObj.id
                  ? { ...f, progress: Math.min(progress, 90) } // Cap at 90% until fully processed
                  : f
              )
            );
          }
        }, 200);
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove an attached file from comment
  const removeAttachedFile = (fileId) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Format file size for display (helper function)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mock file upload function - replace with actual API call
  const uploadFile = async (file) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve({
          id: `file-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          status: 'done',
          progress: 100
        });
      }, 1000);
    });
  };

  // Get cursor position in textarea for mention suggestions
  const getCaretCoordinates = (element, position) => {
    // Create a temporary element to measure text dimensions
    const div = document.createElement('div');
    const textNode = document.createTextNode(element.value.substring(0, position));
    div.appendChild(textNode);

    // Apply the same styles as the textarea
    const style = window.getComputedStyle(element);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.width = style.width;
    div.style.padding = style.padding;
    div.style.font = style.font;
    div.style.letterSpacing = style.letterSpacing;
    div.style.textTransform = style.textTransform;
    div.style.wordSpacing = style.wordSpacing;
    div.style.lineHeight = style.lineHeight;
    div.style.fontSize = style.fontSize;
    div.style.fontFamily = style.fontFamily;
    div.style.fontWeight = style.fontWeight;
    div.style.border = style.border;
    div.style.wordBreak = style.wordBreak;

    // Add to document to measure
    document.body.appendChild(div);
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);

    // Get coordinates
    const rect = span.getBoundingClientRect();
    const textareaRect = element.getBoundingClientRect();

    // Clean up
    document.body.removeChild(div);

    return {
      top: rect.top - textareaRect.top + element.scrollTop,
      left: rect.left - textareaRect.left + element.scrollLeft,
      height: rect.height
    };
  };

  // Mock current user - replace with actual user from auth context
  const currentUser = {
    id: 'current-user',
    name: 'Current User',
    avatar: 'JD',
    email: 'current@example.com'
  };

  // Mock users for mentions (replace with actual users from props)
  const mentionableUsers = [
    { id: 'user1', name: 'John Doe', avatar: 'JD', email: 'john@example.com' },
    { id: 'user2', name: 'Jane Smith', avatar: 'JS', email: 'jane@example.com' },
    { id: 'user3', name: 'Alex Johnson', avatar: 'AJ', email: 'alex@example.com' },
  ];

  // Filter users based on mention query
  const filteredMentionableUsers = mentionableUsers.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(mentionQuery.toLowerCase())) ||
    user.name.split(' ')[0].toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Handle keyboard navigation in mention suggestions
  const handleMentionKeyDown = (e) => {
    if (!showMentionSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedMentionIndex(prev =>
          prev < filteredMentionableUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredMentionableUsers[selectedMentionIndex]) {
          handleSelectMention(filteredMentionableUsers[selectedMentionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowMentionSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Check if file is an image
  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  // Handle file preview
  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Process uploaded files
  const handleFiles = (files) => {
    const fileList = Array.isArray(files) ? files : Array.from(files);
    if (fileList.length === 0) return;

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = fileList.filter(file => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      toast({
        title: 'File too large',
        description: `Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`,
        variant: 'destructive'
      });

      // Only process files that are within the size limit
      const validFiles = fileList.filter(file => file.size <= MAX_FILE_SIZE);
      if (validFiles.length === 0) return;
      processFileUploads(validFiles);
    } else {
      processFileUploads(fileList);
    }
  };

  // Process file uploads with proper error handling
  const processFileUploads = async (files) => {
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAttachments = await Promise.all(
        files.map(async (file) => {
          try {
            // In a real app, you would upload the file to your server here
            // const uploadedFile = await uploadFileToServer(file);

            return {
              id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file),
              uploadedAt: new Date().toISOString(),
              uploadedBy: 'current-user-id',
              status: 'uploaded'
            };
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            toast({
              title: 'Upload error',
              description: `Failed to process ${file.name}. Please try again.`,
              variant: 'destructive'
            });
            return null;
          }
        })
      );

      // Filter out any failed uploads
      const successfulUploads = newAttachments.filter(Boolean);

      if (successfulUploads.length > 0) {
        setAttachments(prev => [...prev, ...successfulUploads]);

        // Show success message
        toast({
          title: 'Upload complete',
          description: `${successfulUploads.length} of ${files.length} file(s) uploaded successfully`,
        });

        // Auto-save after adding attachments
        handleSaveChanges();
      }

    } catch (error) {
      console.error('Error during file upload:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an attachment
  const handleDeleteAttachment = (id) => {
    setAttachments(attachments.filter(file => file.id !== id));
    // Auto-save after deleting attachment
    setTimeout(() => handleSaveChanges(), 0);
  };

  // Format relative date (e.g., '2 hours ago', '3 days ago')
  const formatRelativeDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isToday(date)) {
        return 'Today';
      } else if (isYesterday(date)) {
        return 'Yesterday';
      } else if (isPast(date)) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FileIcon className="h-4 w-4" />;

    const type = fileType.split('/')[0];
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'application':
        if (fileType.includes('pdf')) return <FileText className="h-4 w-4" />;
        if (fileType.includes('word') || fileType.includes('document'))
          return <FileText className="h-4 w-4" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet'))
          return <FileText className="h-4 w-4" />;
        if (fileType.includes('powerpoint') || fileType.includes('presentation'))
          return <FileText className="h-4 w-4" />;
        if (fileType.includes('zip') || fileType.includes('compressed'))
          return <FileArchive className="h-4 w-4" />;
        return <FileIcon className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

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

  // Handle mention detection in comment input
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @mention
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol >= 0 && !/\s/.test(textBeforeCursor.substring(lastAtSymbol + 1))) {
      const mentionQuery = textBeforeCursor.substring(lastAtSymbol + 1).toLowerCase();
      setMentionQuery(mentionQuery);

      // Position the suggestions dropdown near the cursor
      if (textareaRef.current) {
        const { top, left } = getCaretCoordinates(textareaRef.current, lastAtSymbol);
        setMentionPosition({ top, left });
      }

      setShowMentionSuggestions(true);
    } else {
      setShowMentionSuggestions(false);
    }
  };

  // Handle selecting a mention from suggestions
  const handleSelectMention = (user) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const textBeforeCursor = newComment.substring(0, startPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol >= 0) {
      const newText =
        newComment.substring(0, lastAtSymbol) +
        `@${user.name} ` +
        newComment.substring(startPos);

      setNewComment(newText);
      setShowMentionSuggestions(false);

      // Set cursor position after the mention
      setTimeout(() => {
        const newCursorPos = lastAtSymbol + user.name.length + 2; // +2 for @ and space
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() && attachedFiles.length === 0) return;

    try {
      setIsCommenting(true);

      // Upload files first if any
      const uploadedAttachments = [];

      if (attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          if (file.status === 'done') {
            uploadedAttachments.push({
              id: file.id,
              name: file.name,
              type: file.type,
              size: file.size,
              url: file.url
            });
          } else {
            // Simulate file upload
            const uploadedFile = await uploadFile(file);
            if (uploadedFile) {
              uploadedAttachments.push({
                id: uploadedFile.id,
                name: uploadedFile.name,
                type: uploadedFile.type,
                size: uploadedFile.size,
                url: uploadedFile.url
              });
            }
          }
        }
      }

      // Create new comment object
      const newCommentObj = {
        id: `comment-${Date.now()}`,
        content: newComment,
        user: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: uploadedAttachments,
        mentions: extractMentions(newComment)
      };

      // Add to comments list
      setComments([...comments, newCommentObj]);

      // Reset form
      setNewComment('');
      setAttachedFiles([]);
      setShowEmojiPicker(false);

      // Trigger save action
      if (onAction) {
        onAction('add-comment', {
          taskId: task.id,
          comment: newCommentObj
        });
      }

      // Show success message
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted.',
      });

    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCommenting(false);
    }
  };

  // Helper to extract mentions from comment text
  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      const user = mentionableUsers.find(u =>
        u.name.toLowerCase().includes(username.toLowerCase()) ||
        u.name.split(' ')[0].toLowerCase() === username.toLowerCase()
      );

      if (user) {
        mentions.push({
          id: user.id,
          name: user.name,
          avatar: user.avatar
        });
      }
    }

    return mentions;
  };

  // Handle text formatting (bold, italic, code, etc.)
  const wrapSelection = (prefix, suffix) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = newComment.substring(startPos, endPos);

    let newText, newCursorPos;

    if (startPos === endPos) {
      // No text selected, just insert the formatting
      newText =
        newComment.substring(0, startPos) +
        prefix + suffix +
        newComment.substring(endPos);
      newCursorPos = startPos + prefix.length;
    } else {
      // Text is selected, wrap it with the formatting
      newText =
        newComment.substring(0, startPos) +
        prefix + selectedText + suffix +
        newComment.substring(endPos);
      newCursorPos = endPos + prefix.length + suffix.length;
    }

    setNewComment(newText);

    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };



  // Check for unsaved changes
  const hasUnsavedChanges = task && (
    editedTitle !== task.title ||
    editedDescription !== task.description ||
    selectedStatus !== task.status ||
    selectedPriority !== task.priority ||
    JSON.stringify(selectedAssignees) !== JSON.stringify(task.assignedTo ? [task.assignedTo] : []) ||
    JSON.stringify(tags) !== JSON.stringify(task.tags || []) ||
    JSON.stringify(subtasks) !== JSON.stringify(task.subtasks || []) ||
    JSON.stringify(attachments) !== JSON.stringify(task.attachments || []) ||
    (date ? date.toISOString() : null) !== task.dueDate ||
    timeSpent !== (task.timeSpent || 0)
  );

  // Enhanced save function with better feedback
  const handleSaveChanges = useCallback(async () => {
    try {
      if (!task) return;

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
        timeSpent,
        comments,
        updatedAt: new Date().toISOString()
      };

      await onAction('update', updatedTask);

      toast({
        title: "Task updated",
        description: "Your changes have been saved successfully.",
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
    } finally {
      setIsSubmitting(false);
    }
  }, [task, editedTitle, editedDescription, selectedStatus, selectedPriority, selectedAssignees, tags, subtasks, attachments, date, timeSpent, comments, onAction, toast]);

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
      // Edit title on Ctrl+E or Cmd+E
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (!isEditingTitle) {
          setIsEditingTitle(true);
        }
      }
      // Copy link on Ctrl+L or Cmd+L
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        copyTaskLink();
      }
      // Toggle fullscreen on Ctrl+Shift+F or Cmd+Shift+F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Toggle watch on Ctrl+W or Cmd+W
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        toggleWatch();
      }
      // Delete task on Ctrl+Delete or Cmd+Delete
      if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
        e.preventDefault();
        handleDeleteTask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingTitle, isEditingDescription]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (task && (editedTitle !== task.title || editedDescription !== task.description)) {
        handleSaveChanges();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [editedTitle, editedDescription, task]);

  // Unsaved changes warning
  useEffect(() => {
    const hasUnsavedChanges = task && (
      editedTitle !== task.title ||
      editedDescription !== task.description ||
      selectedStatus !== task.status ||
      selectedPriority !== task.priority
    );

    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [editedTitle, editedDescription, selectedStatus, selectedPriority, task]);

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
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const dueDateInfo = getDueDateInfo();

  // Task templates for quick setup
  const taskTemplates = [
    {
      id: 'bug-report',
      name: 'Bug Report',
      icon: <Bug className="h-4 w-4" />,
      template: {
        title: 'Bug: [Brief description]',
        description: '## Bug Description\n\n### Steps to Reproduce\n1. \n2. \n3. \n\n### Expected Behavior\n\n### Actual Behavior\n\n### Environment\n- OS: \n- Browser: \n- Version: \n\n### Additional Information\n',
        type: 'bug',
        priority: 'high'
      }
    },
    {
      id: 'feature-request',
      name: 'Feature Request',
      icon: <Sparkles className="h-4 w-4" />,
      template: {
        title: 'Feature: [Feature name]',
        description: '## Feature Description\n\n### Problem Statement\n\n### Proposed Solution\n\n### Benefits\n\n### Implementation Notes\n\n### Acceptance Criteria\n- [ ] \n- [ ] \n- [ ] ',
        type: 'feature',
        priority: 'medium'
      }
    },
    {
      id: 'task-template',
      name: 'General Task',
      icon: <FileText className="h-4 w-4" />,
      template: {
        title: 'Task: [Task description]',
        description: '## Task Overview\n\n### Objectives\n\n### Requirements\n\n### Deliverables\n\n### Timeline\n\n### Notes\n',
        type: 'task',
        priority: 'medium'
      }
    },
    {
      id: 'improvement',
      name: 'Improvement',
      icon: <Zap className="h-4 w-4" />,
      template: {
        title: 'Improve: [Area to improve]',
        description: '## Current State\n\n### Issues\n\n### Proposed Improvements\n\n### Benefits\n\n### Implementation Plan\n',
        type: 'improvement',
        priority: 'low'
      }
    }
  ];

  // Apply template
  const applyTemplate = (template) => {
    setEditedTitle(template.template.title);
    setEditedDescription(template.template.description);
    setTaskType(template.template.type);
    setSelectedPriority(template.template.priority);
    setShowTemplates(false);

    toast({
      title: 'Template applied',
      description: `${template.name} template has been applied to your task.`,
    });
  };

  // Quick actions
  const quickActions = [
    {
      id: 'duplicate',
      label: 'Duplicate Task',
      icon: <Copy className="h-4 w-4" />,
      action: () => {
        const newTask = {
          ...task,
          id: `task-${Date.now()}`,
          title: `${task.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'backlog'
        };
        onAction('duplicate', newTask);
        toast({
          title: 'Task duplicated',
          description: 'A copy of this task has been created.',
        });
      }
    },
    {
      id: 'archive',
      label: 'Archive Task',
      icon: <FileArchive className="h-4 w-4" />,
      action: () => {
        onAction('archive', task);
        toast({
          title: 'Task archived',
          description: 'This task has been moved to archive.',
        });
      }
    },
    {
      id: 'export',
      label: 'Export Task',
      icon: <Download className="h-4 w-4" />,
      action: () => {
        const taskData = JSON.stringify(task, null, 2);
        const blob = new Blob([taskData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-${task.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: 'Task exported',
          description: 'Task data has been downloaded as JSON.',
        });
      }
    }
  ];

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
        "sm:max-w-4xl max-h-[90vh] flex flex-col p-0 bg-background",
        isMaximized && "max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]",
        "overflow-hidden"
      )}>
        <DialogHeader className="sr-only">
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="sticky top-0 z-20 bg-background border-b px-6 py-3 shadow-sm">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-0">
            {/* Left side: Back button and task type */}
            <div className="flex items-center gap-3 min-w-0">
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
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-yellow-50 border border-yellow-200">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-xs text-yellow-700 font-medium">Unsaved changes</span>
                </div>
              )}
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
              <div className="text-sm text-muted-foreground font-mono truncate max-w-[100px] md:max-w-[200px]">
                {task?.id || 'TASK-123'}
              </div>
            </div>
            {/* Right side: Action buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
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
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-mono text-sm">{formatTime(timeSpent)}</span>
                      </>
                    ) : (
                      <Play className="h-4 w-4" />
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
                    onClick={() => {
                      if (!isMaximized) {
                        window.open(`/tasks/${task?.id || ''}`, '_blank');
                      } else {
                        toggleFullscreen();
                      }
                    }}
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">{isMaximized ? 'Minimize' : 'Open full page'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isMaximized ? 'Minimize' : 'Open full page'}
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
        </div>

        {/* Task Title Section - Enhanced */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-background to-muted/20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="hover:text-foreground cursor-pointer transition-colors">Projects</span>
            <ChevronRight className="h-3 w-3" />
            <span className="hover:text-foreground cursor-pointer transition-colors">Lab Tasker</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Task Details</span>
          </div>

          {/* Task Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Title Section */}
              <div className="space-y-2">
                {isEditingTitle ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3"
                  >
                    <Input
                      ref={titleInputRef}
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onFocus={() => setIsTitleFocused(true)}
                      onBlur={() => {
                        setIsTitleFocused(false);
                        handleTitleEdit();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTitleEdit();
                        } else if (e.key === 'Escape') {
                          setEditedTitle(task.title || '');
                          setIsEditingTitle(false);
                        }
                      }}
                      className={cn(
                        "text-2xl font-bold px-3 py-2 border-2 shadow-sm transition-all duration-200",
                        isTitleFocused
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      )}
                      placeholder="Enter task title..."
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        onClick={handleTitleEdit}
                        className="h-8 px-3"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditedTitle(task.title || '');
                          setIsEditingTitle(false);
                        }}
                        className="h-8 px-3"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group relative"
                  >
                    <h1
                      className="text-2xl font-bold leading-tight tracking-tight cursor-pointer group-hover:bg-accent/50 px-3 py-2 rounded-lg transition-all duration-200 -ml-3 hover:shadow-sm"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      {editedTitle || 'Untitled Task'}
                    </h1>
                    {/* Edit indicator */}
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                        <Edit2 className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Task Meta Information */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <UserAvatar user={task?.createdBy} size="sm" />
                    <span>Created by {task?.createdBy?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Created {task?.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : 'recently'}</span>
                  </div>
                  {task?.updatedAt && task.updatedAt !== task.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Time Tracking with Enhanced UI */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isTracking ? 'secondary' : 'outline'}
                    size="sm"
                    className={cn(
                      'h-10 gap-2 px-4 transition-all duration-200',
                      isTracking
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-lg'
                        : 'hover:shadow-md'
                    )}
                    onClick={toggleTimeTracking}
                  >
                    {isTracking ? (
                      <>
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-mono text-sm">{formatTime(timeSpent)}</span>
                        <Timer className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Start Timer</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isTracking ? 'Stop time tracking' : 'Start time tracking'}
                </TooltipContent>
              </Tooltip>

              {/* Save Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={hasUnsavedChanges ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-10 px-4 gap-2 transition-all duration-200",
                      hasUnsavedChanges
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                        : "hover:shadow-md"
                    )}
                    onClick={handleSaveChanges}
                    disabled={isSubmitting || !hasUnsavedChanges}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                    {hasUnsavedChanges && !isSubmitting && (
                      <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {hasUnsavedChanges ? 'Save changes (⌘S)' : 'All changes saved'}
                </TooltipContent>
              </Tooltip>

              {/* Quick Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 hover:shadow-md transition-all duration-200"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    <span>Edit title</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘E</span>
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
                  {quickActions.map((action) => (
                    <DropdownMenuItem key={action.id} onClick={action.action}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDeleteTask}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete task</span>
                    <span className="ml-auto text-xs text-muted-foreground">⌘⌫</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content with Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="subtasks" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Subtasks</span>
                {subtasks.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                    {subtasks.length}
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
                {comments.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                    {comments.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                <TabsContent value="details" className="m-0 p-0">
                  <TaskDetailsSection
                    task={task}
                    users={users}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    currentStatus={currentStatus}
                    currentPriority={currentPriority}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedPriority={selectedPriority}
                    setSelectedPriority={setSelectedPriority}
                    selectedAssignees={selectedAssignees}
                    setSelectedAssignees={setSelectedAssignees}
                    tags={tags}
                    setTags={setTags}
                    newTag={newTag}
                    setNewTag={setNewTag}
                    date={date}
                    setDate={setDate}
                    openDatePicker={openDatePicker}
                    setOpenDatePicker={setOpenDatePicker}
                    handleSaveChanges={handleSaveChanges}
                    isPast={isPast}
                    isToday={isToday}
                    editedDescription={editedDescription}
                    setEditedDescription={setEditedDescription}
                    isEditingDescription={isEditingDescription}
                    setIsEditingDescription={setIsEditingDescription}
                    descriptionInputRef={descriptionInputRef}
                    format={format}
                  />
                </TabsContent>

                {/* Attachments Tab */}
                <TabsContent value="attachments" className="m-0 p-0">
                  <TaskFiles task={task} />
                </TabsContent>

                {/* Subtasks Tab */}
                <TabsContent value="subtasks" className="m-0 p-0">
                  <TaskSubtasks
                    subtasks={subtasks}
                    onSubtasksChange={(updated) => {
                      setSubtasks(updated);
                      handleSaveChanges();
                    }}
                  />
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="m-0 p-0">
                  <TaskComments
                    taskId={task.id}
                    initialComments={comments}
                    currentUser={currentUser}
                    onCommentsChange={setComments}
                    maxHeight={320}
                    className="rounded-lg border bg-background"
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for rendering comment content with mentions and user info
const CommentContent = ({ content, user, createdAt, updatedAt, className = '', users = [] }) => {
  // Simple mention detection - splits content into text and mention parts
  const parts = content ? content.split(/(@\w+)/g) : [];

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <UserAvatar user={user} size="sm" />
        <span className="text-sm font-medium">{user?.name || 'Unknown User'}</span>
        <span className="text-xs text-muted-foreground">
          {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ''}
          {createdAt && updatedAt && createdAt !== updatedAt && ' (edited)'}
        </span>
      </div>
      <div className="pl-8">
        <p className="text-sm">
          {parts.map((part, i) => {
            if (part.startsWith('@')) {
              // Extract the username after @
              const username = part.substring(1);
              // Find the mentioned user
              const mentionedUser = users.find(
                u => u.name.toLowerCase().includes(username.toLowerCase()) ||
                  u.name.split(' ')[0].toLowerCase() === username.toLowerCase()
              );

              return (
                <span key={i} className="text-primary font-medium">
                  @{mentionedUser?.name || username}
                </span>
              );
            }
            return part;
          })}
        </p>
      </div>
    </div>
  );
};
