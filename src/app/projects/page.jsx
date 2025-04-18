"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectManagement } from "@/components/dashboard/project-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { motion } from "framer-motion"
import { Sparkles, Beaker, FolderKanban } from "lucide-react"

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
        <BackgroundBeams className="opacity-15" />
        
        <div className="container max-w-full mx-auto p-4 md:p-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-background/80 to-background/40 backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FolderKanban className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Projects
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base max-w-md">
                    Manage your research projects and experiments in one centralized workspace
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full">
                  <Beaker className="h-3.5 w-3.5 text-primary" />
                  <span>Research Hub</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/5 px-3 py-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Innovation Center</span>
                </div>
              </div>
            </div>
            
            <ProjectManagement />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
