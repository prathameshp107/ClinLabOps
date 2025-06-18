"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, LineChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SmartInsights() {
  const [insights] = useState([
    {
      title: "Task Completion Rate Improved",
      description: "Your team's task completion rate has increased by 12% this week compared to last week.",
      action: "View Tasks",
      icon: "📈"
    },
    {
      title: "Experiment PCR-2023-42 Needs Attention",
      description: "This experiment has been in the 'Analysis' phase for 3 days longer than average.",
      action: "View Experiment",
      icon: "⚠️"
    },
    {
      title: "Inventory Alert",
      description: "5 reagents are running low and need to be reordered soon.",
      action: "View Inventory",
      icon: "🧪"
    }
  ]);
  
  const [currentInsight, setCurrentInsight] = useState(0);
  
  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };
  
  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Lab Insights</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevInsight} className="h-8 w-8">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextInsight} className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Key insights based on your lab's recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card p-4 rounded-lg border border-border/50"
        >
          <div className="flex gap-4 items-start">
            <div className="text-3xl">{insights[currentInsight].icon}</div>
            <div>
              <h3 className="font-medium mb-1">{insights[currentInsight].title}</h3>
              <p className="text-sm text-muted-foreground">{insights[currentInsight].description}</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="ml-auto">
          <LineChart className="mr-2 h-4 w-4" />
          View All Insights
        </Button>
      </CardFooter>
    </Card>
  );
}