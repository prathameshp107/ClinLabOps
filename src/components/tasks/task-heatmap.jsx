"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Activity } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { weekDays } from "@/constants";

export const TaskHeatmap = ({ tasks, year = new Date().getFullYear() }) => {
  const [activeTab, setActiveTab] = useState("week");

  // Generate sample data for the heatmap
  const weekData = [
    { day: "Mon", tasks: 5, color: "bg-emerald-200 dark:bg-emerald-900" },
    { day: "Tue", tasks: 8, color: "bg-emerald-400 dark:bg-emerald-700" },
    { day: "Wed", tasks: 3, color: "bg-emerald-100 dark:bg-emerald-950" },
    { day: "Thu", tasks: 7, color: "bg-emerald-300 dark:bg-emerald-800" },
    { day: "Fri", tasks: 9, color: "bg-emerald-500 dark:bg-emerald-600" },
    { day: "Sat", tasks: 2, color: "bg-emerald-100 dark:bg-emerald-950" },
    { day: "Sun", tasks: 1, color: "bg-emerald-50 dark:bg-emerald-950/50" },
  ];

  // Generate month data - 4 weeks
  const monthData = Array.from({ length: 4 }, (_, weekIndex) => {
    return weekDays.map((day) => {
      const tasks = Math.floor(Math.random() * 10);
      let color;

      if (tasks === 0) color = "bg-emerald-50 dark:bg-emerald-950/30";
      else if (tasks < 3) color = "bg-emerald-100 dark:bg-emerald-950";
      else if (tasks < 5) color = "bg-emerald-200 dark:bg-emerald-900";
      else if (tasks < 7) color = "bg-emerald-300 dark:bg-emerald-800";
      else if (tasks < 9) color = "bg-emerald-400 dark:bg-emerald-700";
      else color = "bg-emerald-500 dark:bg-emerald-600";

      return {
        day,
        week: weekIndex + 1,
        tasks,
        color,
      };
    });
  }).flat();

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold">Task Activity</CardTitle>
        </div>
        <CardDescription>Visual representation of task activity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div
                          className={`w-full aspect-square rounded-md ${day.color} transition-colors hover:opacity-80 cursor-pointer`}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{day.day}</p>
                          <p className="text-xs text-muted-foreground">{day.tasks} tasks</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <span className="text-xs mt-1 text-muted-foreground">
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-950"></div>
                    <span className="text-xs text-muted-foreground">1-2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-800"></div>
                    <span className="text-xs text-muted-foreground">3-6</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
                    <span className="text-xs text-muted-foreground">7+</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tasks completed
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {monthData.map((day, i) => (
                  <HoverCard key={i}>
                    <HoverCardTrigger asChild>
                      <div
                        className={`w-full aspect-square rounded-sm ${day.color} transition-colors hover:opacity-80 cursor-pointer`}
                      />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Week {day.week}, {day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.tasks} tasks</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>

              <div className="grid grid-cols-4 mt-2 text-center">
                <div className="text-xs text-muted-foreground">Week 1</div>
                <div className="text-xs text-muted-foreground">Week 2</div>
                <div className="text-xs text-muted-foreground">Week 3</div>
                <div className="text-xs text-muted-foreground">Week 4</div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-950"></div>
                    <span className="text-xs text-muted-foreground">1-2</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-800"></div>
                    <span className="text-xs text-muted-foreground">3-6</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
                    <span className="text-xs text-muted-foreground">7+</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tasks completed
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}