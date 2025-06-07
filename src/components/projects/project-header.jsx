"use client"

import { Beaker, Calendar, ChevronDown, Download, Edit, FileText, ListTodo, MoreHorizontal, Plus, Share, Trash, UserPlus, Clock, Users, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const AvatarGroup = ({ children }) => {
  return (
    <div className="flex -space-x-2">
      {children}
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center gap-2 text-sm px-4 border-r border-gray-200 last:border-r-0 ${className}`}>
    <Icon className="h-4 w-4 text-gray-500" />
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export function ProjectHeader({ project, onAddTask, onAddMember }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded">
              <Beaker className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h1>
                <Badge
                  variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs font-medium"
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-500">ID: {project.id}</span>
                <span className="text-sm text-gray-500">Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-sm font-medium"
              onClick={onAddTask}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onAddTask} className="text-sm">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddMember} className="text-sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Document
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-0 pt-4 mt-2 border-t border-gray-100">
          <StatItem
            icon={Target}
            label="Progress"
            value={
              <div className="flex items-center gap-2">
                <Progress
                  value={project.progress || 35}
                  className="h-1.5 w-20"
                />
                <span>{project.progress || 35}%</span>
              </div>
            }
          />

          <StatItem
            icon={Clock}
            label="Deadline"
            value={project.deadline || "Dec 31, 2023"}
          />

          <StatItem
            icon={Users}
            label="Team"
            value={
              <div className="flex items-center gap-2">
                <AvatarGroup>
                  {(project.team || []).slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="h-6 w-6 border border-white">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs bg-blue-50 text-blue-600">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                {(project.team || []).length > 3 && (
                  <span className="text-gray-500">
                    +{(project.team || []).length - 3}
                  </span>
                )}
              </div>
            }
          />

          <StatItem
            icon={Calendar}
            label="Priority"
            value={
              <Badge
                variant={
                  project.priority === 'high' ? 'destructive' :
                    project.priority === 'medium' ? 'warning' : 'default'
                }
                className="text-xs"
              >
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              </Badge>
            }
          />
        </div>
      </div>
    </div>
  )
}