"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ExperimentManagement } from "@/components/dashboard/experiment-management"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { motion } from "framer-motion"
import { Beaker, FlaskConical, Microscope, Atom } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExperimentsPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

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
            {/* Header Section with Icon */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FlaskConical className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Experiments
                  </h1>
                  <p className="text-muted-foreground">
                    Manage laboratory experiments, protocols, and results
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mt-2 md:mt-0">
                  <Card className="bg-card/50 backdrop-blur-sm border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-blue-500/10 p-2.5 rounded-full group-hover:bg-blue-500/20 transition-colors duration-300">
                        <Beaker className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Active Experiments</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold">24</p>
                          <span className="text-xs text-blue-500">+3 this week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-green-500/10 p-2.5 rounded-full group-hover:bg-green-500/20 transition-colors duration-300">
                        <Microscope className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Completed Studies</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold">18</p>
                          <span className="text-xs text-green-500">+2 this month</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border border-border/30 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="bg-amber-500/10 p-2.5 rounded-full group-hover:bg-amber-500/20 transition-colors duration-300">
                        <Atom className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Pending Analysis</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-bold">7</p>
                          <span className="text-xs text-amber-500">3 urgent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Tabs for different experiment views */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="all" className="rounded-md">All Experiments</TabsTrigger>
                <TabsTrigger value="active" className="rounded-md">Active</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-md">Completed</TabsTrigger>
                <TabsTrigger value="archived" className="rounded-md">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <ExperimentManagement />
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                <ExperimentManagement filterStatus="active" />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <ExperimentManagement filterStatus="completed" />
              </TabsContent>
              
              <TabsContent value="archived" className="mt-0">
                <ExperimentManagement filterStatus="archived" />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}