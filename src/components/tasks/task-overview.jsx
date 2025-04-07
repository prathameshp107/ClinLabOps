"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FileText, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";

export function TaskOverview({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  
  const handleSave = () => {
    // In a real app, you would save the updated description to the backend
    // For now, we'll just update the local state
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setDescription(task.description);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Task Description
          </CardTitle>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              placeholder="Enter task description..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{description}</p>
            
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Created by</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.createdBy.avatar} alt={task.createdBy.name} />
                    <AvatarFallback>{task.createdBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.createdBy.name}</span>
                </div>
              </div>
              
              <div className="flex flex-col ml-auto">
                <span className="text-xs text-muted-foreground">Priority</span>
                <HoverBorderGradient className="rounded-md mt-1">
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'warning' : 'default'
                  }>
                    {task.priority}
                  </Badge>
                </HoverBorderGradient>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}