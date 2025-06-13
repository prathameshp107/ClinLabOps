"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UpcomingDeadlines({ deadlines }) {
  const getUrgencyColor = (daysLeft) => {
    if (daysLeft < 0) return "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30";
    if (daysLeft <= 1) return "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30";
    if (daysLeft <= 3) return "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30";
    return "text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30";
  };

  const getUrgencyText = (daysLeft) => {
    if (daysLeft < 0) return "Overdue";
    if (daysLeft === 0) return "Due today";
    if (daysLeft === 1) return "Due tomorrow";
    return `${daysLeft} days left`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-3">
            {deadlines.map((deadline, index) => (
              <motion.div
                key={deadline.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{deadline.title}</h3>
                  <Badge variant="outline" className={getUrgencyColor(deadline.daysLeft)}>
                    {getUrgencyText(deadline.daysLeft)}
                  </Badge>
                </div>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Due {deadline.dueDate}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Project: {deadline.projectName}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    View Task
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}