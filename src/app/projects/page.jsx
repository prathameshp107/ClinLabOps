"use client"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProjectManagement } from "@/components/projects/project-management"
import { ProjectsLoading } from "@/components/projects/projects-loading"
import { Button } from "@/components/ui/button"
import { Plus, Beaker, Sparkles, LayoutGrid, List, FlaskConical, FileText, Layers } from "lucide-react"
import { useState, useEffect } from "react"
import { statusChips } from "@/constants"
import { getSettings } from "@/services/settingsService"

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projectCategories, setProjectCategories] = useState([])
  const [view, setView] = useState("board")
  const [status, setStatus] = useState("all")

  // Load project categories from settings
  useEffect(() => {
    const loadProjectCategories = async () => {
      try {
        const settings = await getSettings();
        if (settings.project && settings.project.categories) {
          setProjectCategories(settings.project.categories);
        } else {
          // Fallback to default categories if none are defined
          setProjectCategories([
            {
              id: "research",
              name: "Research",
              description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
              icon: "FlaskConical",
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
              borderColor: "border-blue-500/20"
            },
            {
              id: "regulatory",
              name: "Regulatory",
              description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
              icon: "FileText",
              color: "text-amber-500",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/20"
            },
            {
              id: "miscellaneous",
              name: "Miscellaneous",
              description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
              icon: "Layers",
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
              borderColor: "border-purple-500/20"
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load project categories:', error);
        // Fallback to default categories on error
        setProjectCategories([
          {
            id: "research",
            name: "Research",
            description: "Exploratory or proof-of-concept studies to generate new scientific knowledge.",
            icon: "FlaskConical",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
          },
          {
            id: "regulatory",
            name: "Regulatory",
            description: "Guideline-driven studies (ISO, OECD, FDA, etc.) for authority submissions.",
            icon: "FileText",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20"
          },
          {
            id: "miscellaneous",
            name: "Miscellaneous",
            description: "Pilot, academic, or client-specific studies for non-regulatory purposes.",
            icon: "Layers",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20"
          }
        ]);
      } finally {
        // Add a small delay to ensure smooth loading
        const timer = setTimeout(() => {
          setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
      }
    };

    loadProjectCategories();
  }, [])

  // Simulate loading state
  useEffect(() => {
    if (projectCategories.length > 0 && loading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [projectCategories, loading])

  if (loading) {
    return (
      <DashboardLayout>
        <ProjectsLoading />
      </DashboardLayout>
    )
  }

  // Icon mapping
  const iconMap = {
    FlaskConical: FlaskConical,
    FileText: FileText,
    Layers: Layers
  };

  return (
    <DashboardLayout>
      <div className="w-full px-0 py-6">
        {/* Sticky Responsive Header for Mobile */}
        <div className="md:hidden sticky top-0 z-20 bg-gradient-to-r from-background to-background/50 backdrop-blur-sm px-4 py-4 flex items-center justify-between border-b border-border/50">
          <div>
            <h1 className="text-xl font-bold text-foreground">Projects</h1>
            <p className="text-xs text-muted-foreground">Research & Development</p>
          </div>
          <Button className="bg-primary text-primary-foreground rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* Enhanced Header */}
        <div className="hidden md:flex flex-row items-center justify-between gap-6 mb-8 px-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Beaker className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Projects</h1>
                <p className="text-muted-foreground">
                  Manage your research projects and experiments in one centralized workspace.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full text-sm text-primary font-medium">
                <Beaker className="h-4 w-4" />
                <span>Research Hub</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-2 rounded-full text-sm text-amber-600 font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Innovation Center</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Categories Section */}
        <div className="w-full px-4 md:px-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectCategories.map((category) => {
              const IconComponent = iconMap[category.icon] || Beaker;
              return (
                <div
                  key={category.id}
                  className={`border ${category.borderColor} ${category.bgColor} rounded-xl p-6 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ProjectManagement (board/list) */}
        <div className="w-full px-4 md:px-8">
          <ProjectManagement view={view} status={status} />
        </div>
      </div>
    </DashboardLayout>
  )
}