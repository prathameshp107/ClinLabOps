"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProjectTimeline({ timeline }) {
  return (
    <Card className="bg-background border border-border h-full">
      <CardHeader className="px-4 py-3 border-b border-border">
        <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-48px)]">
        <ScrollArea className="h-full">
          <div className="relative py-4 pl-4 pr-4">
            <div className="space-y-6">
              {timeline?.map((event, i) => (
                <div key={i} className="flex items-start relative">
                  {/* Timeline Dot and Connecting Line */}
                  <div className="relative w-6 flex-shrink-0 flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full ${event.completed ? 'bg-blue-600' : 'bg-muted'} border-2 border-background z-10 flex items-center justify-center dark:border-border`} />
                    {i < timeline.length - 1 && (
                      <div className="absolute w-0.5 bg-border z-0" style={{ top: '8px', height: 'calc(100% + 152px)' }} />
                    )}
                  </div>

                  {/* Event Content */}
                  <div className={`flex-1 p-3 rounded border ${event.completed ? 'bg-muted/50 border-border' : 'bg-background border-border'} transition-all duration-200 ml-2`}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground font-medium">{event.date}</p>
                      {event.completed && (
                        <Badge className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Completed</Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-0.5">{event.title}</h4>
                    <p className="text-sm text-muted-foreground leading-normal">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}