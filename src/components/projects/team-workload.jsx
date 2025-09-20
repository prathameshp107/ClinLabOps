"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Users, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle2, Clock, MoreVertical, Activity } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const getStatusColor = (status) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getWorkloadStatus = (value) => {
  if (value >= 80) return { label: 'High', color: 'text-red-600 bg-red-50' };
  if (value >= 60) return { label: 'Medium', color: 'text-amber-600 bg-amber-50' };
  return { label: 'Low', color: 'text-green-600 bg-green-50' };
};

const getAvatarFallback = (name) => {
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
};

export function TeamWorkload({ project }) {
  // Calculate workload for each team member based on their assigned tasks
  const calculateMemberWorkload = () => {
    if (!project?.team || !project?.tasks) return [];

    return project.team.map(member => {
      // Find tasks assigned to this member
      const assignedTasks = project.tasks.filter(task => 
        task.assigneeId === member.id || task.assignee === member.name
      );

      const completedTasks = assignedTasks.filter(task => task.status === 'completed').length;
      const inProgressTasks = assignedTasks.filter(task => task.status === 'in_progress').length;
      const pendingTasks = assignedTasks.filter(task => task.status === 'pending').length;
      const totalTasks = assignedTasks.length;

      // Calculate workload percentage (simple calculation based on total tasks)
      const workloadPercentage = totalTasks > 0 ? Math.min((totalTasks / 5) * 100, 100) : 0;

      return {
        id: member.id,
        name: member.name,
        role: member.role,
        avatarFallback: getAvatarFallback(member.name),
        status: member.status || 'offline',
        completed: completedTasks,
        inProgress: inProgressTasks,
        pending: pendingTasks,
        totalTasks: totalTasks,
        workloadPercentage: Math.round(workloadPercentage),
        lastActive: 'Recently active' // This could be enhanced with real activity data
      };
    });
  };

  const teamWorkloadData = calculateMemberWorkload();

  // Show message when no team data is available
  if (!project?.team || project.team.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border-b border-gray-100/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            Team Workload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
            <p className="text-gray-600 text-sm max-w-md">
              This project doesn't have any team members assigned yet. Add team members to see their workload and task assignments.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message when team exists but no tasks are assigned
  if (teamWorkloadData.length === 0 || teamWorkloadData.every(member => member.totalTasks === 0)) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border-b border-gray-100/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            Team Workload
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-600 text-sm max-w-md">
              Team members are available but no tasks have been assigned to them yet. Assign tasks to see workload distribution.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTasks = teamWorkloadData.reduce((sum, member) => sum + member.totalTasks, 0);
  const averageWorkload = teamWorkloadData.length > 0 
    ? teamWorkloadData.reduce((sum, member) => sum + member.workloadPercentage, 0) / teamWorkloadData.length 
    : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            Team Workload
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">
                {teamWorkloadData.filter(m => m.status === 'online').length} Active
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors">
                    Reassign work items
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to reassign work items and balance team workload</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
            <div className="text-sm text-blue-600 font-medium mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-blue-900">{totalTasks}</div>
            <div className="text-xs text-blue-600 mt-1">Across all team members</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
            <div className="text-sm text-purple-600 font-medium mb-1">Average Workload</div>
            <div className="text-2xl font-bold text-purple-900">{Math.round(averageWorkload)}%</div>
            <div className="text-xs text-purple-600 mt-1">Team capacity utilization</div>
          </div>
        </div>

        <div className="space-y-4">
          {teamWorkloadData.map((member, index) => {
            const workloadStatus = getWorkloadStatus(member.workloadPercentage);
            return (
              <div key={member.id || index} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 hover:shadow-md transition-all duration-200">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {member.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {member.name}
                      </span>
                      <Badge variant="outline" className={`text-xs ${workloadStatus.color}`}>
                        {workloadStatus.label} Workload
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {member.lastActive}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{member.role}</span>
                    <span className="text-xs text-gray-500">{member.totalTasks} tasks</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${member.workloadPercentage}%`,
                        backgroundColor: workloadStatus.label === 'High' ? '#ef4444' : 
                                     workloadStatus.label === 'Medium' ? '#f59e0b' : '#10b981'
                      }}
                    />
                  </div>
                  {/* Task breakdown */}
                  {member.totalTasks > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {member.completed} completed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        {member.inProgress} in progress
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        {member.pending} pending
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 