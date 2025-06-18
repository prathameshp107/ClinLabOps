"use client"

import { motion } from "framer-motion"
import { 
  Calendar, Clock, AlertTriangle, CheckCircle, PauseCircle, 
  ClipboardEdit, Trash2, X, FileText, Users, Tag, BarChart,
  Share2, History, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, differenceInDays } from "date-fns"

export function ProjectDetailsDialog({ project, open, onOpenChange, onAction }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "In Progress":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "On Hold":
        return <PauseCircle className="h-5 w-5 text-orange-500" />;
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
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
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

  const calculateDuration = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const days = differenceInDays(end, start);
    
    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (days < 365) {
      const months = Math.round(days / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = (days / 365).toFixed(1);
      return `${years} year${years !== "1.0" ? 's' : ''}`;
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {project.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${project.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
                  onClick={() => onAction("toggleFavorite", project)}
                >
                  <Star className={`h-4 w-4 ${project.isFavorite ? 'fill-yellow-500' : ''}`} />
                </Button>
              </DialogTitle>
              <DialogDescription>
                Project details and information
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                <span className="flex items-center gap-1.5">
                  {getStatusIcon(project.status)}
                  {project.status}
                </span>
              </Badge>
              <Badge variant="outline" className={`${getPriorityColor(project.priority)}`}>
                {project.priority} Priority
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full mt-2">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="mt-4 pr-4" style={{ height: 'calc(70vh - 120px)' }}>
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 border rounded-md p-4">
                    <h4 className="text-sm font-medium">Timeline</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(project.startDate)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(project.endDate)}</span>
                        </div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{calculateDuration()}</span>
                        </div>
                      </div>
                      <div className="col-span-2 mt-2">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getStatusIcon(project.status)}
                          <span>{getTimeRemaining()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border rounded-md p-4">
                    <h4 className="text-sm font-medium">Progress</h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{project.progress}% Complete</span>
                          <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="flex flex-col items-center justify-center border rounded-md p-2">
                          <p className="text-xs text-muted-foreground">Priority</p>
                          <Badge variant="outline" className={`mt-1 ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center justify-center border rounded-md p-2">
                          <p className="text-xs text-muted-foreground">Team</p>
                          <p className="text-sm font-medium mt-1">{project.team.length} members</p>
                        </div>
                        <div className="flex flex-col items-center justify-center border rounded-md p-2">
                          <p className="text-xs text-muted-foreground">Tags</p>
                          <p className="text-sm font-medium mt-1">{project.tags.length} tags</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Project Team</h3>
                <p className="text-sm text-muted-foreground">
                  {project.team.length} team member{project.team.length !== 1 ? 's' : ''} assigned to this project
                </p>
                
                <div className="space-y-3">
                  {project.team.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {project.team.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                      <Users className="h-10 w-10 mb-2" />
                      <p>No team members assigned</p>
                      <p className="text-xs mt-1">This project doesn't have any team members assigned to it</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">General Information</h4>
                    <div className="space-y-2">
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Project ID</span>
                        <span>{project.id}</span>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Project Name</span>
                        <span>{project.name}</span>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getStatusIcon(project.status)}
                          <span>{project.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Priority</span>
                        <Badge variant="outline" className={`w-fit mt-1 ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Start Date</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">End Date</span>
                        <span>{formatDate(project.endDate)}</span>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Duration</span>
                        <span>{calculateDuration()}</span>
                      </div>
                      <div className="flex flex-col border-b pb-2">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <div className="w-full space-y-1 mt-1">
                          <Progress value={project.progress} className="h-2" />
                          <div className="text-xs">
                            {project.progress}% Complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <div className="border rounded-md p-4 text-sm">
                    {project.description}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Team Members</h4>
                  <div className="border rounded-md p-4">
                    <ul className="space-y-2">
                      {project.team.map(member => (
                        <li key={member.id} className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{member.name} ({member.role})</span>
                        </li>
                      ))}
                      {project.team.length === 0 && (
                        <li className="text-muted-foreground">No team members assigned</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length === 0 && (
                        <span className="text-muted-foreground">No tags</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex gap-2 items-center justify-between sm:justify-between flex-row">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAction("viewActivity", project)}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Activity Log</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAction("share", project)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => onAction("edit", project)}
            >
              <ClipboardEdit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={() => onAction("delete", project)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
