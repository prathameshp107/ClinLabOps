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
import { CalendarIcon, PlusCircle, Save, X, Clock } from "lucide-react"
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
  dueDate: z.date({
    required_error: "Please select a due date.",
  }).refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "Due date cannot be in the past",
    }
  ),
  assigneeId: z.string({
    required_error: "Please select an assignee.",
  }).refine(
    (value) => value !== "unassigned",
    {
      message: "Task must be assigned to a team member",
    }
  ),
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
  // State for calendar popover
  const [showCalendar, setShowCalendar] = useState(false);
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
    // Find the assignee user object based on the selected ID
    const assignee = userArray.find(user => user.id === data.assigneeId) ||
      // Fallback for hardcoded users
      [
        { id: 'user1', name: 'John Doe' },
        { id: 'user2', name: 'Jane Smith' },
        { id: 'user3', name: 'Sarah Johnson' },
        { id: 'user4', name: 'Jenny Parker' },
        { id: 'user5', name: 'Harry Potter' }
      ].find(user => user.id === data.assigneeId);

    // Map form fields to expected task fields
    const formattedTask = {
      ...data,
      name: data.title,
      experimentName: experiments.find(e => e.id === data.experimentId)?.name || "",
      tags,
      subtasks,
      // Add assignee information
      assignee: assignee ? {
        id: assignee.id,
        name: assignee.name,
        avatar: assignee.avatar || null
      } : null,
      assigneeName: assignee?.name || "Unassigned"
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-lg bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {mode === "create" ? (
              <>
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                Create New Task
              </>
            ) : (
              <>
                <div className="bg-blue-500/10 p-1.5 rounded-full">
                  <Save className="h-5 w-5 text-blue-500" />
                </div>
                Edit Task
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-1.5">
            {mode === "create"
              ? "Add a new task to your project."
              : "Update the details of this task."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          {mode === "create" && templatesArray.length > 0 && (
            <div className="mb-5 bg-muted/50 p-4 rounded-lg border border-border/30">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </span>
                Start from a template
              </h4>
              <Select onValueChange={(value) => {
                const template = templatesArray.find(t => t.id === value);
                handleApplyTemplate(template);
              }}>
                <SelectTrigger className="bg-background">
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
                <div className="flex items-center mt-3">
                  <Badge variant="outline" className="mr-2 bg-primary/5 text-primary border-primary/20">
                    Using template: {selectedTemplate.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details" className="rounded-l-md">Task Details</TabsTrigger>
              <TabsTrigger value="subtasks" className="rounded-r-md">Subtasks ({subtasks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-2 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/30">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <span className="bg-primary/10 p-1 rounded-full">
                              <PlusCircle className="h-3.5 w-3.5 text-primary" />
                            </span>
                            Title*
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter task title"
                              {...field}
                              className="focus-visible:ring-primary/70 shadow-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-5">
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <span className="bg-blue-500/10 p-1 rounded-full">
                              <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                            </span>
                            Description*
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter task description"
                              className="min-h-[120px] focus-visible:ring-primary/70 resize-none shadow-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/20 p-4 rounded-lg border border-border/30 space-y-5">
                      <h3 className="text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2">
                        <span className="bg-green-500/10 p-1 rounded-full">
                          <CalendarIcon className="h-3.5 w-3.5 text-green-500" />
                        </span>
                        Status & Priority
                      </h3>

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Status*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="focus-visible:ring-primary/70 shadow-sm">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"></div>
                                    Pending
                                  </div>
                                </SelectItem>
                                <SelectItem value="in-progress">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div>
                                    In Progress
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                                    Completed
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Priority*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="focus-visible:ring-primary/70 shadow-sm">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div>
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></div>
                                    High
                                  </div>
                                </SelectItem>
                                <SelectItem value="critical">
                                  <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
                                    Critical
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-muted/20 p-4 rounded-lg border border-border/30 space-y-5">
                      <h3 className="text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2">
                        <span className="bg-purple-500/10 p-1 rounded-full">
                          <Clock className="h-3.5 w-3.5 text-purple-500" />
                        </span>
                        Scheduling
                      </h3>

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              Due Date
                              <span className="text-xs text-red-500 font-normal ml-1">*Required</span>
                            </FormLabel>
                            <div className="relative">
                              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                                <PopoverTrigger asChild>
                                  {/* Open calendar on button click */}
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal focus-visible:ring-primary/70 shadow-sm",
                                        !field.value && "text-muted-foreground",
                                        field.value && "border-purple-500/30 bg-purple-500/5"
                                      )}
                                      type="button"
                                      onClick={() => setShowCalendar(true)}
                                    >
                                      {field.value ? (
                                        <span className="flex items-center gap-2">
                                          <CalendarIcon className="h-3.5 w-3.5 text-purple-500" />
                                          {format(field.value, "PPP")}
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-2">
                                          <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
                                          Pick a date
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <div className="p-2 border-b border-border flex justify-between items-center">
                                    <span className="text-xs font-medium">Select date</span>
                                    <div className="flex gap-1">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => field.onChange(new Date())}
                                      >
                                        Today
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => {
                                          const tomorrow = new Date();
                                          tomorrow.setDate(tomorrow.getDate() + 1);
                                          field.onChange(tomorrow);
                                        }}
                                      >
                                        Tomorrow
                                      </Button>
                                    </div>
                                  </div>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className="rounded-md border"
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    fromDate={new Date()}
                                  />
                                  {field.value && (
                                    <div className="p-3 border-t border-border">
                                      <div className="flex flex-col space-y-2">
                                        <div className="bg-muted/40 rounded-md p-2 flex items-center justify-between">
                                          <span className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                                            <CalendarIcon className="h-3 w-3 text-purple-500" />
                                            Selected:
                                          </span>
                                          <span className="text-xs font-medium">
                                            {format(field.value, "EEEE, MMMM do, yyyy")}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => field.onChange(undefined)}
                                          >
                                            <X className="h-3 w-3 mr-1.5" />
                                            Clear
                                          </Button>
                                          <Button
                                            variant="default"
                                            size="sm"
                                            className="h-8 px-3 text-xs bg-purple-500 hover:bg-purple-600 text-white"
                                            type="button"
                                            onClick={() => setShowCalendar(false)}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                              <path d="M20 6 9 17l-5-5"></path>
                                            </svg>
                                            Done
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </PopoverContent>
                              </Popover>
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 rounded-l-none"
                                  onClick={() => field.onChange(undefined)}
                                >
                                  <X className="h-3.5 w-3.5 opacity-70" />
                                </Button>
                              )}
                            </div>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assigneeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Assignee
                              <span className="text-xs text-red-500 font-normal ml-1">*Required</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={cn(
                                  "focus-visible:ring-primary/70",
                                  field.value === "unassigned" && "border-red-300 bg-red-50/50"
                                )}>
                                  <SelectValue placeholder="Assign to..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unassigned" disabled>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    Select an assignee
                                  </div>
                                </SelectItem>
                                <SelectItem value="user1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    John Doe
                                  </div>
                                </SelectItem>
                                <SelectItem value="user2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Jane Smith
                                  </div>
                                </SelectItem>
                                <SelectItem value="user3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Sarah Johnson
                                  </div>
                                </SelectItem>
                                <SelectItem value="user4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Jenny Parker
                                  </div>
                                </SelectItem>
                                <SelectItem value="user5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    Harry Potter
                                  </div>
                                </SelectItem>

                                {userArray.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                      {user.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="experimentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Experiment
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="focus-visible:ring-primary/70">
                                  <SelectValue placeholder="Select experiment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none_experiment">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    No experiment
                                  </div>
                                </SelectItem>
                                
                                {/* Default experiment options */}
                                <SelectItem value="exp1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    Compound A Toxicity Study
                                  </div>
                                </SelectItem>
                                <SelectItem value="exp2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                    Compound B Efficacy Test
                                  </div>
                                </SelectItem>
                                <SelectItem value="exp3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    Compound C Cellular Study
                                  </div>
                                </SelectItem>
                                
                                {/* Dynamic experiment options from props */}
                                {experimentsArray.map((experiment) => (
                                  <SelectItem key={experiment.id} value={experiment.id}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                      {experiment.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs text-muted-foreground/70 mt-1">
                              Associate this task with a specific experiment
                            </FormDescription>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="bg-muted/20 p-4 rounded-lg border border-border/30 space-y-5 col-span-2">
                      <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <span className="bg-indigo-500/10 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                            <path d="M7 7h.01"></path>
                          </svg>
                        </span>
                        Task Tags
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] bg-background/50 p-2 rounded-md border border-border/20">
                        {tags.length > 0 ? (
                          tags.map((tag, index) => (
                            <div
                              key={index}
                              className="bg-secondary/90 text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <span className="font-medium">{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-secondary-foreground/70 hover:text-secondary-foreground rounded-full hover:bg-secondary-foreground/10 p-0.5 transition-colors"
                                aria-label={`Remove ${tag} tag`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground/60 text-sm px-2">No tags added yet</span>
                        )}
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
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
                            className="focus-visible:ring-primary/70 shadow-sm pl-3 pr-3 py-2"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleAddTag}
                          className="focus-visible:ring-primary/70 shadow-sm gap-1.5"
                          disabled={!currentTag.trim()}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Tag
                        </Button>
                      </div>

                      <FormDescription className="text-xs text-muted-foreground/70 flex items-center gap-1.5 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                        Add tags to categorize and organize tasks. Press Enter to add quickly.
                      </FormDescription>
                    </div>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="subtasks" className="pt-2">
              <TaskSubtasks
                subtasks={subtasks}
                onSubtasksChange={handleSubtasksChange}
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/30 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/50"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
