"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Calendar, FolderPlus, CheckCircle2, X, Info, FileText, Link2, Beaker, Users, Clock, AlertTriangle, FileSpreadsheet, ArrowRight, Plus, FlaskConical, Layers, Sparkles, ChevronLeft, ClipboardEdit
} from "lucide-react"

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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { useToast } from "@/components/ui/use-toast"

// Rich text editor imports
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

// Import project service
import { getProjects } from "@/services/projectService"
import { getSettings } from "@/services/settingsService"

import {
  projectStatuses,
  projectPriorities,
  commonTags
} from "@/constants"
import { getUsers } from "@/services/userService"

// Icon mapping
const ICON_COMPONENTS = {
  FlaskConical,
  FileText,
  Layers,
  FolderPlus,
  ClipboardEdit,
  Beaker
}

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
    <div className="flex flex-wrap items-center gap-1 p-1.5 border-b bg-muted/30 rounded-t-lg">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2 rounded-md", editor.isActive('bold') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8" /><path d="M15 20a4 4 0 0 0 0-8H6v8Z" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2 rounded-md", editor.isActive('italic') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2 rounded-md", editor.isActive('underline') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4" /><line x1="4" x2="20" y1="20" y2="20" /></svg>
      </Button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2 rounded-md", editor.isActive('bulletList') ? "bg-muted" : "")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" x2="20" y1="6" y2="6" /><line x1="9" x2="20" y1="12" y2="12" /><line x1="9" x2="20" y1="18" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></svg>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("h-8 px-2 rounded-md", editor.isActive('orderedList') ? "bg-muted" : "")}
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
              className={cn("h-8 px-2 rounded-md", editor.isActive('link') ? "bg-muted" : "")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 rounded-lg">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Insert Link</h4>
              <div className="space-y-3">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  className="col-span-3 h-9"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      editor.chain().focus().setLink({ href: e.target.value }).run()
                      e.target.value = ''
                      document.body.click() // Close popover
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      document.getElementById('url').value = ''
                      document.body.click() // Close popover
                    }}
                  >
                    Cancel
                  </Button>
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
  const { toast } = useToast()
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "Pending",
    priority: "Medium",
    category: "research", // Default to research
    projectType: "", // For regulatory projects
    tags: [],
    assignedTo: [],
    dependencies: [],
    budget: "",
    milestones: [],
    isFavorite: false
  })
  const [projectSettings, setProjectSettings] = useState({
    categories: []
  })
  const [formErrors, setFormErrors] = useState({})
  const [tagInput, setTagInput] = useState("")
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [equipmentInput, setEquipmentInput] = useState("")
  const [documentInput, setDocumentInput] = useState("")
  const [collaboratorInput, setCollaboratorInput] = useState("")
  const scrollAreaRef = useRef(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        // Handle both paginated and non-paginated responses
        const usersArray = Array.isArray(usersData)
          ? usersData
          : (usersData.users || []);
        setUsers(usersArray);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      }
    };

    // Load project settings
    const loadProjectSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings.project) {
          setProjectSettings(settings.project);
          // Set default category to the first available category
          if (settings.project.categories && settings.project.categories.length > 0) {
            setProjectData(prev => ({
              ...prev,
              category: settings.project.categories[0].id
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch project settings:', error);
      }
    };

    if (open) {
      fetchUsers();
      loadProjectSettings();
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

  // Scroll to top and focus editor when dialog opens
  useEffect(() => {
    if (open) {
      // Scroll to top of the dialog content with multiple fallback methods
      const scrollToTop = () => {
        // Method 1: Using ref
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = 0;
          return;
        }

        // Method 2: Query selector for the scrollable area
        const scrollableArea = document.querySelector('[role="dialog"] .overflow-y-auto');
        if (scrollableArea) {
          scrollableArea.scrollTop = 0;
          return;
        }

        // Method 3: Query selector for the specific div with ref
        const dialogScrollArea = document.querySelector('[data-dialog-scroll-area]');
        if (dialogScrollArea) {
          dialogScrollArea.scrollTop = 0;
          return;
        }
      };

      // Try immediately
      scrollToTop();

      // Try after a small delay to ensure DOM is ready
      const timer1 = setTimeout(scrollToTop, 50);

      // Try again after a longer delay for slower renders
      const timer2 = setTimeout(scrollToTop, 200);

      // Focus editor after a small delay to ensure DOM is ready
      if (editor) {
        setTimeout(() => {
          editor.commands.focus();
        }, 100);
      }

      // Cleanup timers
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [open, editor]);

  // Additional scroll to top when details tab is active
  useEffect(() => {
    if (open && activeTab === "details" && scrollAreaRef.current) {
      const timer = setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = 0;
        }
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

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
      // Check for duplicate project names before submitting
      const existingProjects = await getProjects();
      const isDuplicate = existingProjects.some(project =>
        project.name.toLowerCase() === projectData.name.toLowerCase()
      );

      if (isDuplicate) {
        setFormErrors(prev => ({
          ...prev,
          name: "A project with this name already exists. Please choose a different name."
        }));

        // Show toast notification for better visibility
        toast({
          title: "Duplicate Project Name",
          description: "A project with this name already exists. Please choose a different name.",
          variant: "destructive",
        });

        setIsSubmitting(false);
        return;
      }

      // Create a new project object with all the form data
      const newProject = {
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

      // Only close the dialog and reset form on successful submission
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
          department: "",
          externalCollaborators: [],
          requiredEquipment: [],
          relatedDocuments: [],
          // Reset project category and type fields
          category: "miscellaneous",
          projectType: "",
          documents: {
            protocol: null,
            ethics: null,
            other: []
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
    // First check if we have custom templates from settings
    if (projectSettings.categories && projectSettings.categories.length > 0) {
      const category = projectSettings.categories.find(cat => cat.id === type);
      if (category && category.templates && category.templates.length > 0) {
        return category.templates.map(template => ({
          id: template.id,
          name: template.name,
          description: template.description,
          tags: template.tags || [] // Custom templates might not have tags
        }));
      }
    }

    // Fallback to default templates
    const templates = {
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
      ],
      // Templates for Research projects
      research: [
        {
          id: "research-1",
          name: "Basic Research Template",
          description: "Standard research project template",
          tags: ["research", "scientific", "study"]
        },
        {
          id: "research-2",
          name: "Experimental Study Template",
          description: "Controlled experiment template",
          tags: ["experiment", "controlled-study", "methodology"]
        },
        {
          id: "research-3",
          name: "Data Analysis Template",
          description: "Data-driven research template",
          tags: ["data-analysis", "statistics", "research"]
        }
      ]
    };

    // For miscellaneous category, return miscellaneous templates
    if (type === "miscellaneous") {
      return templates.miscellaneous || [];
    }

    // For research category, return research templates
    if (type === "research") {
      return templates.research || [];
    }

    // For regulatory categories, return empty array since we now use sub-types
    return [];
  };

  // New function to get templates for regulatory sub-types
  const getTemplatesForRegulatorySubType = (subTypeId) => {
    // First check if we have custom templates from settings
    if (projectSettings.categories && projectSettings.categories.length > 0) {
      const regulatoryCategory = projectSettings.categories.find(cat => cat.id === "regulatory");
      if (regulatoryCategory && regulatoryCategory.subTypes && regulatoryCategory.subTypes.length > 0) {
        const subType = regulatoryCategory.subTypes.find(st => st.id === subTypeId);
        if (subType && subType.templates && subType.templates.length > 0) {
          return subType.templates.map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            tags: template.tags || [] // Custom templates might not have tags
          }));
        }
      }
    }

    // Fallback to default templates based on sub-type
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
      ]
    };

    return templates[subTypeId] || [];
  };

  // Function to handle template selection
  const handleTemplateSelect = (template) => {
    // Add template tags to project tags
    const newTags = [...projectData.tags];
    if (template.tags && Array.isArray(template.tags)) {
      template.tags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
    }

    // Update project name if it's empty
    let newName = projectData.name || template.name;

    // Update description with template description if empty
    let newDescription = projectData.description;
    if (!newDescription || newDescription === '<p></p>' || newDescription === '<p><br></p>') {
      // Format the description properly for the rich text editor
      newDescription = `<p><strong>${template.name}</strong></p><p>${template.description}</p>`;
    }

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
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/10 flex-shrink-0 bg-gradient-to-r from-background to-background/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <FolderPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Add New Project</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Create a new research project and assign team members
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="w-full justify-start border-b border-border/10 rounded-none bg-transparent p-0 h-auto px-6 flex-shrink-0">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3.5 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3.5 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3.5 font-medium transition-all hover:text-primary/80 text-xs sm:text-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div
              ref={scrollAreaRef}
              data-dialog-scroll-area="true"
              className="flex-1 overflow-y-auto px-6 py-6"
              style={{
                maxHeight: 'calc(90vh - 200px)',
                minHeight: '300px'
              }}
            >
              <TabsContent value="details" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-8">
                    {/* Project Category Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="category" className="text-base font-semibold">
                          Project Category
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select the appropriate category for this project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {projectSettings.categories && projectSettings.categories.length > 0 ? (
                          projectSettings.categories.map((category) => {
                            const IconComponent = ICON_COMPONENTS[category.icon] || FlaskConical;
                            return (
                              <motion.div
                                key={category.id}
                                className={cn(
                                  "border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                                  projectData.category === category.id
                                    ? `${category.borderColor} ${category.bgColor} ring-2 ring-primary/20`
                                    : "border-border/50 bg-background/50 hover:border-primary/30"
                                )}
                                onClick={() => handleSelectChange(category.id, "category")}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2.5 rounded-lg ${category.bgColor}`}>
                                    <IconComponent className={`h-5 w-5 ${category.color}`} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-base">{category.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                      {category.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          // Fallback to default categories if none are loaded
                          <>
                            <motion.div
                              className={cn(
                                "border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                                projectData.category === "research"
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border/50 bg-background/50 hover:border-primary/30"
                              )}
                              onClick={() => handleSelectChange("research", "category")}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-lg bg-blue-500/10">
                                  <FlaskConical className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base">Research</h3>
                                  <p className="text-xs text-muted-foreground mt-1.5">
                                    Exploratory or proof-of-concept studies
                                  </p>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className={cn(
                                "border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                                projectData.category === "regulatory"
                                  ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                                  : "border-border/50 bg-background/50 hover:border-amber-300/50"
                              )}
                              onClick={() => handleSelectChange("regulatory", "category")}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-lg bg-amber-500/10">
                                  <FileText className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base">Regulatory</h3>
                                  <p className="text-xs text-muted-foreground mt-1.5">
                                    Guideline-driven studies for authority submissions
                                  </p>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className={cn(
                                "border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                                projectData.category === "miscellaneous"
                                  ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20"
                                  : "border-border/50 bg-background/50 hover:border-purple-300/50"
                              )}
                              onClick={() => handleSelectChange("miscellaneous", "category")}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-lg bg-purple-500/10">
                                  <Layers className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base">Miscellaneous</h3>
                                  <p className="text-xs text-muted-foreground mt-1.5">
                                    Pilot, academic, or client-specific studies
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Project Type Selection - Show for Regulatory projects, hide for Miscellaneous (but still show templates) */}
                    {projectData.category === "regulatory" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 pt-5 border-t border-border/20"
                      >
                        <Label htmlFor="projectType" className="text-base font-semibold flex items-center gap-1">
                          Regulatory Project Sub-Type
                        </Label>
                        <Select
                          value={projectData.projectType || ""}
                          onValueChange={(value) => handleSelectChange(value, "projectType")}
                        >
                          <SelectTrigger id="projectType" className="bg-background/50 border-border/50 h-12 rounded-lg">
                            <SelectValue placeholder="Select regulatory project sub-type" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Dynamically load sub-types from settings */}
                            {projectSettings.categories && projectSettings.categories.length > 0 ? (
                              (() => {
                                const regulatoryCategory = projectSettings.categories.find(cat => cat.id === "regulatory");
                                return regulatoryCategory && regulatoryCategory.subTypes && regulatoryCategory.subTypes.length > 0 ? (
                                  regulatoryCategory.subTypes.map((subType) => (
                                    <SelectItem key={subType.id} value={subType.id}>
                                      <div className="flex items-center gap-2">
                                        {subType.icon && (
                                          (() => {
                                            const IconComponent = ICON_COMPONENTS[subType.icon] || FileText;
                                            return <IconComponent className={`h-4 w-4 ${subType.color}`} />;
                                          })()
                                        )}
                                        <span className="text-sm">{subType.name}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  // Fallback to default sub-types if no custom sub-types are defined
                                  <>
                                    <SelectItem value="iso">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">ISO Standards</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="oecd">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">OECD Guidelines</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="fda">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-red-500" />
                                        <span className="text-sm">FDA Regulations</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="ema">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm">EMA Guidelines</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="ich">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm">ICH Guidelines</span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="other">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">Other Regulatory Framework</span>
                                      </div>
                                    </SelectItem>
                                  </>
                                );
                              })()
                            ) : (
                              // Fallback to default sub-types if settings are not loaded
                              <>
                                <SelectItem value="iso">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">ISO Standards</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="oecd">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">OECD Guidelines</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="fda">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">FDA Regulations</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="ema">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm">EMA Guidelines</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="ich">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">ICH Guidelines</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="other">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Other Regulatory Framework</span>
                                  </div>
                                </SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    )}

                    {/* Info text for Miscellaneous projects */}
                    {projectData.category === "miscellaneous" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 pt-5 border-t border-border/20"
                      >
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          Miscellaneous Project
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Create pilot, academic, or client-specific studies for non-regulatory purposes.
                          Select a template below to pre-fill project details or continue without a template.
                        </p>
                      </motion.div>
                    )}

                    {/* Predefined Templates - Show for all categories */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 pt-5 border-t border-border/20"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Predefined Templates
                        </Label>
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>

                      {/* Show templates for the selected category */}
                      {projectData.category === "regulatory" ? (
                        // For Regulatory projects, only show templates after sub-type is selected
                        projectData.projectType ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getTemplatesForRegulatorySubType(projectData.projectType).map((template) => (
                              <motion.div
                                key={template.id}
                                className="border rounded-xl p-5 bg-background/50 border-border/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                                onClick={() => handleTemplateSelect(template)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1 p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base">{template.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
                                    {template.tags && template.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {template.tags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-1 bg-primary/5 text-primary border-primary/10">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          // Show message to select a sub-type first
                          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-lg border border-dashed">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Select a Regulatory Sub-Type</h3>
                            <p className="text-muted-foreground max-w-md">
                              Please select a regulatory sub-type above to view available templates for that specific framework.
                            </p>
                          </div>
                        )
                      ) : (
                        // For non-regulatory categories, show templates directly
                        // Show templates for any category that has templates, not just default categories
                        (projectData.category && projectData.category !== "regulatory") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getTemplatesForType(projectData.category).map((template) => (
                              <motion.div
                                key={template.id}
                                className="border rounded-xl p-5 bg-background/50 border-border/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                                onClick={() => handleTemplateSelect(template)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1 p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-base">{template.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
                                    {template.tags && template.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {template.tags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-1 bg-primary/5 text-primary border-primary/10">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )
                      )}

                      {/* Show all categories with their templates if no specific category is selected */}
                      {(!projectData.category) && (
                        <div className="space-y-6">
                          {projectSettings.categories && projectSettings.categories.length > 0 ? (
                            projectSettings.categories.map((category) => (
                              <div key={category.id} className="space-y-3">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                  {category.icon && (
                                    (() => {
                                      const IconComponent = ICON_COMPONENTS[category.icon] || FlaskConical;
                                      return <IconComponent className={`h-5 w-5 ${category.color}`} />;
                                    })()
                                  )}
                                  {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                                {category.templates && category.templates.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.templates.map((template) => (
                                      <motion.div
                                        key={template.id}
                                        className="border rounded-xl p-5 bg-background/50 border-border/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                                        onClick={() => {
                                          // Set the category and select the template
                                          setProjectData(prev => ({
                                            ...prev,
                                            category: category.id
                                          }));
                                          handleTemplateSelect({
                                            id: template.id,
                                            name: template.name,
                                            description: template.description,
                                            tags: template.tags || []
                                          });
                                        }}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="mt-1 p-2 rounded-lg bg-primary/10">
                                            <FileText className="h-5 w-5 text-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-base">{template.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
                                            {template.tags && template.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-2 mt-3">
                                                {template.tags.map((tag) => (
                                                  <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-1 bg-primary/5 text-primary border-primary/10">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">No templates available for this category</p>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {getTemplatesForType("research").map((template) => (
                                <motion.div
                                  key={template.id}
                                  className="border rounded-xl p-5 bg-background/50 border-border/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md"
                                  onClick={() => handleTemplateSelect(template)}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1 p-2 rounded-lg bg-primary/10">
                                      <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-base">{template.name}</h4>
                                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{template.description}</p>
                                      {template.tags && template.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                          {template.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs px-2.5 py-1 bg-primary/5 text-primary border-primary/10">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Select a template to pre-fill project details, or skip to create a project from scratch.
                      </p>
                    </motion.div>

                    <div className="space-y-4 pt-5 border-t border-border/20">
                      <Label htmlFor="name" className="text-base font-semibold flex items-center gap-1">
                        Project Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter project name"
                          value={projectData.name}
                          onChange={handleInputChange}
                          className={cn(
                            "pl-10 h-12 transition-all duration-200 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 shadow-sm rounded-lg",
                            formErrors.name ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                          )}
                        />
                      </div>
                      {formErrors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1.5"
                        >
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>{formErrors.name}</span>
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-base font-semibold flex items-center gap-1">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <div className={cn(
                        "border rounded-lg transition-all duration-200 bg-background/50 border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm overflow-hidden",
                        formErrors.description ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                      )}>
                        <EditorMenuBar editor={editor} />
                        <EditorContent
                          editor={editor}
                          className="p-4 min-h-[180px] prose prose-sm max-w-none focus:outline-none bg-background [&_*]:outline-none [&_*]:border-none [&_*]:ring-0 [&_*]:selection:bg-primary/10 [&_*]:selection:text-inherit [&_p]:my-0 [&_p]:leading-relaxed"
                        />
                      </div>
                      {formErrors.description && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-destructive flex items-center gap-1.5"
                        >
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>{formErrors.description}</span>
                        </motion.p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-4">
                        <Label htmlFor="startDate" className="text-base font-semibold flex items-center gap-1">
                          Start Date <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <DatePicker
                            selectedDate={projectData.startDate}
                            onDateChange={(date) => handleDateChange(date, "startDate")}
                            placeholder="Select start date"
                            className={cn(
                              "pl-10 w-full h-12 rounded-lg",
                              formErrors.startDate ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                            )}
                            showTodayButton={true}
                            showClearButton={false}
                          />
                        </div>
                        {formErrors.startDate && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1.5"
                          >
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>{formErrors.startDate}</span>
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="endDate" className="text-base font-semibold flex items-center gap-1">
                          End Date <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <DatePicker
                            selectedDate={projectData.endDate}
                            onDateChange={(date) => handleDateChange(date, "endDate")}
                            placeholder="Select end date"
                            className={cn(
                              "pl-10 w-full h-12 rounded-lg",
                              formErrors.endDate ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                            )}
                            minDate={projectData.startDate}
                            showTodayButton={true}
                            showClearButton={false}
                          />
                        </div>
                        {formErrors.endDate && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1.5"
                          >
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>{formErrors.endDate}</span>
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/20">
                      {/* Status */}
                      <div className="space-y-4">
                        <Label htmlFor="status" className="text-base font-semibold flex items-center gap-1">
                          Status
                        </Label>
                        <Select
                          value={projectData.status}
                          onValueChange={(value) => handleSelectChange(value, "status")}
                        >
                          <SelectTrigger id="status" className="bg-background/50 border-border/50 h-12 rounded-lg">
                            <SelectValue placeholder="Select project status" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectStatuses.map(status => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  <span className="text-sm">{status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Priority */}
                      <div className="space-y-4">
                        <Label htmlFor="priority" className="text-base font-semibold flex items-center gap-1">
                          Priority
                        </Label>
                        <Select
                          value={projectData.priority}
                          onValueChange={(value) => handleSelectChange(value, "priority")}
                        >
                          <SelectTrigger id="priority" className="bg-background/50 border-border/50 h-12 rounded-lg">
                            <SelectValue placeholder="Select project priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectPriorities.map(priority => (
                              <SelectItem key={priority} value={priority}>
                                <div className="flex items-center gap-2">
                                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  <span className="text-sm">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Department & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/20">
                      {/* Department */}
                      <div className="space-y-4">
                        <Label htmlFor="department" className="text-base font-semibold flex items-center gap-1">
                          Department
                        </Label>
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9.5 9h5L12 12z" />
                          </svg>
                          <Input
                            id="department"
                            name="department"
                            value={projectData.department}
                            onChange={handleInputChange}
                            placeholder="e.g., Oncology, Cardiology"
                            className="pl-10 bg-background/50 border-border/50 h-12 rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="space-y-4">
                        <Label htmlFor="budget" className="text-base font-semibold flex items-center gap-1">
                          Budget (Optional)
                        </Label>
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                          <Input
                            id="budget"
                            name="budget"
                            type="number"
                            value={projectData.budget}
                            onChange={handleInputChange}
                            placeholder="Enter budget amount"
                            className={cn(
                              "pl-10 bg-background/50 border-border/50 h-12 rounded-lg",
                              formErrors.budget ? "border-destructive/50 ring-1 ring-destructive/20" : ""
                            )}
                          />
                        </div>
                        {formErrors.budget && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-destructive flex items-center gap-1.5"
                          >
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>{formErrors.budget}</span>
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-4 pt-6 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Project Tags</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add tags to categorize and organize your project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                            <path d="M7 7h.01" />
                          </svg>
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
                            className="pl-10 bg-background/50 border-border/50 h-12"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleTagAdd(tagInput)}
                          className="h-12 px-6 bg-primary hover:bg-primary/90"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter or click "Add" to add a tag
                      </p>

                      {projectData.tags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-2"
                        >
                          <div className="flex flex-wrap gap-2 mt-4">
                            {projectData.tags.map(tag => (
                              <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Badge variant="secondary" className="px-3 py-1.5 gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                                    <path d="M7 7h.01" />
                                  </svg>
                                  <span className="text-sm">{tag}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleTagRemove(tag)}
                                    className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-primary/30"
                                    aria-label={`Remove ${tag}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
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
                  <div className="space-y-6">
                    {/* Principal Investigator Selection */}
                    <div className="space-y-4">
                      <Label htmlFor="pi" className="text-base font-semibold flex items-center gap-1">
                        Principal Investigator (PI) <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={projectData.principalInvestigator?.id}
                        onValueChange={(value) => {
                          // Find the selected user from the fetched users
                          const selectedUser = users.find(user => (user._id || user.id) === value);
                          const selectedPI = selectedUser || availablePIs.find(pi => pi.id === value);

                          setProjectData(prev => ({
                            ...prev,
                            principalInvestigator: selectedPI ? {
                              id: selectedPI._id || selectedPI.id,
                              name: selectedPI.name || `${selectedPI.firstName || ''} ${selectedPI.lastName || ''}`.trim() || selectedPI.email,
                              email: selectedPI.email,
                              department: selectedPI.department,
                              institution: selectedPI.institution || "Internal User"
                            } : null
                          }))
                        }}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-border/50 h-16 rounded-lg">
                          <SelectValue placeholder="Select Principal Investigator">
                            {projectData.principalInvestigator?.name ? (
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold">
                                  {projectData.principalInvestigator.name?.split(' ').map(n => n[0]).join('') || 'PI'}
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="font-semibold">{projectData.principalInvestigator.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {projectData.principalInvestigator.department || 'N/A'} • {projectData.principalInvestigator.institution || 'Internal User'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              "Select Principal Investigator"
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {/* Section for internal users */}
                          {users.length > 0 && (
                            SelectGroup ? (
                              <SelectGroup>
                                <SelectLabel>Internal Users</SelectLabel>
                                {users.map(user => (
                                  <SelectItem
                                    key={user._id || user.id}
                                    value={user._id || user.id}
                                    className="py-2"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                        {(user.name || user.firstName || 'U').charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {user.department || 'N/A'} • Internal User
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ) : (
                              <>
                                <SelectLabel>Internal Users</SelectLabel>
                                {users.map(user => (
                                  <SelectItem
                                    key={user._id || user.id}
                                    value={user._id || user.id}
                                    className="py-2"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                        {(user.name || user.firstName || 'U').charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {user.department || 'N/A'} • Internal User
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )
                          )}

                          {/* Section for predefined PIs */}
                          {SelectGroup ? (
                            <SelectGroup>
                              <SelectLabel>Predefined Principal Investigators</SelectLabel>
                              {availablePIs.map(pi => (
                                <SelectItem
                                  key={pi.id}
                                  value={pi.id}
                                  className="py-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
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
                            </SelectGroup>
                          ) : (
                            <>
                              <SelectLabel>Predefined Principal Investigators</SelectLabel>
                              {availablePIs.map(pi => (
                                <SelectItem
                                  key={pi.id}
                                  value={pi.id}
                                  className="py-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
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
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Team Members Selection */}
                    <div className="space-y-5 pt-5 border-t border-border/20">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Team Members
                        </Label>
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {projectData?.team?.length} selected
                        </Badge>
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start h-14 border-dashed hover:bg-primary/5 transition-colors">
                            <div className="flex items-center text-muted-foreground">
                              <Plus className="mr-2 h-4 w-4" />
                              <span className="font-medium">Add team member</span>
                              <span className="ml-2 text-xs bg-muted/50 px-2 py-1 rounded-full">
                                {projectData?.team?.length} added
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search for a team member..." className="h-12" />
                            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                              No team members found
                            </CommandEmpty>
                            <CommandGroup heading="Available Team Members" className="p-2">
                              {Array.isArray(users) && users
                                .filter(user => !projectData?.team?.some(member => member.id === (user._id || user.id)))
                                .map(user => (
                                  <CommandItem
                                    key={user._id || user.id}
                                    onSelect={() => handleTeamMemberAdd({
                                      id: user._id || user.id,
                                      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                                      email: user.email,
                                      role: user.roles?.[0] || 'User',
                                      department: user.department || 'N/A'
                                    })}
                                    className="flex items-center justify-between p-3 rounded-lg mx-1 mb-1 hover:bg-primary/5 cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                                        <span className="text-sm font-bold text-primary">
                                          {(user.name || user.firstName || 'U').charAt(0)}
                                        </span>
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">
                                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {user.roles?.[0] || user.department || 'User'}
                                        </p>
                                      </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Display selected team members */}
                      {projectData?.team?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 pt-2"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projectData?.team?.map(member => (
                              <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-semibold truncate">{member.name}</span>
                                    <span className="text-xs text-muted-foreground truncate">
                                      {member.role} • {member.department || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleTeamMemberRemove(member.id)}
                                  className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* External Collaborators */}
                    <div className="space-y-4 pt-6 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="collaborators" className="text-base font-semibold">External Collaborators / Institutions</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add external collaborators or institutions involved in this project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                            className="pl-10 bg-background/50 border-border/50 h-12"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleCollaboratorAdd(collaboratorInput)}
                          className="h-12 px-6 bg-primary hover:bg-primary/90"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter or click "Add" to add a collaborator
                      </p>
                    </div>

                    {projectData?.externalCollaborators?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-2"
                      >
                        <div className="flex flex-wrap gap-2">
                          {projectData?.externalCollaborators?.map(collaborator => (
                            <motion.div
                              key={collaborator}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge variant="outline" className="px-3 py-1.5 gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                <Users className="h-3.5 w-3.5" />
                                <span className="text-sm">{collaborator}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCollaboratorRemove(collaborator)}
                                  className="rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-blue-200"
                                  aria-label={`Remove ${collaborator}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
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
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="relatedFiles" className="text-base font-semibold">
                          Related Files
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Upload PDFs, Excel, Word documents, or other file formats</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="border-2 border-dashed rounded-xl p-8 bg-background/30 border-border/30 hover:border-primary/50 transition-all duration-300 hover:bg-primary/5">
                        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                          <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <FileText className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                          <p className="text-sm text-muted-foreground mb-6">
                            Drag & drop files here or click to browse your device
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
                            className="bg-primary/10 hover:bg-primary/20 border-primary/30 h-12 px-6 text-base font-medium"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Select Files
                          </Button>
                          <p className="text-xs text-muted-foreground mt-3">
                            Supports PDF, DOCX, XLSX, PPTX, and other common formats
                          </p>
                        </div>
                        {projectData?.relatedFiles && projectData?.relatedFiles?.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-border/20">
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Uploaded Files</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                              {projectData?.relatedFiles?.map((file, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 bg-background/80 rounded-lg border border-border/50 flex items-center justify-between group hover:bg-primary/5 transition-colors"
                                >
                                  <div className="flex items-center min-w-0 flex-1">
                                    <div className="p-2 rounded-md bg-primary/10 mr-3 flex-shrink-0">
                                      <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium truncate">{file.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
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
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Links */}
                    <div className="space-y-4 pt-6 border-t border-border/20">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="documentLink" className="text-base font-semibold">Document Links & References</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add links to external documents, websites, or references</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="documentLink"
                            placeholder="https://example.com/document"
                            value={documentInput}
                            onChange={(e) => setDocumentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleDocumentAdd(documentInput);
                              }
                            }}
                            className="pl-10 bg-background/50 border-border/50 h-12"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleDocumentAdd(documentInput)}
                          className="h-12 px-6 bg-primary hover:bg-primary/90"
                        >
                          Add Link
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Press Enter or click "Add Link" to add a document reference
                      </p>
                    </div>

                    {projectData?.relatedDocuments?.length > 0 && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-border/20">
                        <h4 className="text-base font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Added Document Links
                        </h4>
                        <div className="grid gap-3">
                          {projectData?.relatedDocuments?.map(doc => (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="p-2 rounded-md bg-primary/10 flex-shrink-0">
                                  <Link2 className="h-4 w-4 text-primary" />
                                </div>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline text-primary font-medium truncate"
                                >
                                  {doc.name}
                                </a>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDocumentRemove(doc.id)}
                                className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </div>

            <DialogFooter
              className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/10 px-6 pb-6 bg-background/50 flex-shrink-0"
              style={{ minHeight: '80px' }}
            >
              <div className="flex items-center justify-start">
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (activeTab === "team") setActiveTab("details");
                      else if (activeTab === "documents") setActiveTab("team");
                    }}
                    className="gap-2 bg-background border-border/50 shadow-sm hover:shadow-md transition-all h-10 sm:h-12 px-4 sm:px-6 text-sm rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                        else if (activeTab === "team") setActiveTab("documents");
                      }}
                      className="gap-2 shadow-md hover:shadow-lg transition-all h-10 sm:h-12 px-6 sm:px-8 bg-primary text-primary-foreground text-sm sm:text-base rounded-lg"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 py-2 sm:py-3 px-6 sm:px-8 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/30 transition-all text-sm sm:text-base flex items-center justify-center h-10 sm:h-12 min-w-[140px] sm:min-w-[160px]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
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