"use client"

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays, addDays } from "date-fns";
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  CheckSquare,
  Tag,
  AlertTriangle,
  MoreHorizontal,
  ChevronLeft,
  Paperclip,
  Link2,
  Share2,
  Edit,
  Save,
  Zap,
  BarChart4,
  Users,
  Bookmark,
  Bell,
  Trash2,
  PlusCircle,
  ArrowUpRight
} from "lucide-react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Custom Components
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
import { StickyScroll } from "@/components/ui/aceternity/sticky-scroll";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";
import { TaskNotFound } from "@/components/tasks/Task-Notfound";
import { TaskLoading } from "@/components/tasks/Task-Loading";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const timerRef = useRef(null);

  // New feature: AI suggestions
  useEffect(() => {
    if (task) {
      // Simulate AI analysis
      setTimeout(() => {
        setAiSuggestions({
          riskLevel: task.priority === 'high' ? 'high' : 'medium',
          estimatedCompletion: addDays(new Date(), 5).toISOString(),
          bottlenecks: ["Sample processing time", "Equipment availability"],
          recommendations: [
            "Consider parallel processing for samples 6-10",
            "Schedule equipment usage in advance",
            "Consult with Dr. Chen about optimized protocol"
          ]
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

  // Rest of your existing code for fetching task data
  useEffect(() => {
    // Fetch task data
    const fetchTask = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/tasks/${id}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockTask = {
          id: id,
          title: "PCR Analysis of Sample Group B",
          description: "Perform PCR analysis on the collected samples from Group B. Follow the standard protocol and document all results in the lab system.",
          status: "in_progress",
          priority: "high",
          progress: 65,
          progressDetails: {
            timeEstimate: 40, // hours
            timeSpent: 26, // hours
            milestones: [
              { name: "Planning", complete: true, date: "2023-10-16" },
              { name: "Sample Preparation", complete: true, date: "2023-10-18" },
              { name: "Initial Analysis", complete: true, date: "2023-10-20" },
              { name: "Full Analysis", complete: false, date: "2023-10-25" },
              { name: "Documentation", complete: false, date: "2023-11-01" }
            ],
            riskFactors: [
              { name: "Equipment Failure", probability: "low", impact: "high" },
              { name: "Sample Contamination", probability: "medium", impact: "high" },
              { name: "Staff Availability", probability: "medium", impact: "medium" }
            ],
            weeklyProgress: [
              { week: "Week 1", planned: 30, actual: 25 },
              { week: "Week 2", planned: 60, actual: 65 },
              { week: "Week 3", planned: 90, actual: 0 }
            ]
          },
          createdAt: "2023-10-15T10:30:00Z",
          createdBy: {
            id: "u1",
            name: "Dr. Jane Doe",
            avatar: "/avatars/jane-doe.png"
          },
          dueDate: "2023-11-05T23:59:59Z",
          assignee: {
            id: "u2",
            name: "John Smith",
            avatar: "/avatars/john-smith.png"
          },
          project: {
            id: "p1",
            name: "Laboratory Management System"
          },
          tags: ["PCR", "Analysis", "Group B", "Lab Work"],
          subtasks: [
            {
              id: "ST-101",
              title: "Prepare PCR reagents",
              completed: true,
              status: "completed",
              progress: 100,
              priority: "high",
              assignee: {
                id: "u2",
                name: "John Smith",
                avatar: "/avatars/john-smith.png"
              },
              startDate: "2023-10-16T09:00:00Z",
              endDate: "2023-10-16T14:00:00Z",
              notes: "Used the new batch of reagents from Lab Supply Co."
            },
            {
              id: "ST-102",
              title: "Set up PCR machine",
              completed: true,
              status: "completed",
              progress: 100,
              priority: "high",
              assignee: {
                id: "u2",
                name: "John Smith",
                avatar: "/avatars/john-smith.png"
              },
              startDate: "2023-10-17T09:00:00Z",
              endDate: "2023-10-17T11:00:00Z",
              notes: "Machine calibrated and settings verified before run."
            },
            {
              id: "ST-103",
              title: "Run PCR on samples 1-5",
              completed: true,
              status: "completed",
              progress: 100,
              priority: "medium",
              assignee: {
                id: "u2",
                name: "John Smith",
                avatar: "/avatars/john-smith.png"
              },
              startDate: "2023-10-18T09:00:00Z",
              endDate: "2023-10-18T16:00:00Z",
              notes: "All samples processed successfully. Results look promising."
            },
            {
              id: "ST-104",
              title: "Run PCR on samples 6-10",
              completed: false,
              status: "in_progress",
              progress: 60,
              priority: "medium",
              assignee: {
                id: "u3",
                name: "Emily Chen",
                avatar: "/avatars/emily-chen.png"
              },
              startDate: "2023-10-21T09:00:00Z",
              endDate: "2023-10-21T16:00:00Z",
              notes: "Samples 6-8 completed, working on 9-10."
            },
            {
              id: "ST-105",
              title: "Document results in lab system",
              completed: false,
              status: "not_started",
              progress: 0,
              priority: "low",
              assignee: {
                id: "u4",
                name: "Michael Brown",
                avatar: "/avatars/michael-brown.png"
              },
              startDate: "2023-10-22T09:00:00Z",
              endDate: "2023-10-22T16:00:00Z",
              notes: ""
            }
          ],
          files: [
            { id: "f1", name: "PCR_Protocol.pdf", size: "1.2 MB", uploadedAt: "2023-10-16T14:20:00Z", uploadedBy: "Dr. Jane Doe" },
            { id: "f2", name: "Sample_Group_B_Data.xlsx", size: "3.5 MB", uploadedAt: "2023-10-18T09:45:00Z", uploadedBy: "John Smith" },
            { id: "f3", name: "PCR_Results_Partial.docx", size: "2.1 MB", uploadedAt: "2023-10-20T16:30:00Z", uploadedBy: "John Smith" }
          ],
          comments: [
            {
              id: "c1",
              text: "I've started the PCR analysis. The first batch of samples is running now.",
              createdAt: "2023-10-17T11:20:00Z",
              user: { id: "u2", name: "John Smith", avatar: "/avatars/john-smith.png" }
            },
            {
              id: "c2",
              text: "Great! Make sure to follow the updated protocol we discussed in the meeting.",
              createdAt: "2023-10-17T13:45:00Z",
              user: { id: "u1", name: "Dr. Jane Doe", avatar: "/avatars/jane-doe.png" }
            },
            {
              id: "c3",
              text: "I've completed the first 5 samples. Results look promising. Will continue with the rest tomorrow.",
              createdAt: "2023-10-19T17:30:00Z",
              user: { id: "u2", name: "John Smith", avatar: "/avatars/john-smith.png" }
            }
          ],
          activityLog: [
            { id: "a1", type: "task_created", timestamp: "2023-10-15T10:30:00Z", user: "Dr. Jane Doe" },
            { id: "a2", type: "task_assigned", timestamp: "2023-10-15T10:35:00Z", user: "Dr. Jane Doe", details: "Assigned to John Smith" },
            { id: "a3", type: "comment_added", timestamp: "2023-10-17T11:20:00Z", user: "John Smith" },
            { id: "a4", type: "comment_added", timestamp: "2023-10-17T13:45:00Z", user: "Dr. Jane Doe" },
            { id: "a5", type: "file_uploaded", timestamp: "2023-10-18T09:45:00Z", user: "John Smith", details: "Sample_Group_B_Data.xlsx" },
            { id: "a6", type: "subtask_completed", timestamp: "2023-10-18T14:20:00Z", user: "John Smith", details: "Prepare PCR reagents" },
            { id: "a7", type: "subtask_completed", timestamp: "2023-10-18T16:45:00Z", user: "John Smith", details: "Set up PCR machine" },
            { id: "a8", type: "comment_added", timestamp: "2023-10-19T17:30:00Z", user: "John Smith" },
            { id: "a9", type: "file_uploaded", timestamp: "2023-10-20T16:30:00Z", user: "John Smith", details: "PCR_Results_Partial.docx" }
          ],
          teamMembers: [
            { id: "u1", name: "Dr. Jane Doe", role: "Principal Investigator", avatar: "/avatars/jane-doe.png" },
            { id: "u2", name: "John Smith", role: "Lab Technician", avatar: "/avatars/john-smith.png" },
            { id: "u3", name: "Emily Chen", role: "Research Assistant", avatar: "/avatars/emily-chen.png" },
            { id: "u4", name: "Michael Brown", role: "Data Analyst", avatar: "/avatars/michael-brown.png" }
          ],
          relatedTasks: [
            {
              id: "T10",
              title: "Data Analysis for Group A",
              status: "completed",
              dueDate: "2023-10-25T23:59:59Z",
              assignee: { id: "u4", name: "Michael Brown", avatar: "/avatars/michael-brown.png" }
            },
            {
              id: "T11",
              title: "Equipment Calibration",
              status: "in_progress",
              dueDate: "2023-11-10T23:59:59Z",
              assignee: { id: "u2", name: "John Smith", avatar: "/avatars/john-smith.png" }
            },
            {
              id: "T12",
              title: "Lab Inventory Check",
              status: "not_started",
              dueDate: "2023-11-15T23:59:59Z",
              assignee: { id: "u3", name: "Emily Chen", avatar: "/avatars/emily-chen.png" }
            },
            {
              id: "T13",
              title: "Reagent Order",
              status: "completed",
              dueDate: "2023-10-30T23:59:59Z",
              assignee: { id: "u1", name: "Dr. Jane Doe", avatar: "/avatars/jane-doe.png" }
            }
          ]
        };

        setTask(mockTask);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <TaskLoading />;
  }

  if (!task) {
    return (
      <TaskNotFound />
    );
  }

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
                <h1 className="text-2xl font-bold truncate">{task.title}</h1>
                <Badge variant={
                  task.status === 'completed' ? 'success' :
                    task.status === 'in_progress' ? 'warning' : 'outline'
                } className="ml-2 animate-fade-in">
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>Task #{task.id}</span>
                <span>•</span>
                <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                <span>•</span>
                <span>Project: {task.project.name}</span>
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
        </div>
        {/* Animated Edit Task Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-background rounded-xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] border border-border/50"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">Edit Task (Coming Soon)</h2>
                <p className="text-muted-foreground mb-4">A full-featured edit form for all task fields will appear here.</p>
                <Button onClick={() => setShowEditModal(false)} variant="outline">Close</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="w-full max-w-[1600px] mx-auto px-4">
            <div className="space-y-6 w-full">
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
                      task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'warning' : 'outline'
                    } className="capitalize">
                      {task.priority} Priority
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                      {task.progress}% Complete
                    </Badge>
                  </div>
                </div>
                <TabsContent value="overview" className="space-y-6 w-full">
                  <TaskOverview task={task} className="w-full" />
                  <RelatedTasksCard relatedTasks={task.relatedTasks} className="w-full" />
                  <TaskActivityLog activities={task.activityLog} className="w-full" />
                </TabsContent>
                <TabsContent value="subtasks" className="space-y-6 w-full">
                  <SubtasksList task={task} setTask={setTask} className="w-full" />
                </TabsContent>
                <TabsContent value="files" className="space-y-6 w-full">
                  <TaskFiles task={task} className="w-full" />
                </TabsContent>
                <TabsContent value="comments" className="space-y-6 w-full">
                  <TaskComments task={task} className="w-full" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
