"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function DeleteProjectDialog({ project, open, onOpenChange }) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Check if confirmation text matches
  const isConfirmValid = confirmText === project?.name

  // Reset state when dialog closes
  const handleOpenChange = (open) => {
    if (!open) {
      setConfirmText("")
      setIsDeleting(false)
    }
    onOpenChange(open)
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  }

  const handleDelete = async () => {
    if (!isConfirmValid) return
    
    setIsDeleting(true)
    
    try {
      // In a real application, you would call your API here
      console.log(`Deleting project: ${project.id}`)
      
      // Simulate successful API call
      setTimeout(() => {
        setIsDeleting(false)
        handleOpenChange(false)
      }, 1000)
    } catch (error) {
      console.error("Error deleting project:", error)
      setIsDeleting(false)
      // Handle error appropriately
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full bg-background/95 backdrop-blur-md border border-border/40 shadow-xl rounded-2xl flex flex-col items-center justify-center p-0 overflow-hidden">
        <DialogHeader className="space-y-2 pb-4 pt-6 px-6 w-full flex flex-col items-center">
          <DialogTitle className="flex items-center gap-3 text-destructive text-2xl font-bold justify-center">
            <div className="bg-destructive/10 p-2 rounded-full">
              <Trash2 className="h-5 w-5" />
            </div>
            <span>Delete Project</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            This action is irreversible. All project data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 px-6 pb-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4 border rounded-xl p-5 bg-muted/40 shadow-inner"
          >
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Project Information</p>
              <h3 className="text-base font-semibold">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-1">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                <p className="font-medium">{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">End Date</p>
                <p className="font-medium">{formatDate(project.endDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Status</p>
                <Badge variant={project.status === "Completed" ? "success" : 
                       project.status === "In Progress" ? "default" : 
                       project.status === "On Hold" ? "warning" : "outline"} 
                       className="mt-1">
                  {project.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Priority</p>
                <Badge variant={project.priority === "High" ? "destructive" : 
                       project.priority === "Medium" ? "warning" : "outline"} 
                       className="mt-1">
                  {project.priority}
                </Badge>
              </div>
            </div>
            
            <div className="mt-1 border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground font-medium">Team Members</p>
              <p className="text-sm font-medium">{project.team.length} members</p>
            </div>
          </motion.div>
          
          <div className="space-y-4 border-t border-border/30 pt-4">
            <div className="flex items-center gap-2.5 p-3 bg-amber-500/20 rounded-xl text-amber-700 border border-amber-300/40">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium text-sm">This action cannot be undone</p>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              This will permanently delete the project and all associated data including tasks, files, and team assignments.
            </p>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="confirm" className="text-sm font-semibold">
                Type <span className="font-semibold text-foreground">"{project.name}"</span> to confirm deletion
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={`mt-1 w-full px-3 py-2 rounded-lg border ${!isConfirmValid && confirmText ? "border-destructive focus-visible:ring-destructive/20" : "border-border/40"} focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                placeholder={project.name}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border/20 px-0">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="font-normal w-full sm:w-auto py-2 px-6"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="gap-2 w-full sm:w-auto py-2 px-6 shadow-sm hover:shadow-md focus:shadow-md transition-all"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
