"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, FileText, Tag, TrendingUp, Calendar, Users, DollarSign, Clock, Target, Zap, CheckCircle2, AlertCircle, User, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RecentActivity } from "./recent-activity"
import { UpcomingMilestones } from "./upcoming-milestones"
import { TaskStatusOverview } from "./task-status-overview"
import { PriorityBreakdown } from "./priority-breakdown"
import { TeamWorkload } from "./team-workload"
import { mockActivities, mockMilestones, statProgressColors } from "@/data/projects-data"
import { getActivities } from "@/services/activityService"

const StatProgress = ({ label, value, total, progress, color = "blue", icon: Icon, trend, description }) => {
  const colorClasses = statProgressColors[color] || statProgressColors.blue;

  return (
    <div className={`group p-4 rounded-2xl bg-gradient-to-br ${colorClasses.bg} hover:shadow-lg transition-all duration-300 mb-4 last:mb-0 border border-white/50`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-white/80 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <Icon className={`h-4 w-4 ${colorClasses.icon}`} />
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
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
          className="h-2 bg-white/60 rounded-full"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>{progress}% Complete</span>
          <span>{100 - progress}% Remaining</span>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity, index }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors group">
    <Avatar className="h-8 w-8 shadow-sm group-hover:shadow-md transition-shadow">
      <AvatarImage src={activity.avatar} alt={activity.user} />
      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
        {activity.user?.charAt(0) || 'U'}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          {activity.action}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>{activity.timestamp}</span>
      </div>
    </div>
  </div>
);

const MilestoneItem = ({ milestone, index }) => {
  const isOverdue = new Date(milestone.dueDate) < new Date();
  const isUpcoming = new Date(milestone.dueDate) - new Date() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className={`p-4 rounded-xl border-l-4 ${isOverdue ? 'border-l-red-400 bg-red-50/50' : isUpcoming ? 'border-l-amber-400 bg-amber-50/50' : 'border-l-green-400 bg-green-50/50'} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
            {isOverdue ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : milestone.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Target className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{milestone.dueDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{milestone.assignee}</span>
            </div>
          </div>
        </div>
        <Badge
          variant={milestone.completed ? "default" : isOverdue ? "destructive" : "secondary"}
          className="ml-3"
        >
          {milestone.completed ? "Done" : isOverdue ? "Overdue" : "Pending"}
        </Badge>
      </div>
    </div>
  );
};

export function ProjectOverview({ project }) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    if (!project?.id) return;
    getActivities({ project: project.id }).then(setActivities).catch(() => setActivities([]));
  }, [project?.id]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* Left Column - Main Content */}
      <div className="xl:col-span-2 space-y-6">
        {/* Project Description */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              Project Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed text-base mb-6">
                {project?.description || "This project aims to develop a comprehensive laboratory management system that revolutionizes sample tracking, experiment scheduling, and result reporting. Our goal is to create an intuitive, scalable solution that enhances laboratory efficiency and data accuracy."}
              </p>

              <div className="bg-gradient-to-r from-gray-50/50 to-blue-50/30 rounded-2xl p-5 border border-gray-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Tag className="h-4 w-4 text-gray-600" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Project Tags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(project?.tags || ["Research", "Development", "Laboratory", "Software", "Innovation", "Healthcare"]).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-white/80 text-gray-700 border border-gray-200/50 px-3 py-1.5 text-sm font-medium rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-200 cursor-default shadow-sm"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-gray-100/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              Recent Activity
              <Badge variant="outline" className="ml-auto">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-1">
              <RecentActivity activities={activities} />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-gray-100/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockMilestones.map((milestone, index) => (
                <MilestoneItem key={index} milestone={milestone} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
        <PriorityBreakdown />
      </div>

      {/* Right Column - Stats & Widgets */}
      <div className="space-y-6">
        {/* Project Progress Stats */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-gray-100/50">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
              Project Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StatProgress
              label="Task Completion"
              value="18"
              total="25"
              progress={72}
              color="blue"
              icon={CheckCircle2}
              trend="+8% this week"
              description="Tasks completed vs total"
            />
            <StatProgress
              label="Budget Utilization"
              value="$12,400"
              total="$18,000"
              progress={69}
              color="green"
              icon={DollarSign}
              trend="+$2.1K this month"
              description="Budget spent vs allocated"
            />
            <StatProgress
              label="Timeline Progress"
              value="58"
              total="90 days"
              progress={64}
              color="purple"
              icon={Calendar}
              trend="On schedule"
              description="Days elapsed vs total"
            />
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Tasks</p>
                  <p className="text-2xl font-bold">7</p>
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
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Status Overview */}
        <TaskStatusOverview />

        {/* Team Workload */}
        <TeamWorkload />
      </div>
    </div>
  )
}