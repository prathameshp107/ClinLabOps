"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, FileText, Tag, TrendingUp, Calendar, Users, DollarSign, Clock, Target, Zap, CheckCircle2, AlertCircle, User, ArrowUpRight } from "lucide-react"
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
import { cn } from "@/lib/utils"

const StatProgress = ({ label, value, total, progress, color = "blue", icon: Icon, trend, description }) => {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-500/20 text-blue-600",
    green: "from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-500/20 text-green-600",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-200/50 dark:border-orange-500/20 text-orange-600",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-500/20 text-purple-600",
  };

  const iconBgClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  };

  const progressClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
  };

  return (
    <div className={cn(
      "group p-5 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:shadow-md mb-4 last:mb-0",
      colorClasses[color] || colorClasses.blue
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn("p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300", iconBgClasses[color] || iconBgClasses.blue)}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-foreground block">{label}</span>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-lg text-foreground">
            {typeof value === 'string' && value.includes('$') ? value : `${value}/${total}`}
          </div>
          {trend && (
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-2 bg-background/50 rounded-full overflow-hidden"
          indicatorclassname={progressClasses[color] || progressClasses.blue}
        />
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>{progress}% Complete</span>
          <span>{100 - progress}% Remaining</span>
        </div>
      </div>
    </div>
  );
};

export function ProjectOverview({ project }) {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-2">
      {/* Left Column - Main Content */}
      <div className="xl:col-span-2 space-y-8">
        {/* Project Description */}
        <Card className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="px-8 py-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Project Overview
              </CardTitle>
              {project?.status && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full border shadow-sm",
                    project.status === 'In Progress' ? 'border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                      project.status === 'Completed' ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' :
                        project.status === 'On Hold' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' :
                          'border-gray-200 text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {project.status}
                  </div>
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Project Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Description</h3>
                </div>

                {project?.description ? (
                  <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                    <div
                      className="text-muted-foreground leading-relaxed text-base prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border-2 border-dashed border-border/50">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Description Available</h3>
                    <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-4">
                      This project doesn't have a description yet. Add a detailed description to help team members understand the project goals.
                    </p>
                    <Button variant="outline" size="sm">
                      Add Description
                    </Button>
                  </div>
                )}
              </div>

              {/* Project Tags Section */}
              {project?.tags && project.tags.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">Tags</h3>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-background hover:bg-muted text-muted-foreground border border-border/50 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-default"
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
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-foreground">Details</h3>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project?.startDate && (
                        <div className="flex items-center gap-4 p-4 bg-background/60 rounded-xl border border-border/50 hover:border-border transition-colors">
                          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</span>
                            <p className="text-sm font-bold text-foreground mt-0.5">{new Date(project.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                      )}
                      {project?.endDate && (
                        <div className="flex items-center gap-4 p-4 bg-background/60 rounded-xl border border-border/50 hover:border-border transition-colors">
                          <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</span>
                            <p className="text-sm font-bold text-foreground mt-0.5">{new Date(project.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                        </div>
                      )}
                      {project?.department && (
                        <div className="flex items-center gap-4 p-4 bg-background/60 rounded-xl border border-border/50 hover:border-border transition-colors">
                          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</span>
                            <p className="text-sm font-bold text-foreground mt-0.5">{project.department}</p>
                          </div>
                        </div>
                      )}
                      {project?.priority && (
                        <div className="flex items-center gap-4 p-4 bg-background/60 rounded-xl border border-border/50 hover:border-border transition-colors">
                          <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</span>
                            <div className="mt-1">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-semibold px-2.5 py-0.5 rounded-md border shadow-sm",
                                  project.priority === 'High' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:bg-red-900/30' :
                                    project.priority === 'Medium' ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/50 dark:text-amber-300 dark:bg-amber-900/30' :
                                      'border-green-200 text-green-700 bg-green-50 dark:border-green-900/50 dark:text-green-300 dark:bg-green-900/30'
                                )}
                              >
                                {project.priority}
                              </Badge>
                            </div>
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
      <div className="space-y-8">
        {/* Project Progress Stats */}
        <Card className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 rounded-2xl border-0 group">
            <CardContent className="p-5">
              <div className="flex flex-col justify-between h-full gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-blue-100" />
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">
                    {project?.tasks ? project.tasks.filter(task => task.status === 'in_progress').length : 0}
                  </p>
                  <p className="text-blue-100 text-sm font-medium">Active Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 rounded-2xl border-0 group">
            <CardContent className="p-5">
              <div className="flex flex-col justify-between h-full gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-emerald-100" />
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">
                    {project?.team ? project.team.length : 0}
                  </p>
                  <p className="text-emerald-100 text-sm font-medium">Team Size</p>
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