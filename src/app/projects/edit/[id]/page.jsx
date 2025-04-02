"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Trash2, CalendarDays, UserPlus, Tag, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { mockProjects } from "@/components/dashboard/project-management" // We'll need to export this

// Remove the generateStaticParams function from here
// Keep all your other imports and component code

export default function EditProjectPage({ params }) {
  const router = useRouter()
  const params = useParams()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newTag, setNewTag] = useState("")
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    priority: "",
    progress: 0,
    tags: []
  })

  useEffect(() => {
    // In a real app, fetch from an API
    // For now, simulate loading from our mock data
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Find the project by ID
      const foundProject = mockProjects.find(p => p.id === params.id)
      
      if (foundProject) {
        setProject(foundProject)
        setForm({
          name: foundProject.name,
          description: foundProject.description,
          startDate: foundProject.startDate,
          endDate: foundProject.endDate,
          status: foundProject.status,
          priority: foundProject.priority,
          progress: foundProject.progress,
          tags: [...foundProject.tags] // Create a copy to avoid modifying the original
        })
      }
      
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, save to an API
    console.log("Saving project:", form)
    
    // Redirect back to projects page
    router.push("/projects")
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full w-full py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Button 
            className="mt-6"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push("/projects")}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
              <p className="text-muted-foreground mt-1">
                Make changes to project details and save when done
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button className="gap-2" onClick={handleSubmit}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Project Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the project goals and scope"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Start Date
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      End Date
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <label className="text-sm font-medium block">
                  Project Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="gap-1.5"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)} 
                        className="rounded-full h-4 w-4 inline-flex items-center justify-center hover:bg-muted-foreground/20 text-muted-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a new tag"
                      className="pl-10"
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                  </div>
                  <Button onClick={addTag} variant="secondary">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Status & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
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
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Priority
                </label>
                <Select
                  value={form.priority}
                  onValueChange={(value) => handleChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Progress (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => handleChange("progress", parseInt(e.target.value) || 0)}
                />
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Project Team
                </label>
                <div className="flex -space-x-2 mb-4">
                  {project.team.map((member) => (
                    <div
                      key={member.id}
                      className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium border-2 border-background"
                      title={`${member.name} (${member.role})`}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <UserPlus className="h-4 w-4" />
                  Manage Team
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full gap-2 mb-2" onClick={handleSubmit}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => router.push("/projects")}
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
