"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { profileData } from "@/data/profile-data"

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState(profileData)
  const { toast } = useToast()

  // Handle updating user data
  const handleUpdateUserData = (section, data) => {
    const updatedUserData = {
      ...userData,
      [section]: {
        ...userData[section],
        ...data
      }
    }
    
    setUserData(updatedUserData)
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
      variant: "success",
    })
  }

  // Handle updating profile picture
  const handleUpdateProfilePicture = (imageUrl) => {
    setUserData({
      ...userData,
      personal: {
        ...userData.personal,
        profilePicture: imageUrl
      }
    })
    
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
      variant: "success",
    })
  }

  // Handle adding a new skill
  const handleAddSkill = (newSkill) => {
    if (!userData.skills.includes(newSkill)) {
      const updatedSkills = [...userData.skills, newSkill]
      setUserData({
        ...userData,
        skills: updatedSkills
      })
      
      toast({
        title: "Skill added",
        description: `"${newSkill}" has been added to your skills.`,
        variant: "success",
      })
    }
  }

  // Handle removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = userData.skills.filter(skill => skill !== skillToRemove)
    setUserData({
      ...userData,
      skills: updatedSkills
    })
    
    toast({
      title: "Skill removed",
      description: `"${skillToRemove}" has been removed from your skills.`,
      variant: "success",
    })
  }

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
    >
      
        <div className="container px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
          <ProfileHeader 
            userData={userData} 
            onUpdateProfilePicture={handleUpdateProfilePicture} 
          />
          
          <ProfileTabs 
            userData={userData} 
            onUpdateUserData={handleUpdateUserData}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        </div>
      
    </DashboardLayout>
  )
}