"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddMemberModal({ open, onOpenChange, onAddMember }) {
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
              <Input id="member-search" placeholder="Search by name or email" className="pl-8" />
            </div>
          </div>
          <div className="border rounded-md">
            <div className="p-2 border-b">
              <h4 className="text-sm font-medium">Suggested Members</h4>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {[
                { id: 'u1', name: 'Alex Johnson', role: 'Lab Technician', department: 'Laboratory' },
                { id: 'u2', name: 'Jessica Williams', role: 'Data Scientist', department: 'Analytics' },
                { id: 'u3', name: 'Robert Garcia', role: 'Research Assistant', department: 'Research' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-role">Role in Project</Label>
            <Select>
              <SelectTrigger id="member-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            onAddMember();
            onOpenChange(false);
          }}>Add to Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}