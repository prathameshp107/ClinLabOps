"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
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
  Share2
} from "lucide-react";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

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
            { id: "a9", type: "file_uploaded", timestamp: "2023-10-20T16:30:00Z", user: "John Smith", details: "PCR_Results_Partial.docx" },
            { id: "a10", type: "subtask_completed", timestamp: "2023-10-20T16:35:00Z", user: "John Smith", details: "Run PCR on samples 1-5" },
            { id: "a11", type: "progress_updated", timestamp: "2023-10-20T16:40:00Z", user: "John Smith", details: "Progress updated to 65%" }
          ],
          teamMembers: [
            { id: "u1", name: "Dr. Jane Doe", avatar: "/avatars/jane-doe.png", role: "Project Lead" },
            { id: "u2", name: "John Smith", avatar: "/avatars/john-smith.png", role: "Lab Technician" },
            { id: "u3", name: "Emily Chen", avatar: "/avatars/emily-chen.png", role: "Research Assistant" },
            { id: "u4", name: "Michael Brown", avatar: "/avatars/michael-brown.png", role: "Data Analyst" }
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
        className="container mx-auto px-4 py-6 max-w-7xl"
      >
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <BackButton />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold truncate">{task.title}</h1>
                <Badge variant={
                  task.status === 'completed' ? 'success' :
                    task.status === 'in_progress' ? 'warning' : 'outline'
                }>
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
          </div>

          <div className="flex items-center gap-2">
            <HoverBorderGradient className="rounded-md">
              <Button variant="outline" size="sm" className="gap-1">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
            </HoverBorderGradient>

            <HoverBorderGradient className="rounded-md">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </HoverBorderGradient>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
                <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Task details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <TaskOverview task={task} />
                <TaskProgress task={task} />
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
                {new Date(task.dueDate) < new Date() && (
                  <Badge variant="destructive" className="mt-2">Overdue</Badge>
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
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    + Add
                  </Button>
                </div>
              </CardContent>
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
      </motion.div>
    </DashboardLayout>
  );
}
