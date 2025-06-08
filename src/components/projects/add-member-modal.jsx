"use client"

import { useState } from "react"
import { Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddMemberModal({ open, onOpenChange, onAddMember }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newMembers, setNewMembers] = useState([])

  const handleAddMember = () => {
    if (newMembers.length > 0) {
      onAddMember(newMembers)
      // Reset state
      setNewMembers([])
      setSearchQuery("")
    }
  }

  const handleMemberSelect = (user) => {
    // Check if member is already in new members
    if (!newMembers.some(member => member.id === user.id)) {
      setNewMembers([...newMembers, { ...user, role: "" }])
    }
  }

  const handleRoleChange = (userId, role) => {
    setNewMembers(prev => 
      prev.map(member => 
        member.id === userId ? { ...member, role } : member
      )
    )
  }

  const removeNewMember = (userId) => {
    setNewMembers(prev => prev.filter(member => member.id !== userId))
  }

  const suggestedMembers = [
    { id: 'u1', name: 'Alex Johnson', role: 'Lab Technician', department: 'Laboratory' },
    { id: 'u2', name: 'Jessica Williams', role: 'Data Scientist', department: 'Analytics' },
    { id: 'u3', name: 'Robert Garcia', role: 'Research Assistant', department: 'Research' },
  ]

  const filteredMembers = suggestedMembers.filter(member => 
    (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !newMembers.some(newMember => newMember.id === member.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to the project team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="member-search">Search User</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="member-search" 
                placeholder="Search by name or email" 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* New Members Section */}
          {newMembers.length > 0 && (
            <div className="space-y-2">
              <Label>New Members</Label>
              <div className="border rounded-md divide-y">
                {newMembers.map((member) => (
                  <div key={member.id} className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role} • {member.department}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNewMember(member.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      value={member.role}
                      onValueChange={(value) => handleRoleChange(member.id, value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Members Section */}
          <div className="border rounded-md">
            <div className="p-2 border-b">
              <h4 className="text-sm font-medium">Suggested Members</h4>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredMembers.map((user, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMemberSelect(user)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setNewMembers([])
              setSearchQuery("")
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember}
            disabled={newMembers.length === 0 || newMembers.some(member => !member.role)}
          >
            Add to Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}