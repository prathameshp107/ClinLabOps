"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Eye, EyeOff, Copy, RefreshCw, Check } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function AddUserDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
    enable2FA: false,
    sendInvite: true,
    passwordType: "auto",
    password: "",
    confirmPassword: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Password strength validation
  const validatePasswordStrength = (password) => {
    const minLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    
    return {
      valid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    }
  }
  
  const passwordStrength = formData.password ? validatePasswordStrength(formData.password) : null
  const passwordsMatch = formData.password === formData.confirmPassword

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }
  
  const generateRandomPassword = () => {
    // Generate a strong random password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    
    // Ensure at least one of each required character type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];
    
    // Fill up to 12 characters
    for (let i = 0; i < 8; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    setFormData(prev => ({ 
      ...prev, 
      password, 
      confirmPassword: password 
    }))
    setPasswordVisible(true)
  }
  
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(formData.password)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    
    if (!formData.name || !formData.email || !formData.role) {
      // Form validation would go here
      return
    }
    
    // Additional validation for manual password
    if (formData.passwordType === "manual") {
      if (!passwordStrength?.valid) {
        alert("Password does not meet strength requirements")
        return
      }
      
      if (!passwordsMatch) {
        alert("Passwords do not match")
        return
      }
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real app, this would call an API to create the user
      console.log("Creating new user:", {
        ...formData,
        password: formData.passwordType === "auto" && !formData.password ? "auto-generated" : "manually-set"
      })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onOpenChange(false)
      setFormData({
        name: "",
        email: "",
        role: "",
        department: "",
        status: "Active",
        enable2FA: false,
        sendInvite: true,
        passwordType: "auto",
        password: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and send an invitation email.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="password">Password & Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="required">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="required">Email Address</Label>
                  <Input
                    id="email"
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
                  <Label htmlFor="role" className="required">Role</Label>
                  <Select 
                    required
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger id="role" className="w-full">
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
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
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
                        ? "User can log in and use the system immediately" 
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
            
            <TabsContent value="password" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Password Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.passwordType === "auto" ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, passwordType: "auto" }))}
                  >
                    Auto Generate
                  </Button>
                  <Button
                    type="button"
                    variant={formData.passwordType === "manual" ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, passwordType: "manual" }))}
                  >
                    Set Manually
                  </Button>
                </div>
              </div>
              
              {formData.passwordType === "auto" ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Generated Password</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateRandomPassword}
                        className="h-8 gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Generate
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <Input
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Click Generate to create a password"
                        readOnly
                      />
                      <div className="absolute right-2 top-2.5 flex gap-1">
                        {formData.password && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={copyPasswordToClipboard}
                          >
                            {copySuccess ? (
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span className="sr-only">Copy password</span>
                          </Button>
                        )}
                        {formData.password && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            {passwordVisible ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                            <span className="sr-only">
                              {passwordVisible ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="required">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2.5 h-5 w-5"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">
                          {passwordVisible ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="required">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={passwordVisible ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                  
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="text-sm">Password strength:</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-1 w-16 rounded-full ${
                              passwordStrength?.minLength ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-1 w-16 rounded-full ${
                              passwordStrength?.hasUppercase ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-1 w-16 rounded-full ${
                              passwordStrength?.hasLowercase ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-1 w-16 rounded-full ${
                              passwordStrength?.hasNumber ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-1 w-16 rounded-full ${
                              passwordStrength?.hasSpecial ? "bg-green-500" : "bg-gray-200"
                            }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Special character</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.password && formData.confirmPassword && !passwordsMatch && (
                    <div className="text-sm text-red-500">
                      Passwords do not match
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable2FA">
                      Two-Factor Authentication (2FA)
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {formData.enable2FA 
                        ? "User will need to set up 2FA on first login" 
                        : "User can log in with just a password"}
                    </div>
                  </div>
                  <Switch
                    id="enable2FA"
                    checked={formData.enable2FA}
                    onCheckedChange={(checked) => handleCheckboxChange("enable2FA", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="sendInvite">
                      Send Invitation Email
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {formData.sendInvite 
                        ? "User will receive login details via email" 
                        : "No automatic email will be sent"}
                    </div>
                  </div>
                  <Switch
                    id="sendInvite"
                    checked={formData.sendInvite}
                    onCheckedChange={(checked) => handleCheckboxChange("sendInvite", checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
