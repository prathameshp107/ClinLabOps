"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectDetails } from "@/components/dashboard/project-management/project-details"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.id
  
  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
        <BackgroundBeams className="opacity-10" />
        
        <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
          <ProjectDetails projectId={projectId} />
        </div>
      </div>
    </DashboardLayout>
  )
}
