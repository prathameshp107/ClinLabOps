'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { getRecentActivities } from "@/services/dashboardService";

const getActionIcon = (type) => {
  switch (type) {
    case 'task':
      return '✅';
    case 'discussion':
      return '💬';
    case 'file':
      return '📄';
    case 'bug':
      return '🐛';
    default:
      return '⚡';
  }
};

export default function RecentActivity({ data }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (data) {
        // Use provided data if available
        setActivities(data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const activityData = await getRecentActivities(5);
        setActivities(activityData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recent activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [data]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading activities...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Error loading activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load activities: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activities to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={activity.user?.avatar} alt={activity.user?.name || 'User'} />
                <AvatarFallback>
                  {activity.user?.name ? activity.user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user?.name || 'Unknown User'}</p>
                  {activity.user?.role && (
                    <Badge variant="outline" className="text-xs">
                      {activity.user.role}
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {activity.timestamp ? format(new Date(activity.timestamp), 'h:mm a') : 'Unknown time'}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  <span className="font-medium">{activity.action || activity.type}</span>
                  <span className="mx-1">{activity.title || activity.target || 'activity'}</span>
                  <span className="inline-flex ml-1">{getActionIcon(activity.type)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}