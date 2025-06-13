"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserX, AlertTriangle, Trash2, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function DeleteUserDialog({ user, open, onOpenChange }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const isConfirmValid = confirmText.toLowerCase() === "delete"

  const handleDelete = async () => {
    if (!isConfirmValid) return;
    
    setIsSubmitting(true)
    
    try {
      // In a real app, this would call an API to delete the user
      console.log(`Deleting user: ${user.id}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-col items-center gap-1">
          <div className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-3">
            <UserX className="h-7 w-7 text-red-600 dark:text-red-300" />
          </div>
          <DialogTitle className="text-xl">Delete User Account</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the account for <span className="font-medium">{user?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {user && (
            <div className="bg-muted/50 rounded-md p-4">
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <h4 className="text-sm font-medium">User ID</h4>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Role</h4>
                  <div className="flex items-center gap-1.5">
                    {user.role === "Admin" && <Shield className="h-3 w-3 text-red-500" />}
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className="text-xs">
                    <Badge 
                      variant={user.status === "Active" ? "outline" : "secondary"}
                      className={user.status === "Active" ? "text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" : "text-xs"}
                    >
                      {user.status || "Unknown"}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 p-4 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Warning: This action cannot be undone</p>
              <ul className="mt-2 space-y-1">
                <li>• User account will be permanently deleted</li>
                <li>• All associated user data will be lost</li>
                <li>• User will no longer be able to access the system</li>
                <li>• Any active sessions will be terminated</li>
              </ul>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <p className="text-sm font-medium mb-2">Confirm deletion</p>
            <p className="text-sm text-muted-foreground mb-3">
              To confirm, type "delete" in the field below
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type 'delete' to confirm"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isSubmitting || !isConfirmValid}
            className="gap-2"
          >
            {isSubmitting ? "Deleting..." : "Delete Account"}
            {!isSubmitting && <Trash2 className="h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
