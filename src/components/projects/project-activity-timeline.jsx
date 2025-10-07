"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Activity } from "lucide-react"
import { getProjectActivities } from "@/services/activityService"

const ActivityItem = ({ activity }) => {
    // Format timestamp to a readable format
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Get avatar initials
    const getInitials = (name) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    // Get badge variant based on activity type
    const getBadgeVariant = (type) => {
        const variantMap = {
            'task_created': 'default',
            'task_updated': 'secondary',
            'task_deleted': 'destructive',
            'project_created': 'default',
            'project_updated': 'secondary',
            'user_created': 'default',
            'user_updated': 'secondary',
            'default': 'outline'
        }
        return variantMap[type] || 'outline'
    }

    return (
        <div className="flex gap-4 py-4 border-b border-border/50 last:border-0">
            <Avatar className="h-10 w-10 shadow-sm">
                {activity.user?.email ? (
                    <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user.name)}&background=random`}
                        alt={activity.user.name}
                    />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {getInitials(activity.user?.name || 'U')}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">
                    {activity.description || activity.action}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                        {activity.type?.replace(/_/g, ' ') || 'Activity'}
                    </Badge>
                    {activity.meta?.category && (
                        <Badge variant="outline" className="text-xs">
                            {activity.meta.category}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(activity.createdAt)}</span>
                </div>
            </div>
        </div>
    )
}

export function ProjectActivityTimeline({ projectId }) {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchActivities = async () => {
            if (!projectId) return

            try {
                setLoading(true)
                const data = await getProjectActivities(projectId, { limit: 10 })
                // Sort activities by timestamp (newest first)
                const sortedActivities = data.activities?.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                ) || []
                setActivities(sortedActivities)
            } catch (err) {
                console.error('Error fetching activities:', err)
                setError('Failed to load project activities')
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [projectId])

    if (loading) {
        return (
            <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/50 dark:to-indigo-900/50 border-b border-border/50">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Project Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 py-4">
                                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/50 dark:to-indigo-900/50 border-b border-border/50">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        Project Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                            <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Activities</h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            {error}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/50 dark:to-indigo-900/50 border-b border-border/50">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Project Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {activities.length > 0 ? (
                    <ScrollArea className="h-[400px] p-6">
                        <div className="space-y-2">
                            {activities.map((activity) => (
                                <ActivityItem key={activity._id} activity={activity} />
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Activity Yet</h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            No activities have been recorded for this project yet. Activities will appear here when team members make changes.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}