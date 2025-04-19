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
      <Card className="border border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-gray-800/50 pb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-foreground">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
              <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Project Dependencies
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Define relationships between projects to ensure proper sequencing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Badge variant="outline" className="bg-background">
                  {dependencies.length}
                </Badge>
                dependencies defined
              </div>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="gap-2"
                size="sm"
                variant="outline"
              >
                <Link className="h-4 w-4" />
                Add Dependency
              </Button>
            </div>
            
            {dependencies.length > 0 ? (
              <ScrollArea className="h-[300px] rounded-md border border-border/40 bg-background/50">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[30%]">Source Project</TableHead>
                      <TableHead className="w-[25%]">Dependency Type</TableHead>
                      <TableHead className="w-[30%]">Target Project</TableHead>
                      <TableHead className="text-right w-[15%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dependencies.map((dep) => (
                      <TableRow key={dep.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{dep.sourceName}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="bg-blue-50/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                  {getDependencyTypeLabel(dep.type)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>{getDependencyTypeDescription(dep.type)}</p>
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
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
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
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-[300px] border border-dashed rounded-lg p-6 bg-muted/30"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full mb-4">
                  <Info className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No Dependencies</h3>
                <p className="text-muted-foreground text-center max-w-md mt-2 mb-4">
                  Project dependencies help you define relationships and ensure proper workflow sequencing
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="gap-2"
                  variant="outline"
                >
                  <Link className="h-4 w-4" />
                  Add Your First Dependency
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dependency Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <DialogHeader className="space-y-2 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
                <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Add Project Dependency
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Define how projects depend on each other to ensure proper sequencing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="source-project" className="text-sm font-medium">Source Project</Label>
              <Select
                value={selectedProject?.id || ""}
                onValueChange={(value) => {
                  const project = projects.find(p => p.id === value)
                  setSelectedProject(project)
                }}
              >
                <SelectTrigger id="source-project" className="bg-background border-border/60">
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
              <Label htmlFor="dependency-type" className="text-sm font-medium">Dependency Type</Label>
              <Select
                value={dependencyType}
                onValueChange={setDependencyType}
              >
                <SelectTrigger id="dependency-type" className="bg-background border-border/60">
                  <SelectValue placeholder="Select dependency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finish-to-start">Finish to Start (FS)</SelectItem>
                  <SelectItem value="start-to-start">Start to Start (SS)</SelectItem>
                  <SelectItem value="finish-to-finish">Finish to Finish (FF)</SelectItem>
                  <SelectItem value="start-to-finish">Start to Finish (SF)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1.5 pl-1">
                {getDependencyTypeDescription(dependencyType)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-project" className="text-sm font-medium">Target Project</Label>
              <Select
                disabled={!selectedProject}
              >
                <SelectTrigger id="target-project" className={`bg-background border-border/60 ${!selectedProject ? 'opacity-50' : ''}`}>
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
              {selectedProject && getAvailableProjects().length === 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1.5 pl-1 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  No available projects to create dependency
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center gap-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="font-normal">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // This is handled in the target project selection
              }}
              disabled={!selectedProject || getAvailableProjects().length === 0}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Add Dependency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
