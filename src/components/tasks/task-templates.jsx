"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart2,
  Users,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  OctagonAlert,
  List,
  Grid,
  PlusCircle,
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  Star,
  StarOff,
  Share,
  Activity,
  Copy,
  Tag
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskTemplateDialog } from "./task-template-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
// Task templates will be fetched from API or defined locally

// Sample task templates data
const sampleTemplates = [
  {
    id: "template1",
    name: "Quality Control Check",
    description: "Template for standard quality control tasks that occur weekly",
    defaultPriority: "medium",
    defaultStatus: "pending",
    defaultAssigneeRole: "technician",
    categoryTags: ["quality", "routine", "weekly"],
    createdAt: "2025-02-15T08:30:00Z",
    updatedAt: "2025-03-01T11:45:00Z",
    createdBy: "u1"
  },
  {
    id: "template2",
    name: "Experiment Setup",
    description: "Template for setting up new scientific experiments",
    defaultPriority: "high",
    defaultStatus: "pending",
    defaultAssigneeRole: "scientist",
    categoryTags: ["experiment", "setup", "preparation"],
    createdAt: "2025-02-05T14:15:00Z",
    updatedAt: "2025-02-20T09:30:00Z",
    createdBy: "u3"
  },
  {
    id: "template3",
    name: "Lab Maintenance",
    description: "Template for monthly lab equipment maintenance tasks",
    defaultPriority: "low",
    defaultStatus: "pending",
    defaultAssigneeRole: "technician",
    categoryTags: ["maintenance", "monthly", "equipment"],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-03-05T15:20:00Z",
    createdBy: "u2"
  },
  {
    id: "template4",
    name: "Regulatory Documentation",
    description: "Template for regulatory compliance documentation tasks",
    defaultPriority: "critical",
    defaultStatus: "pending",
    defaultAssigneeRole: "admin",
    categoryTags: ["regulatory", "documentation", "compliance"],
    createdAt: "2025-02-25T16:45:00Z",
    updatedAt: "2025-03-10T13:10:00Z",
    createdBy: "u1"
  }
];

export const TaskTemplates = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState(sampleTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState(sampleTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Template dialog state
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [dialogMode, setDialogMode] = useState("create");

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  // Get unique categories from all templates
  const allCategories = [...new Set(templates.flatMap(template => template.categoryTags || []))];

  // Filter templates based on search query and filters
  useEffect(() => {
    let filtered = [...templates];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        (template.categoryTags && template.categoryTags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(template =>
        template.categoryTags && template.categoryTags.includes(selectedCategory)
      );
    }

    // Filter by priority
    if (selectedPriority) {
      filtered = filtered.filter(template =>
        template.defaultPriority === selectedPriority
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory, selectedPriority]);

  // Handle creating or updating a template
  const handleSubmitTemplate = (templateData) => {
    if (dialogMode === "create") {
      // Add new template with generated ID
      const newTemplate = {
        ...templateData,
        id: `template${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "u1", // Assuming current user ID
      };

      setTemplates([...templates, newTemplate]);
    } else {
      // Update existing template
      const updatedTemplates = templates.map(template =>
        template.id === templateData.id
          ? { ...template, ...templateData, updatedAt: new Date().toISOString() }
          : template
      );

      setTemplates(updatedTemplates);
    }

    // Close the dialog
    setShowTemplateDialog(false);
  };

  // Handle deleting a template
  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(template => template.id !== templateToDelete.id));
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    }
  };

  // Handle cloning a template
  const handleCloneTemplate = (template) => {
    const clonedTemplate = {
      ...template,
      id: `template${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTemplates([...templates, clonedTemplate]);
  };

  // Handle editing a template
  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setDialogMode("edit");
    setShowTemplateDialog(true);
  };

  // Open create template dialog
  const handleOpenCreateDialog = () => {
    setCurrentTemplate(null);
    setDialogMode("create");
    setShowTemplateDialog(true);
  };

  // Handle applying a template (passes the template to the parent component)
  const handleApplyTemplate = (template) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
    }
  };

  // Calculate all tags used across templates
  const allTags = [...new Set(templates.flatMap(template => template.categoryTags || []))];

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedPriority("");
  };

  // Handle opening delete confirmation dialog
  const confirmDelete = (template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Task Templates</h2>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-row gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {selectedCategory || "Filter by tag"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {selectedPriority ? `Priority: ${selectedPriority}` : "Filter by priority"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || selectedCategory || selectedPriority) && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-xl font-medium">No templates found</div>
          <p className="text-muted-foreground mt-2">
            {templates.length === 0
              ? "Create your first template to get started."
              : "Try adjusting your search or filters."}
          </p>
          {templates.length === 0 && (
            <Button className="mt-4" onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">{template.name}</CardTitle>
                        <CardDescription>
                          Last updated {new Date(template.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleApplyTemplate(template)}>
                            Use Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloneTemplate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(template)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Default Priority:</span>
                      <Badge
                        variant={
                          template.defaultPriority === "low" ? "outline" :
                            template.defaultPriority === "medium" ? "secondary" :
                              template.defaultPriority === "high" ? "default" : "destructive"
                        }
                      >
                        {template.defaultPriority.charAt(0).toUpperCase() + template.defaultPriority.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Default Status:</span>
                      <Badge variant="outline">
                        {template.defaultStatus.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    {template.defaultAssigneeRole && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Default Assignee:</span>
                        <Badge variant="outline">
                          {template.defaultAssigneeRole.charAt(0).toUpperCase() + template.defaultAssigneeRole.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    {template.categoryTags && template.categoryTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Template Dialog */}
      <TaskTemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        template={currentTemplate}
        mode={dialogMode}
        onSubmit={handleSubmitTemplate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the template "{templateToDelete?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
