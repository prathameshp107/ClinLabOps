"use client"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProjectManagement } from "@/components/projects/project-management"
import { ProjectsLoading } from "@/components/projects/projects-loading"
import { Button } from "@/components/ui/button"
import { Plus, Beaker, Sparkles, LayoutGrid, List, FlaskConical, FileText, Layers, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { statusChips } from "@/constants"
import { getSettings } from "@/services/settingsService"
import { motion } from "framer-motion"

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [projectCategories, setProjectCategories] = useState([])
  const [view, setView] = useState("board")
  const [status, setStatus] = useState("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

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

  // Navigation functions
  const goToNext = () => {
    if (currentIndex + 3 < projectCategories.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

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
      <div className="w-full min-h-screen bg-background/50">
        {/* Sticky Responsive Header for Mobile */}
        <div className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border/50">
          <div>
            <h1 className="text-xl font-bold text-foreground">Projects</h1>
            <p className="text-xs text-muted-foreground">Research & Development</p>
          </div>
          <Button className="bg-primary text-primary-foreground rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex flex-row items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                  <Beaker className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Projects
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage your research projects and experiments.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 p-1.5 rounded-full shadow-sm">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm text-primary font-medium transition-colors hover:bg-primary/20 cursor-default">
                  <Beaker className="h-4 w-4" />
                  <span>Research Hub</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full text-sm text-amber-600 font-medium transition-colors hover:bg-amber-500/20 cursor-default">
                  <Sparkles className="h-4 w-4" />
                  <span>Innovation Center</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project Categories Section with Horizontal Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground/90 flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Categories
              </h2>

              {/* Navigation Buttons */}
              {projectCategories.length > 3 && (
                <div className="flex gap-2">
                  <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className={`h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center transition-all ${currentIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-accent hover:text-accent-foreground hover:shadow-md cursor-pointer'
                      }`}
                    aria-label="Previous categories"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={currentIndex + 3 >= projectCategories.length}
                    className={`h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center transition-all ${currentIndex + 3 >= projectCategories.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-accent hover:text-accent-foreground hover:shadow-md cursor-pointer'
                      }`}
                    aria-label="Next categories"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Categories Container */}
            <div
              ref={containerRef}
              className="overflow-hidden -mx-4 px-4 py-2"
            >
              <div
                className="flex gap-6 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${currentIndex * 350}px)` }}
              >
                {projectCategories.map((category, index) => {
                  const IconComponent = iconMap[category.icon] || Beaker;
                  return (
                    <motion.div
                      key={category.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`
                        relative overflow-hidden rounded-2xl p-6 flex-shrink-0 w-[330px]
                        bg-gradient-to-br from-card to-card/50 border border-border/50
                        hover:shadow-xl hover:shadow-${category.color.split('-')[1]}-500/10
                        transition-all duration-300 group/card
                      `}
                    >
                      {/* Decorative background blob */}
                      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${category.bgColor} opacity-50 blur-3xl group-hover/card:opacity-70 transition-opacity`} />

                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`
                          p-3.5 rounded-xl ${category.bgColor} 
                          ring-1 ring-inset ring-black/5 dark:ring-white/10
                          shadow-sm group-hover/card:shadow-md transition-all
                        `}>
                          <IconComponent className={`h-6 w-6 ${category.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1.5 text-foreground group-hover/card:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Indicators */}
            {projectCategories.length > 3 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: projectCategories.length - 2 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-4' : 'bg-muted'
                      }`}
                    aria-label={`Go to category set ${index + 1}`}
                  />
                ))}
              </div>
            )}
        </motion.div>

        {/* ProjectManagement (board/list) */}
        <div className="w-full px-4 md:px-8">
          <ProjectManagement view={view} status={status} />
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}