"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectDetails } from "@/components/dashboard/project-management/project-details"

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.id
  
  return (
    <DashboardLayout>
      <ProjectDetails projectId={projectId} />
    </DashboardLayout>
  )
}
