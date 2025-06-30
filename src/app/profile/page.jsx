"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { getProfile, isAuthenticated } from "@/services/authService"

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    getProfile()
      .then((data) => {
        setUserData(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        toast({
          title: "Error",
          description: err.message || "Failed to load profile.",
          variant: "destructive",
        })
        router.push("/login")
      })
  }, [])

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

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading profile...</div>
  }

  if (!userData) {
    return null
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