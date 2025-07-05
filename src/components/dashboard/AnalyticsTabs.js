'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskCompletionChart from "./TaskCompletionChart";
import TeamWorkloadChart from "./TeamWorkloadChart";
import ProjectAnalytics from "./ProjectAnalytics";

export default function AnalyticsTabs() {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tasks" className="space-y-6">
        <div className="space-y-6">
          <TaskCompletionChart />
          <TeamWorkloadChart />
        </div>
      </TabsContent>
      
      <TabsContent value="projects" className="space-y-6">
        <ProjectAnalytics />
      </TabsContent>
    </Tabs>
  );
}
