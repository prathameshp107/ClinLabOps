"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { getProfile, isAuthenticated, updateProfile } from "@/services/authService"
import { ProfileLoading } from "@/components/profile/profile-loading"

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
        // Ensure the data structure matches what our components expect
        const formattedData = {
          ...data,
          personal: {
            fullName: data.name || data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || ''
          }
        }
        setUserData(formattedData)
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
  const handleUpdateUserData = async (section, data) => {
    try {
      // Prepare data for the API call
      const updateData = {
        fullName: data.fullName || userData.personal.fullName,
        email: data.email || userData.personal.email,
        phone: data.phone || userData.personal.phone,
        department: data.department || userData.personal.department
      };

      // Call the updateProfile service
      const updatedUser = await updateProfile(updateData);

      // Update local state with the response
      const formattedData = {
        ...updatedUser,
        personal: {
          fullName: updatedUser.name || updatedUser.fullName || '',
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          department: updatedUser.department || ''
        }
      };

      setUserData(formattedData);

      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
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

  if (loading) {
    return <ProfileLoading />;
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
        />
      </div>
    </DashboardLayout>
  )
}