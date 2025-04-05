"use client";

import { format } from "date-fns";
import { 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  User, 
  Clock, 
  BarChart 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TaskActivityLog({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
        return <FileText className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'subtask_completed':
        return <CheckSquare className="h-4 w-4" />;
      case 'task_assigned':
        return <User className="h-4 w-4" />;
      case 'file_uploaded':
        return <FileText className="h-4 w-4" />;
      case 'progress_updated':
        return <BarChart className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
        return "bg-green-500";
      case 'comment_added':
        return "bg-blue-500";
      case 'subtask_completed':
        return "bg-purple-500";
      case 'task_assigned':
        return "bg-amber-500";
      case 'file_uploaded':
        return "bg-indigo-500";
      case 'progress_updated':
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'task_created':
        return `${activity.user} created this task`;
      case 'task_assigned':
        return `${activity.user} assigned this task to ${activity.details}`;
      case 'comment_added':
        return `${activity.user} added a comment`;
      case 'file_uploaded':
        return `${activity.user} uploaded ${activity.details}`;
      case 'subtask_completed':
        return `${activity.user} completed subtask "${activity.details}"`;
      case 'progress_updated':
        return `${activity.user} updated progress to ${activity.details}`;
      default:
        return `${activity.user} performed an action`;
    }
  };
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            <div className={cn(
              "h-4 w-4 rounded-full mt-1 z-10 flex items-center justify-center",
              getActivityColor(activity.type)
            )}>
              <div className="h-2 w-2 rounded-full bg-background" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm">{getActivityText(activity)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(new Date(activity.timestamp), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}