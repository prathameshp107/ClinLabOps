"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { UserManagement } from "@/components/user-management/user-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"

export default function UserManagementPage() {
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