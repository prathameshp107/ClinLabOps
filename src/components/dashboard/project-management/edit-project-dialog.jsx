"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, ClipboardEdit, CheckCircle2, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Mock users for team selection
const mockUsers = [
  { id: "u1", name: "Dr. Sarah Johnson", role: "Admin", department: "Research & Development" },
  { id: "u2", name: "Mark Williams", role: "Scientist", department: "Biochemistry" },
  { id: "u3", name: "Dr. Emily Chen", role: "Reviewer", department: "Quality Control" },
  { id: "u4", name: "James Rodriguez", role: "Technician", department: "Laboratory Operations" },
  { id: "u5", name: "Olivia Taylor", role: "Scientist", department: "Microbiology" },
  { id: "u6", name: "Robert Kim", role: "Technician", department: "Equipment Maintenance" }
]

// Common project tags
const commonTags = [
  "Oncology", "Proteomics", "Clinical", "Microbiology", "Drug Development", "Neuroscience", 
  "Data Analysis", "Genetics", "Protocol", "Screening", "Equipment", "Validation", 
  "Mass Spec", "Vaccines", "Stability", "mRNA", "Immunology", "Biomarkers"
]

export function EditProjectDialog({ project, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    status: "Pending",
    priority: "Medium",
    progress: 0,
    team: [],
    tags: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [tagInput, setTagInput] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)

  // Initialize form with project data when opened
  useEffect(() => {
    if (project && open) {
      setProjectData({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
      })
    }
  }, [project, open])

  const validateForm = () => {
    const errors = {}
    
    if (!projectData.name.trim()) {
      errors.name = "Project name is required"
    }
    
    if (!projectData.description.trim()) {
      errors.description = "Project description is required"
    }
    
    if (!projectData.startDate) {
      errors.startDate = "Start date is required"
    }
    
    if (!projectData.endDate) {
      errors.endDate = "End date is required"
    } else if (projectData.endDate < projectData.startDate) {
      errors.endDate = "End date cannot be earlier than start date"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target
    const numberValue = parseInt(value, 10)
    
    if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 100) {
      setProjectData(prev => ({
        ...prev,
        [name]: numberValue
      }))
    }
  }

  const handleDateChange = (date, field) => {
    setProjectData(prev => ({
      ...prev,
      [field]: date
    }))
    
    // Clear error when user selects date
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSelectChange = (value, field) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTeamMemberAdd = (user) => {
    // Skip if user is already in team
    if (projectData.team.some(member => member.id === user.id)) {
      return
    }
    
    setProjectData(prev => ({
      ...prev,
      team: [...prev.team, { 
        id: user.id, 
        name: user.name, 
        role: user.role,
        department: user.department
      }]
    }))
  }

  const handleTeamMemberRemove = (userId) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== userId)
    }))
  }

  const handleTagAdd = (tag) => {
    // Skip if tag is already added or empty
    if (!tag.trim() || projectData.tags.includes(tag.trim())) {
      setTagInput("")
      return
    }
    
    setProjectData(prev => ({
      ...prev,
      tags: [...prev.tags, tag.trim()]
    }))
    setTagInput("")
  }

  const handleTagRemove = (tag) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real application, you would send the data to your API here
      console.log("Updating project:", projectData)
      
      // Simulate successful API call
      setTimeout(() => {
        setIsSubmitting(false)
        onOpenChange(false)
      }, 1000)
    } catch (error) {
      console.error("Error updating project:", error)
      setIsSubmitting(false)
      // Handle error appropriately
    }
  }

  const filteredTagSuggestions = commonTags
    .filter(tag => 
      tag.toLowerCase().includes(tagInput.toLowerCase()) && 
      !projectData.tags.includes(tag)
    )
    .slice(0, 5)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardEdit className="h-5 w-5" />
            Edit Project
          </DialogTitle>
          <DialogDescription>
            Update project details and information
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="details" 
          className="w-full overflow-hidden"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Basic Details
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Team
            </TabsTrigger>
            <TabsTrigger value="additional" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
              Additional Info
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <ScrollArea className="pr-4" style={{ height: 'calc(75vh - 180px)' }}>
              <TabsContent value="details" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Project Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter project name"
                      value={projectData.name}
                      onChange={handleInputChange}
                      className={cn(formErrors.name ? "border-destructive" : "")}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter project description"
                      value={projectData.description}
                      onChange={handleInputChange}
                      className={cn("min-h-[100px]", formErrors.description ? "border-destructive" : "")}
                    />
                    {formErrors.description && (
                      <p className="text-sm text-destructive">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="startDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !projectData.startDate && "text-muted-foreground",
                              formErrors.startDate ? "border-destructive" : ""
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {projectData.startDate ? (
                              format(projectData.startDate, "PPP")
                            ) : (
                              <span>Select start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={projectData.startDate}
                            onSelect={(date) => handleDateChange(date, "startDate")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.startDate && (
                        <p className="text-sm text-destructive">{formErrors.startDate}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="endDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !projectData.endDate && "text-muted-foreground",
                              formErrors.endDate ? "border-destructive" : ""
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {projectData.endDate ? (
                              format(projectData.endDate, "PPP")
                            ) : (
                              <span>Select end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={projectData.endDate}
                            onSelect={(date) => handleDateChange(date, "endDate")}
                            initialFocus
                            disabled={(date) => date < projectData.startDate}
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.endDate && (
                        <p className="text-sm text-destructive">{formErrors.endDate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={projectData.status}
                        onValueChange={(value) => handleSelectChange(value, "status")}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={projectData.priority}
                        onValueChange={(value) => handleSelectChange(value, "priority")}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="progress">
                        Progress ({projectData.progress}%)
                      </Label>
                      <Input
                        id="progress"
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={projectData.progress}
                        onChange={handleNumberInputChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Team Members</Label>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span>Add Team Members</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" x2="19" y1="8" y2="14" />
                            <line x1="16" x2="22" y1="11" y2="11" />
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup heading="Users">
                            {mockUsers
                              .filter(user => !projectData.team.some(member => member.id === user.id))
                              .map(user => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => handleTeamMemberAdd(user)}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="flex flex-col">
                                    <span>{user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.role} • {user.department}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={projectData.team.length > 0 ? "" : "sr-only"}>
                      Selected Team Members ({projectData.team.length})
                    </Label>
                    
                    {projectData.team.length > 0 ? (
                      <div className="space-y-2">
                        {projectData.team.map(member => (
                          <div 
                            key={member.id} 
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{member.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {member.role} • {member.department}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleTeamMemberRemove(member.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <p className="mt-2">No team members added yet</p>
                        <p className="text-xs">Add team members from the dropdown above</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="relative">
                      <Input
                        id="tags"
                        placeholder="Add tags (e.g., Oncology, Clinical)"
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value)
                          setShowTagSuggestions(e.target.value.length > 0)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleTagAdd(tagInput)
                          }
                        }}
                      />
                      {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 border rounded-md bg-background shadow-md">
                          {filteredTagSuggestions.map(tag => (
                            <div
                              key={tag}
                              className="px-2 py-1.5 hover:bg-muted cursor-pointer"
                              onClick={() => {
                                handleTagAdd(tag)
                                setShowTagSuggestions(false)
                              }}
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Press Enter to add a tag
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={projectData.tags.length > 0 ? "" : "sr-only"}>
                      Selected Tags ({projectData.tags.length})
                    </Label>
                    
                    {projectData.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {projectData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="px-2 py-1 gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-muted-foreground/20"
                              aria-label={`Remove ${tag} tag`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag">
                          <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                          <path d="M7 7h.01" />
                        </svg>
                        <p className="mt-2">No tags added yet</p>
                        <p className="text-xs">Add tags to categorize your project</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
            
            <DialogFooter className="mt-6 gap-2">
              <div className="flex items-center mr-auto">
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === "team" ? "details" : "team")}
                    className="gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </Button>
                )}
              </div>
              
              {activeTab !== "additional" ? (
                <Button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "details" ? "team" : "additional")}
                  className="gap-2"
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit" className="gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating Project...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Update Project
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save changes to this project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
