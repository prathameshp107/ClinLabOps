// ... existing imports ...
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  CalendarIcon, X, Plus, Trash2, ArrowRight, Info,
  Users, Briefcase, Tag, DollarSign, Link, FileText,
  Clock, AlertTriangle, CheckCircle2, UserPlus, Search, Check,
  ChevronDown, ChevronUp
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
  // Add state for success message
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Replace step state with section toggle states
  const [expandedSections, setExpandedSections] = useState({
    setup: true,
    details: false,
    team: false
  })
  
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
    
    // Show success message
    setShowSuccess(true)
    
    // Close the dialog and reset form after a delay
    setTimeout(() => {
      setShowSuccess(false)
      onOpenChange(false)
      
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
      setExpandedSections({ setup: true, details: false, team: false })
      setUseTemplate(false)
      setSelectedTemplate(null)
      setSelectedTeamMembers([])
      setMilestones([...defaultMilestones])
    }, 2000) // Close after 2 seconds
  }

  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return useTemplate || formData.name.trim() !== ""
      case 2:
        return formData.name.trim() !== "" && formData.description.trim() !== ""
      case 3:
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
    if (currentStep < 3) {  // Changed from 4 to 3
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

  // Add the missing toggleSection function
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
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

  // Add the isFormValid function here, outside of the JSX
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" && 
      formData.description.trim() !== ""
    );
  };

  return (
    <>
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

          {/* Remove progress indicator and replace with section toggles */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Setup */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                type="button"
                className="w-full flex items-center justify-between p-4 bg-muted/50 text-left font-medium"
                onClick={() => toggleSection('setup')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</div>
                  <span>Project Setup</span>
                </div>
                {expandedSections.setup ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {expandedSections.setup && (
                <div className="p-4 space-y-6">
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
              )}
            </div>
              
            {/* Section 2: Details */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                type="button"
                className="w-full flex items-center justify-between p-4 bg-muted/50 text-left font-medium"
                onClick={() => toggleSection('details')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</div>
                  <span>Project Details</span>
                </div>
                {expandedSections.details ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {expandedSections.details && (
                <div className="p-4 space-y-6">
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
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
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
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
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
              
                    {/* Milestones section remains the same */}
                    {/* ... existing milestones section ... */}
                  </div>
                </div>
              )}
            </div>
              
            {/* Section 3: Team */}
            <div className="border rounded-lg overflow-hidden">
              <button 
                type="button"
                className="w-full flex items-center justify-between p-4 bg-muted/50 text-left font-medium"
                onClick={() => toggleSection('team')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">3</div>
                  <span>Team Members</span>
                </div>
                {expandedSections.team ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {expandedSections.team && (
                <div className="p-4 space-y-6">
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
              
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Team Members</Label>
                      <Badge variant="outline" className="font-normal">
                        {selectedTeamMembers?.length || 0} selected
                      </Badge>
                    </div>

                    {/* Added team members section */}
                    {selectedTeamMembers.length > 0 && (
                      <div className="border rounded-md p-3 space-y-2">
                        <Label className="text-sm text-muted-foreground">Added Team Members</Label>
                        <div className="space-y-2">
                          {selectedTeamMembers.map((memberId) => {
                            const user = mockUsers.find(u => u.id === memberId);
                            return (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.department}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTeamMembers(prev => 
                                    prev.filter(id => id !== user.id)
                                  )}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
              
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <ScrollArea className="h-[200px] border rounded-md">
                      <div className="p-4 space-y-2">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.department}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!selectedTeamMembers.includes(user.id)) {
                                  setSelectedTeamMembers(prev => [...prev, user.id])
                                }
                              }}
                              disabled={selectedTeamMembers.includes(user.id)}
                            >
                              {selectedTeamMembers.includes(user.id) ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <UserPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
              
            {/* Settings section - now included as toggles in each relevant section */}
              
            <DialogFooter className="mt-6">
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isFormValid()}>
                  Create Project
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Success message */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="sr-only">Project Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center">Project Created Successfully!</h2>
            <p className="text-center text-muted-foreground mt-2">
              Your new project has been created and is ready to go.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}