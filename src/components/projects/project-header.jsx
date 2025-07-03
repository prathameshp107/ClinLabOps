"use client"

import { Beaker, Calendar, ChevronDown, Download, Edit, FileText, ListTodo, MoreHorizontal, Plus, Share, Trash, UserPlus, Clock, Users, Target, Star, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const AvatarGroup = ({ children }) => {
  return (
    <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
      {children}
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, className = "", trend = null }) => (
  <div className={`group flex items-center gap-3 text-sm p-3 rounded-xl bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-blue-50/50 hover:to-blue-100/30 transition-all duration-300 hover:shadow-sm ${className}`}>
    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300">
      <Icon className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{value}</span>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export function ProjectHeader({ project, onAddTask, onAddMember }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <Beaker className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {project.name ? project.name : project.title}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-yellow-100 hover:text-yellow-600 transition-all duration-200 rounded-xl"
                >
                  <Star className="h-5 w-5" />
                </Button>
                <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(project.status || 'active')}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    {(project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg shadow-sm">
                  <span className="text-gray-500 font-medium">ID:</span>
                  <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">{project.id}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg shadow-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 w-11 p-0 hover:bg-gray-50 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 backdrop-blur-md border-gray-200/50 shadow-xl rounded-2xl">
                <DropdownMenuItem onClick={onAddTask} className="text-sm py-3 px-3 rounded-xl hover:bg-blue-50 transition-colors">
                  <ListTodo className="h-4 w-4 mr-3 text-blue-600" />
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddMember} className="text-sm py-3 px-3 rounded-xl hover:bg-green-50 transition-colors">
                  <UserPlus className="h-4 w-4 mr-3 text-green-600" />
                  Add Member
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-purple-50 transition-colors">
                  <FileText className="h-4 w-4 mr-3 text-purple-600" />
                  Add Document
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-indigo-50 transition-colors">
                  <Share className="h-4 w-4 mr-3 text-indigo-600" />
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-3 text-gray-600" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                  <Trash className="h-4 w-4 mr-3" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200/50">
          <StatItem
            icon={Target}
            label="Progress"
            value={
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <Progress
                    value={project.progress || 65}
                    className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
                  />
                </div>
                <span className="font-bold text-lg text-blue-600">{project.progress || 65}%</span>
              </div>
            }
            trend="+12%"
          />

          <StatItem
            icon={Clock}
            label="Deadline"
            value={
              <div className="flex flex-col">
                <span className="font-semibold">{project.deadline || "Dec 31, 2024"}</span>
                <span className="text-xs text-orange-600">5 days left</span>
              </div>
            }
          />

          <StatItem
            icon={Users}
            label="Team"
            value={
              <div className="flex items-center gap-3">
                <AvatarGroup>
                  {(project.team || [
                    { name: "Alice", avatar: "" },
                    { name: "Bob", avatar: "" },
                    { name: "Charlie", avatar: "" },
                    { name: "Diana", avatar: "" }
                  ]).slice(0, 4).map((member, i) => (
                    <Avatar key={i} className="h-8 w-8 border-3 border-white shadow-md hover:scale-110 transition-transform duration-200">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                {(project.team || []).length > 4 && (
                  <div className="bg-gray-100 rounded-full px-2 py-1">
                    <span className="text-xs font-medium text-gray-600">
                      +{(project.team || []).length - 4}
                    </span>
                  </div>
                )}
              </div>
            }
          />

          <StatItem
            icon={Zap}
            label="Priority"
            value={
              <div className={`px-3 py-1.5 rounded-full text-sm font-semibold border shadow-sm ${getPriorityColor(project.priority || 'high')}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  {(project.priority || 'high').charAt(0).toUpperCase() + (project.priority || 'high').slice(1)}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}