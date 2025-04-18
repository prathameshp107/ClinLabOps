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
      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundBeams className="opacity-20" />
        {/* Floating Action Button for quick task creation */}
        <motion.button
          onClick={() => setShowTaskModal(true)}
          className="fixed bottom-7 right-7 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <Plus className="h-7 w-7" />
          <span className="sr-only">Add Task</span>
        </motion.button>
        {/* Modal placeholder for quick add */}
        <AnimatePresence>
          {showTaskModal && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTaskModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-background rounded-xl p-8 shadow-2xl min-w-[320px] max-w-[90vw] border border-border/50"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">Quick Add Task</h2>
                <p className="text-muted-foreground mb-4">(Coming soon: A full-featured quick add task form!)</p>
                <Button onClick={() => setShowTaskModal(false)} variant="outline">Close</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-6 w-full relative z-10">
          {/* Sticky header/toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-background/40 backdrop-blur-md rounded-xl p-5 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-0 z-30"
          >
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
                Task Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Create, assign, and track laboratory tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-9 bg-background/70 border-border/50 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Advanced filters placeholder */}
              <Button variant="outline" size="icon" className="h-9 w-9 shadow-md bg-background/70 border-border/50 ml-1">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setShowTaskModal(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
                onClick={handleRefresh}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </motion.div>
          {/* Animated statistics cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07, duration: 0.4 }}
                className="bg-background/70 border border-border/40 rounded-xl p-4 flex flex-col items-center justify-center shadow-md"
              >
                <div className="mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-3"
            >
              <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Tasks Overview</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 shadow-sm">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 shadow-sm">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>Sort</span>
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Manage and track all laboratory tasks in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Removed the tabs and directly showing TaskManagement */}
                  <TaskManagement view="all" searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted animate-pulse"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded animate-pulse"></div>
                            <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center text-red-600">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">PCR Analysis</p>
                          <p className="text-xs text-muted-foreground">Due today</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center text-amber-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sample Preparation</p>
                          <p className="text-xs text-muted-foreground">Due tomorrow</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data Analysis</p>
                          <p className="text-xs text-muted-foreground">Due in 3 days</p>
                        </div>
                      </div>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="w-full mt-2">View all deadlines</Button>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team Workload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                            <div className="h-4 bg-muted rounded animate-pulse w-1/6"></div>
                          </div>
                          <div className="h-2 bg-muted rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Dr. Jane Smith</span>
                          <span className="text-muted-foreground">8 tasks</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-red-500 w-[80%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Dr. Mike Johnson</span>
                          <span className="text-muted-foreground">5 tasks</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-amber-500 w-[50%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Sarah Williams</span>
                          <span className="text-muted-foreground">3 tasks</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-green-500 w-[30%] rounded-full"></div>
                        </div>
                      </div>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="w-full mt-2">Manage team</Button>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Task Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold text-primary">78%</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">On-time Rate</p>
                      <p className="text-2xl font-bold text-primary">82%</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold text-primary">24</p>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border/30 shadow-sm">
                      <p className="text-xs text-muted-foreground">Avg. Duration</p>
                      <p className="text-2xl font-bold text-primary">3.2d</p>
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
