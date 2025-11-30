"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Clock, CheckCircle2, Circle, Calendar } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function ProjectTimeline({ timeline }) {
  return (
    <Card className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl">
            <History className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Project Timeline</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Track project milestones and progress</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="relative py-8 px-8">
            {timeline && timeline.length > 0 ? (
              <div className="space-y-8">
                {timeline.map((event, i) => (
                  <div key={i} className="flex items-start relative group">
                    {/* Timeline Dot and Connecting Line */}
                    <div className="relative w-8 flex-shrink-0 flex flex-col items-center">
                      <div className={cn(
                        "h-5 w-5 rounded-full border-4 border-background z-10 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-125",
                        event.completed
                          ? "bg-green-500 ring-4 ring-green-500/20"
                          : "bg-muted-foreground/30 ring-4 ring-muted/20"
                      )}>
                        {event.completed && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={cn(
                          "absolute w-0.5 z-0 top-5",
                          event.completed ? "bg-green-500/30" : "bg-border"
                        )} style={{ height: 'calc(100% + 32px)' }} />
                      )}
                    </div>

                    {/* Event Content */}
                    <div className={cn(
                      "flex-1 p-5 rounded-2xl border transition-all duration-300 ml-4 group-hover:shadow-md",
                      event.completed
                        ? "bg-green-500/5 border-green-200/50 dark:bg-green-900/10 dark:border-green-800/30"
                        : "bg-background/60 border-border/50 hover:bg-muted/30"
                    )}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        {event.completed ? (
                          <Badge className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-200/50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30 shadow-sm">
                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground border-border/50">
                            <Clock className="h-3 w-3 mr-1.5" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6 border border-border/50">
                  <History className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Timeline Events</h3>
                <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
                  Timeline events will appear here as the project progresses. Add milestones to track your project's journey.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}