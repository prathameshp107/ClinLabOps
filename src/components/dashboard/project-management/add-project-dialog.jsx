"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, FolderPlus, CheckCircle2, X, Info, FileText, Link2, Beaker, Users, Clock, AlertTriangle, FileSpreadsheet } from "lucide-react"
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

// Rich text editor imports
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

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

// Research areas for dropdown
const researchAreas = [
  "Oncology", "Pharmacology", "Toxicology", "Immunology", "Neuroscience",
  "Cardiology", "Microbiology", "Genetics", "Biochemistry", "Cell Biology",
  "Molecular Biology", "Virology", "Endocrinology", "Hematology", "Pathology"
]

// Study types
const studyTypes = ["In vivo", "In vitro", "Ex vivo", "Clinical", "Computational", "Observational"]

// Data collection frequencies
const dataCollectionFrequencies = ["Hourly", "Daily", "Twice Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Custom"]

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
      <div className="w-px h-6 bg-border mx-1"></div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2", editor.isActive('link') ? "bg-muted" : "")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Insert Link</h4>
            <div className="space-y-2">
              <Input
                id="url"
                placeholder="https://example.com"
                className="col-span-3 h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    editor.chain().focus().setLink({ href: e.target.value }).run()
                    e.target.value = ''
                    document.body.click() // Close popover
                  }
                }}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const url = document.getElementById('url').value
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run()
                      document.getElementById('url').value = ''
                      document.body.click() // Close popover
                    }
                  }}
                >
                  Insert
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function AddProjectDialog({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    status: "Not Started",
    priority: "Medium",
    team: [],
    tags: [],
    // New fields
    budget: "",
    confidential: false,
    complexity: 50,
    department: "",
    externalCollaborators: [],
    requiredEquipment: [],
    relatedDocuments: [],
    // Additional new fields
    principalInvestigator: null,
    researchArea: "",
    studyType: "",
    documents: {
      protocol: null,
      ethics: null,
      other: []
    },
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
      [field]: value[0]
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
      // In a real application, you would send the data to your API here
      console.log("Creating new project:", projectData)

      // Simulate successful API call
      setTimeout(() => {
        setIsSubmitting(false)
        onOpenChange(false)

        // Reset form for next time
        setProjectData({
          name: "",
          description: "",
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          status: "Pending",
          priority: "Medium",
          team: [],
          tags: [],
          budget: "",
          confidential: false,
          complexity: 50,
          department: "",
          externalCollaborators: [],
          requiredEquipment: [],
          relatedDocuments: []
        })
        setFormErrors({})
        setActiveTab("details")
        editor?.commands.setContent("")
      }, 1000)
    } catch (error) {
      console.error("Error creating project:", error)
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
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        overlayClassName="fixed inset-0 z-50 bg-black/50 dark:bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="px-1">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="bg-primary/10 p-2 rounded-md">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Create New Project</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80">
              Add a new research project to the system with all necessary details
            </DialogDescription>
          </DialogHeader>
        </motion.div>

        <Tabs
          defaultValue="details"
          className="w-full overflow-hidden mt-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-6 mb-6 p-1 bg-muted/50 backdrop-blur-sm shadow-inner rounded-xl whitespace-normal">
            <TabsTrigger
              value="details"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "details" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Info className={`h-4 w-4 ${activeTab === "details" ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              Basic Details
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "team" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Users className={`h-4 w-4 ${activeTab === "team" ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              Team
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "research" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${activeTab === "research" ? "text-primary" : "text-muted-foreground"}`}>
                  <path d="M10 2v8a2 2 0 0 1-2 2H2" />
                  <path d="M4.271 10.271A10 10 0 1 0 12 4" />
                </svg>
              </motion.div>
              Research
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "documents" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FileText className={`h-4 w-4 ${activeTab === "documents" ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "resources" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Beaker className={`h-4 w-4 ${activeTab === "resources" ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="additional"
              className="flex flex-col items-center gap-1 px-2 py-1 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg whitespace-normal text-center min-w-0 break-words"
            >
              <motion.div
                animate={{ scale: activeTab === "additional" ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${activeTab === "additional" ? "text-primary" : "text-muted-foreground"}`}>
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </motion.div>
              Additional
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <ScrollArea className="pr-4" style={{ height: 'calc(75vh - 180px)' }}>
              <TabsContent value="details" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
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
                            "pl-9 transition-all duration-200 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 shadow-sm",
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

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <div className={cn(
                        "border rounded-md transition-all duration-200 bg-background/50 border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm overflow-hidden",
                        formErrors.description ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                      )}>
                        <EditorMenuBar editor={editor} />
                        <EditorContent
                          editor={editor}
                          className="p-3 min-h-[150px] prose prose-sm max-w-none focus:outline-none"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={projectData.status}
                          onValueChange={(value) => handleSelectChange(value, "status")}
                        >
                          <SelectTrigger id="status" className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={projectData.priority}
                          onValueChange={(value) => handleSelectChange(value, "priority")}
                        >
                          <SelectTrigger id="priority" className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                Low
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                                Medium
                              </div>
                            </SelectItem>
                            <SelectItem value="High">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                                High
                              </div>
                            </SelectItem>
                            <SelectItem value="Critical">
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                                Critical
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {/* Principal Investigator Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="pi" className="text-sm font-medium flex items-center gap-1">
                        Principal Investigator (PI) <span className="text-destructive">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between bg-background/50 border-border/50"
                            id="pi"
                          >
                            {projectData.principalInvestigator ? (
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                  {projectData.principalInvestigator.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span>{projectData.principalInvestigator.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Select Principal Investigator</span>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search users..." />
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup heading="Users">
                              {mockUsers.map(user => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={() => {
                                    setProjectData(prev => ({
                                      ...prev,
                                      principalInvestigator: user
                                    }))
                                  }}
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

                    {/* Team Members Selection */}
                    <div className="space-y-2">
                      <Label>Team Members</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between bg-background/50 border-border/50">
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
                                .filter(user => !projectData.team.some(member => member.id === user.id) &&
                                  (!projectData.principalInvestigator || user.id !== projectData.principalInvestigator.id))
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

                    {/* Rest of team members display code remains the same */}
                    <div className="space-y-2">
                      <Label className={projectData.team.length > 0 ? "" : "sr-only"}>
                        Selected Team Members ({projectData.team.length})
                      </Label>

                      {/* Existing team members display code */}
                      {/* ... existing code ... */}
                    </div>

                    {/* External Collaborators */}
                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="collaborators">External Collaborators / Institutions</Label>
                      <div className="flex gap-2">
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
                          className="bg-background/50 border-border/50"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleCollaboratorAdd(collaboratorInput)}
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
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
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

              <TabsContent value="additional" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
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
                          className="bg-background/50 border-border/50"
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
                        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl text-muted-foreground/70 bg-muted/20">
                          <div className="bg-primary/5 rounded-full p-3 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/80">
                              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                              <path d="M7 7h.01" />
                            </svg>
                          </div>
                          <p className="text-base font-medium mb-1">No tags added yet</p>
                          <p className="text-sm">Add tags to categorize and organize your project</p>
                          <div className="flex flex-wrap gap-2 mt-4 justify-center max-w-xs">
                            {commonTags.slice(0, 5).map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors border-primary/20"
                                onClick={() => handleTagAdd(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="research" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {/* Research Area */}
                    <div className="space-y-2">
                      <Label htmlFor="researchArea" className="text-sm font-medium">
                        Research Area
                      </Label>
                      <Select
                        value={projectData.researchArea}
                        onValueChange={(value) => handleSelectChange(value, "researchArea")}
                      >
                        <SelectTrigger id="researchArea" className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select research area" />
                        </SelectTrigger>
                        <SelectContent>
                          {researchAreas.map(area => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Study Type */}
                    <div className="space-y-2">
                      <Label htmlFor="studyType" className="text-sm font-medium">
                        Study Type
                      </Label>
                      <Select
                        value={projectData.experimentDetails.studyType}
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
                        <SelectTrigger id="studyType" className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select study type" />
                        </SelectTrigger>
                        <SelectContent>
                          {studyTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experiment Details */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-4">Experiment Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Number of Experiments */}
                        <div className="space-y-2">
                          <Label htmlFor="numberOfExperiments" className="text-sm font-medium">
                            Number of Experiments
                          </Label>
                          <Input
                            id="numberOfExperiments"
                            type="number"
                            min="1"
                            value={projectData.experimentDetails.numberOfExperiments}
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>

                        {/* Number of Test Groups */}
                        <div className="space-y-2">
                          <Label htmlFor="numberOfGroups" className="text-sm font-medium">
                            Number of Test Groups / Arms
                          </Label>
                          <Input
                            id="numberOfGroups"
                            type="number"
                            min="1"
                            value={projectData.experimentDetails.numberOfGroups}
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
                            className="bg-background/50 border-border/50"
                          />
                        </div>
                      </div>

                      {/* Data Collection Frequency */}
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="dataCollectionFrequency" className="text-sm font-medium">
                          Data Collection Frequency
                        </Label>
                        <Select
                          value={projectData.experimentDetails.dataCollectionFrequency}
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
                          <SelectTrigger id="dataCollectionFrequency" className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataCollectionFrequencies.map(frequency => (
                              <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {/* Research Area / Study Type */}
                    <div className="space-y-2">
                      <Label htmlFor="researchArea" className="text-sm font-medium">
                        Research Area / Study Type
                      </Label>
                      <Select
                        value={projectData.researchArea}
                        onValueChange={(value) => handleSelectChange(value, "researchArea")}
                      >
                        <SelectTrigger id="researchArea" className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select research area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oncology">Oncology</SelectItem>
                          <SelectItem value="Pharmacology">Pharmacology</SelectItem>
                          <SelectItem value="Toxicology">Toxicology</SelectItem>
                          <SelectItem value="Immunology">Immunology</SelectItem>
                          <SelectItem value="Neuroscience">Neuroscience</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Microbiology">Microbiology</SelectItem>
                          <SelectItem value="Genetics">Genetics</SelectItem>
                          <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                          <SelectItem value="Cell Biology">Cell Biology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experiment Details */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-4">Experiment Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Number of Experiments */}
                        <div className="space-y-2">
                          <Label htmlFor="numberOfExperiments" className="text-sm font-medium">
                            Number of Experiments
                          </Label>
                          <Input
                            id="numberOfExperiments"
                            type="number"
                            min="1"
                            placeholder="1"
                            className="bg-background/50 border-border/50"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              setProjectData(prev => ({
                                ...prev,
                                numberOfExperiments: value
                              }));
                            }}
                          />
                        </div>

                        {/* Number of Test Groups */}
                        <div className="space-y-2">
                          <Label htmlFor="numberOfGroups" className="text-sm font-medium">
                            Number of Test Groups / Arms
                          </Label>
                          <Input
                            id="numberOfGroups"
                            type="number"
                            min="1"
                            placeholder="2"
                            className="bg-background/50 border-border/50"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 2;
                              setProjectData(prev => ({
                                ...prev,
                                numberOfGroups: value
                              }));
                            }}
                          />
                        </div>
                      </div>

                      {/* Data Collection Frequency */}
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="dataCollectionFrequency" className="text-sm font-medium">
                          Data Collection Frequency
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "dataCollectionFrequency")}
                          defaultValue="Weekly"
                        >
                          <SelectTrigger id="dataCollectionFrequency" className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Study Type */}
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="studyType" className="text-sm font-medium">
                          Study Type
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "studyType")}
                          defaultValue="In vitro"
                        >
                          <SelectTrigger id="studyType" className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select study type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In vivo">In vivo</SelectItem>
                            <SelectItem value="In vitro">In vitro</SelectItem>
                            <SelectItem value="Ex vivo">Ex vivo</SelectItem>
                            <SelectItem value="Clinical">Clinical</SelectItem>
                            <SelectItem value="Computational">Computational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Required Equipment */}
                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="equipment">Required Equipment</Label>
                      <div className="flex gap-2">
                        <Input
                          id="equipment"
                          placeholder="Add required equipment"
                          value={equipmentInput}
                          onChange={(e) => setEquipmentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleEquipmentAdd(equipmentInput);
                            }
                          }}
                          className="bg-background/50 border-border/50"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleEquipmentAdd(equipmentInput)}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add equipment
                      </div>
                    </div>

                    {projectData.requiredEquipment.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectData.requiredEquipment.map(equipment => (
                          <Badge key={equipment} variant="outline" className="px-2 py-1 gap-1 bg-blue-50">
                            <Beaker className="h-3 w-3 mr-1" />
                            {equipment}
                            <button
                              type="button"
                              onClick={() => handleEquipmentRemove(equipment)}
                              className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-muted-foreground/20"
                              aria-label={`Remove ${equipment}`}
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

              {/* Documents & Attachments Tab */}
              <TabsContent value="documents" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {/* Protocol Document */}
                    <div className="space-y-2">
                      <Label htmlFor="protocolDoc" className="text-sm font-medium">
                        Protocol Document
                      </Label>
                      <div className="border-2 border-dashed rounded-md p-6 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center text-center">
                          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium">Upload Protocol Document</h3>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">
                            PDF, Word, or other document formats
                          </p>
                          <Input
                            id="protocolDoc"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setProjectData(prev => ({
                                  ...prev,
                                  protocolDocument: e.target.files[0]
                                }));
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('protocolDoc').click()}
                            className="bg-primary/5 hover:bg-primary/10"
                          >
                            Select File
                          </Button>
                        </div>
                        {projectData.protocolDocument && (
                          <div className="mt-4 p-2 bg-primary/5 rounded-md flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm truncate max-w-[200px]">
                                {projectData.protocolDocument.name}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProjectData(prev => ({
                                  ...prev,
                                  protocolDocument: null
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ethics Approval Document */}
                    <div className="space-y-2">
                      <Label htmlFor="ethicsDoc" className="text-sm font-medium">
                        Ethics Approval Document
                      </Label>
                      <div className="border-2 border-dashed rounded-md p-6 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center text-center">
                          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="text-sm font-medium">Upload Ethics Approval</h3>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">
                            PDF, Word, or other document formats
                          </p>
                          <Input
                            id="ethicsDoc"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setProjectData(prev => ({
                                  ...prev,
                                  ethicsDocument: e.target.files[0]
                                }));
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('ethicsDoc').click()}
                            className="bg-primary/5 hover:bg-primary/10"
                          >
                            Select File
                          </Button>
                        </div>
                        {projectData.ethicsDocument && (
                          <div className="mt-4 p-2 bg-primary/5 rounded-md flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm truncate max-w-[200px]">
                                {projectData.ethicsDocument.name}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setProjectData(prev => ({
                                  ...prev,
                                  ethicsDocument: null
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Related Files */}
                    <div className="space-y-2">
                      <Label htmlFor="relatedFiles" className="text-sm font-medium">
                        Related Files (PDFs, Excel, etc.)
                      </Label>
                      <div className="border-2 border-dashed rounded-md p-6 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-2">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M8 13h2" />
                            <path d="M8 17h2" />
                            <path d="M14 13h2" />
                            <path d="M14 17h2" />
                          </svg>
                          <h3 className="text-sm font-medium">Upload Related Files</h3>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">
                            PDF, Excel, Word, or other document formats
                          </p>
                          <Input
                            id="relatedFiles"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const newFiles = Array.from(e.target.files);
                                setProjectData(prev => ({
                                  ...prev,
                                  relatedFiles: [...(prev.relatedFiles || []), ...newFiles]
                                }));
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('relatedFiles').click()}
                            className="bg-primary/5 hover:bg-primary/10"
                          >
                            Select Files
                          </Button>
                        </div>
                        {projectData.relatedFiles && projectData.relatedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {projectData.relatedFiles.map((file, index) => (
                              <div key={index} className="p-2 bg-primary/5 rounded-md flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-primary" />
                                  <span className="text-sm truncate max-w-[200px]">
                                    {file.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setProjectData(prev => ({
                                      ...prev,
                                      relatedFiles: prev.relatedFiles.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Links */}
                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="documentLink">Document Links</Label>
                      <div className="flex gap-2">
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
                          className="bg-background/50 border-border/50"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDocumentAdd(documentInput)}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Press Enter to add document link
                      </div>
                    </div>

                    {projectData.relatedDocuments.length > 0 && (
                      <div className="space-y-2">
                        {projectData.relatedDocuments.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md bg-background/50 border-border/50">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline text-primary"
                              >
                                {doc.name}
                              </a>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDocumentRemove(doc.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </ScrollArea>

            <DialogFooter className="mt-6 gap-2 pb-2">
              <div className="flex items-center mr-auto">
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === "team" ? "details" : "team")}
                    className="gap-2 bg-background/70 border-border/50 shadow-sm hover:shadow transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                  </Button>
                )}
              </div>

              {activeTab !== "additional" ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    onClick={() => setActiveTab(activeTab === "details" ? "team" : "additional")}
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Button>
                </motion.div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="gap-2 shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/80"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Project...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Create Project
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create new project with the specified details</p>
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