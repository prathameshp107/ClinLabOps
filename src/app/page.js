"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { PendingApprovals } from "@/components/dashboard/pending-approvals";
import { UserActivity } from "@/components/dashboard/user-activity";
import { ExperimentProgress } from "@/components/dashboard/experiment-progress";
import { ComplianceAlerts } from "@/components/dashboard/compliance-alerts";
import { SystemLogs } from "@/components/dashboard/system-logs";
import { SmartInsights } from "@/components/dashboard/smart-insights";
import { TaskHeatmap } from "@/components/dashboard/task-heatmap";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutGrid,
  LayoutList,
  Sparkles,
  Bell,
  Settings,
  RefreshCw,
  ChevronRight,
  Calendar,
  Clock,
  Zap,
  Search,
  Filter,
  ArrowUpRight,
  BarChart3,
  Layers
} from "lucide-react";
import {
  HoverGlowCard,
  GlowingStarsBackgroundCard
} from "@/components/ui/aceternity/cards";
import { ThreeDCard } from "@/components/ui/aceternity/three-d-card";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { cn } from "@/lib/utils";
import { TasksDashboard } from "@/components/dashboard/tasks-dashboard";
import { ExperimentsDashboard } from "@/components/dashboard/experiments-dashboard";

// Import all dashboard data
import {
  notificationCenterData,
  quickActionsData,
  taskOverviewData,
  pendingApprovalsData,
  userActivityData,
  dailyActiveUsersData,
  experimentProgressData,
  complianceAlertsData,
  systemLogsData,
  smartInsightsData,
  taskHeatmapData,
  tasksDashboardData,
  experimentsDashboardData
} from "@/data/dashboard-data";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [notificationCount, setNotificationCount] = useState(
    notificationCenterData.filter(notification => !notification.read).length
  );
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide welcome message after 5 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundBeams className="opacity-20" />

        <div className="p-3 sm:p-4 md:p-6 w-full relative z-10">
          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6 bg-gradient-to-r from-primary/20 to-primary/5 backdrop-blur-md rounded-xl p-4 border border-primary/30 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <SparklesCore
                    id="welcomeSparkles"
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={40}
                    className="w-full h-full"
                    particleColor="#8B5CF6"
                  />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Welcome to LabTasker Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Your lab operations at a glance</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWelcome(false)}
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-background/40 backdrop-blur-md rounded-xl p-5 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          >
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
                  Dashboard Overview
                </h1>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center">
                Welcome back! Here's what's happening in your lab today
                <ArrowUpRight className="h-3 w-3 ml-1 text-primary" />
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  className="h-9 w-[180px] rounded-md border border-border/50 bg-background/70 backdrop-blur-sm pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="bg-background/70 backdrop-blur-sm rounded-md border border-border/50 p-1 flex items-center shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 shadow-sm"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 shadow-sm"
                >
                  <LayoutList className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="relative h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
                      onClick={() => setNotificationCount(0)}
                    >
                      <Bell className="h-4 w-4" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                          {notificationCount}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))
            ) : (
              <>
                <ThreeDCard className="bg-gradient-to-br from-blue-50 via-blue-100/70 to-blue-50 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-950/20 border border-blue-200/70 dark:border-blue-800/30 rounded-xl p-5 h-28 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                        <span className="relative">
                          Total Tasks
                          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-400/30 dark:bg-blue-500/30 rounded-full"></span>
                        </span>
                      </p>
                      <h3 className="text-3xl font-bold mt-2 text-blue-700 dark:text-blue-300">68</h3>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1 flex items-center">
                        <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-1.5 py-0.5 mr-1">
                          <span className="mr-0.5">↑</span>12%
                        </span>
                        from last week
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-200/50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-full flex items-center justify-center shadow-md">
                      <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </ThreeDCard>

                <ThreeDCard className="bg-gradient-to-br from-purple-50 via-purple-100/70 to-purple-50 dark:from-purple-950/40 dark:via-purple-900/30 dark:to-purple-950/20 border border-purple-200/70 dark:border-purple-800/30 rounded-xl p-5 h-28 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center">
                        <span className="relative">
                          Active Users
                          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-purple-400/30 dark:bg-purple-500/30 rounded-full"></span>
                        </span>
                      </p>
                      <h3 className="text-3xl font-bold mt-2 text-purple-700 dark:text-purple-300">31</h3>
                      <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1 flex items-center">
                        <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-1.5 py-0.5 mr-1">
                          <span className="mr-0.5">↑</span>8%
                        </span>
                        from yesterday
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-200/50 dark:from-purple-900/40 dark:to-purple-800/20 rounded-full flex items-center justify-center shadow-md">
                      <BarChart3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </ThreeDCard>

                <ThreeDCard className="bg-gradient-to-br from-amber-50 via-amber-100/70 to-amber-50 dark:from-amber-950/40 dark:via-amber-900/30 dark:to-amber-950/20 border border-amber-200/70 dark:border-amber-800/30 rounded-xl p-5 h-28 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center">
                        <span className="relative">
                          Pending Approvals
                          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-amber-400/30 dark:bg-amber-500/30 rounded-full"></span>
                        </span>
                      </p>
                      <h3 className="text-3xl font-bold mt-2 text-amber-700 dark:text-amber-300">12</h3>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1 flex items-center">
                        <span className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full px-1.5 py-0.5 mr-1">
                          <span className="mr-0.5">↑</span>3
                        </span>
                        since yesterday
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-gradient-to-br from-amber-100 to-amber-200/50 dark:from-amber-900/40 dark:to-amber-800/20 rounded-full flex items-center justify-center shadow-md">
                      <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </ThreeDCard>

                <ThreeDCard className="bg-gradient-to-br from-green-50 via-green-100/70 to-green-50 dark:from-green-950/40 dark:via-green-900/30 dark:to-green-950/20 border border-green-200/70 dark:border-green-800/30 rounded-xl p-5 h-28 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between h-full">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                        <span className="relative">
                          Completed Tasks
                          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-green-400/30 dark:bg-green-500/30 rounded-full"></span>
                        </span>
                      </p>
                      <h3 className="text-3xl font-bold mt-2 text-green-700 dark:text-green-300">24</h3>
                      <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1 flex items-center">
                        <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-1.5 py-0.5 mr-1">
                          <span className="mr-0.5">↑</span>18%
                        </span>
                        this week
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-green-200/50 dark:from-green-900/40 dark:to-green-800/20 rounded-full flex items-center justify-center shadow-md">
                      <Zap className="h-7 w-7 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </ThreeDCard>
              </>
            )}
          </motion.div>

          <div className="mb-8">
            <QuickActions actions={quickActionsData} />
          </div>

          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-6 p-1 bg-background/70 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-border/40 rounded-lg">
              <TabsTrigger value="overview" className="shadow-sm data-[state=active]:shadow-md transition-shadow">Overview</TabsTrigger>
              <TabsTrigger value="tasks" className="shadow-sm data-[state=active]:shadow-md transition-shadow">Tasks</TabsTrigger>
              <TabsTrigger value="experiments" className="shadow-sm data-[state=active]:shadow-md transition-shadow">Experiments</TabsTrigger>
              <TabsTrigger value="analytics" className="shadow-sm data-[state=active]:shadow-md transition-shadow">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isLoading ? "hidden" : "visible"}
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <GlowingStarsBackgroundCard className="p-6 bg-background/60 backdrop-blur-md border border-border/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <SparklesCore
                          id="tsparticles"
                          background="transparent"
                          minSize={0.6}
                          maxSize={1.4}
                          particleDensity={70}
                          className="w-full h-full"
                          particleColor="#8B5CF6"
                        />
                      </div>
                      <div className="relative z-10">
                        <SmartInsights data={smartInsightsData} />
                      </div>
                    </div>
                  </GlowingStarsBackgroundCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"} gap-6 mb-8`}>
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <TasksOverview data={taskOverviewData} />
                      </div>
                    </HoverGlowCard>

                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <PendingApprovals data={pendingApprovalsData} />
                      </div>
                    </HoverGlowCard>

                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <UserActivity activityData={userActivityData} activeUsersData={dailyActiveUsersData} />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className={`grid ${viewMode === "grid" ? "grid-cols-1 2xl:grid-cols-2" : "grid-cols-1"} gap-6 mb-8`}>
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <ExperimentProgress data={experimentProgressData} />
                      </div>
                    </HoverGlowCard>

                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <TaskHeatmap data={taskHeatmapData} />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <ComplianceAlerts data={complianceAlertsData} />
                      </div>
                    </HoverGlowCard>

                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1 overflow-x-auto">
                        <NotificationCenter data={notificationCenterData} />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <HoverGlowCard className="w-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                    <div className="p-1 overflow-x-auto">
                      <SystemLogs data={systemLogsData} />
                    </div>
                  </HoverGlowCard>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="bg-background/40 backdrop-blur-md rounded-xl p-4 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <TasksDashboard data={tasksDashboardData} />
              </div>
            </TabsContent>

            <TabsContent value="experiments">
              <div className="bg-background/40 backdrop-blur-md rounded-xl p-4 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <ExperimentsDashboard data={experimentsDashboardData} />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="p-12 text-center bg-background/40 backdrop-blur-md rounded-xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
                  <Sparkles className="h-12 w-12 absolute inset-0 m-auto text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                </div>
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Analytics Dashboard</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This tab will contain detailed analytics and insights about your laboratory performance.
                </p>
                <Button className="mt-6 shadow-lg hover:shadow-xl transition-shadow">
                  Coming Soon
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground p-2 bg-background/30 backdrop-blur-sm rounded-md border border-border/20 shadow-sm">
              <span className="mr-2">Last updated:</span>
              <span className="font-medium">{lastRefreshed.toLocaleTimeString()}</span>
            </div>

            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              View activity log
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}