"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProjectById, updateProject } from "@/services/projectService"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProjectPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await getProjectById(id)
        if (data) {
          const adaptedData = { ...data, id: data._id }
          setProject(adaptedData)
        } else {
          setError("Project not found.")
        }
      } catch (err) {
        setError("Failed to load project details.")
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  const handleSave = async (updatedData) => {
    try {
      await updateProject(id, updatedData)
      router.push(`/projects/${id}`) // Redirect to the project detail page
    } catch (error) {
      console.error("Failed to update project:", error)
      // You can add state to show an error message in the UI
      alert("Failed to save project. Please try again.")
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8"><Skeleton className="h-96 w-full" /></div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-red-500">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <EditProjectDialog
          project={project}
          open={true} // Keep the dialog open as it's the main content
          onOpenChange={() => router.back()} // Go back if the user closes it
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  )
}
