"use client"

import {
  Calendar, Clock, AlertTriangle, CheckCircle, PauseCircle,
  ClipboardEdit, Trash2, Eye, MoreHorizontal, Star, Activity, CheckCircle2, Zap
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ProjectTable({ projects, onAction, sortConfig, requestSort }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "In Progress":
        return <Activity className="h-3.5 w-3.5" />;
      case "Completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "On Hold":
        return <PauseCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20";
      case "Completed":
        return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20";
      case "On Hold":
        return "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/20";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20";
      case "Low":
        return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-500/20";
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm"
    >
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-muted/30 border-border/50">
            <TableHead className="w-12 text-center">
              <span className="sr-only">Favorite</span>
            </TableHead>
            <TableHead
              onClick={() => requestSort('name')}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                Project Name
                {sortConfig.key === 'name' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => requestSort('status')}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                Status
                {sortConfig.key === 'status' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => requestSort('priority')}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                Priority
                {sortConfig.key === 'priority' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => requestSort('progress')}
              className="cursor-pointer hover:text-primary transition-colors"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                Progress
                {sortConfig.key === 'progress' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => requestSort('startDate')}
              className="cursor-pointer hover:text-primary transition-colors hidden md:table-cell"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                Start Date
                {sortConfig.key === 'startDate' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead
              onClick={() => requestSort('endDate')}
              className="cursor-pointer hover:text-primary transition-colors hidden md:table-cell"
            >
              <div className="flex items-center gap-1.5 font-semibold">
                End Date
                {sortConfig.key === 'endDate' && (
                  <span className="text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold">Team</TableHead>
            <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan="10" className="h-64 text-center">
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <Activity className="h-8 w-8 opacity-50" />
                  </div>
                  <div className="text-lg font-semibold text-foreground">No projects found</div>
                  <div className="text-sm mt-1 max-w-xs mx-auto">Get started by creating your first project to organize your research work.</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            projects.map(project => (
              <TableRow key={project.id} className="group hover:bg-muted/30 border-border/50 transition-colors">
                <TableCell className="w-12 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full transition-all",
                      project.isFavorite ? 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => onAction("toggleFavorite", project)}
                  >
                    <Star className={cn("h-4 w-4 transition-all", project.isFavorite ? 'fill-yellow-500' : '')} />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <span className="text-base group-hover:text-primary transition-colors cursor-pointer" onClick={() => onAction("view", project)}>
                      {project.name}
                    </span>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-5 bg-muted/50 text-muted-foreground">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <span className="text-[10px] text-muted-foreground flex items-center">+{project.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-medium border", getStatusColor(project.status))}>
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-medium border", getPriorityColor(project.priority))}>
                    <Zap className="h-3 w-3 mr-1" />
                    {project.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-[140px] space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500 ease-out",
                          project.progress >= 75 ? "bg-gradient-to-r from-green-400 to-green-500" :
                            project.progress >= 50 ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                              project.progress >= 25 ? "bg-gradient-to-r from-amber-400 to-amber-500" :
                                "bg-gradient-to-r from-red-400 to-red-500"
                        )}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
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
                                className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} text-white flex items-center justify-center text-xs font-bold border-2 border-background ring-1 ring-black/5 dark:ring-white/10`}
                                style={{ zIndex: 10 - index }}
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
                              className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold border-2 border-background ring-1 ring-black/5 dark:ring-white/10"
                              style={{ zIndex: 7 }}
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
                </TableCell>
                <TableCell className="text-right pr-4">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => onAction("view", project)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => onAction("edit", project)}
                          >
                            <ClipboardEdit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAction("delete", project)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAction("view", project)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction("edit", project)}>
                          <ClipboardEdit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("delete", project)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  )
}
