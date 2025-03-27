"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, Clock, ArrowLeft, Edit, Trash2,
  CheckCircle, XCircle, FileText, Link,
  Share2, UserPlus, AlignLeft, CheckSquare, MessageSquare, History, BriefcaseMedical, Download, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { TaskComments } from "./task-comments";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskSubtasks } from "./task-subtasks";

// Mock users for development
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatarUrl: "" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatarUrl: "" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", avatarUrl: "" },
];

// Mock sample activities
const generateMockActivities = (taskId) => [
  {
    id: "act-1",
    type: "created",
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "act-2",
    type: "updated",
    field: "status",
    oldValue: "pending",
    newValue: "in-progress",
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "act-3",
    type: "updated",
    field: "priority",
    oldValue: "medium",
    newValue: "high",
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "act-4",
    type: "added_subtask",
    subtaskTitle: "Review documentation",
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

// Mock sample comments
const generateMockComments = (taskId) => [
  {
    id: "comment-1",
    text: "I've started working on this task. Will update progress tomorrow.",
    author: mockUsers[0],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    mentions: [],
    attachments: []
  },
  {
    id: "comment-2",
    text: "Can you clarify the requirements for the second subtask? @Jane Smith",
    author: mockUsers[2],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    mentions: ["2"],
    attachments: []
  },
  {
    id: "comment-3",
    text: "@Robert Johnson I've added some documentation that should help clarify. Let me know if you have any questions.",
    author: mockUsers[1],
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    mentions: ["3"],
    attachments: [
      {
        id: "attachment-1",
        name: "requirements.pdf",
        size: 1205000,
        type: "application/pdf",
        url: "#"
      }
    ]
  }
];

export const TaskDetails = ({
  taskId,
  task,
  onBack,
  onUpdate,
  onDelete,
  relatedTasks = [],
  experiments = []
}) => {
  const [currentTask, setCurrentTask] = useState(task);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("subtasks");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  // Load task data
  useEffect(() => {
    if (task) {
      setCurrentTask(task);
      setSubtasks(task.subtasks || []);
      setActivities(generateMockActivities(task.id));
      setComments(generateMockComments(task.id));
    }
  }, [task]);

  const isPastDue = (dateString) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
  };


  // Update subtasks
  const handleUpdateSubtasks = (updatedSubtasks) => {
    setSubtasks(updatedSubtasks);

    // Update the task with new subtasks
    const updatedTask = {
      ...currentTask,
      subtasks: updatedSubtasks,
      updatedAt: new Date()
    };

    setCurrentTask(updatedTask);
    if (onUpdate) {
      onUpdate(updatedTask);
    }

    // Add activity for completed subtasks
    const newlyCompletedSubtasks = updatedSubtasks.filter(
      (subtask, index) =>
        subtask.completed &&
        index < (currentTask.subtasks || []).length &&
        !(currentTask.subtasks[index]?.completed)
    );

    if (newlyCompletedSubtasks.length > 0) {
      const newActivities = newlyCompletedSubtasks.map(subtask => ({
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "completed_subtask",
        subtaskTitle: subtask.description,
        user: mockUsers[0], // Current user
        timestamp: new Date()
      }));

      setActivities([...activities, ...newActivities]);
    }
  };

  // Handle task update
  const handleTaskUpdate = (updatedTaskData) => {
    // Track changes for activity log
    const changedFields = [];

    if (updatedTaskData.status !== currentTask.status) {
      changedFields.push({
        field: "status",
        oldValue: currentTask.status,
        newValue: updatedTaskData.status
      });
    }

    if (updatedTaskData.priority !== currentTask.priority) {
      changedFields.push({
        field: "priority",
        oldValue: currentTask.priority,
        newValue: updatedTaskData.priority
      });
    }

    if (updatedTaskData.assigneeId !== currentTask.assigneeId) {
      changedFields.push({
        field: "assignee",
        oldValue: currentTask.assigneeId,
        newValue: updatedTaskData.assigneeId
      });
    }

    // Update task
    const updatedTask = {
      ...currentTask,
      ...updatedTaskData,
      updatedAt: new Date()
    };

    setCurrentTask(updatedTask);
    if (onUpdate) {
      onUpdate(updatedTask);
    }

    // Add activities for changes
    if (changedFields.length > 0) {
      const newActivities = changedFields.map(change => ({
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "updated",
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        user: mockUsers[0], // Current user
        timestamp: new Date()
      }));

      setActivities([...activities, ...newActivities]);
    }

    setEditDialogOpen(false);
  };

  // Get subtasks progress percentage
  const getSubtasksProgress = () => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-blue-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500 text-white";
      case "in-progress": return "bg-blue-500 text-white";
      case "review": return "bg-purple-500 text-white";
      case "completed": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Get user by ID
  const getUserById = (userId) => {
    return mockUsers.find(user => user.id === userId) || { name: "Unassigned", avatarUrl: "" };
  };

  // Handle comments update
  const handleCommentsUpdate = (updatedComments) => {
    setComments(updatedComments);

    // Check if a new comment was added
    if (updatedComments.length > comments.length) {
      const newComment = updatedComments[updatedComments.length - 1];

      // Add an activity for the new comment
      const newActivity = {
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "added_comment",
        commentId: newComment.id,
        user: newComment.author,
        timestamp: new Date()
      };

      setActivities([...activities, newActivity]);

      // Update the task's updatedAt timestamp
      const updatedTask = {
        ...currentTask,
        updatedAt: new Date()
      };

      setCurrentTask(updatedTask);
      if (onUpdate) {
        onUpdate(updatedTask);
      }
    }
  };

  // Render activity item
  const renderActivityItem = (activity) => {
    let content;

    switch (activity.type) {
      case "created":
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> created this task
          </div>
        );
        break;

      case "updated":
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> updated
            {" "}<span className="text-gray-500">{activity.field}</span>{" "}
            from <Badge variant="outline">{activity.oldValue}</Badge>
            {" "}to <Badge variant="outline">{activity.newValue}</Badge>
          </div>
        );
        break;

      case "added_subtask":
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> added subtask
            {" "}<span className="font-medium">"{activity.subtaskTitle}"</span>
          </div>
        );
        break;

      case "completed_subtask":
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> completed subtask
            {" "}<span className="font-medium">"{activity.subtaskTitle}"</span>
          </div>
        );
        break;

      case "added_comment":
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> added a comment
          </div>
        );
        break;

      default:
        content = (
          <div className="text-sm">
            <span className="font-medium">{activity.user.name}</span> performed an action
          </div>
        );
    }

    return (
      <div key={activity.id} className="flex items-start gap-3 py-2 border-t first:border-t-0">
        <Avatar className="h-7 w-7">
          <AvatarImage src={activity.user.avatarUrl} />
          <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {content}
          <div className="text-xs text-gray-500 mt-1">
            {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>
    );
  };

  // If task is not loaded yet
  if (!currentTask) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Loading task details...</h3>
          <p className="text-gray-500">Please wait while we fetch the task information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Modern Header with Glassmorphism */}
      <div className="mb-8 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-10 w-10 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50 transition-all"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">{currentTask.title || currentTask.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-500 mt-1">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Task ID: {currentTask.id}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Created {format(new Date(currentTask.createdAt), "MMM dd, yyyy")}</span>
                {currentTask.dueDate && (
                  <span className={`text-xs px-2 py-1 rounded-full ${isPastDue(currentTask.dueDate) ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}>
                    Due {format(new Date(currentTask.dueDate), "MMM dd, yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-200 dark:border-gray-600 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit Task
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2 transition-all hover:bg-red-600"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Modern Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Info & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Info Card with Modern Design */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-950 rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-blue-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Task Details</span>
                </CardTitle>
                <Badge className={`${getPriorityColor(currentTask.priority)} px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm`}>
                  {currentTask.priority?.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentTask.description}</p>
              </div>

              {/* Progress Section with Animation */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Progress
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {getSubtasksProgress()}%
                  </span>
                </div>
                <Progress
                  value={getSubtasksProgress()}
                  className="h-2.5 bg-gray-100 dark:bg-gray-800"
                />
              </div>

              {/* Experiment Info */}
              {currentTask.experimentName && (
                <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <BriefcaseMedical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Experiment Information
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{currentTask.experimentName}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs Section with Modern Design */}
          <Tabs defaultValue="subtasks" className="w-full">
            <TabsList className="w-full justify-start bg-white dark:bg-gray-950 p-1 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <TabsTrigger value="subtasks" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg transition-all">
                <CheckSquare className="h-4 w-4 mr-2" />
                Subtasks
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg transition-all">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg transition-all">
                <History className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="attachments" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg transition-all">
                <FileText className="h-4 w-4 mr-2" />
                Attachments
              </TabsTrigger>
            </TabsList>

            {/* Subtasks Tab */}
            <TabsContent value="subtasks" className="mt-6">
              <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <TaskSubtasks
                    taskId={currentTask.id}
                    subtasks={subtasks}
                    onUpdateSubtasks={handleUpdateSubtasks}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Tab - Enhanced with the TaskComments component */}
            <TabsContent value="comments" className="mt-6">
              <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <TaskComments
                    taskId={currentTask.id}
                    initialComments={comments}
                    onUpdateComments={handleCommentsUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab - Enhanced with Timeline Design */}
            <TabsContent value="activity" className="mt-6">
              <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Activity Timeline</span>
                  </h3>

                  <div className="space-y-0">
                    {activities.length > 0 ? (
                      <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-6 py-2">
                        {activities.map((activity, index) => (
                          <div key={activity.id} className="relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-[25px] mt-1.5 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 shadow-md"></div>

                            {/* Activity content with card design */}
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                                  <AvatarImage src={activity.user.avatarUrl} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">{activity.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                  {activity.type === "created" && (
                                    <div className="text-sm">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user.name}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> created this task</span>
                                    </div>
                                  )}

                                  {activity.type === "updated" && (
                                    <div className="text-sm">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user.name}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> updated </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">{activity.field}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> from </span>
                                      <Badge variant="outline" className="mx-1 text-xs bg-gray-50 dark:bg-gray-800">{activity.oldValue}</Badge>
                                      <span className="text-gray-700 dark:text-gray-300"> to </span>
                                      <Badge variant="outline" className="mx-1 text-xs bg-blue-50 dark:bg-blue-900/30">{activity.newValue}</Badge>
                                    </div>
                                  )}

                                  {activity.type === "added_subtask" && (
                                    <div className="text-sm">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user.name}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> added subtask </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">"{activity.subtaskTitle}"</span>
                                    </div>
                                  )}

                                  {activity.type === "completed_subtask" && (
                                    <div className="text-sm">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user.name}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> completed subtask </span>
                                      <span className="font-medium text-gray-900 dark:text-gray-100">"{activity.subtaskTitle}"</span>
                                    </div>
                                  )}

                                  {activity.type === "added_comment" && (
                                    <div className="text-sm">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{activity.user.name}</span>
                                      <span className="text-gray-700 dark:text-gray-300"> added a comment</span>
                                    </div>
                                  )}

                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <History className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                        <p>No activity recorded yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attachments Tab */}
            <TabsContent value="attachments" className="mt-6">
              <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Attachments</span>
                  </h3>

                  {currentTask.attachments && currentTask.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentTask.attachments.map((attachment) => (
                        <div 
                          key={attachment.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{attachment.name}</h4>
                            <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                      <p>No attachments for this task</p>
                      <Button variant="outline" size="sm" className="mt-4 rounded-full">
                        Add Attachment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar with Task Metadata */}
        <div className="space-y-6">
          {/* Status & Details Card */}
          <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-950">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-blue-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Status & Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status</label>
                  <div className="mt-1.5">
                    <Badge
                      className={`text-base py-1.5 px-3 w-full justify-center ${getStatusColor(currentTask.status)} rounded-lg shadow-sm`}
                    >
                      {currentTask.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority Level</label>
                  <div className="mt-1.5">
                    <Badge
                      className={`text-base py-1.5 px-3 w-full justify-center ${getPriorityColor(currentTask.priority)} rounded-lg shadow-sm`}
                    >
                      {currentTask.priority?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Task Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Created
                      </div>
                      <div className="text-sm font-medium">
                        {format(new Date(currentTask.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                    
                    {currentTask.dueDate && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Due Date
                        </div>
                        <div className={`text-sm font-medium ${isPastDue(currentTask.dueDate) ? "text-red-500 dark:text-red-400" : ""}`}>
                          {format(new Date(currentTask.dueDate), "MMM dd, yyyy")}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Last Updated
                      </div>
                      <div className="text-sm font-medium">
                        {format(new Date(currentTask.updatedAt || currentTask.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Assignee */}
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee</label>
                  <div className="mt-1.5 flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-md border border-gray-100 dark:border-gray-800">
                    <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                      <AvatarImage src={currentTask.assignedTo?.avatarUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                        {currentTask.assignedTo?.avatar || currentTask.assignedTo?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{currentTask.assignedTo?.name}</div>
                      {currentTask.assignedTo?.email && (
                        <div className="text-xs text-gray-500">{currentTask.assignedTo.email}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Dependencies */}
                {currentTask.dependencies && currentTask.dependencies.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dependencies</label>
                    <div className="mt-1.5 space-y-2">
                      {currentTask.dependencies.map(depId => {
                        const dependency = relatedTasks.find(t => t.id === depId);
                        return dependency ? (
                          <div
                            key={depId}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(dependency.priority)}`} />
                            <span className="text-sm truncate flex-1">{dependency.title || dependency.name}</span>
                            <Badge className={getStatusColor(dependency.status)}>
                              {dependency.status}
                            </Badge>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Tasks Card */}
          <Card className="shadow-sm border-none rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-950">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-blue-100 dark:border-gray-800">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Related Tasks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {relatedTasks
                .filter(t => t.id !== currentTask.id)
                .slice(0, 5)
                .map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer mb-2 border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{task.title || task.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(task.dueDate), "MMM dd")}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(task.status)} text-xs`}>
                      {task.status}
                    </Badge>
                  </motion.div>
                ))}

              {relatedTasks.filter(t => t.id !== currentTask.id).length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <Link className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                  <p>No related tasks found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Task Edit Dialog */}
      {editDialogOpen && (
        <TaskFormDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleTaskUpdate}
          task={currentTask}
          mode="edit"
          users={mockUsers}
          relatedTasks={relatedTasks}
          className="rounded-xl border-none shadow-2xl" // Add modern styling
        />
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800"
          >
            <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete the task <span className="font-medium">"{currentTask.title || currentTask.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (onDelete) {
                    onDelete(currentTask.id);
                  }
                  setConfirmDeleteOpen(false);
                }}
                className="rounded-lg hover:bg-red-600"
              >
                Delete Task
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
