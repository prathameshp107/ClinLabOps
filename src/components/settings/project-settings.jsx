"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    PlusCircle,
    Edit,
    Trash2,
    FlaskConical,
    FileText,
    Layers,
    FolderPlus,
    ClipboardEdit,
    Search,
    Filter,
    Grid3X3,
    List,
    Palette,
    Hash,
    Tag,
    BookOpen,
    Settings,
    Archive,
    Eye,
    EyeOff,
    ChevronRight,
    ChevronDown,
    File,
    FileSpreadsheet,
    FileTextIcon
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { updateSettings, getSettings } from "@/services/settingsService"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


// Default project categories and templates with regulatory sub-types
const DEFAULT_CATEGORIES = [
    {
        id: "research",
        name: "Research",
        description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
        icon: "FlaskConical",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        keywords: ["research", "exploratory", "proof-of-concept", "scientific", "study", "experiment", "innovation", "discovery", "laboratory", "genomics", "drug-discovery", "ai", "machine-learning"],
        templates: [
            { id: "basic-research", name: "Basic Research", description: "Standard research project template" },
            { id: "experimental", name: "Experimental Study", description: "Controlled experiment template" },
            { id: "data-analysis", name: "Data Analysis", description: "Data-driven research template" }
        ]
    },
    {
        id: "regulatory",
        name: "Regulatory",
        description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
        icon: "FileText",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        keywords: ["regulatory", "iso", "oecd", "fda", "guideline", "compliance", "authority", "submission", "validation", "testing", "environmental", "monitoring", "biomedical", "device-testing", "safety"],
        subTypes: [
            {
                id: "iso",
                name: "ISO Standards",
                description: "International Organization for Standardization standards",
                icon: "FileTextIcon",
                color: "text-blue-600",
                bgColor: "bg-blue-500/10",
                templates: [
                    { id: "iso-10993-1", name: "ISO 10993-1 Biological Evaluation", description: "Biological evaluation of medical devices - Part 1: Evaluation and testing within a risk management process" },
                    { id: "iso-14155", name: "ISO 14155 Clinical Investigation", description: "Clinical investigation of medical devices for human subjects - Good clinical practice" },
                    { id: "iso-13485", name: "ISO 13485 Quality Management", description: "Quality management systems - Requirements for regulatory purposes" }
                ]
            },
            {
                id: "oecd",
                name: "OECD Guidelines",
                description: "Organisation for Economic Co-operation and Development guidelines",
                icon: "FileSpreadsheet",
                color: "text-green-600",
                bgColor: "bg-green-500/10",
                templates: [
                    { id: "oecd-401", name: "OECD Guideline 401", description: "Acute Oral Toxicity - Fixed Dose Procedure" },
                    { id: "oecd-402", name: "OECD Guideline 402", description: "Acute Dermal Toxicity" },
                    { id: "oecd-403", name: "OECD Guideline 403", description: "Acute Inhalation Toxicity" }
                ]
            },
            {
                id: "fda",
                name: "FDA Regulations",
                description: "U.S. Food and Drug Administration regulations",
                icon: "FileTextIcon",
                color: "text-red-600",
                bgColor: "bg-red-500/10",
                templates: [
                    { id: "fda-21-cfr-11", name: "FDA 21 CFR Part 11", description: "Electronic Records and Electronic Signatures" },
                    { id: "fda-510k", name: "FDA 510(k) Template", description: "Premarket Notification for Medical Devices" },
                    { id: "fda-ind", name: "FDA IND Application", description: "Investigational New Drug Application" }
                ]
            },
            {
                id: "ema",
                name: "EMA Guidelines",
                description: "European Medicines Agency guidelines",
                icon: "FileTextIcon",
                color: "text-purple-600",
                bgColor: "bg-purple-500/10",
                templates: [
                    { id: "ema-cta", name: "EMA Clinical Trial Application", description: "Application for authorization of a clinical trial" },
                    { id: "ema-rmp", name: "EMA Risk Management Plan", description: "Pharmacovigilance risk management plan template" }
                ]
            },
            {
                id: "ich",
                name: "ICH Guidelines",
                description: "International Council for Harmonisation guidelines",
                icon: "FileTextIcon",
                color: "text-indigo-600",
                bgColor: "bg-indigo-500/10",
                templates: [
                    { id: "ich-e6", name: "ICH E6 (R2) Good Clinical Practice", description: "Guideline for good clinical practice in clinical trials" },
                    { id: "ich-q7", name: "ICH Q7 Active Pharmaceutical Ingredients", description: "Good manufacturing practice guidance for active pharmaceutical ingredients" }
                ]
            }
        ],
        templates: [] // Regulatory category templates (if any)
    },
    {
        id: "miscellaneous",
        name: "Miscellaneous",
        description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
        icon: "Layers",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        keywords: ["pilot", "academic", "client", "miscellaneous", "other", "general", "management", "platform", "system"],
        templates: [
            { id: "pilot", name: "Pilot Study", description: "Small-scale preliminary study template" },
            { id: "academic", name: "Academic Research", description: "University research project template" },
            { id: "consulting", name: "Consulting Project", description: "Client consulting project template" }
        ]
    }
]

const ICON_OPTIONS = [
    { value: "FlaskConical", label: "Flask", icon: FlaskConical },
    { value: "FileText", label: "Document", icon: FileText },
    { value: "FileTextIcon", label: "File Text", icon: FileTextIcon },
    { value: "FileSpreadsheet", label: "Spreadsheet", icon: FileSpreadsheet },
    { value: "Layers", label: "Layers", icon: Layers },
    { value: "FolderPlus", label: "Folder", icon: FolderPlus },
    { value: "ClipboardEdit", label: "Clipboard", icon: ClipboardEdit },
    { value: "BookOpen", label: "Book", icon: BookOpen },
    { value: "Settings", label: "Settings", icon: Settings },
    { value: "Archive", label: "Archive", icon: Archive }
]

export function ProjectSettings({ settings, onSettingsChange, onSave }) {
    const [projectSettings, setProjectSettings] = useState({
        categories: DEFAULT_CATEGORIES,
        templates: []
    })
    const [editingCategory, setEditingCategory] = useState(null)
    const [editingSubType, setEditingSubType] = useState(null)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [isSubTypeDialogOpen, setIsSubTypeDialogOpen] = useState(false)
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterSubType, setFilterSubType] = useState("all")
    const [openSubTypes, setOpenSubTypes] = useState({})
    const { toast } = useToast()

    useEffect(() => {
        if (settings.project) {
            setProjectSettings(settings.project)
        }
    }, [settings])

    const handleSaveSettings = async () => {
        try {
            await updateSettings('project', projectSettings)
            onSettingsChange(projectSettings)
            onSave(projectSettings)
            toast({
                title: "Settings saved",
                description: "Project settings have been updated successfully.",
            })
        } catch (error) {
            console.error('Error saving project settings:', error)
            toast({
                title: "Error",
                description: "Failed to save project settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleAddCategory = () => {
        setEditingCategory({
            id: "",
            name: "",
            description: "",
            icon: "FlaskConical",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            keywords: [],
            templates: [],
            subTypes: []
        })
        setIsCategoryDialogOpen(true)
    }

    const handleEditCategory = (category) => {
        setEditingCategory({ ...category })
        setIsCategoryDialogOpen(true)
    }

    const handleDeleteCategory = (categoryId) => {
        // Prevent deletion of default categories
        const defaultCategoryIds = DEFAULT_CATEGORIES.map(cat => cat.id)
        if (defaultCategoryIds.includes(categoryId)) {
            toast({
                title: "Cannot delete",
                description: "Default categories cannot be deleted.",
                variant: "destructive",
            })
            return
        }

        const updatedCategories = projectSettings.categories.filter(cat => cat.id !== categoryId)
        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })
    }

    const handleSaveCategory = () => {
        if (!editingCategory.name.trim()) {
            toast({
                title: "Validation error",
                description: "Category name is required.",
                variant: "destructive",
            })
            return
        }

        const updatedCategories = [...projectSettings.categories]
        const existingIndex = updatedCategories.findIndex(cat => cat.id === editingCategory.id)

        if (existingIndex >= 0) {
            // Update existing category
            updatedCategories[existingIndex] = editingCategory
        } else {
            // Add new category
            const newCategory = {
                ...editingCategory,
                id: editingCategory.id || editingCategory.name.toLowerCase().replace(/\s+/g, '-')
            }
            updatedCategories.push(newCategory)
        }

        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })

        setIsCategoryDialogOpen(false)
        setEditingCategory(null)
    }

    const handleAddSubType = (categoryId) => {
        setEditingSubType({
            id: "",
            name: "",
            description: "",
            icon: "FileTextIcon",
            color: "text-blue-600",
            bgColor: "bg-blue-500/10",
            templates: [],
            categoryId: categoryId
        })
        setIsSubTypeDialogOpen(true)
    }

    const handleEditSubType = (subType, categoryId) => {
        setEditingSubType({ ...subType, categoryId })
        setIsSubTypeDialogOpen(true)
    }

    const handleDeleteSubType = (subTypeId, categoryId) => {
        const updatedCategories = projectSettings.categories.map(category => {
            if (category.id === categoryId && category.subTypes) {
                const updatedSubTypes = category.subTypes.filter(st => st.id !== subTypeId)
                return { ...category, subTypes: updatedSubTypes }
            }
            return category
        })

        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })
    }

    const handleSaveSubType = () => {
        if (!editingSubType.name.trim() || !editingSubType.categoryId) {
            toast({
                title: "Validation error",
                description: "Sub-type name and category are required.",
                variant: "destructive",
            })
            return
        }

        const updatedCategories = [...projectSettings.categories]
        const categoryIndex = updatedCategories.findIndex(cat => cat.id === editingSubType.categoryId)

        if (categoryIndex >= 0) {
            const category = updatedCategories[categoryIndex]
            let updatedSubTypes = [...(category.subTypes || [])]
            const existingIndex = updatedSubTypes.findIndex(st => st.id === editingSubType.id)

            if (existingIndex >= 0) {
                // Update existing sub-type
                updatedSubTypes[existingIndex] = editingSubType
            } else {
                // Add new sub-type
                const newSubType = {
                    ...editingSubType,
                    id: editingSubType.id || `${editingSubType.categoryId}-${editingSubType.name.toLowerCase().replace(/\s+/g, '-')}`
                }
                updatedSubTypes.push(newSubType)
            }

            updatedCategories[categoryIndex] = { ...category, subTypes: updatedSubTypes }
        }

        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })

        setIsSubTypeDialogOpen(false)
        setEditingSubType(null)
    }

    const handleAddTemplate = (categoryId, subTypeId = null) => {
        setEditingTemplate({
            id: "",
            name: "",
            description: "",
            categoryId: categoryId,
            subTypeId: subTypeId || ""
        })
        setIsTemplateDialogOpen(true)
    }

    const handleEditTemplate = (template) => {
        setEditingTemplate({ ...template })
        setIsTemplateDialogOpen(true)
    }

    const handleDeleteTemplate = (templateId) => {
        const updatedCategories = projectSettings.categories.map(category => {
            // Check if template is in category templates
            if (category.templates) {
                const updatedTemplates = category.templates.filter(t => t.id !== templateId)
                category = { ...category, templates: updatedTemplates }
            }

            // Check if template is in sub-type templates
            if (category.subTypes) {
                const updatedSubTypes = category.subTypes.map(subType => {
                    if (subType.templates) {
                        const updatedTemplates = subType.templates.filter(t => t.id !== templateId)
                        return { ...subType, templates: updatedTemplates }
                    }
                    return subType
                })
                category = { ...category, subTypes: updatedSubTypes }
            }

            return category
        })

        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })
    }

    const handleSaveTemplate = () => {
        if (!editingTemplate.name.trim() || !editingTemplate.categoryId) {
            toast({
                title: "Validation error",
                description: "Template name and category are required.",
                variant: "destructive",
            })
            return
        }

        const updatedCategories = [...projectSettings.categories]
        const categoryIndex = updatedCategories.findIndex(cat => cat.id === editingTemplate.categoryId)

        if (categoryIndex >= 0) {
            const category = updatedCategories[categoryIndex]

            if (editingTemplate.subTypeId) {
                // Template belongs to a sub-type
                if (category.subTypes) {
                    const subTypeIndex = category.subTypes.findIndex(st => st.id === editingTemplate.subTypeId)
                    if (subTypeIndex >= 0) {
                        const subType = category.subTypes[subTypeIndex]
                        const updatedTemplates = [...(subType.templates || [])]
                        const existingIndex = updatedTemplates.findIndex(t => t.id === editingTemplate.id)

                        if (existingIndex >= 0) {
                            // Update existing template
                            updatedTemplates[existingIndex] = editingTemplate
                        } else {
                            // Add new template
                            const newTemplate = {
                                ...editingTemplate,
                                id: editingTemplate.id || `${editingTemplate.subTypeId}-${editingTemplate.name.toLowerCase().replace(/\s+/g, '-')}`
                            }
                            updatedTemplates.push(newTemplate)
                        }

                        const updatedSubTypes = [...category.subTypes]
                        updatedSubTypes[subTypeIndex] = { ...subType, templates: updatedTemplates }
                        updatedCategories[categoryIndex] = { ...category, subTypes: updatedSubTypes }
                    }
                }
            } else {
                // Template belongs to category directly
                const updatedTemplates = [...(category.templates || [])]
                const existingIndex = updatedTemplates.findIndex(t => t.id === editingTemplate.id)

                if (existingIndex >= 0) {
                    // Update existing template
                    updatedTemplates[existingIndex] = editingTemplate
                } else {
                    // Add new template
                    const newTemplate = {
                        ...editingTemplate,
                        id: editingTemplate.id || `${editingTemplate.categoryId}-${editingTemplate.name.toLowerCase().replace(/\s+/g, '-')}`
                    }
                    updatedTemplates.push(newTemplate)
                }

                updatedCategories[categoryIndex] = { ...category, templates: updatedTemplates }
            }
        }

        setProjectSettings({
            ...projectSettings,
            categories: updatedCategories
        })

        setIsTemplateDialogOpen(false)
        setEditingTemplate(null)
    }

    const handleKeywordChange = (keywordsString) => {
        const keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k)
        setEditingCategory({
            ...editingCategory,
            keywords
        })
    }

    const toggleSubType = (subTypeId) => {
        setOpenSubTypes(prev => ({
            ...prev,
            [subTypeId]: !prev[subTypeId]
        }))
    }

    // Filter categories based on search term
    const filteredCategories = projectSettings.categories.filter(category => {
        if (!searchTerm) return true
        const term = searchTerm.toLowerCase()
        return (
            category.name.toLowerCase().includes(term) ||
            category.description.toLowerCase().includes(term) ||
            category.keywords.some(keyword => keyword.toLowerCase().includes(term)) ||
            (category.subTypes && category.subTypes.some(subType =>
                subType.name.toLowerCase().includes(term) ||
                subType.description.toLowerCase().includes(term)
            )) ||
            (category.templates && category.templates.some(template =>
                template.name.toLowerCase().includes(term) ||
                template.description.toLowerCase().includes(term)
            )) ||
            (category.subTypes && category.subTypes.some(subType =>
                subType.templates && subType.templates.some(template =>
                    template.name.toLowerCase().includes(term) ||
                    template.description.toLowerCase().includes(term)
                )
            ))
        )
    })

    // Get all templates for filtering
    const getAllTemplates = () => {
        const templates = []
        projectSettings.categories.forEach(category => {
            // Add category templates
            if (category.templates) {
                category.templates.forEach(template => {
                    templates.push({
                        ...template,
                        category: category.name,
                        categoryId: category.id,
                        subType: null,
                        subTypeId: null,
                        icon: category.icon,
                        color: category.color
                    })
                })
            }

            // Add sub-type templates
            if (category.subTypes) {
                category.subTypes.forEach(subType => {
                    if (subType.templates) {
                        subType.templates.forEach(template => {
                            templates.push({
                                ...template,
                                category: category.name,
                                categoryId: category.id,
                                subType: subType.name,
                                subTypeId: subType.id,
                                icon: subType.icon || category.icon,
                                color: subType.color || category.color
                            })
                        })
                    }
                })
            }
        })
        return templates
    }

    // Filter templates based on search term, category filter, and sub-type filter
    const filteredTemplates = getAllTemplates().filter(template => {
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            if (!(template.name.toLowerCase().includes(term) ||
                template.description.toLowerCase().includes(term) ||
                template.category.toLowerCase().includes(term) ||
                (template.subType && template.subType.toLowerCase().includes(term)))) {
                return false
            }
        }

        // Apply category filter
        if (filterCategory !== "all" && template.categoryId !== filterCategory) {
            return false
        }

        // Apply sub-type filter
        if (filterSubType !== "all" && template.subTypeId !== filterSubType) {
            return false
        }

        return true
    })

    return (
        <div className="space-y-6">
            {/* Header with search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Project Configuration</h2>
                    <p className="text-muted-foreground">
                        Customize project categories, sub-types, and templates for your organization
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories, sub-types, and templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <FolderPlus className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <p className="text-2xl font-bold">{projectSettings.categories.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/10">
                                <FileText className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sub-Types</p>
                                <p className="text-2xl font-bold">
                                    {projectSettings.categories.reduce((total, category) =>
                                        total + (category.subTypes ? category.subTypes.length : 0), 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                                <BookOpen className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Templates</p>
                                <p className="text-2xl font-bold">
                                    {projectSettings.categories.reduce((total, category) => {
                                        let count = category.templates ? category.templates.length : 0
                                        if (category.subTypes) {
                                            count += category.subTypes.reduce((subTotal, subType) =>
                                                subTotal + (subType.templates ? subType.templates.length : 0), 0)
                                        }
                                        return total + count
                                    }, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/10">
                                <Tag className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Keywords</p>
                                <p className="text-2xl font-bold">
                                    {projectSettings.categories.reduce((total, category) => total + category.keywords.length, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FolderPlus className="h-5 w-5" />
                                Project Categories
                            </CardTitle>
                            <CardDescription>
                                Define project categories and their associated sub-types and templates
                            </CardDescription>
                        </div>
                        <Button onClick={handleAddCategory} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredCategories.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Category</TableHead>
                                        <TableHead className="w-[300px]">Description</TableHead>
                                        <TableHead className="w-[100px] text-center">Sub-Types</TableHead>
                                        <TableHead className="w-[100px] text-center">Templates</TableHead>
                                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value={category.id} className="border-b">
                                                    <TableRow className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                                                    {category.icon && (
                                                                        (() => {
                                                                            const IconComponent = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || FlaskConical
                                                                            return <IconComponent className={`h-5 w-5 ${category.color}`} />
                                                                        })()
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        {category.name}
                                                                        {DEFAULT_CATEGORIES.some(cat => cat.id === category.id) && (
                                                                            <Badge variant="secondary" className="text-xs">
                                                                                Default
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        {category.keywords.length} keywords
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-md">
                                                                <p className="text-sm line-clamp-2">{category.description}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline" className="gap-1">
                                                                <FileText className="h-3 w-3" />
                                                                {category.subTypes ? category.subTypes.length : 0}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline" className="gap-1">
                                                                <BookOpen className="h-3 w-3" />
                                                                {category.templates ? category.templates.length : 0}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleEditCategory(category)}
                                                                            >
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Edit Category</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleDeleteCategory(category.id)}
                                                                                disabled={DEFAULT_CATEGORIES.some(cat => cat.id === category.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Delete Category</TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    {/* Sub-types and templates for this category */}
                                                    {(category.subTypes && category.subTypes.length > 0) || (category.templates && category.templates.length > 0) ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="p-0 bg-muted/5">
                                                                <AccordionContent className="p-4">
                                                                    <div className="ml-8 space-y-4">
                                                                        {category.subTypes && category.subTypes.length > 0 && (
                                                                            <>
                                                                                <div className="flex items-center justify-between">
                                                                                    <h4 className="font-medium text-sm">Sub-Types</h4>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => handleAddSubType(category.id)}
                                                                                        className="gap-1"
                                                                                    >
                                                                                        <PlusCircle className="h-3 w-3" />
                                                                                        Add Sub-Type
                                                                                    </Button>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                    {category.subTypes.map((subType) => (
                                                                                        <Card key={subType.id} className="border border-muted">
                                                                                            <CardHeader className="p-4">
                                                                                                <div className="flex items-start justify-between">
                                                                                                    <div className="flex items-center gap-2">
                                                                                                        <div className={`p-1.5 rounded-md ${subType.bgColor}`}>
                                                                                                            {subType.icon && (
                                                                                                                (() => {
                                                                                                                    const IconComponent = ICON_OPTIONS.find(opt => opt.value === subType.icon)?.icon || FileText
                                                                                                                    return <IconComponent className={`h-4 w-4 ${subType.color}`} />
                                                                                                                })()
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div>
                                                                                                            <CardTitle className="text-sm font-medium">{subType.name}</CardTitle>
                                                                                                            <CardDescription className="text-xs mt-1 line-clamp-2">
                                                                                                                {subType.description}
                                                                                                            </CardDescription>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex gap-1">
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="icon"
                                                                                                            className="h-6 w-6"
                                                                                                            onClick={() => handleEditSubType(subType, category.id)}
                                                                                                        >
                                                                                                            <Edit className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="icon"
                                                                                                            className="h-6 w-6"
                                                                                                            onClick={() => handleDeleteSubType(subType.id, category.id)}
                                                                                                        >
                                                                                                            <Trash2 className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </CardHeader>
                                                                                            <CardContent className="p-4 pt-0">
                                                                                                <div className="flex items-center justify-between">
                                                                                                    <Badge variant="secondary" className="text-xs gap-1">
                                                                                                        <BookOpen className="h-3 w-3" />
                                                                                                        {subType.templates ? subType.templates.length : 0} templates
                                                                                                    </Badge>
                                                                                                    <Button
                                                                                                        variant="outline"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleAddTemplate(category.id, subType.id)}
                                                                                                        className="h-7 text-xs gap-1"
                                                                                                    >
                                                                                                        <PlusCircle className="h-3 w-3" />
                                                                                                        Add Template
                                                                                                    </Button>
                                                                                                </div>
                                                                                                {subType.templates && subType.templates.length > 0 && (
                                                                                                    <div className="mt-3 space-y-2">
                                                                                                        <h5 className="text-xs font-medium text-muted-foreground">Templates:</h5>
                                                                                                        <div className="space-y-1">
                                                                                                            {subType.templates.map((template) => (
                                                                                                                <div key={template.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                                                                                                                    <span className="truncate">{template.name}</span>
                                                                                                                    <div className="flex gap-1">
                                                                                                                        <Button
                                                                                                                            variant="ghost"
                                                                                                                            size="icon"
                                                                                                                            className="h-5 w-5"
                                                                                                                            onClick={() => handleEditTemplate({ ...template, categoryId: category.id, subTypeId: subType.id })}
                                                                                                                        >
                                                                                                                            <Edit className="h-2.5 w-2.5" />
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                            variant="ghost"
                                                                                                                            size="icon"
                                                                                                                            className="h-5 w-5"
                                                                                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                                                                                        >
                                                                                                                            <Trash2 className="h-2.5 w-2.5" />
                                                                                                                        </Button>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    ))}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        {/* Direct templates for this category */}
                                                                        {category.templates && category.templates.length > 0 && (
                                                                            <>
                                                                                <div className="flex items-center justify-between mt-6">
                                                                                    <h4 className="font-medium text-sm">Category Templates</h4>
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => handleAddTemplate(category.id)}
                                                                                        className="gap-1"
                                                                                    >
                                                                                        <PlusCircle className="h-3 w-3" />
                                                                                        Add Template
                                                                                    </Button>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                    {category.templates.map((template) => (
                                                                                        <Card key={template.id} className="border border-muted">
                                                                                            <CardContent className="p-4">
                                                                                                <div className="flex items-start justify-between">
                                                                                                    <div>
                                                                                                        <h5 className="font-medium text-sm">{template.name}</h5>
                                                                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                                                            {template.description}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                    <div className="flex gap-1">
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="icon"
                                                                                                            className="h-6 w-6"
                                                                                                            onClick={() => handleEditTemplate({ ...template, categoryId: category.id })}
                                                                                                        >
                                                                                                            <Edit className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            size="icon"
                                                                                                            className="h-6 w-6"
                                                                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                                                                        >
                                                                                                            <Trash2 className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </CardContent>
                                                                                        </Card>
                                                                                    ))}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </AccordionContent>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : null}
                                                </AccordionItem>
                                            </Accordion>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? "No categories match your search." : "Get started by adding a new category."}
                            </p>
                            <Button onClick={handleAddCategory} className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Category
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Sub-Types Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Regulatory Sub-Types
                            </CardTitle>
                            <CardDescription>
                                Manage sub-types for regulatory projects and their templates
                            </CardDescription>
                        </div>
                        <Button onClick={() => handleAddSubType("regulatory")} className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Sub-Type
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {projectSettings.categories.filter(cat => cat.id === "regulatory" && cat.subTypes && cat.subTypes.length > 0).length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Sub-Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[100px] text-center">Templates</TableHead>
                                        <TableHead className="w-[120px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projectSettings.categories
                                        .filter(cat => cat.id === "regulatory")
                                        .flatMap(cat => cat.subTypes || [])
                                        .map((subType) => (
                                            <TableRow key={subType.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${subType.bgColor}`}>
                                                            {subType.icon && (
                                                                (() => {
                                                                    const IconComponent = ICON_OPTIONS.find(opt => opt.value === subType.icon)?.icon || FileText
                                                                    return <IconComponent className={`h-5 w-5 ${subType.color}`} />
                                                                })()
                                                            )}
                                                        </div>
                                                        <span>{subType.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-md">
                                                        <p className="text-sm line-clamp-2">{subType.description}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="gap-1">
                                                        <BookOpen className="h-3 w-3" />
                                                        {subType.templates ? subType.templates.length : 0}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEditSubType(subType, "regulatory")}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Edit Sub-Type</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteSubType(subType.id, "regulatory")}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Delete Sub-Type</TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No sub-types found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by adding a new regulatory sub-type.
                            </p>
                            <Button onClick={() => handleAddSubType("regulatory")} className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Sub-Type
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                All Templates
                            </CardTitle>
                            <CardDescription>
                                Manage all project templates across categories and sub-types
                            </CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {projectSettings.categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <div className="flex items-center gap-2">
                                                {category.icon && (
                                                    (() => {
                                                        const IconComponent = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || FlaskConical
                                                        return <IconComponent className={`h-4 w-4 ${category.color}`} />
                                                    })()
                                                )}
                                                {category.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterSubType} onValueChange={setFilterSubType}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by sub-type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sub-Types</SelectItem>
                                    {projectSettings.categories
                                        .filter(category => filterCategory === "all" || category.id === filterCategory)
                                        .flatMap(category =>
                                            category.subTypes ? category.subTypes.map(subType => ({
                                                ...subType,
                                                categoryId: category.id,
                                                categoryName: category.name
                                            })) : []
                                        )
                                        .map((subType) => (
                                            <SelectItem key={subType.id} value={subType.id}>
                                                <div className="flex items-center gap-2">
                                                    {subType.icon && (
                                                        (() => {
                                                            const IconComponent = ICON_OPTIONS.find(opt => opt.value === subType.icon)?.icon || FileText
                                                            return <IconComponent className={`h-4 w-4 ${subType.color}`} />
                                                        })()
                                                    )}
                                                    {subType.categoryName} → {subType.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={() => handleAddTemplate(projectSettings.categories[0]?.id || "")} className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Template
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredTemplates.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">Template</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[200px]">Location</TableHead>
                                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTemplates.map((template) => (
                                        <TableRow key={template.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${template.bgColor || 'bg-muted/10'}`}>
                                                        {template.icon && (
                                                            (() => {
                                                                const IconComponent = ICON_OPTIONS.find(opt => opt.value === template.icon)?.icon || BookOpen
                                                                return <IconComponent className={`h-5 w-5 ${template.color || 'text-muted-foreground'}`} />
                                                            })()
                                                        )}
                                                    </div>
                                                    <span>{template.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-md">
                                                    <p className="text-sm line-clamp-2">{template.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        {template.icon && (
                                                            (() => {
                                                                const category = projectSettings.categories.find(cat => cat.id === template.categoryId)
                                                                if (category) {
                                                                    const IconComponent = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || FlaskConical
                                                                    return <IconComponent className={`h-4 w-4 ${category.color}`} />
                                                                }
                                                            })()
                                                        )}
                                                        <span className="text-sm">{template.category}</span>
                                                    </div>
                                                    {template.subType && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6 mt-1">
                                                            <ChevronRight className="h-3 w-3" />
                                                            <span>{template.subType}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditTemplate(template)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit Template</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Delete Template</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || filterCategory !== "all" || filterSubType !== "all"
                                    ? "No templates match your filters."
                                    : "Get started by adding a new template."}
                            </p>
                            <Button onClick={() => handleAddTemplate(projectSettings.categories[0]?.id || "")} className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Add Template
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSaveSettings} size="lg" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Save Project Settings
                </Button>
            </div>

            {/* Enhanced Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {editingCategory?.id ? (
                                <>
                                    <Edit className="h-5 w-5" />
                                    Edit Category
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-5 w-5" />
                                    Add Category
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory?.id
                                ? "Modify the category details below"
                                : "Create a new project category"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        {editingCategory && (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="category-name" className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Name
                                        </Label>
                                        <Input
                                            id="category-name"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                            placeholder="Category name"
                                            className="h-10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category-icon" className="flex items-center gap-2">
                                            <Palette className="h-4 w-4" />
                                            Icon
                                        </Label>
                                        <Select
                                            value={editingCategory.icon}
                                            onValueChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select an icon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ICON_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <option.icon className="h-4 w-4" />
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category-description" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="category-description"
                                        value={editingCategory.description}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                        placeholder="Category description"
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category-keywords" className="flex items-center gap-2">
                                        <Hash className="h-4 w-4" />
                                        Keywords
                                    </Label>
                                    <Textarea
                                        id="category-keywords"
                                        value={editingCategory.keywords.join(', ')}
                                        onChange={(e) => handleKeywordChange(e.target.value)}
                                        placeholder="Enter keywords separated by commas (e.g., research, study, experiment)"
                                        className="min-h-[80px]"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Keywords help automatically categorize projects. Enter relevant terms separated by commas.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Label>
                                    <Card className="border-dashed">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-lg ${editingCategory.bgColor}`}>
                                                    {editingCategory.icon && (
                                                        (() => {
                                                            const IconComponent = ICON_OPTIONS.find(opt => opt.value === editingCategory.icon)?.icon || FlaskConical
                                                            return <IconComponent className={`h-6 w-6 ${editingCategory.color}`} />
                                                        })()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{editingCategory.name || "Category Name"}</h4>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {editingCategory.description || "Category description will appear here"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {editingCategory.keywords.length} keywords
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs gap-1">
                                                            <BookOpen className="h-3 w-3" />
                                                            {editingCategory.templates?.length || 0} templates
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </ScrollArea>

                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsCategoryDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveCategory}
                            className="w-full sm:w-auto gap-2"
                        >
                            {editingCategory?.id ? (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Update Category
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4" />
                                    Add Category
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sub-Type Dialog */}
            <Dialog open={isSubTypeDialogOpen} onOpenChange={setIsSubTypeDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {editingSubType?.id ? (
                                <>
                                    <Edit className="h-5 w-5" />
                                    Edit Sub-Type
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-5 w-5" />
                                    Add Sub-Type
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSubType?.id
                                ? "Modify the sub-type details below"
                                : "Create a new regulatory sub-type"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        {editingSubType && (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="subtype-name" className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Name
                                        </Label>
                                        <Input
                                            id="subtype-name"
                                            value={editingSubType.name}
                                            onChange={(e) => setEditingSubType({ ...editingSubType, name: e.target.value })}
                                            placeholder="Sub-type name"
                                            className="h-10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subtype-icon" className="flex items-center gap-2">
                                            <Palette className="h-4 w-4" />
                                            Icon
                                        </Label>
                                        <Select
                                            value={editingSubType.icon}
                                            onValueChange={(value) => setEditingSubType({ ...editingSubType, icon: value })}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select an icon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ICON_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        <div className="flex items-center gap-2">
                                                            <option.icon className="h-4 w-4" />
                                                            {option.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtype-description" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="subtype-description"
                                        value={editingSubType.description}
                                        onChange={(e) => setEditingSubType({ ...editingSubType, description: e.target.value })}
                                        placeholder="Sub-type description"
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Label>
                                    <Card className="border-dashed">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-lg ${editingSubType.bgColor}`}>
                                                    {editingSubType.icon && (
                                                        (() => {
                                                            const IconComponent = ICON_OPTIONS.find(opt => opt.value === editingSubType.icon)?.icon || FileText
                                                            return <IconComponent className={`h-6 w-6 ${editingSubType.color}`} />
                                                        })()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{editingSubType.name || "Sub-Type Name"}</h4>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {editingSubType.description || "Sub-type description will appear here"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="text-xs gap-1">
                                                            <BookOpen className="h-3 w-3" />
                                                            {editingSubType.templates?.length || 0} templates
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </ScrollArea>

                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsSubTypeDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveSubType}
                            className="w-full sm:w-auto gap-2"
                        >
                            {editingSubType?.id ? (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Update Sub-Type
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4" />
                                    Add Sub-Type
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Enhanced Template Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {editingTemplate?.id ? (
                                <>
                                    <Edit className="h-5 w-5" />
                                    Edit Template
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-5 w-5" />
                                    Add Template
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTemplate?.id
                                ? "Modify the template details below"
                                : "Create a new project template"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        {editingTemplate && (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="template-name" className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            Name
                                        </Label>
                                        <Input
                                            id="template-name"
                                            value={editingTemplate.name}
                                            onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                            placeholder="Template name"
                                            className="h-10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="template-category" className="flex items-center gap-2">
                                            <FolderPlus className="h-4 w-4" />
                                            Category
                                        </Label>
                                        <Select
                                            value={editingTemplate.categoryId}
                                            onValueChange={(value) => setEditingTemplate({ ...editingTemplate, categoryId: value, subTypeId: "" })}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projectSettings.categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        <div className="flex items-center gap-2">
                                                            {category.icon && (
                                                                (() => {
                                                                    const IconComponent = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || FlaskConical
                                                                    return <IconComponent className={`h-4 w-4 ${category.color}`} />
                                                                })()
                                                            )}
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {editingTemplate.categoryId && (
                                    <div className="space-y-2">
                                        <Label htmlFor="template-subtype" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Sub-Type (Optional)
                                        </Label>
                                        <Select
                                            value={editingTemplate.subTypeId || ""}
                                            onValueChange={(value) => setEditingTemplate({ ...editingTemplate, subTypeId: value })}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select a sub-type (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="__none__">None (Category template)</SelectItem>
                                                {projectSettings.categories
                                                    .find(cat => cat.id === editingTemplate.categoryId)
                                                    ?.subTypes?.map((subType) => (
                                                        <SelectItem key={subType.id} value={subType.id}>
                                                            <div className="flex items-center gap-2">
                                                                {subType.icon && (
                                                                    (() => {
                                                                        const IconComponent = ICON_OPTIONS.find(opt => opt.value === subType.icon)?.icon || FileText
                                                                        return <IconComponent className={`h-4 w-4 ${subType.color}`} />
                                                                    })()
                                                                )}
                                                                {subType.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="template-description" className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="template-description"
                                        value={editingTemplate.description}
                                        onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                                        placeholder="Template description"
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Label>
                                    <Card className="border-dashed">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-3 rounded-lg ${(() => {
                                                    const category = projectSettings.categories.find(cat => cat.id === editingTemplate.categoryId);
                                                    return category ? category.bgColor : 'bg-muted/10';
                                                })()}`}>
                                                    {(() => {
                                                        const category = projectSettings.categories.find(cat => cat.id === editingTemplate.categoryId);
                                                        if (category) {
                                                            const IconComponent = ICON_OPTIONS.find(opt => opt.value === category.icon)?.icon || BookOpen;
                                                            return <IconComponent className={`h-6 w-6 ${category.color}`} />;
                                                        }
                                                        return <BookOpen className="h-6 w-6 text-muted-foreground" />;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{editingTemplate.name || "Template Name"}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {editingTemplate.description || "Template description will appear here"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-xs text-muted-foreground">
                                                            Category: {
                                                                projectSettings.categories.find(cat => cat.id === editingTemplate.categoryId)?.name || "Not selected"
                                                            }
                                                        </span>
                                                        {editingTemplate.subTypeId && (
                                                            <span className="text-xs text-muted-foreground">
                                                                → {
                                                                    projectSettings.categories
                                                                        .find(cat => cat.id === editingTemplate.categoryId)
                                                                        ?.subTypes?.find(st => st.id === editingTemplate.subTypeId)?.name || "Unknown"
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </ScrollArea>

                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsTemplateDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveTemplate}
                            className="w-full sm:w-auto gap-2"
                        >
                            {editingTemplate?.id ? (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Update Template
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4" />
                                    Add Template
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}