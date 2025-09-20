"use client";

import { useState } from "react";
import {
  User,
  ChevronDown,
  Mail,
  Phone,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Plus,
  BarChart3,
  Users,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import "./task-assignee.css";
import { updateTaskAssignee } from "@/services/taskService";

export function TaskAssignee({ task, teamMembers, onAssigneeChange }) {
  const [assignee, setAssignee] = useState(task.assignee);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAssigneeChange = async (member) => {
    setLoading(true);
    try {
      await updateTaskAssignee(task.id, member);
      setAssignee(member);
      if (onAssigneeChange) onAssigneeChange(member);
    } catch (err) {
      alert("Failed to update assignee: " + err.message);
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  // Calculate workload and performance metrics
  const workload = {
    total: 12,
    completed: 8,
    inProgress: 3,
    overdue: 1
  };

  const performance = {
    rating: 4.5,
    onTimeDelivery: 92,
    taskCompletion: 85
  };

  return (
    <div className="relative">
      {/* Border Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-lg blur-xl -z-10" />

      <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span>Task Assignee</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {showDetails ? "Show Less" : "Show More"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Main Assignee Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-sm" />
                  <Avatar className="relative h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {assignee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">{assignee.name}</h3>
                    <Badge variant="outline" className="font-normal bg-primary/5">
                      {assignee.role || "Team Member"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{assignee.email}</span>
                    </div>
                    {assignee.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{assignee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
                  >
                    Reassign
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                  <DropdownMenuLabel>Select Team Member</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {teamMembers.map((member) => (
                    <DropdownMenuItem
                      key={member.id}
                      onClick={() => handleAssigneeChange(member)}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer",
                        member.id === assignee.id && "bg-primary/10"
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role || "Team Member"}</p>
                      </div>
                      {member.id === assignee.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Team Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BarChart3 className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="text-sm font-medium">Total Tasks</h4>
                        </div>
                        <p className="text-2xl font-semibold">{workload.total}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <h4 className="text-sm font-medium">Completed</h4>
                        </div>
                        <p className="text-2xl font-semibold text-green-600">{workload.completed}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <Clock className="h-4 w-4 text-blue-500" />
                          </div>
                          <h4 className="text-sm font-medium">In Progress</h4>
                        </div>
                        <p className="text-2xl font-semibold text-blue-600">{workload.inProgress}</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-red-500/10">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                          <h4 className="text-sm font-medium">Overdue</h4>
                        </div>
                        <p className="text-2xl font-semibold text-red-600">{workload.overdue}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <h4 className="text-sm font-medium">Performance Rating</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{performance.rating}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">On-time Delivery</span>
                              <span className="font-medium">{performance.onTimeDelivery}%</span>
                            </div>
                            <Progress
                              value={performance.onTimeDelivery}
                              className="h-1.5 bg-primary/10"
                              indicatorClassName="bg-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Task Completion</span>
                              <span className="font-medium">{performance.taskCompletion}%</span>
                            </div>
                            <Progress
                              value={performance.taskCompletion}
                              className="h-1.5 bg-primary/10"
                              indicatorClassName="bg-primary"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="text-sm font-medium">Team Collaboration</h4>
                        </div>
                        <div className="space-y-4">
                          {[
                            { name: "John Doe", tasks: 5, color: "bg-blue-500" },
                            { name: "Jane Smith", tasks: 3, color: "bg-green-500" },
                            { name: "Mike Johnson", tasks: 2, color: "bg-purple-500" }
                          ].map((member, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className={cn("h-2 w-2 rounded-full", member.color)} />
                              <span className="text-sm flex-1">{member.name}</span>
                              <span className="text-sm font-medium">{member.tasks} tasks</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: 'completed', title: 'Completed Task #123', time: '2 hours ago' },
                          { type: 'started', title: 'Started Task #124', time: '4 hours ago' },
                          { type: 'commented', title: 'Added comment to Task #125', time: '1 day ago' }
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className={cn(
                              "p-1.5 rounded-full",
                              activity.type === 'completed' && "bg-green-100 text-green-600",
                              activity.type === 'started' && "bg-blue-100 text-blue-600",
                              activity.type === 'commented' && "bg-purple-100 text-purple-600"
                            )}>
                              {activity.type === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                              {activity.type === 'started' && <Clock className="h-4 w-4" />}
                              {activity.type === 'commented' && <AlertCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}