"use client"

import { Beaker, Calendar, ChevronDown, Download, Edit, FileText, ListTodo, MoreHorizontal, Plus, Share, Trash, UserPlus, Clock, Users, Target, Star, Zap, TrendingUp, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const AvatarGroup = ({ children }) => {
  return (
    <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
      {children}
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, className = "", trend = null, color = "blue" }) => {
  const colorStyles = {
    blue: "from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-200/50 dark:border-blue-500/20",
    green: "from-green-500/10 to-green-600/5 text-green-600 border-green-200/50 dark:border-green-500/20",
    orange: "from-orange-500/10 to-orange-600/5 text-orange-600 border-orange-200/50 dark:border-orange-500/20",
    purple: "from-purple-500/10 to-purple-600/5 text-purple-600 border-purple-200/50 dark:border-purple-500/20",
  };

  const iconStyles = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div className={cn(
      "group flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      colorStyles[color] || colorStyles.blue,
      className
    )}>
      <div className={cn("p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300", iconStyles[color] || iconStyles.blue)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</span>
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg text-foreground truncate">{value}</div>
          {trend && (
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-[10px] text-green-700 font-bold">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function ProjectHeader({ project, onAddTask, onAddMember, onExport }) {
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
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/20';
    }
  };

  return (
    <div className="bg-transparent">
      <div className="px-8 py-8">
        {/* Main Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-10">
          <div className="flex items-start gap-6 w-full">
            <div className="relative group">
              <div className="bg-gradient-to-br from-primary to-primary/60 p-5 rounded-3xl shadow-xl shadow-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-500 group-hover:scale-105">
                <Beaker className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                    {project.name ? project.name : project.title}
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 rounded-full transition-all"
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl line-clamp-2 leading-relaxed">
                  {project.description || "No description provided for this project."}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                  <span className="text-muted-foreground font-medium">ID:</span>
                  <span className="font-mono text-foreground font-semibold tracking-wider">{project.id.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created <span className="text-foreground font-medium">{new Date(project.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={onAddTask}
              className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 rounded-xl shadow-sm transition-all"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-sm py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors flex items-center cursor-pointer">
                    <Download className="h-4 w-4 mr-3 text-muted-foreground" />
                    Export Data
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-[180px] bg-background/95 backdrop-blur-xl border-border/50 shadow-xl rounded-2xl p-1">
                    <DropdownMenuItem onClick={() => onExport && onExport('csv')} className="text-sm px-4 py-2.5 hover:bg-muted/50 rounded-lg cursor-pointer">Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport && onExport('xlsx')} className="text-sm px-4 py-2.5 hover:bg-muted/50 rounded-lg cursor-pointer">Export as Excel</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport && onExport('pdf')} className="text-sm px-4 py-2.5 hover:bg-muted/50 rounded-lg cursor-pointer">Export as PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport && onExport('json')} className="text-sm px-4 py-2.5 hover:bg-muted/50 rounded-lg cursor-pointer">Export as JSON</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem onClick={onAddMember} className="text-sm py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <UserPlus className="h-4 w-4 mr-3 text-muted-foreground" />
                  Add Member
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <Share className="h-4 w-4 mr-3 text-muted-foreground" />
                  Share Project
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-red-500/10 text-red-600 transition-colors cursor-pointer">
                  <Trash className="h-4 w-4 mr-3" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border/50">
          <StatItem
            icon={Target}
            label="Overall Progress"
            color="blue"
            value={
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-end gap-2">
                  <span className="font-bold text-2xl text-foreground">{project.progress || 0}%</span>
                  <span className="text-xs text-muted-foreground mb-1">completed</span>
                </div>
                <Progress
                  value={project.progress || 0}
                  className="h-1.5 w-full bg-blue-100 dark:bg-blue-900/20"
                  indicatorclassname="bg-blue-600"
                />
              </div>
            }
            trend="+12%"
          />

          <StatItem
            icon={Clock}
            label="Time Remaining"
            color="orange"
            value={
              <div className="flex flex-col">
                <span className="font-bold text-xl text-foreground">{project.deadline || "Dec 31, 2024"}</span>
                <span className="text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full w-fit mt-1">
                  5 days left
                </span>
              </div>
            }
          />

          <StatItem
            icon={Users}
            label="Team Members"
            color="purple"
            value={
              <div className="flex items-center gap-3 pt-1">
                <AvatarGroup>
                  {(project.team || [
                    { name: "Alice", avatar: "" },
                    { name: "Bob", avatar: "" },
                    { name: "Charlie", avatar: "" },
                    { name: "Diana", avatar: "" }
                  ]).slice(0, 4).map((member, i) => (
                    <Avatar key={i} className="h-9 w-9 border-2 border-background shadow-sm hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
                {(project.team || []).length > 4 && (
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                    <span className="text-xs font-bold text-muted-foreground">
                      +{(project.team || []).length - 4}
                    </span>
                  </div>
                )}
              </div>
            }
          />

          <StatItem
            icon={Zap}
            label="Project Priority"
            color="green"
            value={
              <div className="pt-1">
                <Badge variant="outline" className={cn("px-3 py-1 text-sm font-semibold border shadow-sm", getPriorityColor(project.priority || 'high'))}>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5" />
                    {(project.priority || 'high').charAt(0).toUpperCase() + (project.priority || 'high').slice(1)}
                  </div>
                </Badge>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}