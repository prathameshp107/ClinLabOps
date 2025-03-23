"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, XCircle, Paperclip } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define form schema with Zod
const taskFormSchema = z.object({
  name: z.string().min(3, {
    message: "Task name must be at least 3 characters.",
  }),
  experimentName: z.string({
    required_error: "Please select an experiment.",
  }),
  assignedTo: z.string({
    required_error: "Please assign this task to someone.",
  }),
  priority: z.string({
    required_error: "Please select a priority level.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  dueDate: z.date({
    required_error: "Please select a due date.",
  }),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const TaskFormDialog = ({ open, onOpenChange, task, mode, onSubmit, users, experiments, tasks }) => {
  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      experimentName: "",
      assignedTo: "",
      priority: "medium",
      status: "pending",
      dueDate: new Date(),
      description: "",
      dependencies: [],
    },
  });
  
  // Reset form when dialog opens/closes or when task changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        form.reset({
          name: task.name,
          experimentName: task.experimentName,
          assignedTo: task.assignedTo.id,
          priority: task.priority,
          status: task.status,
          dueDate: new Date(task.dueDate),
          description: task.description || "",
          dependencies: task.dependencies || [],
        });
      } else {
        form.reset({
          name: "",
          experimentName: "",
          assignedTo: "",
          priority: "medium",
          status: "pending",
          dueDate: new Date(),
          description: "",
          dependencies: [],
        });
      }
    }
  }, [open, mode, task, form]);
  
  // Handle form submission
  const handleSubmit = (data) => {
    // Format the task data
    const formattedTask = {
      ...data,
      assignedTo: {
        id: data.assignedTo,
        name: users[data.assignedTo]?.name || "Unknown User",
        avatar: users[data.assignedTo]?.avatar || "??",
      },
    };
    
    // If editing, add the id
    if (mode === "edit" && task) {
      formattedTask.id = task.id;
      // Preserve existing data that isn't part of the form
      formattedTask.createdAt = task.createdAt;
      formattedTask.attachments = task.attachments || [];
      // We don't overwrite activityLog here as it's handled in the parent component
    }
    
    // Submit the task
    onSubmit(formattedTask);
  };
  
  // Get available tasks for dependencies
  const availableTasks = tasks?.filter(t => {
    if (mode === "create") return true;
    if (mode === "edit" && task) return t.id !== task.id;
    return true;
  }) || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Add a new task for your laboratory experiment."
              : "Update the details of this task."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experimentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiment*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experiment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experiments?.map(exp => (
                          <SelectItem key={exp.id} value={exp.name}>
                            {exp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(users)?.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide additional details about this task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dependencies"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Dependencies</FormLabel>
                    <FormDescription>
                      Select tasks that must be completed before this task can start.
                    </FormDescription>
                  </div>
                  {availableTasks.length > 0 ? (
                    <div className="space-y-2">
                      {availableTasks.map((task) => (
                        <FormField
                          key={task.id}
                          control={form.control}
                          name="dependencies"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={task.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(task.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, task.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== task.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {task.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No other tasks available to select as dependencies.
                    </div>
                  )}
                </FormItem>
              )}
            />
            
            {/* Attachments section - in a real app this would allow file uploads */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                Attachments
              </h3>
              <div className="text-sm text-muted-foreground mb-3">
                Attach relevant lab reports, images, or documents to this task.
              </div>
              
              {mode === "edit" && task?.attachments?.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span>{attachment.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Paperclip className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX, JPG, PNG (MAX. 10MB)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" disabled />
                </label>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Note: File upload functionality is not implemented in this demo.
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create Task" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
