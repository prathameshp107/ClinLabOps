"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CalendarClock,
  Paperclip,
  ArrowRightCircle,
  CheckCircle
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

// Helper to check if a date is in the past
const isPastDue = (dateString) => {
  const dueDate = new Date(dateString);
  const now = new Date();
  return dueDate < now;
};

export const TaskBoard = ({ tasks, onAction, onStatusChange, users }) => {
  // Group tasks by status
  const taskGroups = {
    "pending": tasks.filter(task => task.status === "pending"),
    "in-progress": tasks.filter(task => task.status === "in-progress"),
    "completed": tasks.filter(task => task.status === "completed"),
  };
  
  // Get priority color class
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  // Handler for drag start
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };
  
  // Handler for drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handler for dropping a task in a column
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== targetStatus) {
      onStatusChange(taskId, targetStatus);
    }
  };
  
  // Column configurations
  const columns = [
    {
      id: "pending",
      title: "Pending",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      color: "border-yellow-500",
      emptyMessage: "No pending tasks"
    },
    {
      id: "in-progress",
      title: "In Progress",
      icon: <ArrowRightCircle className="h-5 w-5 text-blue-500" />,
      color: "border-blue-500",
      emptyMessage: "No tasks in progress"
    },
    {
      id: "completed",
      title: "Completed",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      color: "border-green-500",
      emptyMessage: "No completed tasks"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div 
          key={column.id}
          className="flex flex-col"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${column.color}`}>
            {column.icon}
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="outline" className="ml-auto">{taskGroups[column.id].length}</Badge>
          </div>
          
          <div className="space-y-3 h-[calc(100vh-340px)] overflow-y-auto pr-1">
            {taskGroups[column.id].length === 0 ? (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md text-muted-foreground">
                {column.emptyMessage}
              </div>
            ) : (
              taskGroups[column.id].map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onClick={() => onAction("view", task)}
                  className="cursor-pointer"
                >
                  <Card className="shadow-sm hover:shadow transition-shadow">
                    <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium flex gap-1 items-center">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="truncate max-w-[200px]">
                            {task.name}
                          </span>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {task.experimentName}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onAction("view", task);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onAction("edit", task);
                          }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {task.status === "pending" && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(task.id, "in-progress");
                            }}>
                              Mark as In Progress
                            </DropdownMenuItem>
                          )}
                          {task.status === "in-progress" && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(task.id, "completed");
                            }}>
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction("delete", task);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignedTo.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{task.assignedTo.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 text-xs">
                        <div className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className={isPastDue(task.dueDate) && task.status !== "completed" ? "text-red-500 font-medium" : ""}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          {task.dependencies?.length > 0 && (
                            <span title="Has dependencies">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            </span>
                          )}
                          {task.attachments?.length > 0 && (
                            <span title={`${task.attachments.length} attachment(s)`}>
                              <Paperclip className="h-3 w-3 text-muted-foreground" />
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
