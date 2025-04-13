// ... existing imports ...
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  CalendarIcon, X, Plus, Trash2, ArrowRight, Info,
  Users, Briefcase, Tag, DollarSign, Link, FileText,
  Clock, AlertTriangle, CheckCircle2, UserPlus, Search, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


// Mock project templates
const projectTemplates = [
  {
    id: "template1",
    name: "Drug Discovery Research",
    description: "Template for standard drug discovery research projects",
    tags: ["Drug Development", "Screening", "Biochemistry"],
    priority: "High",
    estimatedDuration: 180,
    milestones: [
      { title: "Target Identification", dueDate: null, completed: false },
      { title: "Hit Discovery", dueDate: null, completed: false },
      { title: "Lead Optimization", dueDate: null, completed: false },
      { title: "Preclinical Testing", dueDate: null, completed: false }
    ]
  },
  {
    id: "template2",
    name: "Clinical Trial Protocol",
    description: "Template for setting up clinical trial projects",
    tags: ["Clinical", "Protocol", "Validation"],
    priority: "Medium",
    estimatedDuration: 365,
    milestones: [
      { title: "Protocol Development", dueDate: null, completed: false },
      { title: "IRB Approval", dueDate: null, completed: false },
      { title: "Patient Recruitment", dueDate: null, completed: false },
      { title: "Data Collection", dueDate: null, completed: false },
      { title: "Analysis & Reporting", dueDate: null, completed: false }
    ]
  }
]
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

// Sample departments for the dropdown
const departments = [
  "Research & Development",
  "Clinical Trials",
  "Laboratory Services",
  "Data Analysis",
  "Quality Control",
  "Regulatory Affairs",
  "Biostatistics",
  "Genomics",
  "Proteomics",
  "Microbiology",
  "Biochemistry",
  "Other"
]

// Add project milestones
const defaultMilestones = [
  { title: "Project Initiation", dueDate: null, completed: false },
  { title: "Planning Phase", dueDate: null, completed: false },
  { title: "Execution", dueDate: null, completed: false },
  { title: "Project Closure", dueDate: null, completed: false }
]

export function AddProjectDialog({ open, onOpenChange, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [useTemplate, setUseTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([])
  const [milestones, setMilestones] = useState([...defaultMilestones])
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: null })

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: "Pending",
    priority: "Medium",
    department: "",
    budget: 0,
    tags: [],
    newTag: "",
    enableNotifications: true,
    enableCollaboration: true,
    enableVersioning: false,
    projectLead: "",
    projectType: "Research",
    relatedDocuments: [],
    newDocumentLink: "",
    riskLevel: "Medium",
  })

  const handleAddTeamMember = (userId) => {
    if (!formData.teamMembers) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [userId]
      }))
    } else if (!formData.teamMembers.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, userId]
      }))
    }
  }

  const handleRemoveTeamMember = (userId) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(id => id !== userId)
    }))
  }

  const handleAddMilestone = () => {
    if (newMilestone.title.trim()) {
      setMilestones(prev => [...prev, { ...newMilestone, completed: false }])
      setNewMilestone({ title: "", dueDate: null })
    }
  }

  const handleRemoveMilestone = (index) => {
    setMilestones(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddDocumentLink = () => {
    if (formData.newDocumentLink.trim()) {
      setFormData(prev => ({
        ...prev,
        relatedDocuments: [...prev.relatedDocuments, prev.newDocumentLink.trim()],
        newDocumentLink: ""
      }))
    }
  }

  const handleRemoveDocumentLink = (linkToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedDocuments: prev.relatedDocuments.filter(link => link !== linkToRemove)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submission attempted, current step:", currentStep);

    // Only submit if we're on the final step
    if (currentStep === 4) {
      // Prepare the project data
      const projectData = {
        name: formData.name,
        description: formData.description,
        startDate: format(formData.startDate, "yyyy-MM-dd"),
        endDate: format(formData.endDate, "yyyy-MM-dd"),
        status: formData.status,
        priority: formData.priority,
        department: formData.department,
        budget: parseFloat(formData.budget),
        tags: formData.tags,
        teamMembers: selectedTeamMembers,
        milestones: milestones,
        projectLead: formData.projectLead,
        projectType: formData.projectType,
        relatedDocuments: formData.relatedDocuments,
        riskLevel: formData.riskLevel,
        settings: {
          enableNotifications: formData.enableNotifications,
          enableCollaboration: formData.enableCollaboration,
          enableVersioning: formData.enableVersioning
        }
      }

      console.log("Submitting project data:", projectData);
      onSubmit(projectData)

      // Reset form
      setFormData({
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        status: "Pending",
        priority: "Medium",
        department: "",
        budget: 0,
        tags: [],
        newTag: "",
        enableNotifications: true,
        enableCollaboration: true,
        enableVersioning: false,
        projectLead: "",
        projectType: "Research",
        relatedDocuments: [],
        newDocumentLink: "",
        riskLevel: "Medium",
      })
      setCurrentStep(1)
      setUseTemplate(false)
      setSelectedTemplate(null)
      setSelectedTeamMembers([])
      setMilestones([...defaultMilestones])
    } else {
      // If not on the final step, just advance to the next step
      nextStep();
    }
  }

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return useTemplate || formData.name.trim() !== ""
      case 2:
        return formData.name.trim() !== "" && formData.description.trim() !== ""
      case 3:
        return true
      case 4:
        return true
      default:
        return true
    }
  }

  // Filter users based on search term
  const filteredUsers = mockUsers ? mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  // Filter common tags based on input
  const filteredTags = commonTags.filter(tag =>
    tag.toLowerCase().includes(formData.newTag.toLowerCase()) &&
    !formData.tags.includes(tag)
  )

  // Add navigation functions
  const nextStep = () => {
    console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log(`Moving from step ${currentStep} to step ${currentStep - 1}`);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add missing handler functions
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }))
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleApplyTemplate = (template) => {
    setSelectedTemplate(template)
    // Apply template data to form
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      priority: template.priority,
      tags: [...template.tags]
    }))
    // Set milestones from template if available
    if (template.milestones) {
      setMilestones([...template.milestones])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Plus className="h-5 w-5 text-primary" />
            </motion.div>
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new research project.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="relative mb-6 mt-2">
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "25%" }}
              animate={{ width: `${currentStep * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
              <span className="text-xs mt-1">Setup</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
              <span className="text-xs mt-1">Details</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
              <span className="text-xs mt-1">Team</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>4</div>
              <span className="text-xs mt-1">Settings</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Setup - remains mostly the same */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="use-template"
                      checked={useTemplate}
                      onCheckedChange={setUseTemplate}
                    />
                    <Label htmlFor="use-template">Start with a template</Label>
                  </div>

                  {useTemplate ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {projectTemplates.map(template => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md ${selectedTemplate?.id === template.id ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => handleApplyTemplate(template)}
                        >
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                            <span>Priority: {template.priority}</span>
                            <span>~{template.estimatedDuration} days</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          placeholder="Enter project name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => handleInputChange("projectType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Development">Development</SelectItem>
                            <SelectItem value="Clinical Trial">Clinical Trial</SelectItem>
                            <SelectItem value="Validation">Validation</SelectItem>
                            <SelectItem value="Analysis">Analysis</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details - enhanced with more fields */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the project objectives and scope"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => handleInputChange("startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => handleInputChange("endDate", date)}
                            initialFocus
                            disabled={(date) => date < formData.startDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                              Draft
                            </div>
                          </SelectItem>
                          <SelectItem value="Pending">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              Pending
                            </div>
                          </SelectItem>
                          <SelectItem value="In Progress">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              In Progress
                            </div>
                          </SelectItem>
                          <SelectItem value="On Hold">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              On Hold
                            </div>
                          </SelectItem>
                          <SelectItem value="Completed">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Completed
                            </div>
                          </SelectItem>
                          <SelectItem value="Cancelled">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Cancelled
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleInputChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Low
                            </div>
                          </SelectItem>
                          <SelectItem value="Medium">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              Medium
                            </div>
                          </SelectItem>
                          <SelectItem value="High">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              High
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Project Milestones</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">Add key milestones to track project progress</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="border border-muted rounded-md p-4">
                      <div className="space-y-4">
                        {formData.milestones?.map((milestone, index) => (
                          <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{milestone.title}</p>
                              {milestone.dueDate && (
                                <p className="text-xs text-muted-foreground">
                                  Due: {format(milestone.dueDate, "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMilestone(index)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <Input
                            placeholder="Add milestone"
                            value={formData.newMilestone?.title || ""}
                            onChange={(e) => handleInputChange("newMilestone", { ...(formData.newMilestone || {}), title: e.target.value })}
                            className="flex-1"
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="icon">
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData.newMilestone?.dueDate}
                                onSelect={(date) => handleInputChange("newMilestone", { ...(formData.newMilestone || {}), dueDate: date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddMilestone}
                            disabled={!formData.newMilestone?.title?.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* New Step 3: Team Members */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectLead">Project Lead</Label>
                    <Select
                      value={formData.projectLead}
                      onValueChange={(value) => handleInputChange("projectLead", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">({user.role})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Team Members</Label>
                      <Badge variant="outline" className="font-normal">
                        {formData.teamMembers?.length || 0} selected
                      </Badge>
                    </div>

                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search team members..."
                        value={formData.searchTerm || ""}
                        onChange={(e) => handleInputChange("searchTerm", e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 my-3">
                      {formData.teamMembers?.map(memberId => {
                        const member = mockUsers.find(u => u.id === memberId);
                        return member ? (
                          <Badge key={member.id} variant="secondary" className="px-2 py-1 gap-1">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium mr-1">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {member.name}
                            <button
                              type="button"
                              className="ml-1 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveTeamMember(member.id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>

                    <div className="border border-muted rounded-md overflow-hidden">
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          <div className="divide-y">
                            {filteredUsers.map(user => (
                              <div
                                key={user.id}
                                className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${formData.teamMembers?.includes(user.id) ? 'bg-primary/5' : ''
                                  }`}
                                onClick={() => handleAddTeamMember(user.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={formData.teamMembers?.includes(user.id) ? 'text-primary' : ''}
                                >
                                  {formData.teamMembers?.includes(user.id) ? (
                                    <Check className="h-5 w-5" />
                                  ) : (
                                    <Plus className="h-5 w-5" />
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] p-6 text-center">
                            <Users className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No users found matching "{formData.searchTerm}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Settings - Enhanced with more options */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="department">Department</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Select the department responsible for this project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="budget">Budget</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Estimated budget for this project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="budget"
                          type="number"
                          min="0"
                          step="100"
                          className="pl-9"
                          placeholder="Enter budget amount"
                          value={formData.budget}
                          onChange={(e) => handleInputChange("budget", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag"
                        value={formData.newTag}
                        onChange={(e) => handleInputChange("newTag", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-2 py-1">
                          {tag}
                          <button
                            type="button"
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {formData.tags.length === 0 && (
                        <span className="text-sm text-muted-foreground">No tags added yet</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Related Documents</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add document link or reference"
                        value={formData.newDocumentLink || ""}
                        onChange={(e) => handleInputChange("newDocumentLink", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddDocumentLink();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddDocumentLink}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      {formData.relatedDocuments?.map(link => (
                        <div key={link} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{link}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDocumentLink(link)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      {(!formData.relatedDocuments || formData.relatedDocuments.length === 0) && (
                        <span className="text-sm text-muted-foreground">No documents added yet</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium">Project Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="notifications" className="cursor-pointer">Enable notifications</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">Receive notifications about project updates and deadlines</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          id="notifications"
                          checked={formData.enableNotifications}
                          onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="collaboration" className="cursor-pointer">Enable collaboration</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">Allow team members to collaborate on this project</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          id="collaboration"
                          checked={formData.enableCollaboration}
                          onCheckedChange={(checked) => handleInputChange("enableCollaboration", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="versioning" className="cursor-pointer">Enable versioning</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-[200px] text-xs">Track changes and maintain version history for this project</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Switch
                          id="versioning"
                          checked={formData.enableVersioning}
                          onCheckedChange={(checked) => handleInputChange("enableVersioning", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="mt-6 flex justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepComplete(currentStep)}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">Create Project</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}