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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Project
          </DialogTitle>
          <DialogDescription>
            This action is irreversible. All project data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2.5 border rounded-md p-4 bg-muted/50">
            <div className="space-y-1">
              <p className="text-sm font-medium">Project Information</p>
              <p className="text-base font-semibold">{project.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>
                <p className="text-muted-foreground">Start Date:</p>
                <p>{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date:</p>
                <p>{formatDate(project.endDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status:</p>
                <Badge variant="outline">{project.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Priority:</p>
                <Badge variant="outline">{project.priority}</Badge>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Team Members:</p>
              <p>{project.team.length} members</p>
            </div>
          </div>
          
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2 text-amber-500 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">Warning</p>
            </div>
            
            <p className="text-sm">
              This will delete the project and all associated data. This action cannot be undone.
            </p>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="confirm">
                Type <span className="font-medium">"{project.name}"</span> to confirm deletion
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={!isConfirmValid && confirmText ? "border-destructive" : ""}
                placeholder={project.name}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
