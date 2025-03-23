"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, X, UserPlus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export function ProjectShareDialog({ open, onOpenChange, project, onShare }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [invitedUsers, setInvitedUsers] = useState([])
  const [error, setError] = useState("")

  // Mock user suggestions
  const userSuggestions = [
    { id: "u7", name: "Jessica Lee", email: "j.lee@example.com", role: "Scientist" },
    { id: "u8", name: "Thomas Miller", email: "t.miller@example.com", role: "Technician" },
    { id: "u9", name: "Sophia Wilson", email: "s.wilson@example.com", role: "Scientist" },
    { id: "u10", name: "Michael Brown", email: "m.brown@example.com", role: "Reviewer" },
  ]

  const filteredSuggestions = userSuggestions.filter(user => 
    user.email.includes(email.toLowerCase()) && 
    !invitedUsers.some(invited => invited.email === user.email) &&
    !project?.team?.some(member => member.id === user.id)
  )

  const handleAddCollaborator = () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    // Check if user is already a team member
    if (project?.team?.some(member => 
      member.email?.toLowerCase() === email.toLowerCase() || 
      member.name?.toLowerCase() === email.toLowerCase()
    )) {
      setError("This user is already a team member")
      return
    }

    // Check if user is already invited
    if (invitedUsers.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      setError("This user is already invited")
      return
    }

    // Find if the user exists in suggestions
    const existingUser = userSuggestions.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    )

    // Add the user
    const newUser = existingUser || { 
      id: `temp-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: "External"
    }

    setInvitedUsers([...invitedUsers, { ...newUser, projectRole: role }])
    setEmail("")
    setError("")
  }

  const removeInvitedUser = (userEmail) => {
    setInvitedUsers(prev => prev.filter(user => user.email !== userEmail))
  }

  const handleShare = () => {
    onShare(project.id, invitedUsers)
    onOpenChange(false)
    setInvitedUsers([])
    setEmail("")
    setRole("viewer")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on "{project?.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email or username</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                />
                {filteredSuggestions.length > 0 && email && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-md max-h-48 overflow-y-auto"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredSuggestions.map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                        onClick={() => setEmail(user.email)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddCollaborator}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          {project?.team && project.team.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Team Members</h3>
              <div className="border rounded-md divide-y">
                {project.team.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email || ""}</p>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invitedUsers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">People to be invited</h3>
              <div className="border rounded-md divide-y">
                {invitedUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {user.projectRole}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeInvitedUser(user.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={invitedUsers.length === 0}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            {invitedUsers.length > 0 ? `Send ${invitedUsers.length} Invitation${invitedUsers.length > 1 ? 's' : ''}` : 'Share'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
