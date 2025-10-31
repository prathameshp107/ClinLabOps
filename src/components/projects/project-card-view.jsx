"use client"

import {
  Calendar, Clock, AlertTriangle, CheckCircle, PauseCircle,
  MoreHorizontal, ClipboardEdit, Trash2, Eye, AlarmClock, Star,
  Users, Tag, ChevronRight, MessageSquare, BarChart2,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Folder,
  TrendingUp, Activity, Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { format, differenceInDays, isAfter, isBefore } from "date-fns"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ProjectCardView({ projects, onAction }) {
  const router = useRouter();
  const [hoveredProject, setHoveredProject] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "In Progress":
        return <AlertTriangle className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      case "On Hold":
        return <PauseCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "On Hold":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTimeRemaining = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      const daysToStart = differenceInDays(start, now);
      return `Starts in ${daysToStart} day${daysToStart !== 1 ? 's' : ''}`;
    } else if (now > end) {
      return "Completed";
    } else {
      const daysRemaining = differenceInDays(end, now);
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center p-16 border border-dashed border-border/50 rounded-2xl bg-muted/10">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Get started by creating your first project to organize your research work.
          </p>
          <Button
            className="gap-2"
            onClick={() => {
              // In a real app, this would open the add project dialog
              document.dispatchEvent(new CustomEvent('openAddProjectDialog'));
            }}
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="h-full"
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <Card className="h-full flex flex-col shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-border/40 hover:border-primary/40 relative overflow-hidden bg-card hover:bg-card/80"
              onClick={() => router.push(`/projects/${project.projectKey || project.id}`)}
            >
              {/* Enhanced gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Enhanced status indicator bar with glow effect */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2",
                project.status === "Completed" ? "bg-gradient-to-r from-green-400 to-green-500" :
                  project.status === "In Progress" ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                    project.status === "On Hold" ? "bg-gradient-to-r from-orange-400 to-orange-500" :
                      project.status === "Pending" ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
                        "bg-gradient-to-r from-gray-400 to-gray-500"
              )} />

              <CardHeader className="pb-4 space-y-3 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md",
                          project.status === "Completed" ? "bg-green-500/20 text-green-600 dark:bg-green-500/30 dark:text-green-400" :
                            project.status === "In Progress" ? "bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400" :
                              project.status === "On Hold" ? "bg-orange-500/20 text-orange-600 dark:bg-orange-500/30 dark:text-orange-400" :
                                project.status === "Pending" ? "bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400" :
                                  "bg-muted/50 text-muted-foreground"
                        )}>
                          <Folder className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {project.name || project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-6 w-6 p-0 transition-colors",
                              project.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-foreground'
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction("toggleFavorite", project);
                            }}
                          >
                            <Star className={cn("h-3.5 w-3.5 transition-all", project.isFavorite ? 'fill-yellow-500' : '')} />
                          </Button>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>{getTimeRemaining(project.startDate, project.endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={cn("px-2 py-1 text-xs font-medium", getStatusColor(project.status))}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </Badge>
                      <Badge variant="outline" className={cn("px-2 py-1 text-xs font-medium", getPriorityColor(project.priority))}>
                        <Zap className="h-3 w-3 mr-1" />
                        {project.priority}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${project.projectKey || project.id}`);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onAction("edit", project);
                      }}>
                        <ClipboardEdit className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction("delete", project);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pb-4 flex-1 space-y-4 relative z-10">
                {/* Description with proper text rendering */}
                <div className="space-y-2">
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: project.description?.replace(/\n/g, '<br />') || 'No description available'
                    }}
                  />
                </div>

                {/* Enhanced Progress section with colors */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center",
                        project.progress >= 75 ? "bg-gradient-to-br from-green-400 to-green-500" :
                          project.progress >= 50 ? "bg-gradient-to-br from-blue-400 to-blue-500" :
                            project.progress >= 25 ? "bg-gradient-to-br from-amber-400 to-amber-500" :
                              "bg-gradient-to-br from-red-400 to-red-500"
                      )}>
                        <TrendingUp className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-muted-foreground font-medium">Progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "font-bold text-sm",
                        project.progress >= 75 ? "text-green-600 dark:text-green-400" :
                          project.progress >= 50 ? "text-blue-600 dark:text-blue-400" :
                            project.progress >= 25 ? "text-amber-600 dark:text-amber-400" :
                              "text-red-600 dark:text-red-400"
                      )}>{project.progress}%</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500 ease-out relative",
                          project.progress >= 75 ? "bg-gradient-to-r from-green-400 to-green-500" :
                            project.progress >= 50 ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                              project.progress >= 25 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                                "bg-gradient-to-r from-red-400 to-red-500"
                        )}
                        style={{ width: `${project.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <div className="absolute right-0 top-0 h-full w-1 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Timeline with colors */}
                <div className="flex justify-between text-xs bg-muted/20 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Start</div>
                      <span className="font-semibold text-green-600 dark:text-green-400">{formatDate(project.startDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">End</div>
                      <span className="font-semibold text-red-600 dark:text-red-400">{formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs font-normal bg-muted text-muted-foreground">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 pb-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  {/* Enhanced Team avatars with colorful gradients */}
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => {
                      const gradients = [
                        "from-blue-400 to-blue-600",
                        "from-purple-400 to-purple-600",
                        "from-green-400 to-green-600",
                        "from-pink-400 to-pink-600",
                        "from-indigo-400 to-indigo-600"
                      ];
                      return (
                        <TooltipProvider key={member.id} delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} text-white flex items-center justify-center text-xs font-semibold border-2 border-card hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer hover:scale-110 shadow-sm hover:shadow-md`}
                                style={{ zIndex: 10 - index }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                    {project.team.length > 3 && (
                      <TooltipProvider delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center text-xs font-semibold border-2 border-card hover:bg-muted/80 transition-all cursor-pointer hover:scale-110 shadow-sm hover:shadow-md"
                              style={{ zIndex: 6 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              +{project.team.length - 3}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              {project.team.slice(3).map(member => (
                                <div key={member.id}>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {/* Comments count */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="font-medium">{project.comments?.length || 0}</span>
                  </div>
                </div>

                {/* Action buttons on hover */}
                <div className="flex items-center gap-1">
                  <AnimatePresence>
                    {hoveredProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-1"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/projects/${project.id}/analytics`);
                          }}
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/projects/${project.id}`);
                          }}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}
