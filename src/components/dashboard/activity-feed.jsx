"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MoreHorizontal, LogIn, FlaskConical, FileCheck, CheckCircle, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for the activity feed
const activityData = [
  {
    id: 1,
    user: { name: "Alex Johnson", initials: "AJ" },
    action: "logged in",
    time: "2 minutes ago",
    status: "online",
    icon: LogIn
  },
  {
    id: 2,
    user: { name: "Sarah Miller", initials: "SM" },
    action: "started experiment XC-421",
    time: "15 minutes ago",
    status: "online",
    icon: FlaskConical
  },
  {
    id: 3,
    user: { name: "David Chen", initials: "DC" },
    action: "submitted task report",
    time: "42 minutes ago",
    status: "offline",
    icon: FileCheck
  },
  {
    id: 4,
    user: { name: "Emma Wilson", initials: "EW" },
    action: "approved experiment results",
    time: "1 hour ago",
    status: "offline",
    icon: CheckCircle
  },
  {
    id: 5,
    user: { name: "James Rivera", initials: "JR" },
    action: "requested access to Lab-B",
    time: "3 hours ago",
    status: "offline",
    icon: Key
  }
]

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">User Activity Feed</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-80 pr-1">
          <ul className="space-y-4">
            {activityData.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.li 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 group"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.03)", borderRadius: "0.5rem" }}
                >
                  <div className="relative mt-1">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                      activity.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                    } ring-1 ring-white`}></span>
                  </div>
                  <div className="flex-1 space-y-1 p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.user.name}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              View all activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
