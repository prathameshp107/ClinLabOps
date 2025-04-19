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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, PlusCircle, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { TaskSubtasks } from "./task-subtasks"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define form schema with Zod
const taskFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  priority: z.string({
    required_error: "Please select a priority level.",
  }),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  experimentId: z.string().optional(),
  parentTaskId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const TaskFormDialog = ({ 
  open, 
  onOpenChange, 
  task, 
  mode, 
  onSubmit, 
  users = [], 
  experiments = [], 
  tasks = [], 
  templates = [] 
}) => {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Ensure we have arrays to work with
  const userArray = Array.isArray(users) ? users : [];
  const experimentsArray = Array.isArray(experiments) ? experiments : [];
  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const templatesArray = Array.isArray(templates) ? templates : [];
  
  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: undefined,
      assigneeId: "unassigned",
      experimentId: "none_experiment",
      parentTaskId: "none_task",
      tags: [],
    },
  });
  
  // Reset form when dialog opens/closes or when task changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && task) {
        form.reset({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority || "medium",
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          assigneeId: task.assigneeId || "unassigned",
          experimentId: task.experimentId || "none_experiment",
          parentTaskId: task.parentTaskId || "none_task",
          tags: task.tags || [],
        });
        setTags(task.tags || []);
        setSubtasks(task.subtasks || []);
      } else {
        form.reset({
          title: "",
          description: "",
          status: "pending",
          priority: "medium",
          dueDate: undefined,
          assigneeId: "unassigned",
          experimentId: "none_experiment",
          parentTaskId: "none_task",
          tags: [],
        });
        setTags([]);
        setSubtasks([]);
        setSelectedTemplate(null);
      }
    }
  }, [open, mode, task, form]);
  
  // Handle applying a template
  const handleApplyTemplate = (template) => {
    if (!template) return;
    
    form.setValue("title", template.name);
    form.setValue("description", template.description);
    form.setValue("status", template.defaultStatus);
    form.setValue("priority", template.defaultPriority);
    
    if (template.categoryTags && template.categoryTags.length > 0) {
      setTags(template.categoryTags);
      form.setValue("tags", template.categoryTags);
    }
    
    setSelectedTemplate(template);
  };
  
  // Handle form submission
  const handleSubmit = (data) => {
    // Map form fields to expected task fields
    const formattedTask = {
      ...data,
      name: data.title,
      experimentName: experiments.find(e => e.id === data.experimentId)?.name || "",
      tags,
      subtasks,
    };
    
    // If editing, add the id
    if (mode === "edit" && task) {
      formattedTask.id = task.id;
    }
    
    // Submit the task
    onSubmit(formattedTask);
  };
  
  // Handle adding a new tag
  const handleAddTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setCurrentTag("");
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };
  
  // Handle subtasks changes
  const handleSubtasksChange = (updatedSubtasks) => {
    setSubtasks(updatedSubtasks);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Add a new task to your project."
              : "Update the details of this task."}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "create" && templatesArray.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Start from a template</h4>
            <Select onValueChange={(value) => {
              const template = templatesArray.find(t => t.id === value);
              handleApplyTemplate(template);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templatesArray.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">
                  Using template: {selectedTemplate.name}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => {
                    form.reset();
                    setTags([]);
                    setSubtasks([]);
                    setSelectedTemplate(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="subtasks">Subtasks ({subtasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter task description" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <SelectItem value="low">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                Low
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                High
                              </div>
                            </SelectItem>
                            <SelectItem value="critical">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                Critical
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
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
                            {field.value && (
                              <div className="p-2 border-t border-border">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={() => field.onChange(undefined)}
                                >
                                  <X className="h-3 w-3 mr-2" />
                                  Clear date
                                </Button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignee</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign to..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {userArray.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experimentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Experiment</FormLabel>
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
                            <SelectItem value="none_experiment">None</SelectItem>
                            {experimentsArray.map((experiment) => (
                              <SelectItem key={experiment.id} value={experiment.id}>
                                {experiment.name}
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
                    name="parentTaskId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Task</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none_task">None</SelectItem>
                            {tasksArray
                              .filter(t => mode === "create" || (mode === "edit" && t.id !== task?.id))
                              .map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="text-secondary-foreground/70 hover:text-secondary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a tag" 
                      value={currentTag} 
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={handleAddTag}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    Add tags to organize tasks
                  </FormDescription>
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
                    <Save className="h-4 w-4 mr-2" />
                    {mode === "create" ? "Create Task" : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="subtasks" className="pt-4">
            <TaskSubtasks 
              subtasks={subtasks} 
              onSubtasksChange={handleSubtasksChange} 
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("details")}
              >
                Back to Details
              </Button>
              <Button onClick={form.handleSubmit(handleSubmit)}>
                <Save className="h-4 w-4 mr-2" />
                {mode === "create" ? "Create Task" : "Save Changes"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
