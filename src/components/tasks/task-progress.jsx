"use client";

import { useState } from "react";
import { BarChart, PieChart, Activity, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { LampContainer } from "@/components/ui/aceternity/lamp";
import { Badge } from "@/components/ui/badge";

export function TaskProgress({ task }) {
  const [activeTab, setActiveTab] = useState("progress");
  
  const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtasksProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  
  // Calculate days remaining
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  // Calculate time spent (mock data)
  const timeSpentHours = 24;
  const estimatedHours = 40;
  const timeProgress = Math.round((timeSpentHours / estimatedHours) * 100);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Task Progress
          </CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="progress" className="text-xs px-3">
                <BarChart className="h-3.5 w-3.5 mr-1" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="chart" className="text-xs px-3">
                <PieChart className="h-3.5 w-3.5 mr-1" />
                Chart
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="progress" className="mt-0 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Subtasks Completed</span>
              <span className="font-medium">{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <Progress value={subtasksProgress} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Time Spent</span>
              <span className="font-medium">{timeSpentHours} / {estimatedHours} hours</span>
            </div>
            <Progress value={timeProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Card className="bg-muted/30">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <CheckSquare className="h-4 w-4 text-primary mb-1" />
                <span className="text-xl font-bold">{completedSubtasks}</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <Clock className="h-4 w-4 text-primary mb-1" />
                <span className="text-xl font-bold">{daysRemaining}</span>
                <span className="text-xs text-muted-foreground">Days Left</span>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30">
              <CardContent className="p-3 flex flex-col items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-primary mb-1" />
                <span className="text-xl font-bold">
                  {task.subtasks.filter(s => s.priority === 'high' && !s.completed).length}
                </span>
                <span className="text-xs text-muted-foreground">High Priority</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="chart" className="mt-0">
          <LampContainer className="w-full h-[300px]">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <div className="relative w-48 h-48">
                    {/* Circular progress chart */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeDasharray={`${task.progress * 2.51} 251`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      
                      {/* Text in the middle */}
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="currentColor"
                      >
                        {task.progress}%
                      </text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs">Completed ({task.progress}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted"></div>
                      <span className="text-xs">Remaining ({100 - task.progress}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-xs">On Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className="text-xs">Delayed</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </LampContainer>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge 
                    variant={daysRemaining < 0 ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {daysRemaining < 0 ? "Overdue" : "On Track"}
                  </Badge>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Estimated Completion</span>
                  <span className="text-xs font-medium">
                    {new Date(Date.now() + (estimatedHours - timeSpentHours) * 3600000).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <Badge 
                    variant={task.priority === 'high' ? "destructive" : task.priority === 'medium' ? "warning" : "outline"}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-xs font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
}