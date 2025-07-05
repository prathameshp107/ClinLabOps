'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = {
  overall: 84,
  change: 12,
  metrics: [
    { name: 'Task Completion', value: 78, target: 90, trend: 'up' },
    { name: 'On Time Delivery', value: 82, target: 85, trend: 'up' },
    { name: 'Code Quality', value: 91, target: 85, trend: 'up' },
    { name: 'Team Collaboration', value: 76, target: 80, trend: 'down' },
  ]
};

export default function TeamPerformance() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Team Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{performanceData.overall}%</div>
            <div className={cn(
              "text-sm flex items-center justify-center gap-1",
              performanceData.change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {performanceData.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {Math.abs(performanceData.change)}% from last month
            </div>
          </div>

          <div className="space-y-4">
            {performanceData.metrics.map((metric, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.value}%</span>
                    <span className="text-xs text-muted-foreground">/ {metric.target}%</span>
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      metric.trend === 'up' ? 'bg-green-500' : 'bg-amber-500'
                    )}
                    style={{
                      width: `${(metric.value / metric.target) * 100}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-xs text-muted-foreground">On Track</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">8</div>
              <div className="text-xs text-muted-foreground">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-muted-foreground">Behind</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
