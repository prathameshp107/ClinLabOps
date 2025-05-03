"use client"

import { useState } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Beaker, Users, Clock, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  teamMembers: z.string().optional(),
  equipment: z.string().optional(),
  budget: z.string().optional(),
  tags: z.string().optional(),
  expectedOutcome: z.string().optional(),
})

export function ExperimentForm({ experiment, onSubmit, onCancel }) {
  const isEditing = !!experiment
  const [step, setStep] = useState(1)
  const totalSteps = 2

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
        startDate: experiment.startDate ? new Date(experiment.startDate) : undefined,
        endDate: experiment.endDate ? new Date(experiment.endDate) : undefined,
        teamMembers: experiment.teamMembers?.join(", ") || "",
        equipment: experiment.equipment || "",
        budget: experiment.budget || "",
        tags: experiment.tags?.join(", ") || "",
        expectedOutcome: experiment.expectedOutcome || "",
      }
      : {
        title: "",
        description: "",
        protocol: "",
        status: "planning",
        priority: "medium",
        startDate: undefined,
        endDate: undefined,
        teamMembers: "",
        equipment: "",
        budget: "",
        tags: "",
        expectedOutcome: "",
      },
  })

  const handleSubmit = (data) => {
    // Process team members and tags from comma-separated string to array
    const processedData = {
      ...data,
      teamMembers: data.teamMembers
        ? data.teamMembers.split(",").map(member => member.trim())
        : [],
      tags: data.tags
        ? data.tags.split(",").map(tag => tag.trim())
        : [],
    }

    onSubmit(processedData)
  }

  return (
    <Form {...form}>
      {/* Responsive container with max-width and auto margins */}
      <div className="w-full max-w-3xl mx-auto overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-medium">Step {step} of {totalSteps}</h3>
            <div className="flex gap-1">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 sm:h-2 w-8 sm:w-12 rounded-full ${i + 1 === step ? 'bg-primary' : i + 1 < step ? 'bg-primary/70' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
          <Separator />
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6 px-1">
          {step === 1 && (
            <>
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <Beaker className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-medium">Experiment Details</h3>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Experiment Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter experiment title"
                        {...field}
                        className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-blue-50 text-blue-700 border-blue-200">Planning</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="in-progress">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-green-50 text-green-700 border-green-200">Completed</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="archived">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-green-50 text-green-700 border-green-200">Low</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs sm:text-sm py-0 h-5 bg-red-50 text-red-700 border-red-200">High</Badge>
                              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm sm:text-base">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left text-sm sm:text-base h-8 sm:h-10 font-normal transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 ${!field.value && "text-muted-foreground"}`}
                            >
                              <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm sm:text-base">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left text-sm sm:text-base h-8 sm:h-10 font-normal transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 ${!field.value && "text-muted-foreground"}`}
                            >
                              <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 opacity-70" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Budget</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter budget amount"
                          {...field}
                          className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">Specify the budget allocated for this experiment</FormDescription>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags (comma separated)"
                          {...field}
                          className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">Add tags to categorize your experiment</FormDescription>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-2 sm:pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs sm:text-sm h-8 sm:h-10 group transition-all hover:translate-x-1"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-pulse" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="text-base sm:text-lg font-medium">Experiment Details & Team</h3>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the experiment purpose and goals"
                        className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px] transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Protocol</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detail the experimental protocol and methodology"
                        className="text-sm sm:text-base min-h-[100px] sm:min-h-[150px] transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedOutcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Expected Outcome</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the expected results and outcomes"
                        className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px] transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <FormField
                  control={form.control}
                  name="teamMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Team Members</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter team members (comma separated)"
                          {...field}
                          className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Enter names separated by commas
                      </FormDescription>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Required Equipment</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter required equipment (comma separated)"
                          {...field}
                          className="text-sm sm:text-base h-8 sm:h-10 transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        List equipment needed for this experiment
                      </FormDescription>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between pt-2 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="text-xs sm:text-sm h-8 sm:h-10 group transition-all hover:-translate-x-1"
                >
                  <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:animate-pulse" />
                  Previous Step
                </Button>
                <Button
                  type="submit"
                  className="text-xs sm:text-sm h-8 sm:h-10 transition-all hover:shadow-md"
                >
                  {isEditing ? "Update Experiment" : "Create Experiment"}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </Form>
  )
}