"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Folder, 
  Users, 
  BarChart2, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}

function ProjectCard({ project }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
      <div className={`h-2 ${project.color || 'bg-primary'}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg">{project.name}</h3>
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{project.dueDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span>{project.completedTasks}/{project.totalTasks} tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.teamSize} members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span>{project.priority} priority</span>
            </div>
          </div>
        </div>
        
        {project.isOwner && (
          <Badge variant="outline" className="mt-4 bg-primary/10">Owner</Badge>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team && project.team.slice(0, 3).map((member, i) => (
              <Avatar key={i} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.team && project.team.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{project.team.length - 3}
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}