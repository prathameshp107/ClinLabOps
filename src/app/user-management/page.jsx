"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { UserManagement } from "@/components/user-management/user-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { getProfile } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export default function UserManagementPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const userProfile = await getProfile()
        setUser(userProfile)

        // Check if user is a power user
        if (userProfile.isPowerUser === true) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        // Redirect to login if not authenticated
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthorization()
  }, [router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
          <BackgroundBeams className="opacity-10" />
          <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
            <div className="flex items-center justify-center min-h-[80vh]">
              <Alert variant="destructive" className="max-w-md">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                  You do not have permission to access the user management page.
                  Only power users can access this section.
                </AlertDescription>
                <div className="mt-4">
                  <Button onClick={() => router.push("/dashboard")}>
                    Return to Dashboard
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
        <BackgroundBeams className="opacity-10" />

        <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">User Management</h1>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>

            <UserManagement />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}