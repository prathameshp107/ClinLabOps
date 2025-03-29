"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { 
  LayoutGrid, 
  LayoutList, 
  Sparkles, 
  Bell, 
  Settings, 
  RefreshCw 
} from "lucide-react";
import { 
  HoverGlowCard, 
  GlowingStarsBackgroundCard 
} from "@/components/ui/aceternity/cards";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import { cn } from "@/lib/utils";
import { TasksDashboard } from "@/components/dashboard/tasks-dashboard";
import { ExperimentsDashboard } from "@/components/dashboard/experiments-dashboard";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [notificationCount, setNotificationCount] = useState(3);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <DashboardLayout>
      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundBeams className="opacity-20" />
        
        <div className="p-6 w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-background/40 backdrop-blur-md rounded-xl p-5 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          >
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening in your lab today.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
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
              
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
                onClick={handleRefresh}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 shadow-md hover:shadow-lg transition-shadow bg-background/70 backdrop-blur-sm border-border/50"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <div className="mb-8">
            <QuickActions />
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
                        <SmartInsights />
                      </div>
                    </div>
                  </GlowingStarsBackgroundCard>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"} gap-6 mb-8`}>
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <TasksOverview />
                      </div>
                    </HoverGlowCard>
                    
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <PendingApprovals />
                      </div>
                    </HoverGlowCard>
                    
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <UserActivity />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className={`grid ${viewMode === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"} gap-6 mb-8`}>
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <ExperimentProgress />
                      </div>
                    </HoverGlowCard>
                    
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <TaskHeatmap />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <ComplianceAlerts />
                      </div>
                    </HoverGlowCard>
                    
                    <HoverGlowCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                      <div className="p-1">
                        <NotificationCenter />
                      </div>
                    </HoverGlowCard>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <HoverGlowCard className="w-full bg-background/60 backdrop-blur-md border border-border/50 rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300">
                    <div className="p-1">
                      <SystemLogs />
                    </div>
                  </HoverGlowCard>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="tasks">
              <div className="bg-background/40 backdrop-blur-md rounded-xl p-4 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <TasksDashboard />
              </div>
            </TabsContent>
            
            <TabsContent value="experiments">
              <div className="bg-background/40 backdrop-blur-md rounded-xl p-4 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                <ExperimentsDashboard />
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
          
          <div className="text-xs text-muted-foreground text-center mt-8 p-2 bg-background/30 backdrop-blur-sm rounded-md border border-border/20 shadow-sm max-w-xs mx-auto">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
