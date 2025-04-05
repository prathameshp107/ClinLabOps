"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProjectTimeline({ timeline }) {
  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8 relative">
            {timeline?.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full ${event.completed ? 'bg-primary/20' : 'bg-muted/50'} border-4 border-background flex items-center justify-center z-10`}>
                    <div className={`h-2 w-2 rounded-full ${event.completed ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  </div>
                </div>
                <div className={`${event.completed ? 'bg-background/40' : 'bg-muted/10'} rounded-lg p-3 border border-border/30 flex-1`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <h4 className="text-sm font-medium mt-1">{event.title}</h4>
                    </div>
                    {event.completed && (
                      <Badge variant="success" className="text-xs">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}