"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Check, AlertCircle, Calendar, Clock, Users, Bookmark, Settings, Activity, List, Plus, Edit, Trash2, MoreVertical, ChevronLeft, Save, X, MessageCircle, FileText, UserPlus, Layers } from "lucide-react"
import { format, parseISO } from "date-fns"

// Mock project data - would be fetched from API in production
const mockProjects = [
  {
    id: "p1",
    name: "Cancer Biomarker Discovery",
    description: "Research project focused on identifying novel biomarkers for early cancer detection using proteomics approaches.",
    startDate: "2024-11-15",
    endDate: "2025-03-30",
    status: "In Progress",
    priority: "High",
    completion: 45,
    assignedTo: "Dr. Sarah Chen",
    tags: ["Oncology", "Proteomics", "Diagnostics"],
    team: [
      { id: "u1", name: "Sarah Chen", role: "Principal Investigator", avatar: "SC" },
      { id: "u2", name: "David Park", role: "Research Associate", avatar: "DP" },
      { id: "u3", name: "Maria Rodriguez", role: "Lab Technician", avatar: "MR" }
    ],
    tasks: [
      { id: "t1", name: "Sample collection", status: "Completed", dueDate: "2024-12-15", assignee: "Maria Rodriguez" },
      { id: "t2", name: "Protein extraction", status: "In Progress", dueDate: "2025-01-15", assignee: "David Park" },
      { id: "t3", name: "Mass spectrometry analysis", status: "Not Started", dueDate: "2025-02-15", assignee: "Sarah Chen" },
      { id: "t4", name: "Data analysis", status: "Not Started", dueDate: "2025-03-01", assignee: "David Park" }
    ],
    subprojects: [
      { id: "sp1", name: "Blood Sample Analysis", completion: 80, status: "In Progress" },
      { id: "sp2", name: "Tissue Sample Analysis", completion: 20, status: "In Progress" }
    ],
    activities: [
      { id: "a1", type: "status_change", user: "Sarah Chen", timestamp: "2025-01-10T14:30:00Z", content: "Changed project status from 'Planning' to 'In Progress'" },
      { id: "a2", type: "task_complete", user: "Maria Rodriguez", timestamp: "2024-12-15T11:25:00Z", content: "Completed task: 'Sample collection'" },
      { id: "a3", type: "comment", user: "David Park", timestamp: "2024-12-20T09:15:00Z", content: "Started protein extraction protocol optimization" }
    ],
    milestones: [
      { name: "Sample Collection Complete", date: "2024-12-15", completed: true },
      { name: "Preliminary Results", date: "2025-02-01", completed: false },
      { name: "Final Analysis", date: "2025-03-15", completed: false }
    ]
  },
  {
    id: "p2",
    name: "Antibiotic Resistance Testing",
    description: "Development and validation of new methods for rapid antibiotic resistance detection in clinical samples.",
    startDate: "2024-10-01",
    endDate: "2025-05-30",
    status: "In Progress",
    priority: "Medium",
    completion: 35,
    assignedTo: "Dr. James Wilson",
    tags: ["Microbiology", "Antibiotics", "Diagnostics"],
    team: [
      { id: "u4", name: "James Wilson", role: "Principal Investigator", avatar: "JW" },
      { id: "u5", name: "Emma Johnson", role: "Research Associate", avatar: "EJ" },
      { id: "u6", name: "Michael Brown", role: "Lab Technician", avatar: "MB" }
    ],
    tasks: [
      { id: "t5", name: "Strain collection", status: "Completed", dueDate: "2024-11-01", assignee: "Michael Brown" },
      { id: "t6", name: "MIC determination", status: "In Progress", dueDate: "2025-01-30", assignee: "Emma Johnson" },
      { id: "t7", name: "Rapid test development", status: "Not Started", dueDate: "2025-03-15", assignee: "James Wilson" },
      { id: "t8", name: "Clinical validation", status: "Not Started", dueDate: "2025-05-01", assignee: "Emma Johnson" }
    ],
    subprojects: [
      { id: "sp3", name: "Genetic Testing Methods", completion: 60, status: "In Progress" },
      { id: "sp4", name: "Phenotypic Testing Methods", completion: 20, status: "In Progress" }
    ],
    activities: [
      { id: "a4", type: "status_change", user: "James Wilson", timestamp: "2024-10-15T10:00:00Z", content: "Changed project status from 'Planning' to 'In Progress'" },
      { id: "a5", type: "task_complete", user: "Michael Brown", timestamp: "2024-11-01T16:45:00Z", content: "Completed task: 'Strain collection'" },
      { id: "a6", type: "comment", user: "Emma Johnson", timestamp: "2024-12-05T13:20:00Z", content: "Started MIC testing for the first batch of clinical isolates" }
    ],
    milestones: [
      { name: "Strain Collection Complete", date: "2024-11-01", completed: true },
      { name: "Method Development", date: "2025-03-15", completed: false },
      { name: "Clinical Validation Complete", date: "2025-05-15", completed: false }
    ]
  }
];

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Status badge variant mapper
const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case "completed": return "success"
    case "in progress": return "default"
    case "on hold": return "warning"
    case "not started": return "outline"
    case "review": return "info"
    default: return "default"
  }
};

// Initial chunk implementation - Project Structure & Core UI
export function ProjectDetails({ projectId }) {
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [taskFilter, setTaskFilter] = useState("all")

  // New state for adding items
  const [newSubproject, setNewSubproject] = useState({ name: "", status: "Not Started" })
  const [newTask, setNewTask] = useState({ name: "", status: "Not Started", dueDate: "", assignee: "" })
  const [newMember, setNewMember] = useState({ id: "", role: "" })
  const [newTag, setNewTag] = useState("")
  const [newComment, setNewComment] = useState("")

  // Modal states
  const [showAddSubprojectModal, setShowAddSubprojectModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)

  // Fetch project data
  useEffect(() => {
    // Simulate API call
    const fetchProject = () => {
      setLoading(true)
      setTimeout(() => {
        const foundProject = mockProjects.find(p => p.id === projectId)
        setProject(foundProject || null)
        setLoading(false)
      }, 500)
    }

    fetchProject()
  }, [projectId])

  // Handle adding a new subproject
  const handleAddSubproject = () => {
    if (!newSubproject.name.trim()) return

    const subprojectToAdd = {
      id: `sp-${Date.now()}`,
      name: newSubproject.name,
      status: newSubproject.status,
      completion: 0
    }

    setProject(prev => ({
      ...prev,
      subprojects: [...prev.subprojects, subprojectToAdd]
    }))

    setNewSubproject({ name: "", status: "Not Started" })
    setShowAddSubprojectModal(false)

    // Add to activity log
    addActivityItem("subproject_add", `Added new subproject: "${subprojectToAdd.name}"`)
  }

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.name.trim()) return

    const taskToAdd = {
      id: `t-${Date.now()}`,
      name: newTask.name,
      status: newTask.status,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      assignee: newTask.assignee || "Unassigned"
    }

    setProject(prev => ({
      ...prev,
      tasks: [...prev.tasks, taskToAdd]
    }))

    setNewTask({ name: "", status: "Not Started", dueDate: "", assignee: "" })
    setShowAddTaskModal(false)

    // Add to activity log
    addActivityItem("task_add", `Added new task: "${taskToAdd.name}"`)
  }

  // Handle adding a new team member
  const handleAddTeamMember = () => {
    if (!newMember.id || !newMember.role) return

    // Find the selected member (in a real app, this would be from a proper members list)
    const memberOptions = [
      { id: "member1", name: "John Smith", avatar: "JS" },
      { id: "member2", name: "Elizabeth Taylor", avatar: "ET" },
      { id: "member3", name: "Michael Johnson", avatar: "MJ" }
    ]

    const selectedMember = memberOptions.find(m => m.id === newMember.id)

    if (!selectedMember) return

    const memberToAdd = {
      id: selectedMember.id,
      name: selectedMember.name,
      role: newMember.role,
      avatar: selectedMember.avatar
    }

    // Check if member already exists
    if (project.team.some(m => m.id === memberToAdd.id)) {
      alert("This team member is already assigned to the project")
      return
    }

    setProject(prev => ({
      ...prev,
      team: [...prev.team, memberToAdd]
    }))

    setNewMember({ id: "", role: "" })

    // Add to activity log
    addActivityItem("member_add", `Added ${memberToAdd.name} to the project as ${memberToAdd.role}`)
  }

  // Handle adding a new tag
  const handleAddTag = () => {
    if (!newTag.trim()) return

    // Check if tag already exists
    if (project.tags.includes(newTag)) {
      alert("This tag already exists")
      return
    }

    setProject(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }))

    setNewTag("")

    // Add to activity log
    addActivityItem("tag_add", `Added tag: "${newTag}"`)
  }

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))

    // Add to activity log
    addActivityItem("tag_remove", `Removed tag: "${tagToRemove}"`)
  }

  // Handle adding a comment
  const handleAddComment = () => {
    if (!newComment.trim()) return

    const commentToAdd = {
      id: `a-${Date.now()}`,
      type: "comment",
      user: "Current User", // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString(),
      content: newComment
    }

    setProject(prev => ({
      ...prev,
      activities: [commentToAdd, ...prev.activities]
    }))

    setNewComment("")
  }

  // Helper function to add activity items
  const addActivityItem = (type, content) => {
    const activityItem = {
      id: `a-${Date.now()}`,
      type,
      user: "Current User", // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString(),
      content
    }

    setProject(prev => ({
      ...prev,
      activities: [activityItem, ...prev.activities]
    }))
  }

  // Handle back navigation
  const handleBack = () => {
    router.push("/projects")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-16 w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2.5"></div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    )
  }

  // Filter tasks based on selected filter
  const filteredTasks = project.tasks.filter(task => {
    if (taskFilter === "all") return true
    return task.status.toLowerCase() === taskFilter.toLowerCase()
  })

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto py-6"
    >
      {/* Dialog for adding new subproject */}
      <Dialog open={showAddSubprojectModal} onOpenChange={setShowAddSubprojectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Subproject</DialogTitle>
            <DialogDescription>
              Create a new subproject related to this main project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subproject-name" className="text-sm font-medium">
                Subproject Name
              </label>
              <Input
                id="subproject-name"
                placeholder="Enter subproject name"
                value={newSubproject.name}
                onChange={(e) => setNewSubproject(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subproject-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="subproject-status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newSubproject.status}
                onChange={(e) => setNewSubproject(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSubprojectModal(false)}>Cancel</Button>
            <Button onClick={handleAddSubproject}>Add Subproject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding new task */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="task-name" className="text-sm font-medium">
                Task Name
              </label>
              <Input
                id="task-name"
                placeholder="Enter task name"
                value={newTask.name}
                onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="task-status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTask.status}
                  onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="task-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="task-assignee" className="text-sm font-medium">
                Assigned To
              </label>
              <select
                id="task-assignee"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newTask.assignee}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
              >
                <option value="">-- Assign to --</option>
                {project?.team.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskModal(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant={getStatusVariant(project.status)} className="ml-4">
                {project.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project
                      and all associated data including tasks, team assignments, and progress.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600">Delete Project</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
        </div>
      </div>

      {/* Project Progress */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-2">
            <Progress value={project.completion} className="h-3 flex-1" />
            <span className="ml-4 text-sm font-medium">{project.completion}%</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(parseISO(project.startDate), 'MMM d, yyyy')} - {format(parseISO(project.endDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{project.team.length} team members</span>
            </div>
            <div className="flex items-center">
              <List className="h-4 w-4 mr-1" />
              <span>{project.tasks.length} tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="overview" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="space-y-4 md:col-span-2">
              {/* Project Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About This Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                          {milestone.completed ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium">{milestone.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(parseISO(milestone.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Badge variant={milestone.completed ? "success" : "outline"}>
                          {milestone.completed ? "Completed" : "Upcoming"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Team Members */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.team.map(member => (
                      <div key={member.id} className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>

              {/* Subprojects */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Subprojects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.subprojects.map(subproject => (
                      <div key={subproject.id} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{subproject.name}</h4>
                          <Badge variant={getStatusVariant(subproject.status)}>
                            {subproject.status}
                          </Badge>
                        </div>
                        <div className="flex items-center">
                          <Progress value={subproject.completion} className="h-2 flex-1" />
                          <span className="ml-2 text-xs">{subproject.completion}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setShowAddSubprojectModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subproject
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Project Tasks</CardTitle>
                <Button size="sm" onClick={() => setShowAddTaskModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={taskFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={taskFilter === "not started" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskFilter("not started")}
                >
                  Not Started
                </Button>
                <Button
                  variant={taskFilter === "in progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskFilter("in progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant={taskFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskFilter("completed")}
                >
                  Completed
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox
                        id="select-all-tasks"
                        onCheckedChange={(checked) => {
                          // Handle select all functionality here
                        }}
                      />
                    </TableHead>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map(task => (
                    <TableRow key={task.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <TableCell className="p-2">
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
                          <Checkbox
                            id={`task-${task.id}`}
                            onCheckedChange={(checked) => {
                              // Handle task selection
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium" onClick={() => router.push(`/tasks/${task.id}`)}>
                        {task.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(task.dueDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No tasks found matching the current filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {filteredTasks.length > 0 && (
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div>
                    Showing {filteredTasks.length} of {project.tasks.length} tasks
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled={taskFilter === "all"}>
                      View All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
              </div>
              <CardDescription>
                Manage team members and their roles on this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.team.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h4 className="text-base font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Role
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Member Form */}
                <Card className="border-dashed border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Add New Team Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Team Member</label>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newMember.id}
                          onChange={(e) => setNewMember(prev => ({ ...prev, id: e.target.value }))}
                        >
                          <option value="">Select a member...</option>
                          <option value="member1">John Smith - Research Assistant</option>
                          <option value="member2">Elizabeth Taylor - Lab Technician</option>
                          <option value="member3">Michael Johnson - Data Analyst</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role in Project</label>
                        <Input
                          placeholder="Researcher, Analyst, etc."
                          value={newMember.role}
                          onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAddTeamMember}
                      disabled={!newMember.id || !newMember.role}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Project
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Recent activity and updates on this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {project.activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="relative pl-6 pb-6"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      {/* Timeline connector */}
                      {index < project.activities.length - 1 && (
                        <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20 dark:from-primary dark:to-primary/10" />
                      )}

                      {/* Activity dot */}
                      <motion.div
                        className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.2 }}
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center text-sm font-medium">
                          <span>{activity.user}</span>
                          <span className="ml-auto text-gray-500 dark:text-gray-400 text-xs">
                            {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                          {activity.content}
                        </p>

                        {/* Render different activity types with different styles/icons */}
                        {activity.type === "status_change" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Status Changed
                            </span>
                          </motion.div>
                        )}

                        {activity.type === "task_complete" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Task Completed
                            </span>
                          </motion.div>
                        )}

                        {activity.type === "comment" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                              <MessageCircle className="h-3.5 w-3.5 mr-1" />
                              Comment
                            </span>
                          </motion.div>
                        )}

                        {activity.type === "task_add" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-purple-600 dark:text-purple-400 font-medium flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              New Task Added
                            </span>
                          </motion.div>
                        )}

                        {activity.type === "member_add" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
                              <UserPlus className="h-3.5 w-3.5 mr-1" />
                              Team Member Added
                            </span>
                          </motion.div>
                        )}

                        {activity.type === "subproject_add" && (
                          <motion.div
                            className="mt-2 p-2 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10 rounded-md text-sm"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          >
                            <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center">
                              <Layers className="h-3.5 w-3.5 mr-1" />
                              Subproject Added
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Add Comment */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Add Comment</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your comment here..."
                    className="flex-1"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Press Enter to post. Shift+Enter for a new line.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>
                Configure project properties and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Name</label>
                    <Input defaultValue={project.name} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Status</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="not started">Not Started</option>
                      <option value="in progress" selected={project.status === "In Progress"}>In Progress</option>
                      <option value="on hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" defaultValue={project.startDate} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" defaultValue={project.endDate} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={project.description}
                    />
                  </div>
                </div>
                <Button className="mt-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <Separator />

              {/* Tags Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      <span className="text-sm">{tag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new tag..."
                    className="flex-1"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} disabled={!newTag.trim()}>Add</Button>
                </div>
              </div>

              <Separator />

              {/* Notifications Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Task Updates</h4>
                      <p className="text-xs text-gray-500">Receive notifications when tasks are updated</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Team Changes</h4>
                      <p className="text-xs text-gray-500">Receive notifications when team members are added or removed</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Comments</h4>
                      <p className="text-xs text-gray-500">Receive notifications when someone comments</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Status Changes</h4>
                      <p className="text-xs text-gray-500">Receive notifications when project status changes</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4 rounded-md border border-red-200 dark:border-red-900 p-4">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-gray-500">These actions cannot be undone. Be careful!</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="destructive" size="sm">
                    Archive Project
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete Project
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the project
                          and all associated data including tasks, team assignments, and progress.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600">Delete Project</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
