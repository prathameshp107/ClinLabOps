"use client"

import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity({ activities, team }) {
  return (
    <Card className="md:col-span-2 bg-background/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={team?.find(m => m.id === activity.userId)?.avatar} alt={activity.user} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  {activity.type === 'task_completed' && (
                    <>completed task <span className="font-medium">{activity.task}</span></>
                  )}
                  {activity.type === 'comment_added' && (
                    <>commented on <span className="font-medium">{activity.task}</span>: "{activity.comment}"</>
                  )}
                  {activity.type === 'document_uploaded' && (
                    <>uploaded <span className="font-medium">{activity.document}</span></>
                  )}
                  {activity.type === 'member_joined' && (
                    <>joined the project</>
                  )}
                  {activity.type === 'task_created' && (
                    <>created task <span className="font-medium">{activity.task}</span></>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}