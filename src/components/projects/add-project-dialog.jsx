"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, FolderPlus, CheckCircle2, X, Info, FileText, Link2, Beaker, Users, Clock, AlertTriangle, FileSpreadsheet, ArrowRight, Plus, FlaskConical, Layers } from "lucide-react"
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

// Available Principal Investigators
const availablePIs = [
  {
    "id": "pi001",
    "name": "Dr. Sarah Thompson",
    "email": "sarah.thompson@biocorelab.com",
    "department": "Pharmacology",
    "institution": "BioCore Research Institute"
  },
  {
    "id": "pi002",
    "name": "Dr. Emily Davis",
    "email": "Emily.Davis@gmail.com",
    "department": "Biochemistry",
    "institution": "University of Medicine "
  },
  {
    "id": "pi003",
    "name": "Dr. Michael Wilson",
    "email": "Michael.wilson@reval.com",
    "department": "Department of Chemistry",
    "institution": "University of California, San Diego"
  }
]

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
      {editor && (
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
      )}
    </div>
  )
}

export function AddProjectDialog({ open, onOpenChange, onSubmit }) {
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
    // Project category and type fields
    category: "miscellaneous",
    projectType: "", // New field for regulatory project type
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

  // Update editor content when projectData.description changes
  useEffect(() => {
    if (editor && projectData.description !== editor.getHTML()) {
      editor.commands.setContent(projectData.description)
    }
  }, [editor, projectData.description])

  // Focus editor when dialog opens
  useEffect(() => {
    if (open && editor) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        editor.commands.focus()
      }, 100)
    }
  }, [open, editor])

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
      // Create a new project object with all the form data
      const newProject = {
        id: `p${Date.now()}`, // Generate a unique ID
        name: projectData.name,
        description: projectData.description,
        startDate: format(projectData.startDate, 'yyyy-MM-dd'),
        endDate: format(projectData.endDate, 'yyyy-MM-dd'),
        status: projectData.status || "planning",
        priority: projectData.priority || "medium",
        progress: 0,
        isFavorite: false,
        team: [],
        tags: projectData.tags || [],
        category: projectData.category || "miscellaneous",
        // Include projectType for regulatory projects
        ...(projectData.category === "regulatory" && { projectType: projectData.projectType || "" }),
        dependencies: [],
        activityLog: [
          {
            id: `a${Date.now()}`,
            userId: "u1", // Assuming current user
            action: "created",
            timestamp: new Date().toISOString(),
            details: "Project created"
          }
        ]
      }

      console.log("Creating new project:", newProject)

      // Pass the new project to the parent component
      onSubmit(newProject)

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
          status: "planning",
          priority: "medium",
          team: [],
          tags: [],
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
          // Reset project category and type fields
          category: "miscellaneous",
          projectType: "",
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

  // Function to get templates based on project type
  const getTemplatesForType = (type) => {
    const templates = {
      iso: [
        {
          id: "iso-1",
          name: "ISO 10993-1 Biological Evaluation",
          description: "Biological evaluation of medical devices - Part 1: Evaluation and testing within a risk management process",
          tags: ["biocompatibility", "risk-management", "medical-devices"]
        },
        {
          id: "iso-2",
          name: "ISO 14155 Clinical Investigation",
          description: "Clinical investigation of medical devices for human subjects - Good clinical practice",
          tags: ["clinical-trials", "good-clinical-practice", "medical-devices"]
        },
        {
          id: "iso-3",
          name: "ISO 13485 Quality Management",
          description: "Quality management systems - Requirements for regulatory purposes",
          tags: ["quality-systems", "regulatory-compliance", "standards"]
        }
      ],
      oecd: [
        {
          id: "oecd-1",
          name: "OECD Guideline 401",
          description: "Acute Oral Toxicity - Fixed Dose Procedure",
          tags: ["toxicity", "oral-administration", "safety-testing"]
        },
        {
          id: "oecd-2",
          name: "OECD Guideline 402",
          description: "Acute Dermal Toxicity",
          tags: ["toxicity", "dermal-exposure", "safety-testing"]
        },
        {
          id: "oecd-3",
          name: "OECD Guideline 403",
          description: "Acute Inhalation Toxicity",
          tags: ["toxicity", "inhalation-exposure", "safety-testing"]
        }
      ],
      fda: [
        {
          id: "fda-1",
          name: "FDA 21 CFR Part 11",
          description: "Electronic Records and Electronic Signatures",
          tags: ["electronic-records", "digital-signatures", "compliance"]
        },
        {
          id: "fda-2",
          name: "FDA 510(k) Template",
          description: "Premarket Notification for Medical Devices",
          tags: ["medical-devices", "premarket-notification", "regulatory-submission"]
        },
        {
          id: "fda-3",
          name: "FDA IND Application",
          description: "Investigational New Drug Application",
          tags: ["drug-development", "clinical-trials", "regulatory-submission"]
        }
      ],
      ema: [
        {
          id: "ema-1",
          name: "EMA Clinical Trial Application",
          description: "Application for authorization of a clinical trial",
          tags: ["clinical-trials", "authorization", "european-regulations"]
        },
        {
          id: "ema-2",
          name: "EMA Risk Management Plan",
          description: "Pharmacovigilance risk management plan template",
          tags: ["risk-management", "pharmacovigilance", "safety-monitoring"]
        }
      ],
      ich: [
        {
          id: "ich-1",
          name: "ICH E6 (R2) Good Clinical Practice",
          description: "Guideline for good clinical practice in clinical trials",
          tags: ["clinical-trials", "good-clinical-practice", "international-harmonization"]
        },
        {
          id: "ich-2",
          name: "ICH Q7 Active Pharmaceutical Ingredients",
          description: "Good manufacturing practice guidance for active pharmaceutical ingredients",
          tags: ["manufacturing", "quality-control", "pharmaceutical-ingredients"]
        }
      ],
      // Templates for Miscellaneous projects
      miscellaneous: [
        {
          id: "misc-1",
          name: "Pilot Study Template",
          description: "Template for small-scale preliminary studies to evaluate feasibility, time, cost, and potential adverse effects",
          tags: ["pilot-study", "feasibility", "preliminary-research"]
        },
        {
          id: "misc-2",
          name: "Academic Research Template",
          description: "Template for university-based research projects with literature review and methodology sections",
          tags: ["academic", "literature-review", "methodology"]
        },
        {
          id: "misc-3",
          name: "Client-Specific Study Template",
          description: "Template for client-driven research projects with deliverables and milestone tracking",
          tags: ["client-project", "deliverables", "milestones"]
        },
        {
          id: "misc-4",
          name: "Internal Research Template",
          description: "Template for internal company research initiatives with resource allocation and budget tracking",
          tags: ["internal-research", "resource-allocation", "budget-tracking"]
        }
      ]
    };

    // For miscellaneous category, return miscellaneous templates
    if (type === "miscellaneous") {
      return templates.miscellaneous || [];
    }

    // For regulatory categories, return the specific templates
    return templates[type] || [];
  };

  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    // Add template tags to project tags
    const newTags = [...projectData.tags];
    template.tags.forEach(tag => {
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    });

    // Update project name if it's empty
    const newName = projectData.name || template.name;

    // Update description with template description if empty
    const newDescription = projectData.description || `<p><strong>${template.name}</strong></p><p>${template.description}</p>`;

    setProjectData(prev => ({
      ...prev,
      name: newName,
      description: newDescription,
      tags: newTags
    }));

    // Move to next tab
    setActiveTab("team");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[950px] w-[95vw] overflow-hidden p-0 flex flex-col"
        style={{
          height: 'min(90vh, 800px)',
          maxHeight: '90vh'
        }}
      >
        <DialogHeader className="px-4 sm:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 border-b border-border/10 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-foreground">Add New Project</DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
            Create a new research project and assign team members
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="w-full justify-start border-b border-border/10 rounded-none bg-transparent p-0 h-auto mx-4 sm:mx-8 flex-shrink-0">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Project Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <Beaker className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6"
              style={{
                maxHeight: 'calc(90vh - 200px)',
                minHeight: '300px'
              }}
            >
              <TabsContent value="details" className="mt-0 space-y-4 sm:space-y-8 pr-2 sm:pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Project Category Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-sm font-semibold">
                        Project Category
                      </Label>
                      <Select
                        value={projectData.category}
                        onValueChange={(value) => handleSelectChange(value, "category")}
                      >
                        <SelectTrigger id="category" className="bg-background/50 border-border/50 h-11">
                          <SelectValue placeholder="Select project category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="research">
                            <div className="flex items-center gap-2">
                              <FlaskConical className="h-4 w-4 text-blue-500" />
                              Research
                            </div>
                          </SelectItem>
                          <SelectItem value="regulatory">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-amber-500" />
                              Regulatory
                            </div>
                          </SelectItem>
                          <SelectItem value="miscellaneous">
                            <div className="flex items-center gap-2">
                              <Layers className="h-4 w-4 text-purple-500" />
                              Miscellaneous
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        Select the appropriate category for this project:
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li><strong>Research:</strong> Exploratory or proof-of-concept studies</li>
                          <li><strong>Regulatory:</strong> Guideline-driven studies for authority submissions</li>
                          <li><strong>Miscellaneous:</strong> Pilot, academic, or client-specific studies for non-regulatory purposes</li>
                        </ul>
                      </div>
                    </div>

                    {/* Project Type Selection - Show for Regulatory projects, hide for Miscellaneous (but still show templates) */}
                    {projectData.category === "regulatory" && (
                      <div className="space-y-3 pt-4 border-t border-border/20">
                        <Label htmlFor="projectType" className="text-sm font-semibold">
                          Regulatory Project Type
                        </Label>
                        <Select
                          value={projectData.projectType || ""}
                          onValueChange={(value) => handleSelectChange(value, "projectType")}
                        >
                          <SelectTrigger id="projectType" className="bg-background/50 border-border/50 h-11">
                            <SelectValue placeholder="Select regulatory project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iso">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                ISO Standards
                              </div>
                            </SelectItem>
                            <SelectItem value="oecd">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-green-500" />
                                OECD Guidelines
                              </div>
                            </SelectItem>
                            <SelectItem value="fda">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-red-500" />
                                FDA Regulations
                              </div>
                            </SelectItem>
                            <SelectItem value="ema">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-purple-500" />
                                EMA Guidelines
                              </div>
                            </SelectItem>
                            <SelectItem value="ich">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-orange-500" />
                                ICH Guidelines
                              </div>
                            </SelectItem>
                            <SelectItem value="other">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                Other Regulatory Framework
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select the regulatory framework that applies to this project
                        </p>
                      </div>
                    )}

                    {/* Info text for Miscellaneous projects */}
                    {projectData.category === "miscellaneous" && (
                      <div className="space-y-3 pt-4 border-t border-border/20">
                        <Label className="text-sm font-semibold">
                          Miscellaneous Project
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Create pilot, academic, or client-specific studies for non-regulatory purposes.
                          Select a template below to pre-fill project details or continue without a template.
                        </p>
                      </div>
                    )}

                    {/* Predefined Templates - Show for Regulatory projects with a selected type OR for Miscellaneous projects */}
                    {(projectData.category === "regulatory" && projectData.projectType && projectData.projectType !== "other") ||
                      (projectData.category === "miscellaneous") ? (
                      <div className="space-y-3 pt-4">
                        <Label className="text-sm font-semibold">
                          Predefined Templates
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {getTemplatesForType(
                            projectData.category === "regulatory" ? projectData.projectType : "miscellaneous"
                          ).map((template) => (
                            <div
                              key={template.id}
                              className="border rounded-lg p-4 bg-background/50 border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{template.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {template.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Select a template to pre-fill project details, or skip to create a project from scratch.
                        </p>
                      </div>
                    ) : null}

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
                          className="p-4 min-h-[160px] prose prose-sm max-w-none focus:outline-none bg-background [&_*]:outline-none [&_*]:border-none [&_*]:ring-0 [&_*]:selection:bg-primary/10 [&_*]:selection:text-inherit [&_p]:my-0 [&_p]:leading-relaxed"
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
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                  {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                              <SelectItem key={priority} value={priority}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
                        <Input
                          id="department"
                          name="department"
                          value={projectData.department}
                          onChange={handleInputChange}
                          placeholder="e.g., Oncology, Cardiology"
                          className="bg-background/50 border-border/50 h-11"
                        />
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

              <TabsContent value="team" className="mt-0 space-y-4 sm:space-y-8 pr-2 sm:pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Principal Investigator Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="pi" className="text-sm font-semibold flex items-center gap-1">
                        Principal Investigator (PI) <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={projectData.principalInvestigator?.id}
                        onValueChange={(value) => {
                          const selectedPI = availablePIs.find(pi => pi.id === value);
                          setProjectData(prev => ({
                            ...prev,
                            principalInvestigator: selectedPI
                          }))
                        }}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-border/50 h-16">
                          <SelectValue placeholder="Select Principal Investigator">
                            {projectData.principalInvestigator?.name ? (
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                  {projectData.principalInvestigator.name?.split(' ').map(n => n[0]).join('') || 'PI'}
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">{projectData.principalInvestigator.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {projectData.principalInvestigator.department} • {projectData.principalInvestigator.institution}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              "Select Principal Investigator"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {availablePIs.map(pi => (
                            <SelectItem
                              key={pi.id}
                              value={pi.id}
                              className="py-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                  {pi.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">{pi.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {pi.department} • {pi.institution}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

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

              <TabsContent value="research" className="mt-0 space-y-4 sm:space-y-8 pr-2 sm:pr-4">
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
                          <SelectTrigger id="dataCollectionFrequency" className="bg-background/50 border-border/50">
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

              {/* Documents & Attachments Tab */}
              <TabsContent value="documents" className="mt-0 space-y-4 sm:space-y-8 pr-2 sm:pr-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Related Files */}
                    <div className="space-y-2">
                      <Label htmlFor="relatedFiles" className="text-sm font-semibold">
                        Related Files (PDFs, Excel, etc.)
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-6 bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="p-3 rounded-full bg-primary/5 mb-3">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-sm font-semibold mb-1">Upload Related Files</h3>
                          <p className="text-xs text-muted-foreground mb-4">
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
                              <div key={index} className="p-3 bg-primary/5 rounded-md flex items-center justify-between">
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
                    <div className="space-y-3 pt-6 border-t border-border/20">
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
            </div>

            <DialogFooter
              className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/10 px-4 sm:px-8 pb-4 sm:pb-6 bg-background/50 flex-shrink-0"
              style={{ minHeight: '80px' }}
            >
              <div className="flex items-center justify-start">
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (activeTab === "team") setActiveTab("details");
                      else if (activeTab === "research") setActiveTab("team");
                      else if (activeTab === "documents") setActiveTab("research");
                    }}
                    className="gap-2 bg-background border-border/50 shadow-sm hover:shadow-md transition-all h-9 sm:h-11 px-4 sm:px-6 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                      <path d="M15 18-6-6 6-6" />
                    </svg>
                    Back
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                {activeTab !== "documents" ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={() => {
                        if (activeTab === "details") setActiveTab("team");
                        else if (activeTab === "team") setActiveTab("research");
                        else if (activeTab === "research") setActiveTab("documents");
                      }}
                      className="gap-2 shadow-md hover:shadow-lg transition-all h-9 sm:h-11 px-6 sm:px-8 bg-primary text-primary-foreground text-sm sm:text-base"
                    >
                      Continue
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 py-2 sm:py-3 px-6 sm:px-8 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/30 transition-all text-sm sm:text-base flex items-center justify-center h-9 sm:h-11 min-w-[140px] sm:min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Create Project
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