"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, Unlock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"
import { updateUser } from "@/services/userService"

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
    enable2FA: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set initial form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        department: user.department || "",
        status: user.status || "Active",
        enable2FA: user.twoFactorEnabled || false,
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare update data for backend
      const updateData = {
        name: formData.name,
        email: formData.email,
        roles: [formData.role], // Backend expects array
        department: formData.department,
        status: formData.status,
        twoFactorEnabled: formData.enable2FA,
      };

      // Update user via API
      const updatedUser = await updateUser(user._id || user.id, updateData);

      // Notify parent component to refresh data
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      toast({
        title: "User updated successfully",
        description: `${formData.name}'s profile has been updated.`,
      });

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating user:", error)
      const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred";
      toast({
        title: "Error updating user",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information, role, and security settings.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="security">Security Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              {user && (
                <div className="bg-muted/50 rounded-md p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">User ID</h4>
                      <p className="text-xs text-muted-foreground">{user._id || user.id}</p>
                    </div>
                    {user.lastLogin && (
                      <div className="text-right">
                        <h4 className="font-medium text-sm">Last Login</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(user.lastLogin), "PPpp")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.role && (
                <div className="grid gap-2">
                  <Label>Current Role</Label>
                  <Badge variant="outline" className="w-fit">
                    {formData.role}
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="required">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="required">Email Address</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role" className="required">Role</Label>
                  <Select
                    required
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger id="edit-role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>User Roles</SelectLabel>
                        <SelectItem value="Admin" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-500" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Scientist">Scientist</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Reviewer">Reviewer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department (Optional)</Label>
                  <Input
                    id="edit-department"
                    name="department"
                    placeholder="Research & Development"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-status">
                      {formData.status === "Active" ? "Active" : "Inactive"}
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {formData.status === "Active"
                        ? "User can log in and use the system"
                        : "User cannot log in until activated"}
                    </div>
                  </div>
                  <Switch
                    id="user-status"
                    checked={formData.status === "Active"}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        status: checked ? "Active" : "Inactive"
                      }))
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Two-Factor Authentication (2FA)</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enable2FA">
                        {formData.enable2FA ? "Enabled" : "Disabled"}
                      </Label>
                      {formData.enable2FA ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                          <Lock className="h-3 w-3 mr-1" />
                          Secure
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                          <Unlock className="h-3 w-3 mr-1" />
                          Vulnerable
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formData.enable2FA
                        ? "User is required to use an authenticator app"
                        : "User can log in with just a password"}
                    </div>
                  </div>
                  <Switch
                    id="enable2FA"
                    checked={formData.enable2FA}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, enable2FA: checked }))
                    }
                  />
                </div>
              </div>

              <div className="rounded-md border p-3 bg-muted/50">
                <div className="space-y-2">
                  <h3 className="font-medium">Security Actions</h3>
                  <div className="text-sm text-muted-foreground">
                    To reset the user's password or modify other security settings, use the dedicated actions in the user management table.
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false)
                        // This would typically trigger the reset password dialog
                        console.log("Reset password for user:", user?.id)
                      }}
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
