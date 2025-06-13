"use client"

import { 
  Calendar, Clock, AlertTriangle, CheckCircle, PauseCircle, 
  ClipboardEdit, Trash2, Eye, MoreHorizontal, Star
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

export function ProjectTable({ projects, onAction, sortConfig, requestSort }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "In Progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "On Hold":
        return <PauseCircle className="h-4 w-4 text-orange-500" />;
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-md border shadow-sm"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <span className="sr-only">Favorite</span>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('name')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-1">
                Project Name
                {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('status')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-1">
                Status
                {sortConfig.key === 'status' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('priority')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-1">
                Priority
                {sortConfig.key === 'priority' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('progress')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center gap-1">
                Progress
                {sortConfig.key === 'progress' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('startDate')}
              className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
            >
              <div className="flex items-center gap-1">
                Start Date
                {sortConfig.key === 'startDate' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => requestSort('endDate')}
              className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
            >
              <div className="flex items-center gap-1">
                End Date
                {sortConfig.key === 'endDate' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell">Team</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id} className="group">
              <TableCell className="w-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${project.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                  onClick={() => onAction("toggleFavorite", project)}
                >
                  <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-500' : ''}`} />
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="group-hover:text-primary duration-200">
                    {project.name}
                  </span>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="w-[120px] space-y-1">
                  <Progress value={project.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {project.progress}% Complete
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatDate(project.startDate)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{formatDate(project.endDate)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <TooltipProvider key={member.id} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium border-2 border-background"
                            style={{ zIndex: 10 - index }}
                          >
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {project.team.length > 3 && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background"
                            style={{ zIndex: 7 }}
                          >
                            +{project.team.length - 3}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {project.team.slice(3).map(member => (
                              <div key={member.id}>
                                <p>{member.name}</p>
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
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
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
                      <Button variant="ghost" size="icon">
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
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
