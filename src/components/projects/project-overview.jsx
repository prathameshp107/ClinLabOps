"use client"

import { BarChart3, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RecentActivity } from "./recent-activity"
import { UpcomingMilestones } from "./upcoming-milestones"

export function ProjectOverview({ project }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Project Description */}
      <Card className="md:col-span-2 bg-background/60 backdrop-blur-md border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Project Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {project.description || "This project aims to develop a new laboratory management system that streamlines sample tracking, experiment scheduling, and result reporting."}
          </p>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Project Tags</h4>
            <div className="flex flex-wrap gap-2">
              {(project.tags || ["Research", "Development", "Laboratory", "Software"]).map((tag, i) => (
                <Badge key={i} variant="outline" className="bg-primary/5">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Project Stats */}
      <Card className="bg-background/60 backdrop-blur-md border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Project Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="font-medium">12/20</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Budget Used</span>
                <span className="font-medium">$8,500/$15,000</span>
              </div>
              <Progress value={56} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Time Elapsed</span>
                <span className="font-medium">45/90 days</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <RecentActivity activities={project.activities} team={project.team} />
      
      {/* Upcoming Milestones */}
      <UpcomingMilestones milestones={project.milestones} />
    </div>
  )
}