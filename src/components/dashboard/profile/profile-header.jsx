"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Upload, Camera, User } from "lucide-react"
import { motion } from "framer-motion"

export function ProfileHeader({ userData, onUpdateProfilePicture }) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [fileSelected, setFileSelected] = useState(false)

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
        setFileSelected(true)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle upload confirmation
  const handleUploadConfirm = () => {
    if (previewImage) {
      onUpdateProfilePicture(previewImage)
      setUploadDialogOpen(false)
      setPreviewImage(null)
      setFileSelected(false)
    }
  }

  // Reset upload dialog state when closed
  const handleDialogOpenChange = (open) => {
    setUploadDialogOpen(open)
    if (!open) {
      setPreviewImage(null)
      setFileSelected(false)
    }
  }

  return (
    <div className="mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-6 sm:p-8 border border-border/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center relative z-10">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={userData.personal.profilePicture} alt={userData.personal.fullName} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {getInitials(userData.personal.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <button 
              onClick={() => setUploadDialogOpen(true)}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Change profile picture</span>
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{userData.personal.fullName}</h1>
              {userData.professional.isVerified && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-medium">
                  Verified
                </Badge>
              )}
              {!userData.professional.isProfileComplete && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium">
                  Incomplete Profile
                </Badge>
              )}
            </div>
            
            <div className="text-lg text-muted-foreground">{userData.professional.title}</div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div>{userData.professional.department}</div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground" />
              <div>{userData.professional.labLocation}</div>
              <div className="hidden sm:block h-1 w-1 rounded-full bg-muted-foreground" />
              <div>Joined {new Date(userData.professional.dateJoined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          
          <div className="sm:ml-auto">
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update profile picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. The image will be cropped to fit a square.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <Avatar className="h-32 w-32 border-2 border-border">
                <AvatarImage src={previewImage || userData.personal.profilePicture} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(userData.personal.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="grid w-full gap-2">
                <Label htmlFor="picture" className="text-center">Choose an image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('picture').click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadConfirm}
              disabled={!fileSelected}
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}