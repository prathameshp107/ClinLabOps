"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, FileText, Tag, TrendingUp, Calendar, Users, DollarSign, Clock, Target, Zap, CheckCircle2, AlertCircle, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UpcomingMilestones } from "./upcoming-milestones"
import { TaskStatusOverview } from "./task-status-overview"
import { PriorityBreakdown } from "./priority-breakdown"
import { TeamWorkload } from "./team-workload"
import { ProjectActivityTimeline } from "./project-activity-timeline"
import { statProgressColors } from "@/constants"
import { sanitizeHtml } from "@/lib/utils"

const StatProgress = ({ label, value, total, progress, color = "blue", icon: Icon, trend, description }) => {
  const colorClasses = statProgressColors[color] || statProgressColors.blue;

  return (
    <div className={`group p-4 rounded-2xl bg-gradient-to-br ${colorClasses.bg} hover:shadow-lg transition-all duration-300 mb-4 last:mb-0 border border-border/50`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-background/80 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <Icon className={`h-4 w-4 ${colorClasses.icon}`} />
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-foreground">{label}</span>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold text-lg ${colorClasses.text}`}>
            {typeof value === 'string' && value.includes('$') ? value : `${value}/${total}`}
          </div>
          {trend && (
            <div className="flex items-center gap-1 justify-end">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-2 bg-muted/60 rounded-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{progress}% Complete</span>
          <span>{100 - progress}% Remaining</span>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, index }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors group">
    <Avatar className="h-8 w-8 shadow-sm group-hover:shadow-md transition-shadow">
      <AvatarImage src={activity.avatar} alt={activity.user} />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
        {activity.user?.charAt(0) || 'U'}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-foreground truncate">{activity.user}</p>
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          {activity.action}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
        <Clock className="h-3 w-3" />
        <span>{activity.timestamp}</span>
      </div>
    </div>
  </div>
);

export function ProjectOverview({ project }) {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* Left Column - Main Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Project Description */}
        <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-5 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Project Overview
              </CardTitle>
              {project?.status && (
                <Badge
                  variant="outline"
                  className={`text-xs font-medium px-3 py-1 rounded-full ${project.status === 'In Progress' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    project.status === 'Completed' ? 'border-green-200 text-green-700 bg-green-50' :
                      project.status === 'On Hold' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                        'border-gray-200 text-gray-700 bg-gray-50'
                    }`}
                >
                  {project.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Project Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Description</h3>
                </div>

                {project?.description ? (
                  <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/20 dark:from-gray-900/50 dark:to-blue-900/20 rounded-xl p-5 border border-border/50">
                    <p
                      className="text-foreground/80 leading-relaxed text-base"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gradient-to-r from-gray-50/30 to-blue-50/10 dark:from-gray-900/30 dark:to-blue-900/10 rounded-xl border-2 border-dashed border-border/50">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Description Available</h3>
                    <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                      This project doesn't have a description yet. Add a detailed description to help team members understand the project goals and objectives.
                    </p>
                    <Button variant="outline" className="mt-4 px-4 py-2 text-sm">
                      Add Description
                    </Button>
                  </div>
                )}
              </div>

              {/* Project Tags Section */}
              {project?.tags && project.tags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">Project Tags</h3>
                  </div>
                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/20 dark:from-green-900/50 dark:to-emerald-900/20 rounded-xl p-5 border border-border/50">
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-background/90 text-foreground border border-border/50 px-4 py-2 text-sm font-medium rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-200 cursor-default shadow-sm hover:shadow-md"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details Section */}
              {(project?.startDate || project?.endDate || project?.department || project?.priority) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/20 dark:from-purple-900/50 dark:to-pink-900/20 rounded-xl p-5 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project?.startDate && (
                        <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</span>
                            <p className="text-sm font-semibold text-foreground">{new Date(project.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                      )}
                      {project?.endDate && (
                        <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">End Date</span>
                            <p className="text-sm font-semibold text-foreground">{new Date(project.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                      )}
                      {project?.department && (
                        <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</span>
                            <p className="text-sm font-semibold text-foreground">{project.department}</p>
                          </div>
                        </div>
                      )}
                      {project?.priority && (
                        <div className="flex items-center gap-3 p-3 bg-background/60 rounded-lg border border-border/50">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</span>
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium px-2 py-1 rounded-full ${project.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:bg-red-900/30' :
                                project.priority === 'Medium' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-300 dark:bg-amber-900/30' :
                                  'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-300 dark:bg-green-900/30'
                                }`}
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Activity Timeline */}
        {project?.id && <ProjectActivityTimeline projectId={project.id} />}

        {/* Upcoming Milestones */}
        <UpcomingMilestones project={project} />
        <PriorityBreakdown project={project} />
      </div>

      {/* Right Column - Stats & Widgets */}
      <div className="space-y-6">
        {/* Project Progress Stats */}
        <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/50 dark:to-orange-900/50 border-b border-border/50">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              Project Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Task Completion - Only show if tasks exist */}
            {project?.tasks && project.tasks.length > 0 && (
              <StatProgress
                label="Task Completion"
                value={project.tasks.filter(task => task.status === 'completed').length}
                total={project.tasks.length}
                progress={Math.round((project.tasks.filter(task => task.status === 'completed').length / project.tasks.length) * 100)}
                color="blue"
                icon={CheckCircle2}
                trend={`${Math.round((project.tasks.filter(task => task.status === 'completed').length / project.tasks.length) * 100)}% complete`}
                description="Tasks completed vs total"
              />
            )}

            {/* Budget Utilization - Only show if budget exists */}
            {project?.budget && (
              <StatProgress
                label="Budget Utilization"
                value={`$${parseInt(project.budget).toLocaleString()}`}
                total={`$${parseInt(project.budget).toLocaleString()}`}
                progress={project.progress || 0}
                color="green"
                icon={DollarSign}
                trend={`${project.progress || 0}% utilized`}
                description="Budget utilization rate"
              />
            )}

            {/* Timeline Progress - Only show if start and end dates exist */}
            {project?.startDate && project?.endDate && (
              (() => {
                const startDate = new Date(project.startDate);
                const endDate = new Date(project.endDate);
                const currentDate = new Date();
                const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                const elapsedDays = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
                const timelineProgress = Math.min(Math.max(Math.round((elapsedDays / totalDays) * 100), 0), 100);

                return (
                  <StatProgress
                    label="Timeline Progress"
                    value={elapsedDays > 0 ? elapsedDays : 0}
                    total={totalDays}
                    progress={timelineProgress}
                    color="purple"
                    icon={Calendar}
                    trend={timelineProgress > 100 ? "Overdue" : timelineProgress < 0 ? "Not started" : "On schedule"}
                    description="Days elapsed vs total timeline"
                  />
                );
              })()
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Tasks</p>
                  <p className="text-2xl font-bold">
                    {project?.tasks ? project.tasks.filter(task => task.status === 'in_progress').length : 0}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Team Size</p>
                  <p className="text-2xl font-bold">
                    {project?.team ? project.team.length : 0}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Status Overview */}
        <TaskStatusOverview project={project} />

        {/* Team Workload */}
        <TeamWorkload project={project} />
      </div>
    </div>
  )
}