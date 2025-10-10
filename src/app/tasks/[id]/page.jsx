"use client"

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Bookmark,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Edit,
  FileText,
  Layout,
  Link,
  Link2,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Pause,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  Trash,
  Trash2,
  X
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";

// Task Components
import { TaskOverview } from "@/components/tasks/task-overview";
import { TaskAssignee } from "@/components/tasks/task-assignee";
import { SubtasksList } from "@/components/tasks/subtasks-list";
import { TaskFiles } from "@/components/tasks/task-files";
import { TaskComments } from "@/components/tasks/task-comments";
import { TaskActivityLog } from "@/components/tasks/task-activity-log";
import { BackButton } from "@/components/tasks/back-button";
import { TaskTimeline } from "@/components/tasks/task-timeline";
import { RelatedTasksCard } from "@/components/tasks/related-tasks-card";

// Aceternity UI Components
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";

// Layout and other components
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { TaskNotFound } from "@/components/tasks/Task-Notfound";
import { TaskLoading } from "@/components/tasks/Task-Loading";

// Utilities
import { format, addDays } from "date-fns";

// API Services
import { fetchTaskById } from "@/lib/api/tasks";

import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers } from '@/services/userService';

export default function TaskDetailPage({ params }) {
  const { id } = params;
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const timerRef = useRef(null);

  // Time tracking functions
  const startTracking = () => {
    setIsTracking(true);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTracking = () => {
    stopTracking();
    setTimeSpent(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function for priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      case 'urgent': return 'destructive';
      default: return 'outline';
    }
  };

  // New feature: AI suggestions
  useEffect(() => {
    if (task) {
      // Simulate AI analysis based on actual task data
      setTimeout(() => {
        // Generate realistic bottlenecks based on task data
        const bottlenecks = [];
        if (task.dueDate) {
          bottlenecks.push("Timeline constraints");
        }
        if (task.priority === 'high') {
          bottlenecks.push("Resource allocation");
        }
        if (task.subtasks && task.subtasks.length > 5) {
          bottlenecks.push("Task complexity");
        }

        // Generate realistic recommendations based on task data
        const recommendations = [];
        if (task.assignee) {
          recommendations.push(`Coordinate with ${task.assignee.name || 'assignee'} for task updates`);
        } else {
          recommendations.push("Assign this task to a team member");
        }
        if (task.dueDate) {
          recommendations.push("Review timeline and adjust if needed");
        }
        if (task.priority === 'high') {
          recommendations.push("Prioritize this task in team meetings");
        }

        setAiSuggestions({
          riskLevel: task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low',
          estimatedCompletion: task.dueDate || addDays(new Date(), 7).toISOString(),
          bottlenecks: bottlenecks.length > 0 ? bottlenecks : ["General project constraints"],
          recommendations: recommendations.length > 0 ? recommendations : ["Continue with current approach"]
        });
      }, 100);
    }
  }, [task]);

  // New feature: Time tracking
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking]);

  // Format time spent
  const formatTimeSpent = () => {
    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);
    const seconds = timeSpent % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch task data from API
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);

        // Fetch task using API service
        const taskData = await fetchTaskById(id);

        console.log('Fetched task data:', taskData);

        if (taskData) {
          setTask(taskData);
        } else {
          setTask(null);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  // Fetch users for comments and activity logs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers();
        setUsers(userData || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Fallback mock data for development (remove this in production)
  useEffect(() => {
    if (!loading && !task) {
      // Only use fallback if API call failed and we're in development
      const fallbackTask = {
        id: id,
        title: "Task Details",
        description: "Task description will appear here.",
        status: "not_started",
        priority: "medium",
        progress: 0,
        progressDetails: {
          timeEstimate: 0,
          timeSpent: 0,
          milestones: [],
          riskFactors: [],
          weeklyProgress: []
        },
        createdAt: new Date().toISOString(),
        createdBy: {
          id: "u1",
          name: "System",
          avatar: "S"
        },
        dueDate: null,
        assignee: null,
        project: {
          id: "unknown",
          name: "No Project"
        },
        tags: [],
        subtasks: [],
        files: [],
        comments: [],
        activityLog: [],
        teamMembers: [],
        relatedTasks: []
      };

      // Only use fallback in development when API fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback mock data for task:', id);
        setTask(fallbackTask);
      }
    }
  }, [loading, task, id]);

  if (loading) {
    return <TaskLoading />;
  }

  if (!task) {
    return (
      <TaskNotFound />
    );
  }

  // Ensure task has all required properties with defaults
  const safeTask = {
    id: task.id || id || 'unknown',
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: task.status || 'not_started',
    priority: task.priority || 'medium',
    progress: task.progress || 0,
    createdAt: task.createdAt || new Date().toISOString(),
    dueDate: task.dueDate || null,
    assignee: task.assignee || null,
    project: task.project || { id: 'unknown', name: 'No Project' },
    tags: task.tags || [],
    subtasks: task.subtasks || [],
    files: task.files || [],
    comments: task.comments || [],
    activityLog: task.activityLog || [],
    teamMembers: task.teamMembers || [],
    relatedTasks: task.relatedTasks || [],
    ...task
  };

  console.log('Task detail page - URL id:', id, 'task.id:', task?.id, 'safeTask.id:', safeTask.id);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`h-full flex flex-col ${focusMode ? 'bg-black/5 dark:bg-white/5' : ''}`}
      >
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <BackButton />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold truncate">{safeTask.title}</h1>
                <Badge variant={
                  safeTask.status === 'completed' ? 'success' :
                    safeTask.status === 'in_progress' ? 'warning' : 'outline'
                } className="ml-2 animate-fade-in">
                  {safeTask.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>Task #{safeTask.id}</span>
                <span>•</span>
                <span>Created {format(new Date(safeTask.createdAt), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>Project: {safeTask.project.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="focus-mode" className="sr-only">Focus Mode</Label>
                    <Switch
                      id="focus-mode"
                      checked={focusMode}
                      onCheckedChange={setFocusMode}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Focus Mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Floating action buttons for edit, complete, delete */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Button variant="outline" size="icon" className="h-9 w-9" title="Edit Task" onClick={() => setShowEditModal(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" title="Mark Complete">
                <CheckSquare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" title="Delete Task">
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>

            <HoverBorderGradient className="rounded-md">
              <Button variant="outline" size="sm" className="gap-1">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
            </HoverBorderGradient>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Animated Edit Task Modal */}
        <AnimatePresence>
          {showEditModal && (
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
                <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6">
                  <h2 className="text-2xl font-bold tracking-tight">Edit Task</h2>
                  <p className="text-muted-foreground mt-1">Update task details and properties</p>
                </div>

                <div className="p-6 pt-2 grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" defaultValue={safeTask.title} className="h-10" />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" defaultValue={safeTask.description} rows={4} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue={safeTask.status}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="priority">Priority</Label>
                      <Select defaultValue={safeTask.priority}>
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select defaultValue={safeTask.assignee?.id}>
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {safeTask.teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{member.name?.charAt(0) || '?'}</AvatarFallback>
                                </Avatar>
                                <span>{member.name || 'Unknown'}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <DatePicker />
                    </div>
                  </div>
                </div>

                <DialogFooter className="bg-muted/30 px-6 py-4">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="w-full max-w-[1600px] mx-auto px-4">
            <div className="space-y-6 w-full">
              <TooltipProvider>
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="grid grid-cols-4 w-auto">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                      <TabsTrigger value="files">Files</TabsTrigger>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        safeTask.priority === 'high' ? 'destructive' :
                          safeTask.priority === 'medium' ? 'warning' : 'outline'
                      } className="capitalize">
                        {safeTask.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5">
                        {safeTask.progress}% Complete
                      </Badge>
                    </div>
                  </div>
                  <TabsContent value="overview" className="space-y-6 w-full">
                    <TaskOverview task={safeTask} className="w-full" />
                    <RelatedTasksCard taskId={safeTask.id} task={safeTask} className="w-full" />
                    <TaskActivityLog taskId={safeTask.id} className="w-full" users={users} />
                  </TabsContent>
                  <TabsContent value="subtasks" className="space-y-6 w-full">
                    <SubtasksList task={safeTask} setTask={setTask} className="w-full" />
                  </TabsContent>
                  <TabsContent value="files" className="space-y-6 w-full">
                    <TaskFiles task={safeTask} className="w-full" />
                  </TabsContent>
                  <TabsContent value="comments" className="space-y-6 w-full">
                    <TaskComments
                      taskId={safeTask.id}
                      className="w-full"
                      users={users}
                      currentUserId={currentUser?.id}
                    />
                  </TabsContent>
                </Tabs>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* AI Suggestions Floating Card */}
        <AnimatePresence>
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <HoverBorderGradient className="rounded-full p-0.5">
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              >
                <Sparkles className="h-6 w-6" />
              </Button>
            </HoverBorderGradient>

            <AnimatePresence>
              {showAiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 left-6 z-50 max-w-md"
                >
                  <Card className="bg-background/80 backdrop-blur-lg border border-primary/20 shadow-lg overflow-hidden">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAiSuggestions(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                      <div className="text-sm space-y-3">
                        <p className="text-muted-foreground">Based on this task, I suggest:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                            <span>Break this down into 3-4 smaller subtasks for better tracking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                            <span>Set a due date within the next 7 days</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                            <span>Assign to a team member with UX/UI expertise</span>
                          </li>
                        </ul>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" className="h-8">
                            Ignore
                          </Button>
                          <Button size="sm" className="h-8">
                            Apply Suggestions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}