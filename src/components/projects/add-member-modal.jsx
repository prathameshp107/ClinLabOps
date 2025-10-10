"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, X, UserPlus, Check, Search, Plus, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getAllUsers } from "@/services/userService"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function AddMemberModal({ open, onOpenChange, onAddMember }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [newMembers, setNewMembers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [openCombobox, setOpenCombobox] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const users = await getAllUsers();
        const usersArray = Array.isArray(users) ? users : users.users || [];
        setAllUsers(usersArray.map(user => ({
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role || (user.roles && user.roles[0]) || 'User',
          department: user.department || 'Unknown',
          avatar: user.name.charAt(0).toUpperCase()
        })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load users. Please try again.')
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);

  // Enhanced search functionality
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return allUsers;

    const query = searchQuery.toLowerCase();
    return allUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);

  const handleAddMember = () => {
    if (newMembers.length > 0) {
      onAddMember(newMembers)
      // Reset state
      setNewMembers([])
      setSearchQuery("")
      setSelectedUser(null)
    }
  }

  const handleUserSelect = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (user && !newMembers.some(member => member.id === user.id)) {
      setSelectedUser(user);
      setNewMembers([...newMembers, { ...user, role: "" }]);
    }
    setSearchQuery("")
    setOpenCombobox(false);
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
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Add Team Member
          </DialogTitle>
          <DialogDescription>
            Add new members to the project team. Search by name, email, department, or role.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="member-search">Select User</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between h-12"
                >
                  {selectedUser ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{selectedUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{selectedUser.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedUser.email}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select user...</span>
                  )}
                  {loading ? (
                    <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search by name, email, department, or role..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="h-12"
                  />
                  <CommandList>
                    {loading ? (
                      <div className="py-6 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
                      </div>
                    ) : error ? (
                      <div className="py-6 text-center">
                        <div className="mx-auto h-6 w-6 text-red-500">⚠️</div>
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setLoading(true)
                            setError(null)
                            getAllUsers()
                              .then(users => {
                                const usersArray = Array.isArray(users) ? users : users.users || [];
                                setAllUsers(usersArray.map(user => ({
                                  id: user._id || user.id,
                                  name: user.name,
                                  email: user.email,
                                  role: user.role || (user.roles && user.roles[0]) || 'User',
                                  department: user.department || 'Unknown',
                                  avatar: user.name.charAt(0).toUpperCase()
                                })));
                              })
                              .catch(err => {
                                console.error('Failed to fetch users:', err);
                                setError('Failed to load users. Please try again.')
                              })
                              .finally(() => setLoading(false))
                          }}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty className="py-4 text-center text-sm">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No users found</p>
                            <p className="text-xs text-muted-foreground">Try a different search term</p>
                          </div>
                        </CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={handleUserSelect}
                              className="flex items-center gap-3 py-2.5 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-sm font-medium">{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium truncate">{user.name}</p>
                                  {user.role && (
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      {user.role}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                  <p className="text-xs text-muted-foreground">{user.department}</p>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* New Members Section */}
          {newMembers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Selected Members ({newMembers.length})</Label>
              </div>
              <div className="border rounded-lg divide-y bg-muted/30">
                {newMembers.map((member) => (
                  <div key={member.id} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-medium">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {member.department}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNewMember(member.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 ml-13">
                      <Label className="text-xs text-muted-foreground">Assign Role</Label>
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                      >
                        <SelectTrigger className="h-8 text-sm mt-1">
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
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setNewMembers([])
              setSearchQuery("")
              setSelectedUser(null)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={newMembers.length === 0 || newMembers.some(member => !member.role)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add to Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}