"use client"

import { Beaker, Calendar, ChevronDown, Download, Edit, FileText, ListTodo, MoreHorizontal, Plus, Share, Trash, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// You'll need to create this component
const AvatarGroup = ({ children }) => {
  return (
    <div className="flex -space-x-2">
      {children}
    </div>
  );
};

export function ProjectHeader({ project, onAddTask, onAddMember }) {
  return (
    <div className="bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-md rounded-xl p-6 border border-border/50 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Beaker className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {project.name}
                <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Project ID: {project.id} • Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-1" />
                Add
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onAddTask}>
                <ListTodo className="h-4 w-4 mr-2" />
                Add Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Add Document
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Add Milestone
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default" size="sm" className="h-9">
            <Edit className="h-4 w-4 mr-1" />
            Edit Project
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share Project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground">Progress</p>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={project.progress || 35} className="h-2" />
            <span className="text-sm font-medium">{project.progress || 35}%</span>
          </div>
        </div>
        
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground">Deadline</p>
          <div className="mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{project.deadline || "Dec 31, 2023"}</span>
          </div>
        </div>
        
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground">Team</p>
          <div className="mt-1 flex items-center gap-1">
            <AvatarGroup>
              {(project.team || []).slice(0, 3).map((member, i) => (
                <Avatar key={i} className="border-2 border-background h-6 w-6">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            {(project.team || []).length > 3 && (
              <Avatar className="border-2 border-background h-6 w-6 bg-muted">
                <AvatarFallback className="text-xs">+{(project.team || []).length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground">Priority</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={
              project.priority === 'high' ? 'destructive' : 
              project.priority === 'medium' ? 'warning' : 'default'
            } className="text-xs">
              {project.priority || "Medium"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}