"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, FolderPlus, CheckCircle2, X, Info, FileText, Link2, Beaker, Users, Clock, AlertTriangle, FileSpreadsheet, ArrowRight, Plus } from "lucide-react"
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
  DialogTitle,
  DialogOverlay
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
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"

// Rich text editor imports
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import {
  projectStatuses,
  projectPriorities,
  researchAreas,
  studyTypes,
  dataCollectionFrequencies,
  commonTags
} from "@/constants"
import { getUsers } from "@/services/userService"

// Rich text editor toolbar component
const EditorMenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/30 rounded-t-md">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2", editor.isActive('bold') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8" /><path d="M15 20a4 4 0 0 0 0-8H6v8Z" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2", editor.isActive('italic') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2", editor.isActive('underline') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" /></svg>
      </Button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2", editor.isActive('bulletList') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" x2="20" y1="6" y2="6" /><line x1="9" x2="20" y1="12" y2="12" /><line x1="9" x2="20" y1="18" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2", editor.isActive('orderedList') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
      </Button>
    </div>
  )
}

// Default department values
const defaultDepartments = [
  "Oncology",
  "Cardiology",
  "Neuroscience",
  "Immunology",
  "Genetics",
  "Pharmacology",
  "Microbiology",
  "Biochemistry",
  "Molecular Biology",
  "Clinical Research",
  "Epidemiology",
  "Biostatistics",
  "Radiology",
  "Pathology",
  "Pediatrics",
  "Surgery",
  "Emergency Medicine",
  "Psychiatry",
  "Dermatology",
  "Orthopedics"
];

export function EditProjectDialog({ project, open, onOpenChange, onSave }) {
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: "planning",
    priority: "medium",
    team: [],
    tags: [],
    // Additional fields to match AddProjectDialog
    budget: "",
    confidential: false,
    complexity: 50,
    department: "",
    externalCollaborators: [],
    requiredEquipment: [],
    relatedDocuments: [],
    principalInvestigator: null,
    researchArea: "",
    studyType: "",
    experimentDetails: {
      numberOfExperiments: 1,
      numberOfGroups: 2,
      dataCollectionFrequency: "Weekly",
      studyType: "In vitro"
    }
  })
  const [formErrors, setFormErrors] = useState({})
  const [tagInput, setTagInput] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [equipmentInput, setEquipmentInput] = useState("")
  const [documentInput, setDocumentInput] = useState("")
  const [collaboratorInput, setCollaboratorInput] = useState("")

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  // Initialize form with project data when opened
  useEffect(() => {
    if (project && open) {
      console.log('Initializing edit dialog with project:', project.name, project.id)
      setProjectData({
        name: project.name || project.title || "",
        description: project.description || "",
        startDate: project.startDate ? new Date(project.startDate) : new Date(),
        endDate: project.endDate ? new Date(project.endDate) : new Date(new Date().setMonth(new Date().getMonth() + 3)),
        status: project.status || "planning",
        priority: project.priority || "medium",
        team: Array.isArray(project.team) ? project.team : [],
        tags: Array.isArray(project.tags) ? project.tags : [],
        // Additional fields with fallbacks
        budget: project.budget || "",
        confidential: project.confidential || false,
        complexity: project.complexity || 50,
        department: project.department || "",
        externalCollaborators: Array.isArray(project.externalCollaborators) ? project.externalCollaborators : [],
        requiredEquipment: Array.isArray(project.requiredEquipment) ? project.requiredEquipment : [],
        relatedDocuments: Array.isArray(project.relatedDocuments) ? project.relatedDocuments : [],
        principalInvestigator: project.principalInvestigator || null,
        researchArea: project.researchArea || "",
        studyType: project.studyType || "",
        experimentDetails: {
          numberOfExperiments: project.experimentDetails?.numberOfExperiments || 1,
          numberOfGroups: project.experimentDetails?.numberOfGroups || 2,
          dataCollectionFrequency: project.experimentDetails?.dataCollectionFrequency || "Weekly",
          studyType: project.experimentDetails?.studyType || "In vitro"
        }
      })
      // Clear any previous errors
      setFormErrors({})
      // Reset to first tab
      setActiveTab("details")
    }
  }, [project, open])

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      setActiveTab("details")
      setFormErrors({})
      setTagInput("")
      setEquipmentInput("")
      setDocumentInput("")
      setCollaboratorInput("")
    }
  }, [open])

  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Placeholder.configure({
        placeholder: 'Write a detailed project description...',
      }),
    ],
    content: projectData.description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setProjectData(prev => ({
        ...prev,
        description: html
      }))

      // Clear error when user types
      if (formErrors.description) {
        setFormErrors(prev => ({
          ...prev,
          description: undefined
        }))
      }
    },
  })

  // Update editor content when project data changes
  useEffect(() => {
    if (editor && projectData.description && editor.getHTML() !== projectData.description) {
      editor.commands.setContent(projectData.description)
    }
  }, [editor, projectData.description])

  const validateForm = () => {
    const errors = {}

    if (!projectData.name.trim()) {
      errors.name = "Project name is required"
    }

    if (!projectData.description.trim() || projectData.description === '<p></p>') {
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

    if (projectData.budget && isNaN(parseFloat(projectData.budget))) {
      errors.budget = "Budget must be a valid number"
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

  const handleSwitchChange = (checked, field) => {
    setProjectData(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  const handleSliderChange = (value, field) => {
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

  // New handlers for additional fields
  const handleEquipmentAdd = (equipment) => {
    if (!equipment.trim() || projectData.requiredEquipment.includes(equipment.trim())) {
      setEquipmentInput("")
      return
    }

    setProjectData(prev => ({
      ...prev,
      requiredEquipment: [...prev.requiredEquipment, equipment.trim()]
    }))
    setEquipmentInput("")
  }

  const handleEquipmentRemove = (equipment) => {
    setProjectData(prev => ({
      ...prev,
      requiredEquipment: prev.requiredEquipment.filter(e => e !== equipment)
    }))
  }

  const handleDocumentAdd = (document) => {
    if (!document.trim()) {
      setDocumentInput("")
      return
    }

    setProjectData(prev => ({
      ...prev,
      relatedDocuments: [...prev.relatedDocuments, {
        id: Date.now().toString(),
        name: document.trim(),
        url: document.trim().startsWith('http') ? document.trim() : '#'
      }]
    }))
    setDocumentInput("")
  }

  const handleDocumentRemove = (documentId) => {
    setProjectData(prev => ({
      ...prev,
      relatedDocuments: prev.relatedDocuments.filter(d => d.id !== documentId)
    }))
  }

  const handleCollaboratorAdd = (collaborator) => {
    if (!collaborator.trim() || projectData.externalCollaborators.includes(collaborator.trim())) {
      setCollaboratorInput("")
      return
    }

    setProjectData(prev => ({
      ...prev,
      externalCollaborators: [...prev.externalCollaborators, collaborator.trim()]
    }))
    setCollaboratorInput("")
  }

  const handleCollaboratorRemove = (collaborator) => {
    setProjectData(prev => ({
      ...prev,
      externalCollaborators: prev.externalCollaborators.filter(c => c !== collaborator)
    }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create updated project object with all the form data
      const updatedProject = {
        ...project, // Keep existing project data
        name: projectData.name,
        description: projectData.description,
        startDate: format(projectData.startDate, 'yyyy-MM-dd'),
        endDate: format(projectData.endDate, 'yyyy-MM-dd'),
        status: projectData.status,
        priority: projectData.priority,
        team: projectData.team,
        tags: projectData.tags,
        budget: projectData.budget,
        confidential: projectData.confidential,
        complexity: projectData.complexity,
        department: projectData.department,
        externalCollaborators: projectData.externalCollaborators,
        requiredEquipment: projectData.requiredEquipment,
        relatedDocuments: projectData.relatedDocuments,
        principalInvestigator: projectData.principalInvestigator,
        researchArea: projectData.researchArea,
        studyType: projectData.studyType,
        experimentDetails: projectData.experimentDetails
      }

      console.log("Updating project:", updatedProject)

      // Use the onSave callback passed from the parent page
      if (onSave) {
        await onSave(updatedProject);
      }

      // Close the dialog after successful save
      onOpenChange(false)

      // Reset form state
      setActiveTab("details")
    } catch (error) {
      console.error("Failed to save project", error)
      // You might want to show an error message to the user here
      alert("Failed to update project. Please try again.")
    } finally {
      setIsSubmitting(false)
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
      <DialogContent className="sm:max-w-[950px] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/10">
          <DialogTitle className="text-2xl font-bold text-foreground">Edit Project</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            Update project details and information
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
          <TabsList className="w-full justify-start border-b border-border/10 rounded-none bg-transparent p-0 h-auto mx-8">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium transition-all hover:text-primary/80"
            >
              <FileText className="h-4 w-4 mr-2" />
              Project Details
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium transition-all hover:text-primary/80"
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium transition-all hover:text-primary/80"
            >
              <Beaker className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-medium transition-all hover:text-primary/80"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-8 py-6" style={{ maxHeight: 'calc(95vh - 280px)' }}>
              <TabsContent value="details" className="mt-0 space-y-8 pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1">
                        Project Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter project name"
                          value={projectData.name}
                          onChange={handleInputChange}
                          className={cn(
                            "pl-10 h-11 transition-all duration-200 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 shadow-sm",
                            formErrors.name ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                          )}
                        />
                        <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {formErrors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1 mt-1.5"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {formErrors.name}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-1">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <div className={cn(
                        "border rounded-lg transition-all duration-200 bg-background/50 border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm overflow-hidden",
                        formErrors.description ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                      )}>
                        <EditorMenuBar editor={editor} />
                        <EditorContent
                          editor={editor}
                          className="p-4 min-h-[160px] prose prose-sm max-w-none focus:outline-none"
                        />
                      </div>
                      {formErrors.description && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1 mt-1.5"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {formErrors.description}
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="startDate" className="text-sm font-semibold">
                          Start Date <span className="text-destructive">*</span>
                        </Label>
                        <DatePicker
                          selectedDate={projectData.startDate}
                          onDateChange={(date) => handleDateChange(date, "startDate")}
                          placeholder="Select start date"
                          className={cn(
                            "w-full h-11",
                            formErrors.startDate ? "border-destructive" : ""
                          )}
                          showTodayButton={true}
                          showClearButton={false}
                        />
                        {formErrors.startDate && (
                          <p className="text-sm text-destructive">{formErrors.startDate}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="endDate" className="text-sm font-semibold">
                          End Date <span className="text-destructive">*</span>
                        </Label>
                        <DatePicker
                          selectedDate={projectData.endDate}
                          onDateChange={(date) => handleDateChange(date, "endDate")}
                          placeholder="Select end date"
                          className={cn(
                            "w-full h-11",
                            formErrors.endDate ? "border-destructive" : ""
                          )}
                          minDate={projectData.startDate}
                          showTodayButton={true}
                          showClearButton={false}
                        />
                        {formErrors.endDate && (
                          <p className="text-sm text-destructive">{formErrors.endDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/20">
                      {/* Status */}
                      <div className="space-y-3">
                        <Label htmlFor="status" className="text-sm font-semibold">
                          Status
                        </Label>
                        <Select
                          value={projectData.status}
                          onValueChange={(value) => handleSelectChange(value, "status")}
                        >
                          <SelectTrigger id="status" className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectStatuses.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div className="space-y-3">
                        <Label htmlFor="priority" className="text-sm font-semibold">
                          Priority
                        </Label>
                        <Select
                          value={projectData.priority}
                          onValueChange={(value) => handleSelectChange(value, "priority")}
                        >
                          <SelectTrigger id="priority" className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select project priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectPriorities.map(priority => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: priority.color }} />
                                  {priority.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Department & Project Complexity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/20">
                      {/* Department */}
                      <div className="space-y-3">
                        <Label htmlFor="department" className="text-sm font-semibold">
                          Department
                        </Label>
                        <Select
                          value={projectData.department}
                          onValueChange={(value) => handleSelectChange(value, "department")}
                        >
                          <SelectTrigger className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {defaultDepartments.map(department => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Project Complexity */}
                      <div className="space-y-4">
                        <Label htmlFor="complexity" className="text-sm font-semibold flex items-center justify-between">
                          Project Complexity
                          <span className="font-normal text-muted-foreground text-sm">{projectData.complexity}/100</span>
                        </Label>
                        <Slider
                          id="complexity"
                          min={0}
                          max={100}
                          step={1}
                          value={[projectData.complexity]}
                          onValueChange={(value) => handleSliderChange(value[0], "complexity")}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Simple</span>
                          <span>Complex</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Project Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/20">
                      {/* Budget */}
                      <div className="space-y-3">
                        <Label htmlFor="budget" className="text-sm font-semibold">
                          Budget (Optional)
                        </Label>
                        <Input
                          id="budget"
                          name="budget"
                          type="number"
                          value={projectData.budget}
                          onChange={handleInputChange}
                          placeholder="Enter budget amount"
                          className={cn(
                            "bg-background/50 border-border/50 h-11",
                            formErrors.budget ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                          )}
                        />
                        {formErrors.budget && (
                          <p className="text-sm text-destructive">{formErrors.budget}</p>
                        )}
                      </div>

                      {/* Confidential Toggle */}
                      <div className="space-y-3">
                        <Label htmlFor="confidential" className="text-sm font-semibold">
                          Project Confidentiality
                        </Label>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-background/50">
                          <Switch
                            id="confidential"
                            checked={projectData.confidential}
                            onCheckedChange={(checked) => handleSwitchChange(checked, "confidential")}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {projectData.confidential ? "Confidential" : "Public"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {projectData.confidential ? "Restricted access" : "Open access"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-3 pt-6 border-t border-border/20">
                      <Label className="text-sm font-semibold">Project Tags</Label>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Add project tags"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleTagAdd(tagInput)
                            }
                          }}
                          className="bg-background/50 border-border/50 h-11"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTagAdd(tagInput)}
                          className="h-11 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add a tag
                      </div>

                      {projectData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {projectData.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 gap-2 bg-primary/10 text-primary border-primary/20">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleTagRemove(tag)}
                                className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-primary/20"
                                aria-label={`Remove ${tag}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="mt-0 space-y-8 pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Team Members Selection */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Team Members</Label>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          {projectData.team.length} members selected
                        </span>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start h-11 border-dashed">
                            <Plus className="mr-2 h-4 w-4" />
                            Add team member
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search for a team member..." />
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                              {Array.isArray(users) && users
                                .filter(user => !projectData.team.some(member => member.id === (user._id || user.id)))
                                .map(user => (
                                  <CommandItem
                                    key={user._id || user.id}
                                    onSelect={() => handleTeamMemberAdd({
                                      id: user._id || user.id,
                                      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                                      email: user.email,
                                      role: user.roles?.[0] || 'User'
                                    })}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                                        <span className="text-xs font-bold">
                                          {(user.name || user.firstName || 'U').charAt(0)}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {user.roles?.[0] || user.department || 'User'}
                                        </p>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Display selected team members */}
                      {projectData.team.length > 0 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {projectData.team.map(member => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-medium">
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
                                  size="sm"
                                  onClick={() => handleTeamMemberRemove(member.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* External Collaborators */}
                    <div className="space-y-3 pt-6 border-t border-border/20">
                      <Label htmlFor="collaborators" className="text-sm font-semibold">External Collaborators / Institutions</Label>
                      <div className="flex gap-3">
                        <Input
                          id="collaborators"
                          placeholder="Add external collaborator or institution"
                          value={collaboratorInput}
                          onChange={(e) => setCollaboratorInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleCollaboratorAdd(collaboratorInput)
                            }
                          }}
                          className="bg-background/50 border-border/50 h-11"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleCollaboratorAdd(collaboratorInput)}
                          className="h-11 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add a collaborator
                      </div>
                    </div>

                    {projectData.externalCollaborators.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectData.externalCollaborators.map(collaborator => (
                          <Badge key={collaborator} variant="outline" className="px-2 py-1 gap-1 bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {collaborator}
                            <button
                              type="button"
                              onClick={() => handleCollaboratorRemove(collaborator)}
                              className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-muted-foreground/20"
                              aria-label={`Remove ${collaborator}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="research" className="mt-0 space-y-8 pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Research Area */}
                    <div className="space-y-3">
                      <Label htmlFor="researchArea" className="text-sm font-semibold">
                        Research Area
                      </Label>
                      <Select
                        value={projectData.researchArea}
                        onValueChange={(value) => handleSelectChange(value, "researchArea")}
                      >
                        <SelectTrigger id="researchArea" className="bg-background/50 border-border/50 h-11">
                          <SelectValue placeholder="Select research area" />
                        </SelectTrigger>
                        <SelectContent>
                          {researchAreas.map(area => (
                            <SelectItem key={area} value={area}>
                              <div className="flex items-center gap-2">
                                <Beaker className="h-4 w-4 text-primary" />
                                {area}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Study Type */}
                    <div className="space-y-3">
                      <Label htmlFor="studyType" className="text-sm font-semibold">
                        Study Type
                      </Label>
                      <Select
                        value={projectData.experimentDetails?.studyType}
                        onValueChange={(value) => {
                          setProjectData(prev => ({
                            ...prev,
                            experimentDetails: {
                              ...prev.experimentDetails,
                              studyType: value
                            }
                          }))
                        }}
                      >
                        <SelectTrigger id="studyType" className="bg-background/50 border-border/50 h-11">
                          <SelectValue placeholder="Select study type" />
                        </SelectTrigger>
                        <SelectContent>
                          {studyTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <FileSpreadsheet className="h-4 w-4 text-primary" />
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experiment Details */}
                    <div className="pt-6 border-t border-border/20">
                      <h3 className="text-sm font-semibold mb-6">Experiment Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Number of Experiments */}
                        <div className="space-y-3">
                          <Label htmlFor="numberOfExperiments" className="text-sm font-semibold">
                            Number of Experiments
                          </Label>
                          <Input
                            id="numberOfExperiments"
                            type="number"
                            min="1"
                            value={projectData.experimentDetails?.numberOfExperiments}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1
                              setProjectData(prev => ({
                                ...prev,
                                experimentDetails: {
                                  ...prev.experimentDetails,
                                  numberOfExperiments: value
                                }
                              }))
                            }}
                            className="bg-background/50 border-border/50 h-11"
                          />
                        </div>

                        {/* Number of Test Groups */}
                        <div className="space-y-3">
                          <Label htmlFor="numberOfGroups" className="text-sm font-semibold">
                            Number of Test Groups / Arms
                          </Label>
                          <Input
                            id="numberOfGroups"
                            type="number"
                            min="1"
                            value={projectData.experimentDetails?.numberOfGroups}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1
                              setProjectData(prev => ({
                                ...prev,
                                experimentDetails: {
                                  ...prev.experimentDetails,
                                  numberOfGroups: value
                                }
                              }))
                            }}
                            className="bg-background/50 border-border/50 h-11"
                          />
                        </div>
                      </div>

                      {/* Data Collection Frequency */}
                      <div className="space-y-3 mt-6">
                        <Label htmlFor="dataCollectionFrequency" className="text-sm font-semibold">
                          Data Collection Frequency
                        </Label>
                        <Select
                          value={projectData.experimentDetails?.dataCollectionFrequency}
                          onValueChange={(value) => {
                            setProjectData(prev => ({
                              ...prev,
                              experimentDetails: {
                                ...prev.experimentDetails,
                                dataCollectionFrequency: value
                              }
                            }))
                          }}
                        >
                          <SelectTrigger id="dataCollectionFrequency" className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataCollectionFrequencies.map(frequency => (
                              <SelectItem key={frequency} value={frequency}>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  {frequency}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Required Equipment */}
                    <div className="space-y-3 pt-6 border-t border-border/20">
                      <Label htmlFor="equipment" className="text-sm font-semibold">Required Equipment & Resources</Label>
                      <div className="flex gap-3">
                        <Input
                          id="equipment"
                          placeholder="Add required equipment or resource"
                          value={equipmentInput}
                          onChange={(e) => setEquipmentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleEquipmentAdd(equipmentInput)
                            }
                          }}
                          className="bg-background/50 border-border/50 h-11"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEquipmentAdd(equipmentInput)}
                          className="h-11 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add equipment
                      </div>

                      {projectData.requiredEquipment.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {projectData.requiredEquipment.map(equipment => (
                            <Badge key={equipment} variant="outline" className="px-3 py-1 gap-2 bg-orange-50 text-orange-700 border-orange-200">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                              </svg>
                              {equipment}
                              <button
                                type="button"
                                onClick={() => handleEquipmentRemove(equipment)}
                                className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-orange-200"
                                aria-label={`Remove ${equipment}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 space-y-8 pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Document Links */}
                    <div className="space-y-3">
                      <Label htmlFor="documentLink" className="text-sm font-semibold">Document Links & References</Label>
                      <div className="flex gap-3">
                        <Input
                          id="documentLink"
                          placeholder="Add document link or reference"
                          value={documentInput}
                          onChange={(e) => setDocumentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleDocumentAdd(documentInput);
                            }
                          }}
                          className="bg-background/50 border-border/50 h-11"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDocumentAdd(documentInput)}
                          className="h-11 px-6"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add document link
                      </div>
                    </div>

                    {projectData.relatedDocuments.length > 0 && (
                      <div className="space-y-3 mt-6">
                        <h4 className="text-sm font-medium text-muted-foreground">Added Documents</h4>
                        <div className="grid gap-3">
                          {projectData.relatedDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50 border-border/50 hover:bg-muted/50 transition-colors shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline text-primary font-medium"
                                >
                                  {doc.name}
                                </a>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDocumentRemove(doc.id)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </ScrollArea>

            <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border/10 px-8 pb-8 mt-8 w-full bg-background/50">
              <div className="flex items-center">
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (activeTab === "team") setActiveTab("details");
                      else if (activeTab === "research") setActiveTab("team");
                      else if (activeTab === "documents") setActiveTab("research");
                    }}
                    className="gap-2 bg-background border-border/50 shadow-sm hover:shadow-md transition-all h-11 px-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18-6-6 6-6" />
                    </svg>
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeTab !== "documents" ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={() => {
                        if (activeTab === "details") setActiveTab("team");
                        else if (activeTab === "team") setActiveTab("research");
                        else if (activeTab === "research") setActiveTab("documents");
                      }}
                      className="gap-2 shadow-md hover:shadow-lg transition-all h-11 px-8 bg-primary text-primary-foreground"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 py-3 px-8 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/30 transition-all text-base flex items-center justify-center h-11 min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Update Project
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}