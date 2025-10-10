"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Eye, EyeOff, Copy, RefreshCw, Check, Upload, X, Loader2 } from "lucide-react"
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { createUser, inviteUser } from "@/services/userService"

export function AddUserDialog({ open, onOpenChange, onAddUser, onUserCreated }) {
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
    confirmPassword: "",
    phone: "",
    isPowerUser: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

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

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.role) newErrors.role = "Role is required"

    if (formData.passwordType === "manual") {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (!passwordStrength?.valid) {
        newErrors.password = "Password does not meet requirements"
      }
      if (!passwordsMatch) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
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

  const validateAvatarFile = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && validateAvatarFile(file)) {
      setAvatarLoading(true);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target.result);
        setAvatarLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateAvatarFile(file)) {
      setAvatarLoading(true);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target.result);
        setAvatarLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true)

    try {
      // Prepare user data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined, // Let backend generate if not provided
        roles: [formData.role], // Backend expects array
        department: formData.department,
        phone: formData.phone,
        status: formData.status,
        isPowerUser: formData.isPowerUser,
        twoFactorEnabled: formData.enable2FA,
        // Note: avatar upload would need separate implementation
      };

      // Create user via API
      const newUser = await createUser(userData);

      // Call parent component's handler to refresh the user list
      if (onAddUser) {
        onAddUser(newUser);
      }

      toast({
        title: "User created successfully",
        description: `${formData.name} has been added to the system.`,
      });

      // Reset form and close dialog
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
        confirmPassword: "",
        phone: "",
        isPowerUser: false,
      })
      setAvatarFile(null);
      setAvatarPreview("");
      setErrors({});
    } catch (error) {
      console.error("Error creating user:", error)
      const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred";
      toast({
        title: "Error creating user",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInvite = async () => {
    if (!formData.email || errors.email) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address first.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.role) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name and role before sending invitation.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare invitation data
      const inviteData = {
        name: formData.name,
        email: formData.email,
        roles: [formData.role],
        department: formData.department
      };

      // Send invitation via API
      await inviteUser(inviteData);

      toast({
        title: "Invitation Sent",
        description: `An invitation email was sent to ${formData.email}`
      });

      setFormData(prev => ({ ...prev, status: "Invited" }));
    } catch (error) {
      console.error("Error sending invitation:", error);
      const errorMessage = error.response?.data?.error || "Failed to send invitation";
      toast({
        title: "Error sending invitation",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
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
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative group cursor-pointer transition-all duration-200 ${isDragOver ? 'scale-105' : 'hover:scale-105'
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Avatar className="h-24 w-24 ring-4 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary/50 transition-all duration-200">
                        {avatarLoading ? (
                          <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : avatarPreview ? (
                          <AvatarImage src={avatarPreview} alt="Avatar preview" />
                        ) : (
                          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                            {formData.name ? formData.name[0].toUpperCase() : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {avatarPreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAvatar();
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-black/50 rounded-full p-2">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click or drag to upload avatar</p>
                  </TooltipContent>
                </Tooltip>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Upload a profile picture (JPEG, PNG, GIF, WebP)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maximum size: 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="required">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
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
                    className={errors.email ? "border-red-500" : ""}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="role" className="required">Role</Label>
                  <Select
                    required
                    value={formData.role}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, role: value }))
                      if (errors.role) {
                        setErrors(prev => ({ ...prev, role: "" }))
                      }
                    }}
                  >
                    <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
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
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role}</p>
                  )}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Invited">Invited</SelectItem>
                      <SelectItem value="Locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 555-123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2 flex items-center mt-6">
                  <Label htmlFor="isPowerUser">Power User</Label>
                  <Switch
                    id="isPowerUser"
                    checked={formData.isPowerUser}
                    onCheckedChange={checked => setFormData(prev => ({ ...prev, isPowerUser: checked }))}
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
                        className={errors.password ? "border-red-500" : ""}
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
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
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
                      className={errors.confirmPassword ? "border-red-500" : ""}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="text-sm">Password strength:</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1 w-16 rounded-full ${passwordStrength?.minLength ? "bg-green-500" : "bg-gray-200"
                              }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1 w-16 rounded-full ${passwordStrength?.hasUppercase ? "bg-green-500" : "bg-gray-200"
                              }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1 w-16 rounded-full ${passwordStrength?.hasLowercase ? "bg-green-500" : "bg-gray-200"
                              }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1 w-16 rounded-full ${passwordStrength?.hasNumber ? "bg-green-500" : "bg-gray-200"
                              }`}
                          ></div>
                          <span className="text-xs text-muted-foreground">Number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-1 w-16 rounded-full ${passwordStrength?.hasSpecial ? "bg-green-500" : "bg-gray-200"
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

          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleInvite}
                  disabled={!formData.email || !!errors.email}
                >
                  Invite by Email
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send invitation email to this user</p>
              </TooltipContent>
            </Tooltip>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
