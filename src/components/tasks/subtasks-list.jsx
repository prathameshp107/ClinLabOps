"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  CheckSquare, 
  Plus, 
  Trash, 
  GripVertical, 
  Edit, 
  Calendar, 
  Clock, 
  User, 
  Flag, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";

export function SubtasksList({ task, setTask }) {
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = useState({});
  const [editingSubtask, setEditingSubtask] = useState(null);
  
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
  
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim() === "") return;
    
    const newSubtask = {
      id: `ST-${Date.now().toString().slice(-3)}`,
      title: newSubtaskTitle,
      completed: false,
      status: "not_started",
      progress: 0,
      priority: "medium",
      assignee: task.teamMembers[0],
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(), // Next day
      notes: ""
    };
    
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    setNewSubtaskTitle("");
    setIsAdding(false);
    
    // In a real app, you would update the task on the backend
  };
  
  const handleToggleSubtask = (id) => {
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === id ? { 
        ...subtask, 
        completed: !subtask.completed,
        status: !subtask.completed ? "completed" : "in_progress",
        progress: !subtask.completed ? 100 : 50
      } : subtask
    );
    setSubtasks(updatedSubtasks);
    
    // In a real app, you would update the task on the backend
  };
  
  const handleDeleteSubtask = (id) => {
    const updatedSubtasks = subtasks.filter(subtask => subtask.id !== id);
    setSubtasks(updatedSubtasks);
    
    // In a real app, you would update the task on the backend
  };
  
  const handleReorderEnd = () => {
    setIsReordering(false);
    
    // In a real app, you would update the task order on the backend
  };
  
  const toggleExpandSubtask = (id) => {
    setExpandedSubtasks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleEditSubtask = (subtask) => {
    setEditingSubtask({...subtask});
  };
  
  const handleSaveSubtask = () => {
    if (!editingSubtask) return;
    
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === editingSubtask.id ? editingSubtask : subtask
    );
    
    setSubtasks(updatedSubtasks);
    setEditingSubtask(null);
    
    // In a real app, you would update the task on the backend
  };
  
  const handleCancelEdit = () => {
    setEditingSubtask(null);
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'not_started': return 'outline';
      default: return 'outline';
    }
  };
  
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };
  
  const renderSubtaskCard = (subtask) => {
    const isExpanded = expandedSubtasks[subtask.id];
    const isEditing = editingSubtask && editingSubtask.id === subtask.id;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <HoverBorderGradient className="w-full">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5">
                        {subtask.id}
                      </Badge>
                      {isEditing ? (
                        <Input
                          value={editingSubtask.title}
                          onChange={(e) => setEditingSubtask({...editingSubtask, title: e.target.value})}
                          className="h-7 text-base font-medium"
                        />
                      ) : (
                        <CardTitle className={cn(
                          "text-base",
                          subtask.completed && "line-through text-muted-foreground"
                        )}>
                          {subtask.title}
                        </CardTitle>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {isEditing ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              {editingSubtask.status.replace('_', ' ')}
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, status: 'not_started', completed: false, progress: 0})}>
                              Not Started
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, status: 'in_progress', completed: false, progress: 50})}>
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, status: 'completed', completed: true, progress: 100})}>
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Badge variant={getStatusBadgeVariant(subtask.status)}>
                          {subtask.status.replace('_', ' ')}
                        </Badge>
                      )}
                      
                      {isEditing ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              {editingSubtask.priority}
                              <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, priority: 'low'})}>
                              Low
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, priority: 'medium'})}>
                              Medium
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingSubtask({...editingSubtask, priority: 'high'})}>
                              High
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Badge variant={getPriorityBadgeVariant(subtask.priority)}>
                          {subtask.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {!isEditing && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEditSubtask(subtask)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleExpandSubtask(subtask.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </>
                  )}
                  
                  {isEditing && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="h-7"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveSubtask}
                        className="h-7"
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{subtask.progress}%</span>
                  </div>
                  <Progress value={subtask.progress} className="h-1.5" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {isEditing ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Avatar className="h-4 w-4 mr-1">
                              <AvatarImage src={editingSubtask.assignee.avatar} />
                              <AvatarFallback>{editingSubtask.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {editingSubtask.assignee.name}
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {task.teamMembers.map(member => (
                            <DropdownMenuItem 
                              key={member.id}
                              onClick={() => setEditingSubtask({...editingSubtask, assignee: member})}
                            >
                              <Avatar className="h-4 w-4 mr-1">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {member.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={subtask.assignee.avatar} />
                          <AvatarFallback>{subtask.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{subtask.assignee.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex items-center gap-1 text-xs">
                        <Input
                          type="date"
                          value={format(new Date(editingSubtask.startDate), 'yyyy-MM-dd')}
                          onChange={(e) => setEditingSubtask({...editingSubtask, startDate: new Date(e.target.value).toISOString()})}
                          className="h-7 w-24"
                        />
                        <span>to</span>
                        <Input
                          type="date"
                          value={format(new Date(editingSubtask.endDate), 'yyyy-MM-dd')}
                          onChange={(e) => setEditingSubtask({...editingSubtask, endDate: new Date(e.target.value).toISOString()})}
                          className="h-7 w-24"
                        />
                      </div>
                    ) : (
                      <span className="text-xs">
                        {format(new Date(subtask.startDate), 'MMM d')} - {format(new Date(subtask.endDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                
                {(isExpanded || isEditing) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1"
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                      {isEditing ? (
                        <Textarea
                          value={editingSubtask.notes}
                          onChange={(e) => setEditingSubtask({...editingSubtask, notes: e.target.value})}
                          placeholder="Add notes..."
                          className="min-h-[60px] text-xs"
                        />
                      ) : (
                        <p className="text-xs">
                          {subtask.notes || "No notes added yet."}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </HoverBorderGradient>
      </motion.div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            Subtasks
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant={isReordering ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsReordering(!isReordering)}
            >
              {isReordering ? "Done" : "Reorder"}
            </Button>
            {!isAdding && (
              <Button size="sm" onClick={() => setIsAdding(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Subtask
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span>{completedSubtasks}/{subtasks.length} completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mb-3"
            >
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Enter subtask title..."
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleAddSubtask}>Add</Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsAdding(false);
                  setNewSubtaskTitle("");
                }}
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isReordering ? (
          <Reorder.Group 
            axis="y" 
            values={subtasks} 
            onReorder={setSubtasks}
            className="space-y-3"
          >
            {subtasks.map((subtask) => (
              <Reorder.Item
                key={subtask.id}
                value={subtask}
                className="cursor-move"
              >
                <div className="flex items-center gap-2 p-2 rounded-md bg-background border border-border/50">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="bg-primary/5">
                    {subtask.id}
                  </Badge>
                  <span className={cn(
                    "flex-1 text-sm",
                    subtask.completed && "line-through text-muted-foreground"
                  )}>
                    {subtask.title}
                  </span>
                  <Badge variant={getStatusBadgeVariant(subtask.status)}>
                    {subtask.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="space-y-3">
            {subtasks.map((subtask) => renderSubtaskCard(subtask))}
            
            {subtasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>No subtasks yet. Add one to get started.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}