"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TaskManagement } from "@/components/dashboard/task-management"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { SparklesCore } from "@/components/ui/aceternity/sparkles"
import {
  Search,
  Plus,
  Filter,
  Calendar,
  BarChart2,
  Users,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react"

export default function TasksPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  // --- Stats mock data (replace with real data logic) ---
  const stats = [
    { label: "Total Tasks", value: 42, icon: <BarChart2 className="h-5 w-5 text-primary" /> },
    { label: "Completed", value: 18, icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
    { label: "In Progress", value: 12, icon: <Clock className="h-5 w-5 text-yellow-500" /> },
    { label: "Overdue", value: 3, icon: <AlertCircle className="h-5 w-5 text-red-500" /> },
  ];
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
        <BackgroundBeams className="opacity-30" />
        {/* Floating Action Button for quick task creation */}
        
        <div className="p-8 w-full relative z-10">
          {/* Sticky header/toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-background/60 backdrop-blur-xl rounded-2xl p-6 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-0 z-30"
          >
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 drop-shadow-sm">
                Task Management
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Create, assign, and track laboratory tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-11 h-12 bg-background/80 border-border/50 shadow-lg rounded-xl focus:ring-2 focus:ring-primary/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg bg-background/80 border-border/50 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 rounded-xl hover:bg-primary/5"
                onClick={handleRefresh}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </motion.div>

          {/* Animated statistics cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Tasks Overview
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="h-9 gap-2 shadow-md rounded-xl hover:bg-primary/5 transition-colors">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 gap-2 shadow-md rounded-xl hover:bg-primary/5 transition-colors">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Sort</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-2">
                    Manage and track all laboratory tasks in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskManagement view="all" searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-8"
            >
              <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted animate-pulse"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded-lg animate-pulse"></div>
                            <div className="h-3 bg-muted rounded-lg animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-base font-medium">PCR Analysis</p>
                          <p className="text-sm text-muted-foreground">Due today</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-base font-medium">Sample Preparation</p>
                          <p className="text-sm text-muted-foreground">Due tomorrow</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-base font-medium">Data Analysis</p>
                          <p className="text-sm text-muted-foreground">Due in 3 days</p>
                        </div>
                      </div>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 hover:bg-primary/5 transition-colors rounded-xl"
                  >
                    View all deadlines
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    Team Workload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-1/3"></div>
                            <div className="h-4 bg-muted rounded-lg animate-pulse w-1/6"></div>
                          </div>
                          <div className="h-2 bg-muted rounded-full animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-base">
                          <span className="font-medium">Dr. Jane Smith</span>
                          <span className="text-muted-foreground">8 tasks</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-400 w-[80%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-base">
                          <span className="font-medium">Dr. Mike Johnson</span>
                          <span className="text-muted-foreground">5 tasks</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 w-[50%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-base">
                          <span className="font-medium">Sarah Williams</span>
                          <span className="text-muted-foreground">3 tasks</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[30%] rounded-full"></div>
                        </div>
                      </div>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 hover:bg-primary/5 transition-colors rounded-xl"
                  >
                    Manage team
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                  <SparklesCore
                    id="tsparticles-stats"
                    background="transparent"
                    minSize={0.4}
                    maxSize={0.8}
                    particleDensity={40}
                    className="w-full h-full"
                    particleColor="#8B5CF6"
                  />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <BarChart2 className="h-6 w-6 text-primary" />
                    </div>
                    Task Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/30 shadow-lg">
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">78%</p>
                    </div>
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/30 shadow-lg">
                      <p className="text-sm text-muted-foreground">On-time Rate</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">82%</p>
                    </div>
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/30 shadow-lg">
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">24</p>
                    </div>
                    <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl border border-border/30 shadow-lg">
                      <p className="text-sm text-muted-foreground">Avg. Duration</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">3.2d</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
