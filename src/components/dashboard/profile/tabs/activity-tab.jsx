"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ActivityTab({ activityLogs }) {
  // Get activity type badge variant
  const getActivityVariant = (type) => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "experiment":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "equipment":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "document":
        return "bg-green-100 text-green-800 border-green-200"
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border border-border/40">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          Your recent activities and system interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activityLogs.map((log, index) => (
            <div key={index} className="relative pl-6 pb-6">
              {/* Timeline connector */}
              {index < activityLogs.length - 1 && (
                <div className="absolute left-2.5 top-3 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-2.5 h-5 w-5 rounded-full border-2 border-primary bg-background" />
              
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("font-medium", getActivityVariant(log.type))}>
                    {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                
                <h3 className="text-base font-medium">{log.title}</h3>
                <p className="text-sm text-muted-foreground">{log.description}</p>
                
                {log.details && (
                  <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
                    {log.details}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {activityLogs.length === 0 && (
            <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
              <div className="flex flex-col items-center justify-center space-y-2">
                <h3 className="text-lg font-medium">No activity recorded</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Your recent activities will appear here as you interact with the system.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}