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
import { TaskProgress } from "@/components/tasks/task-progress";
import { BackButton } from "@/components/tasks/back-button";

// Aceternity UI Components
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";
import { StickyScroll } from "@/components/ui/aceternity/sticky-scroll";
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";

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
      }, 1500);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full h-40">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#8b5cf6"
          />
          <div className="text-center mt-4">
            <TextGenerateEffect words="Loading task details..." />
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
        <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or has been removed.</p>
        <BackButton />
      </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
            {/* Left column - Task details */}
            <div className="lg:col-span-3 space-y-6">
              {/* AI Insights Panel - New Feature */}
              {aiSuggestions && (
                <AnimatePresence>
                  {showAiInsights && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-primary/20 bg-primary/5 overflow-hidden glass-card">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-md flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              AI Task Insights
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowAiInsights(false)}>
                              Hide
                            </Button>
                          </div>
                          <CardDescription>
                            AI-powered analysis and recommendations for this task
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex flex-col p-3 bg-background rounded-lg border">
                              <span className="text-xs text-muted-foreground">Risk Level</span>
                              <div className="flex items-center mt-1">
                                <Badge variant={aiSuggestions.riskLevel === 'high' ? 'destructive' : 'warning'} className="capitalize">
                                  {aiSuggestions.riskLevel}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col p-3 bg-background rounded-lg border">
                              <span className="text-xs text-muted-foreground">Estimated Completion</span>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {format(new Date(aiSuggestions.estimatedCompletion), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col p-3 bg-background rounded-lg border">
                              <span className="text-xs text-muted-foreground">Potential Bottlenecks</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {aiSuggestions.bottlenecks.map((bottleneck, i) => (
                                  <Badge key={i} variant="outline" className="bg-destructive/10 text-destructive text-xs">
                                    {bottleneck}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-background rounded-lg border p-3">
                            <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                            <ul className="space-y-2">
                              {aiSuggestions.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <ArrowUpRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {!showAiInsights && aiSuggestions && (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10"
                  onClick={() => setShowAiInsights(true)}
                >
                  <Zap className="h-4 w-4 mr-2 text-primary" />
                  Show AI Task Insights
                </Button>
              )}

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

                <TabsContent value="overview" className="space-y-6">
                  <TaskOverview task={task} />
                  <TaskProgress task={task} />

                  {/* Enhanced Timeline Feature */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-md flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Task Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                        {task.subtasks.map((subtask, index) => (
                          <motion.div
                            key={subtask.id}
                            className="ml-10 mb-6 relative"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={`absolute -left-10 top-1 w-4 h-4 rounded-full bg-background border-2 ${subtask.status === 'completed'
                              ? 'border-green-500'
                              : subtask.status === 'in_progress'
                                ? 'border-amber-500'
                                : 'border-muted-foreground'
                              }`}></div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{subtask.title}</span>
                                <Badge variant={
                                  subtask.status === 'completed' ? 'success' :
                                    subtask.status === 'in_progress' ? 'warning' : 'outline'
                                } className="text-xs">
                                  {subtask.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(subtask.startDate), 'MMM d')} - {format(new Date(subtask.endDate), 'MMM d, yyyy')}
                                </span>
                                <Users className="h-3 w-3 ml-2" />
                                <span>{subtask.assignee.name}</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <Progress value={subtask.progress} className="h-1.5 w-32" />
                                <span className="text-xs">{subtask.progress}%</span>
                              </div>
                              {subtask.notes && (
                                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                                  {subtask.notes}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  
                </TabsContent>

                <TabsContent value="subtasks" className="space-y-6">
                  <SubtasksList task={task} setTask={setTask} />
                </TabsContent>

                <TabsContent value="files" className="space-y-6">
                  <TaskFiles task={task} />
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                  <TaskComments task={task} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Sidebar */}
            <div className="space-y-6">
              <TaskAssignee task={task} teamMembers={task.teamMembers} />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Due Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  {new Date(task.dueDate) < new Date() ? (
                    <Badge variant="destructive" className="mt-2">Overdue</Badge>
                  ) : (
                    <div className="mt-2">
                      <Progress
                        value={100 - (differenceInDays(new Date(task.dueDate), new Date()) / differenceInDays(new Date(task.dueDate), new Date(task.createdAt))) * 100}
                        className="h-1.5 mb-1"
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      + Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Related Tasks Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Related Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[180px]">
                    <div className="divide-y">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/5">T{i + 10}</Badge>
                              <span className="text-sm font-medium truncate">Related PCR Analysis Task {i}</span>
                            </div>
                            <Badge variant={i === 1 ? 'success' : i === 2 ? 'warning' : 'outline'}>
                              {i === 1 ? 'Completed' : i === 2 ? 'In Progress' : 'Not Started'}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Due {format(addDays(new Date(), i + 2), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="pt-2 pb-2">
                  <Button variant="ghost" size="sm" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Link Related Task
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-md flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto pr-2">
                  <TaskActivityLog activities={task.activityLog} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
