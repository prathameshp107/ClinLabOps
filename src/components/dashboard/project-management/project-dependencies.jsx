"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, ArrowRight, AlertCircle, Check, Info, CornerRightDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"

export function ProjectDependencies({ projects, onUpdateProjectDependencies }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [dependencies, setDependencies] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dependencyType, setDependencyType] = useState("finish-to-start")

  // Load existing dependencies
  useEffect(() => {
    // In a real app, you would fetch this from your API/backend
    const existingDependencies = projects.reduce((acc, project) => {
      if (project.dependencies) {
        return [...acc, ...project.dependencies]
      }
      return acc
    }, [])
    
    setDependencies(existingDependencies || [])
  }, [projects])

  const handleAddDependency = (sourceDependency, targetProject) => {
    const newDependency = {
      id: `dep-${Date.now()}`,
      sourceId: selectedProject.id,
      sourceName: selectedProject.name,
      targetId: targetProject.id,
      targetName: targetProject.name,
      type: dependencyType,
      created: new Date().toISOString()
    }
    
    const updatedDependencies = [...dependencies, newDependency]
    setDependencies(updatedDependencies)
    
    if (onUpdateProjectDependencies) {
      onUpdateProjectDependencies(updatedDependencies)
    }
    
    setDialogOpen(false)
  }

  const handleRemoveDependency = (dependencyId) => {
    const updatedDependencies = dependencies.filter(dep => dep.id !== dependencyId)
    setDependencies(updatedDependencies)
    
    if (onUpdateProjectDependencies) {
      onUpdateProjectDependencies(updatedDependencies)
    }
  }

  const getDependencyTypeLabel = (type) => {
    switch(type) {
      case "finish-to-start": return "Finish to Start (FS)"
      case "start-to-start": return "Start to Start (SS)"
      case "finish-to-finish": return "Finish to Finish (FF)"
      case "start-to-finish": return "Start to Finish (SF)"
      default: return type
    }
  }

  const getDependencyTypeDescription = (type) => {
    switch(type) {
      case "finish-to-start": 
        return "The predecessor project must finish before the successor project can start"
      case "start-to-start": 
        return "The successor project cannot start until the predecessor project starts"
      case "finish-to-finish": 
        return "The successor project cannot finish until the predecessor project finishes"
      case "start-to-finish": 
        return "The successor project cannot finish until the predecessor project starts"
      default: return ""
    }
  }

  // Filter out projects that would create circular dependencies
  const getAvailableProjects = () => {
    if (!selectedProject) return []
    
    // Get all projects that depend on the selected project (directly or indirectly)
    const getDependentProjects = (projectId, visited = new Set()) => {
      visited.add(projectId)
      
      const directDependents = dependencies
        .filter(dep => dep.targetId === projectId)
        .map(dep => dep.sourceId)
      
      directDependents.forEach(depId => {
        if (!visited.has(depId)) {
          getDependentProjects(depId, visited)
        }
      })
      
      return visited
    }
    
    const dependentProjects = getDependentProjects(selectedProject.id)
    
    return projects.filter(p => 
      p.id !== selectedProject.id && 
      !dependentProjects.has(p.id) &&
      !dependencies.some(dep => 
        dep.sourceId === selectedProject.id && dep.targetId === p.id
      )
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <CardTitle className="text-xl flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-500" />
            Project Dependencies
          </CardTitle>
          <CardDescription>
            Define relationships between projects to ensure proper sequencing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {dependencies.length} dependencies defined
              </div>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="rounded-lg"
                size="sm"
              >
                <Link className="mr-2 h-4 w-4" />
                Add Dependency
              </Button>
            </div>
            
            {dependencies.length > 0 ? (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source Project</TableHead>
                      <TableHead>Dependency Type</TableHead>
                      <TableHead>Target Project</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dependencies.map((dep) => (
                      <TableRow key={dep.id}>
                        <TableCell className="font-medium">{dep.sourceName}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                                  {getDependencyTypeLabel(dep.type)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{getDependencyTypeDescription(dep.type)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{dep.targetName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDependency(dep.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span className="sr-only">Remove dependency</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <Info className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Dependencies</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mt-1">
                  Project dependencies help you define relationships and ensure proper workflow sequencing
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  Add Your First Dependency
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dependency Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Project Dependency</DialogTitle>
            <DialogDescription>
              Define how projects depend on each other to ensure proper sequencing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="source-project">Source Project</Label>
              <Select
                value={selectedProject?.id || ""}
                onValueChange={(value) => {
                  const project = projects.find(p => p.id === value)
                  setSelectedProject(project)
                }}
              >
                <SelectTrigger id="source-project">
                  <SelectValue placeholder="Select source project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dependency-type">Dependency Type</Label>
              <Select
                value={dependencyType}
                onValueChange={setDependencyType}
              >
                <SelectTrigger id="dependency-type">
                  <SelectValue placeholder="Select dependency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finish-to-start">Finish to Start (FS)</SelectItem>
                  <SelectItem value="start-to-start">Start to Start (SS)</SelectItem>
                  <SelectItem value="finish-to-finish">Finish to Finish (FF)</SelectItem>
                  <SelectItem value="start-to-finish">Start to Finish (SF)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {getDependencyTypeDescription(dependencyType)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-project">Target Project</Label>
              <Select
                disabled={!selectedProject}
              >
                <SelectTrigger id="target-project">
                  <SelectValue placeholder={selectedProject ? "Select target project" : "Select source project first"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProjects().map((project) => (
                    <SelectItem 
                      key={project.id} 
                      value={project.id}
                      onSelect={() => handleAddDependency(selectedProject, project)}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // This is handled in the target project selection
              }}
              disabled={!selectedProject}
            >
              Add Dependency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
