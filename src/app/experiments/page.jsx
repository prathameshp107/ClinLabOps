"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ExperimentManagement } from "@/components/dashboard/experiment-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"

export default function ExperimentsPage() {
  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
        <BackgroundBeams className="opacity-10" />
        
        <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Experiments</h1>
              <p className="text-muted-foreground">Manage laboratory experiments, protocols, and results</p>
            </div>
            
            <ExperimentManagement />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}