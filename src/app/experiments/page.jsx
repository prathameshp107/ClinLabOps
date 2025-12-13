"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ExperimentManagement } from "@/components/experiment-management"
import { ExperimentsLoading } from "@/components/experiments/experiments-loading"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { motion } from "framer-motion"
import { Beaker, FlaskConical, Microscope, Atom } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExperimentsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <ExperimentsLoading />
  }

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-background/80">
        <BackgroundBeams className="opacity-10" />

        <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header moved to ExperimentManagement */}
            <ExperimentManagement />

          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}