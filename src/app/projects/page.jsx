"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectManagement } from "@/components/dashboard/project-management"
import { Button } from "@/components/ui/button"
import { Plus, Beaker, Sparkles, LayoutGrid, List } from "lucide-react"
import { useState } from "react"

const statusChips = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in-progress" },
  { label: "On Hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
]

export default function ProjectsPage() {
  // Demo state for view toggle and status filter
  const [view, setView] = useState("board")
  const [status, setStatus] = useState("all")


  return (
    <div className="min-h-screen w-full bg-[#f4f5f7]">
      <DashboardLayout>
        <div className="w-full px-0 py-8">
          {/* Sticky Responsive Header for Mobile */}
          <div className="md:hidden sticky top-0 z-20 bg-[#f4f5f7] px-4 py-3 flex items-center justify-between border-b border-[#e5e7eb]">
            <h1 className="text-lg font-bold text-[#1e293b]">Projects</h1>
            <Button className="bg-[#2563eb] text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-none hover:bg-[#174ea6]">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>

          {/* Header */}
          <div className="hidden md:flex flex-row items-center justify-between gap-4 mb-6 px-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Projects</h1>
              <p className="text-sm text-[#64748b] mt-1">
                Manage your research projects and experiments in one centralized workspace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full text-xs text-primary">
                <Beaker className="h-3.5 w-3.5" />
                <span>Research Hub</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs text-amber-600">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Innovation Center</span>
              </div>
            </div>
          </div>

          {/* ProjectManagement (board/list) */}
          <div className="w-full px-4 md:px-8">
            <ProjectManagement view={view} status={status} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
