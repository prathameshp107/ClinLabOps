"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { format } from "date-fns"
import { Check, GripVertical, Plus, Trash, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const TaskSubtasks = ({ 
  subtasks = [], 
  onSubtasksChange,
  disabled = false 
}) => {
  const [items, setItems] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [progress, setProgress] = useState(0);
  
  // Initialize subtasks
  useEffect(() => {
    if (subtasks && subtasks.length > 0) {
      setItems(subtasks);
    } else {
      setItems([]);
    }
  }, [subtasks]);
  
  // Calculate progress
  useEffect(() => {
    if (items.length === 0) {
      setProgress(0);
      return;
    }
    
    const completedCount = items.filter(item => item.completed).length;
    const newProgress = Math.round((completedCount / items.length) * 100);
    setProgress(newProgress);
  }, [items]);
  
  // Add a new subtask
  const handleAddSubtask = () => {
    if (newSubtaskText.trim() === "") return;
    
    const newSubtask = {
      id: `subtask-${Date.now()}`,
      description: newSubtaskText,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: null
    };
    
    const updatedItems = [...items, newSubtask];
    setItems(updatedItems);
    onSubtasksChange(updatedItems);
    setNewSubtaskText("");
  };
  
  // Update subtask
  const updateSubtask = (id, changes) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...changes } : item
    );
    
    setItems(updatedItems);
    onSubtasksChange(updatedItems);
  };
  
  // Toggle subtask completion
  const toggleSubtaskCompletion = (id) => {
    const subtask = items.find(item => item.id === id);
    if (subtask) {
      updateSubtask(id, { completed: !subtask.completed });
    }
  };
  
  // Set subtask deadline
  const setSubtaskDeadline = (id, date) => {
    updateSubtask(id, { 
      deadline: date ? date.toISOString() : null 
    });
  };
  
  // Remove subtask
  const removeSubtask = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onSubtasksChange(updatedItems);
  };
  
  // Handle reordering
  const handleReorder = (newOrder) => {
    setItems(newOrder);
    onSubtasksChange(newOrder);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">Subtasks & Checklist</div>
        <Badge variant="outline">
          {items.filter(item => item.completed).length}/{items.length} Completed
        </Badge>
      </div>
      
      {/* Progress bar */}
      {items.length > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">{progress}% complete</div>
        </div>
      )}
      
      {/* Subtasks list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {items.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No subtasks added yet
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={items}
            onReorder={handleReorder}
            className="space-y-2"
          >
            <AnimatePresence initial={false}>
              {items.map((subtask) => (
                <Reorder.Item
                  key={subtask.id}
                  value={subtask}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group flex items-start gap-2 border rounded-md p-2 bg-background",
                    subtask.completed && "bg-accent/30"
                  )}
                  disabled={disabled}
                >
                  <div 
                    className="cursor-grab active:cursor-grabbing touch-none py-2 opacity-40 hover:opacity-100"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  <Checkbox
                    id={`subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtaskCompletion(subtask.id)}
                    disabled={disabled}
                    className="mt-1"
                  />
                  
                  <div className="flex-grow space-y-1">
                    <label 
                      htmlFor={`subtask-${subtask.id}`}
                      className={cn(
                        "text-sm font-medium cursor-pointer",
                        subtask.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {subtask.description}
                    </label>
                    
                    {subtask.deadline && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          new Date(subtask.deadline) < new Date() && !subtask.completed 
                            ? "border-destructive text-destructive" 
                            : ""
                        )}
                      >
                        Due: {format(new Date(subtask.deadline), "MMM d, yyyy")}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          disabled={disabled}
                        >
                          <span className="sr-only">Set deadline</span>
                          <svg 
                            width="15" 
                            height="15" 
                            viewBox="0 0 15 15" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path 
                              d="M4.5 1C4.22386 1 4 1.22386 4 1.5V2H3.5C2.67157 2 2 2.67157 2 3.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V3.5C13 2.67157 12.3284 2 11.5 2H11V1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V2H5V1.5C5 1.22386 4.77614 1 4.5 1ZM11 3H11.5C11.7761 3 12 3.22386 12 3.5V5H3V3.5C3 3.22386 3.22386 3 3.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3ZM3 6V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H3Z" 
                              fill="currentColor" 
                              fillRule="evenodd" 
                              clipRule="evenodd"
                            />
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={subtask.deadline ? new Date(subtask.deadline) : undefined}
                          onSelect={(date) => setSubtaskDeadline(subtask.id, date)}
                          initialFocus
                        />
                        {subtask.deadline && (
                          <div className="p-2 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => setSubtaskDeadline(subtask.id, null)}
                            >
                              <X className="h-3 w-3 mr-2" />
                              Clear deadline
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSubtask(subtask.id)}
                      disabled={disabled}
                    >
                      <span className="sr-only">Remove subtask</span>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </div>
      
      {/* Add new subtask */}
      {!disabled && (
        <div className="flex gap-2">
          <Input
            placeholder="Add subtask..."
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
          />
          <Button 
            onClick={handleAddSubtask} 
            variant="secondary"
            disabled={newSubtaskText.trim() === ""}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};
