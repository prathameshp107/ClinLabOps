"use client";
import { useState, useEffect } from "react";
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
  Filter,
  Activity,
  Sparkles
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTaskActivityLog } from "@/services/taskService";

export function TaskActivityLog({ taskId, className }) {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!taskId || taskId === 'unknown') return;
    setLoading(true);
    getTaskActivityLog(taskId)
      .then(setActivities)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [taskId]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return <FileText className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'comment_updated':
        return <MessageSquare className="h-4 w-4" />;
      case 'comment_deleted':
        return <MessageSquare className="h-4 w-4" />;
      case 'subtask_added':
        return <CheckSquare className="h-4 w-4" />;
      case 'subtask_completed':
        return <CheckSquare className="h-4 w-4" />;
      case 'subtask_updated':
        return <CheckSquare className="h-4 w-4" />;
      case 'subtask_deleted':
        return <CheckSquare className="h-4 w-4" />;
      case 'task_assigned':
        return <User className="h-4 w-4" />;
      case 'file_uploaded':
        return <FileText className="h-4 w-4" />;
      case 'file_deleted':
        return <FileText className="h-4 w-4" />;
      case 'progress_updated':
        return <BarChart className="h-4 w-4" />;
      case 'priority_changed':
        return <Star className="h-4 w-4" />;
      case 'status_changed':
        return <ArrowRight className="h-4 w-4" />;
      case 'due_date_updated':
        return <Calendar className="h-4 w-4" />;
      case 'title_updated':
        return <FileText className="h-4 w-4" />;
      case 'description_updated':
        return <FileText className="h-4 w-4" />;
      case 'task_updated':
        return <FileText className="h-4 w-4" />;
      case 'task_deleted':
        return <AlertCircle className="h-4 w-4" />;
      case 'label_added':
        return <Tag className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
        return "bg-gradient-to-br from-green-500/20 to-green-600/10 text-green-600 border border-green-500/20 shadow-lg shadow-green-500/10";
      case 'comment_added':
      case 'comment_updated':
        return "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-600 border border-blue-500/20 shadow-lg shadow-blue-500/10";
      case 'comment_deleted':
        return "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-600 border border-red-500/20 shadow-lg shadow-red-500/10";
      case 'subtask_added':
        return "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-600 border border-emerald-500/20 shadow-lg shadow-emerald-500/10";
      case 'subtask_completed':
        return "bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-600 border border-purple-500/20 shadow-lg shadow-purple-500/10";
      case 'subtask_updated':
        return "bg-gradient-to-br from-violet-500/20 to-violet-600/10 text-violet-600 border border-violet-500/20 shadow-lg shadow-violet-500/10";
      case 'subtask_deleted':
        return "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-600 border border-red-500/20 shadow-lg shadow-red-500/10";
      case 'task_assigned':
        return "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-600 border border-amber-500/20 shadow-lg shadow-amber-500/10";
      case 'file_uploaded':
        return "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 text-indigo-600 border border-indigo-500/20 shadow-lg shadow-indigo-500/10";
      case 'file_deleted':
        return "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-600 border border-red-500/20 shadow-lg shadow-red-500/10";
      case 'progress_updated':
        return "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-600 border border-cyan-500/20 shadow-lg shadow-cyan-500/10";
      case 'priority_changed':
        return "bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-600 border border-orange-500/20 shadow-lg shadow-orange-500/10";
      case 'status_changed':
        return "bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-600 border border-blue-500/20 shadow-lg shadow-blue-500/10";
      case 'due_date_updated':
        return "bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-600 border border-orange-500/20 shadow-lg shadow-orange-500/10";
      case 'title_updated':
      case 'description_updated':
      case 'task_updated':
        return "bg-gradient-to-br from-slate-500/20 to-slate-600/10 text-slate-600 border border-slate-500/20 shadow-lg shadow-slate-500/10";
      case 'task_deleted':
        return "bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-600 border border-red-500/20 shadow-lg shadow-red-500/10";
      case 'label_added':
        return "bg-gradient-to-br from-pink-500/20 to-pink-600/10 text-pink-600 border border-pink-500/20 shadow-lg shadow-pink-500/10";
      default:
        return "bg-gradient-to-br from-gray-500/20 to-gray-600/10 text-gray-600 border border-gray-500/20 shadow-lg shadow-gray-500/10";
    }
  };

  const getActivityText = (activity) => {
    const userName = activity.user || 'Unknown User';

    switch (activity.action || activity.type) {
      case 'task_created':
        return `${userName} created this task`;
      case 'task_assigned':
        return `${userName} assigned this task${activity.details ? ` to ${activity.details}` : ''}`;
      case 'comment_added':
        return `${userName} added a comment`;
      case 'comment_updated':
        return `${userName} updated a comment`;
      case 'comment_deleted':
        return `${userName} deleted a comment`;
      case 'subtask_added':
        return `${userName} added subtask${activity.details ? ` "${activity.details}"` : ''}`;
      case 'subtask_completed':
        return `${userName} completed subtask${activity.details ? ` "${activity.details}"` : ''}`;
      case 'subtask_updated':
        return `${userName} updated subtask${activity.details ? ` "${activity.details}"` : ''}`;
      case 'subtask_deleted':
        return `${userName} deleted a subtask`;
      case 'file_uploaded':
        return `${userName} uploaded file${activity.details ? ` "${activity.details}"` : ''}`;
      case 'file_deleted':
        return `${userName} deleted a file`;
      case 'progress_updated':
        return `${userName} updated progress${activity.details ? ` to ${activity.details}` : ''}`;
      case 'priority_changed':
        return `${userName} changed priority${activity.details ? ` to ${activity.details}` : ''}`;
      case 'status_changed':
        const statusLabel = activity.details === 'in-progress' ? 'In Progress' :
          activity.details === 'todo' ? 'To Do' :
            activity.details === 'review' ? 'Review' :
              activity.details === 'done' ? 'Done' : activity.details;
        return `${userName} changed status${statusLabel ? ` to ${statusLabel}` : ''}`;
      case 'due_date_updated':
        return `${userName} updated due date${activity.details ? ` to ${activity.details}` : ''}`;
      case 'title_updated':
        return `${userName} updated the task title`;
      case 'description_updated':
        return `${userName} updated the task description`;
      case 'task_updated':
        return `${userName} updated the task`;
      case 'task_deleted':
        return `${userName} deleted this task`;
      case 'label_added':
        return `${userName} added label${activity.details ? ` "${activity.details}"` : ''}`;
      default:
        return `${userName} performed an action`;
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return (activity.action || activity.type) === filter;
  });

  if (loading) {
    return (
      <div className="relative">
        {/* Border Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-xl -z-10" />

        <Card className="relative overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-lg shadow-xl ring-1 ring-primary/10">
          <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-1 ring-primary/20">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Activity Log
              </span>
              <Badge variant="outline" className="ml-auto bg-primary/5 border-primary/20">
                Loading...
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        {/* Border Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 rounded-xl blur-xl -z-10" />

        <Card className="relative overflow-hidden border-2 border-dashed border-red-500/20 bg-gradient-to-br from-background to-red-50/30 dark:to-red-950/30 backdrop-blur-lg shadow-xl">
          <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-red-500/5 via-red-500/3 to-transparent">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 shadow-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <span>Activity Log</span>
              <Badge variant="destructive" className="ml-auto">
                Error
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Failed to load activity log</p>
              <p className="text-xs text-red-500 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Border Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-xl -z-10" />

      <Card className="relative overflow-hidden border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/30 backdrop-blur-lg shadow-xl ring-1 ring-primary/10 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-1 ring-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Activity Log
              </span>
              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {filter !== 'all' && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        1
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl border-primary/10 bg-background/95 backdrop-blur-lg">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Filter Activities
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilter('all')}
                    className={cn(
                      "flex items-center gap-2",
                      filter === 'all' && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-primary/50" />
                    All Activities
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {[
                    { value: 'task_created', label: 'Task Creation' },
                    { value: 'comment_added', label: 'Comments' },
                    { value: 'subtask_added', label: 'Subtask Added' },
                    { value: 'subtask_completed', label: 'Subtask Completion' },
                    { value: 'task_assigned', label: 'Assignments' },
                    { value: 'file_uploaded', label: 'File Uploads' },
                    { value: 'status_changed', label: 'Status Changes' },
                    { value: 'priority_changed', label: 'Priority Changes' },
                    { value: 'progress_updated', label: 'Progress Updates' }
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={cn(
                        "flex items-center gap-2 transition-colors",
                        filter === item.value && "bg-primary/10 text-primary"
                      )}
                    >
                      <div className={cn(
                        "h-6 w-6 rounded-lg flex items-center justify-center",
                        getActivityColor(item.value)
                      )}>
                        {getActivityIcon(item.value)}
                      </div>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-6 py-4">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">No activities yet</h3>
                <p className="text-xs text-muted-foreground">
                  {filter === 'all'
                    ? 'Activities will appear here as you work on this task'
                    : `No ${filter.replace('_', ' ')} activities found`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="group relative"
                  >
                    {/* Timeline line */}
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-border to-transparent" />
                    )}

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-background to-muted/20 border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-primary/2">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-105",
                        getActivityColor(activity.action || activity.type)
                      )}>
                        {getActivityIcon(activity.action || activity.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground leading-relaxed">
                              {getActivityText(activity)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs bg-background/50 border-border/50">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                              </Badge>
                              {activity.details && filter !== 'comment_added' && (
                                <Badge variant="secondary" className="text-xs max-w-[200px] truncate">
                                  {activity.details}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs capitalize",
                                getActivityColor(activity.action || activity.type)
                              )}
                            >
                              {(activity.action || activity.type).replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}