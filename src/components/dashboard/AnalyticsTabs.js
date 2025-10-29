'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCompletionChart from "./TaskCompletionChart";
import TeamWorkloadChart from "./TeamWorkloadChart";
import ProjectAnalytics from "./ProjectAnalytics";
import { isPowerUser } from "@/services/authService"; // Add this import
import { useEffect, useState } from "react"; // Add this import

export default function AnalyticsTabs({ teamPerformance, projects = [] }) {
  const [isPowerUserFlag, setIsPowerUserFlag] = useState(false);

  useEffect(() => {
    // Check if user is PowerUser
    setIsPowerUserFlag(isPowerUser());
  }, []);

  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="space-y-6">
        <div className="space-y-6">
          <TaskCompletionChart />
          {isPowerUserFlag && <TeamWorkloadChart teamPerformance={teamPerformance} />}
        </div>
      </TabsContent>

      <TabsContent value="projects" className="space-y-6">
        <ProjectAnalytics projects={projects} />
      </TabsContent>
    </Tabs>
  );
}