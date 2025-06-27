"use client";
import { useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  MessageSquare,
  CheckSquare,
  User,
  Clock,
  BarChart,
  AlertCircle,
  Star,
  Tag,
  Calendar,
  ArrowRight,
  ChevronDown,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Timeline, TimelineItem } from "@/components/ui/timeline";

export function TaskActivityLog({ activities }) {
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState({});

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
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
      case 'priority_changed':
        return <Star className="h-4 w-4" />;
      case 'due_date_updated':
        return <Calendar className="h-4 w-4" />;
      case 'label_added':
        return <Tag className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
        return "bg-green-500/20 text-green-600";
      case 'comment_added':
        return "bg-blue-500/20 text-blue-600";
      case 'subtask_completed':
        return "bg-purple-500/20 text-purple-600";
      case 'task_assigned':
        return "bg-amber-500/20 text-amber-600";
      case 'file_uploaded':
        return "bg-indigo-500/20 text-indigo-600";
      case 'progress_updated':
        return "bg-cyan-500/20 text-cyan-600";
      case 'priority_changed':
        return "bg-red-500/20 text-red-600";
      case 'due_date_updated':
        return "bg-orange-500/20 text-orange-600";
      case 'label_added':
        return "bg-pink-500/20 text-pink-600";
      default:
        return "bg-gray-500/20 text-gray-600";
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
      case 'priority_changed':
        return `${activity.user} changed priority to ${activity.details}`;
      case 'due_date_updated':
        return `${activity.user} updated due date to ${activity.details}`;
      case 'label_added':
        return `${activity.user} added label "${activity.details}"`;
      default:
        return `${activity.user} performed an action`;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  return (
    <div className="relative">
      {/* Border Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur-xl -z-10" />

      <Card className="relative overflow-hidden border-none bg-white/80 dark:bg-background/80 backdrop-blur-lg shadow-2xl ring-1 ring-primary/10 hover:shadow-3xl transition-all duration-300 flex flex-col">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span>Activity Log</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 shadow-sm hover:shadow-md transition-shadow">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-lg">
                  <DropdownMenuLabel>Filter Activities</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter('all')}>
                    All Activities
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {[
                    { value: 'task_created', label: 'Task Creation' },
                    { value: 'comment_added', label: 'Comments' },
                    { value: 'subtask_completed', label: 'Subtask Completion' },
                    { value: 'task_assigned', label: 'Assignments' },
                    { value: 'file_uploaded', label: 'File Uploads' },
                    { value: 'progress_updated', label: 'Progress Updates' }
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={cn(
                        "flex items-center gap-2",
                        filter === item.value && "bg-primary/10"
                      )}
                    >
                      {getActivityIcon(item.value)}
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          <Timeline>
            {filteredActivities.map((activity, index) => (
              <TimelineItem key={activity.id} className="mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shadow-sm",
                    getActivityColor(activity.type)
                  )}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{getActivityText(activity)}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{format(new Date(activity.timestamp), 'PPP p')}</div>
                    {activity.details && filter !== 'comment_added' && (
                      <div className="text-xs text-muted-foreground mt-1">{activity.details}</div>
                    )}
                  </div>
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}