"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  User
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

// Helper to check if a date is in the past
const isPastDue = (dateString) => {
  const dueDate = new Date(dateString);
  const now = new Date();
  return dueDate < now;
};

// Helper function to get attachment type icon
const getAttachmentIcon = (type) => {
  switch(type) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-red-500" />;
    case 'excel':
      return <FileText className="h-4 w-4 text-green-500" />;
    case 'word':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'image':
      return <FileText className="h-4 w-4 text-purple-500" />;
    case 'zip':
      return <FileText className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export const TaskDetailsDialog = ({ open, onOpenChange, task, onAction, users, experiments }) => {
  const [activeTab, setActiveTab] = useState("details");
  
  if (!task) return null;
  
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
                          onAction("statusChange", {...task, status: "in-progress"});
                        }}>
                          <Clock className="h-4 w-4" />
                          Mark as In Progress
                        </Button>
                      )}
                      {task.status === "in-progress" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                          onAction("statusChange", {...task, status: "completed"});
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
