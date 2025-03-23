"use client"

import { 
  Calendar, Clock, AlertTriangle, CheckCircle, PauseCircle, 
  MoreHorizontal, ClipboardEdit, Trash2, Eye, AlarmClock, Star
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
import { motion } from "framer-motion"
import { format, differenceInDays } from "date-fns"

export function ProjectCardView({ projects, onAction }) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => onAction("view", project)}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 p-0 ${project.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction("toggleFavorite", project);
                      }}
                    >
                      <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-500' : ''}`} />
                    </Button>
                    <h3 className="font-medium leading-tight group-hover:text-primary transition-colors duration-200">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        {project.status}
                      </span>
                    </Badge>
                    <Badge variant="outline" className={`${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onAction("view", project);
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
            <CardContent className="pb-3 flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {project.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlarmClock className="h-3.5 w-3.5" />
                  <span>{getTimeRemaining(project.startDate, project.endDate)}</span>
                </div>
              </div>
              
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex -space-x-2">
                {project.team.slice(0, 4).map((member, index) => (
                  <TooltipProvider key={member.id} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background"
                          style={{ zIndex: 10 - index }}
                          onClick={(e) => e.stopPropagation()}
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
                {project.team.length > 4 && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background"
                          style={{ zIndex: 6 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          +{project.team.length - 4}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          {project.team.slice(4).map(member => (
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
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
