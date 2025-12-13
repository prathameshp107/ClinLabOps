"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Beaker, Users, ArrowRight, ArrowLeft, AlertTriangle, X, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getProjectsForExperimentForm } from "@/services/experimentService"
import { getAllUsers } from "@/services/userService"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Form validation schema
const experimentFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  protocol: z.string().min(10, {
    message: "Protocol must be at least 10 characters.",
  }),
  status: z.enum(["planning", "in-progress", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high"]),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  teamMembers: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  budget: z.string().optional(),
  tags: z.string().optional(),
  expectedOutcome: z.string().optional(),
  // Add projectId field
  projectId: z.string().optional(),
})

export function ExperimentForm({ experiment, onSubmit, onCancel }) {
  const isEditing = !!experiment
  const [step, setStep] = useState(1)
  const totalSteps = 2
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [projectMembers, setProjectMembers] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [openTeamSelector, setOpenTeamSelector] = useState(false)
  const formRef = useRef(null)

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await getProjectsForExperimentForm()
        setProjects(projectData)
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      }
    }
    fetchProjects()
  }, [])

  // Fetch all users for team member selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers()
        setUsers(userData)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }
    fetchUsers()
  }, [])

  // Set selectedProjectId when form is initialized with experiment data
  useEffect(() => {
    if (isEditing && experiment?.projectId) {
      // Handle different possible formats for projectId
      const projectId = experiment.projectId?._id || experiment.projectId?.id || experiment.projectId;
      setSelectedProjectId(projectId)
    }
  }, [isEditing, experiment?.projectId])

  // Fetch project members when a project is selected or when projects/users are loaded
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (selectedProjectId) {
        try {
          // Find the project in our projects array
          // Convert both IDs to strings for comparison
          const project = projects.find(p => {
            const projectId = p._id || p.id;
            return projectId && projectId.toString() === selectedProjectId.toString();
          });

          if (project && project.team) {
            // Map project team members to user IDs
            const memberIds = project.team.map(member => member.id);
            // Filter users to only include those who are in the project team
            const projectUsers = users.filter(user => memberIds.includes(user._id));
            setProjectMembers(projectUsers);
          } else {
            setProjectMembers([]);
          }
        } catch (error) {
          console.error("Failed to fetch project members:", error);
          setProjectMembers([]);
        }
      } else {
        setProjectMembers([]);
      }
    };

    // Only fetch if we have both projects and users loaded
    if (selectedProjectId && projects.length > 0 && users.length > 0) {
      fetchProjectMembers();
    }
  }, [selectedProjectId, projects, users]);

  // Initialize form with default values or existing experiment data
  const form = useForm({
    resolver: zodResolver(experimentFormSchema),
    defaultValues: isEditing
      ? {
        title: experiment.title,
        description: experiment.description,
        protocol: experiment.protocol,
        status: experiment.status,
        priority: experiment.priority,
        startDate: experiment.startDate ? new Date(experiment.startDate) : new Date(),
        endDate: experiment.endDate ? new Date(experiment.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        teamMembers: experiment.teamMembers || [],
        equipment: experiment.equipment || "",
        budget: experiment.budget || "",
        tags: experiment.tags?.join(", ") || "",
        expectedOutcome: experiment.expectedOutcome || "",
        projectId: experiment.projectId || "",
      }
      : {
        title: "",
        description: "",
        protocol: "",
        status: "planning",
        priority: "medium",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        teamMembers: [],
        equipment: "",
        budget: "",
        tags: "",
        expectedOutcome: "",
        projectId: "",
      },
  })

  // Set form ref when form is ready
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // Handle project selection
  const handleProjectChange = (value) => {
    const projectId = value === "__none__" ? "" : value;
    setSelectedProjectId(projectId);

    // Use formRef to avoid circular dependency
    if (formRef.current) {
      formRef.current.setValue("projectId", projectId);
      formRef.current.setValue("teamMembers", []);
    }
  };

  const handleSubmit = (data) => {
    // Process tags from comma-separated string to array
    const processedData = {
      ...data,
      tags: data.tags
        ? data.tags.split(",").map(tag => tag.trim())
        : [],
      // Convert dates to ISO strings
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      // Handle project ID - if it's the special "no project" value, set to undefined
      projectId: data.projectId === "__none__" ? undefined : data.projectId,
    }

    onSubmit(processedData)
  }

  // Get available users for team selection
  const getAvailableUsers = () => {
    // If we have selected a project and have project members, use them
    if (selectedProjectId && projectMembers.length > 0) {
      return projectMembers;
    }
    // Otherwise, use all users
    return users;
  };

  // Toggle team member selection
  const toggleTeamMember = (userId) => {
    // Use formRef to avoid circular dependency
    if (formRef.current) {
      const currentMembers = formRef.current.getValues("teamMembers") || []
      const newMembers = currentMembers.includes(userId)
        ? currentMembers.filter(id => id !== userId)
        : [...currentMembers, userId]

      formRef.current.setValue("teamMembers", newMembers)
    }
  }

  // Remove a team member
  const removeTeamMember = (userId) => {
    // Use formRef to avoid circular dependency
    if (formRef.current) {
      const currentMembers = formRef.current.getValues("teamMembers") || []
      const newMembers = currentMembers.filter(id => id !== userId)
      formRef.current.setValue("teamMembers", newMembers)
    }
  }

  return (
    <Form {...form}>
      {/* Responsive container with max-width and auto margins */}
      <div className="w-full max-w-3xl mx-auto overflow-y-auto max-h-[calc(100vh-10rem)] pr-2">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {step === 1 ? "Basic Information" : "Details & Team"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </p>
            </div>
            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    backgroundColor: i + 1 <= step ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    width: i + 1 === step ? 40 : 12
                  }}
                  className="h-2 rounded-full transition-colors duration-300"
                />
              ))}
            </div>
          </div>
          <Separator className="bg-border/50" />
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Beaker className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Experiment Details</h3>
                </div>

                {/* Add Project Selection Dropdown */}
                <div className="grid grid-cols-1 gap-6 p-6 rounded-xl border border-border/40 bg-muted/5 shadow-sm">
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Project Association</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            handleProjectChange(value)
                            field.onChange(value)
                          }}
                          defaultValue={field.value || "__none__"}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">No Project (Independent)</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project._id} value={project._id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Link this experiment to an existing project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Experiment Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Analysis of Chemical Reaction Rates"
                            {...field}
                            className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planning">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span>Planning</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="in-progress">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span>In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="completed">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>Completed</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="archived">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-500" />
                                <span>Archived</span>
                              </div>
                            </SelectItem>
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
                        <FormLabel className="text-sm font-medium">Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl border border-border/40 bg-muted/5 shadow-sm">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selectedDate={field.value}
                            onDateChange={field.onChange}
                            placeholder="Select start date"
                            className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">End Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selectedDate={field.value}
                            onDateChange={field.onChange}
                            placeholder="Select end date"
                            className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                            minDate={form.watch('startDate')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Budget</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input
                              placeholder="0.00"
                              {...field}
                              className="pl-7 bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="chemistry, analysis, phase-1"
                            {...field}
                            className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Comma separated keywords
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="group transition-all hover:translate-x-1 shadow-lg shadow-primary/20"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Details & Team</h3>
                </div>

                <div className="space-y-6 p-6 rounded-xl border border-border/40 bg-muted/5 shadow-sm">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the experiment purpose and goals..."
                            className="min-h-[100px] bg-background/50 border-border/50 focus:ring-primary/20 transition-all resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="protocol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Protocol</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detail the experimental protocol and methodology..."
                            className="min-h-[150px] bg-background/50 border-border/50 focus:ring-primary/20 transition-all font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedOutcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Expected Outcome</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the expected results and outcomes..."
                            className="min-h-[100px] bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="teamMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Team Members</FormLabel>
                        <Popover open={openTeamSelector} onOpenChange={setOpenTeamSelector}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openTeamSelector}
                              className="w-full justify-between bg-background/50 border-border/50"
                            >
                              {field.value && field.value.length > 0
                                ? `${field.value.length} member${field.value.length > 1 ? 's' : ''} selected`
                                : "Select team members..."}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search team members..." />
                              <CommandList>
                                <CommandEmpty>No team member found.</CommandEmpty>
                                <CommandGroup>
                                  {getAvailableUsers().map((user) => (
                                    <CommandItem
                                      key={user._id}
                                      onSelect={() => toggleTeamMember(user._id)}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <div className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        field.value?.includes(user._id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                      )}>
                                        <CheckCircle2 className="h-3 w-3" />
                                      </div>
                                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                        {user.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription className="text-xs">
                          {selectedProjectId && projectMembers.length > 0
                            ? "Select team members from the project"
                            : "Select team members from all users"}
                        </FormDescription>
                        <FormMessage />
                        {/* Display selected members */}
                        {field.value && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {getAvailableUsers()
                              .filter(user => field.value.includes(user._id))
                              .map(user => (
                                <Badge
                                  key={user._id}
                                  variant="secondary"
                                  className="flex items-center gap-1 pl-1 pr-2 py-1"
                                >
                                  <div className="w-5 h-5 rounded-full bg-background flex items-center justify-center text-[10px] font-bold mr-1">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span>{user.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeTeamMember(user._id)}
                                    className="ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                          </div>
                        )}

                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Required Equipment</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Microscope, Centrifuge, etc."
                            {...field}
                            className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="group transition-all hover:-translate-x-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Previous Step
                  </Button>
                  <Button
                    type="submit"
                    className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                  >
                    {isEditing ? "Update Experiment" : "Create Experiment"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </Form>
  )
}