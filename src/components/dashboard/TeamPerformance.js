'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTeamPerformance } from "@/services/dashboardService";

export default function TeamPerformance({ data }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (data) {
        // Use provided data if available
        setPerformanceData(data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const perfData = await getTeamPerformance();

        // Transform the data to match our component's expected structure
        const transformedData = {
          overall: perfData.summary?.completionRate || 0,
          change: perfData.summary?.completionRateChange || 0,
          metrics: [
            {
              name: 'Task Completion',
              value: perfData.summary?.completionRate || 0,
              target: 100,
              trend: perfData.summary?.completionRateChange >= 0 ? 'up' : 'down'
            },
            {
              name: 'On Time Delivery',
              value: perfData.summary?.onTimeRate || 0,
              target: 100,
              trend: perfData.summary?.onTimeRateChange >= 0 ? 'up' : 'down'
            },
            {
              name: 'Efficiency Score',
              value: perfData.summary?.efficiencyScore || 0,
              target: 100,
              trend: perfData.summary?.efficiencyScoreChange >= 0 ? 'up' : 'down'
            }
          ],
          teamMembers: Array.isArray(perfData.taskCompletion) ? perfData.taskCompletion : []
        };

        setPerformanceData(transformedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching team performance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [data]);

  if (loading) {
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
              <div className="h-10 bg-muted rounded w-16 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-2 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load performance data: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No performance data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Ensure metrics is an array before mapping
  const metrics = Array.isArray(performanceData.metrics) ? performanceData.metrics : [];

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
            {metrics.map((metric, index) => (
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
                      width: `${Math.min(100, (metric.value / metric.target) * 100)}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {Array.isArray(performanceData.teamMembers) && performanceData.teamMembers.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {performanceData.teamMembers.filter(m => (m.completed || m.completedTasks || 0) >= (m.pending || (m.totalTasks - m.completedTasks) || 0)).length}
                </div>
                <div className="text-xs text-muted-foreground">On Track</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {performanceData.teamMembers.filter(m => (m.completed || m.completedTasks || 0) < (m.pending || (m.totalTasks - m.completedTasks) || 0) && (m.pending || (m.totalTasks - m.completedTasks) || 0) > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">At Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {performanceData.teamMembers.filter(m => (m.completed || m.completedTasks || 0) === 0 && (m.pending || (m.totalTasks - m.completedTasks) || 0) > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Behind</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}