"use client"

import { Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UpcomingMilestones({ milestones }) {
  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones?.map((milestone, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background/40 border border-border/30 hover:bg-background/70 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-500' : 
                  milestone.status === 'in_progress' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div>
                  <span className="text-sm font-medium">{milestone.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
                </div>
              </div>
              <span className="text-xs font-medium bg-background/70 px-2 py-1 rounded-md">{milestone.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}