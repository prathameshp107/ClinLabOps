"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KeyRound, Mail, Copy, Check, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ResetPasswordDialog({ user, open, onOpenChange }) {
  const [method, setMethod] = useState("email")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [temporaryPassword, setTemporaryPassword] = useState("")
  const [forceChange, setForceChange] = useState(true)
  const [copied, setCopied] = useState(false)
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // In a real app, this would call an API to reset the password
      console.log(`Resetting password for user: ${user.id}, method: ${method}, forceChange: ${forceChange}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (method === "generate") {
        // Generate a random password (in a real app this would come from the backend)
        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(10).slice(-2).toUpperCase() + "!"
        setTemporaryPassword(randomPassword)
        setIsGenerated(true)
      } else {
        // Email method would close the dialog after sending
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error resetting password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }
  
  const handleClose = () => {
    // Reset state when closing
    setIsGenerated(false)
    setTemporaryPassword("")
    setCopied(false)
    onOpenChange(false)
  }

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "None" };
    
    // Simple password strength calculator (in a real app, use a more sophisticated algorithm)
    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return { 
      score: Math.min(score, 5),
      label: labels[score] 
    };
  }
  
  const strength = getPasswordStrength(temporaryPassword);

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" /> Reset Password
          </DialogTitle>
          <DialogDescription>
            Reset the password for <span className="font-medium">{user?.name || 'User'}</span> ({user?.email})
          </DialogDescription>
        </DialogHeader>
        
        {!isGenerated ? (
          <>
            {user && (
              <div className="bg-muted/50 rounded-md p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">User ID</h4>
                    <p className="text-xs text-muted-foreground">{user.id}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium text-sm">Current Status</h4>
                    <p className="text-xs text-muted-foreground">
                      <Badge 
                        variant={user.status === "Active" ? "outline" : "secondary"}
                        className={user.status === "Active" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" : ""}
                      >
                        {user.status || "Unknown"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            )}
          
            <Tabs defaultValue="email" className="w-full" onValueChange={setMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Reset Link
                </TabsTrigger>
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Generate Password
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="mt-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm mb-2">A password reset link will be sent to:</p>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    The link will expire after 24 hours. The user will receive an email with instructions.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Switch 
                    id="force-change-email" 
                    checked={forceChange}
                    onCheckedChange={setForceChange}
                  />
                  <div>
                    <Label htmlFor="force-change-email">
                      Force password change on next login
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      User will be required to set a new password immediately after logging in
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="generate" className="mt-4 space-y-4">
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Temporary Password</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                      Auto-Generated
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    A secure temporary password will be generated. You'll need to securely share this with the user.
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch 
                      id="force-change-generate" 
                      checked={forceChange}
                      onCheckedChange={setForceChange}
                    />
                    <div>
                      <Label htmlFor="force-change-generate">
                        Force password change on next login
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        User will be required to set a new password immediately after logging in
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 rounded-md border p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Make sure to communicate the temporary password securely to the user.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : method === "email" ? "Send Reset Link" : "Generate Password"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="rounded-md border p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Temporary Password</h3>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${strength.score >= 4 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800' : ''}
                        ${strength.score >= 2 && strength.score < 4 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800' : ''}
                        ${strength.score < 2 ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800' : ''}
                      `}
                    >
                      {strength.score >= 4 ? <ShieldCheck className="h-3 w-3 mr-1 inline" /> : 
                       strength.score < 2 ? <ShieldAlert className="h-3 w-3 mr-1 inline" /> : null}
                      {strength.label}
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    <Input 
                      value={temporaryPassword} 
                      readOnly 
                      className="pr-10 font-mono text-base"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={copyToClipboard}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={copyToClipboard}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                    {copied ? <Check className="h-4 w-4 ml-2" /> : <Copy className="h-4 w-4 ml-2" />}
                  </Button>
                  
                  <div className="text-sm mt-2">
                    <p className="font-medium">Password Settings:</p>
                    <ul className="mt-1 space-y-1 text-muted-foreground text-xs">
                      <li>• User: {user?.name} ({user?.email})</li>
                      <li>• {forceChange 
                            ? "User will be required to change this password on their next login" 
                            : "User can continue using this password"}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 rounded-md border p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Security Notice</p>
                  <p className="text-xs">Share this password securely with the user. Do not send it via unsecured channels like plain email or text messages.</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
