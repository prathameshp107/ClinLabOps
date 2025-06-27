'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const activities = [
  {
    id: 1,
    user: { name: 'Alex Johnson', avatar: 'AJ', role: 'Team Lead' },
    action: 'completed',
    target: 'Project Dashboard',
    type: 'task',
    time: new Date('2023-06-21T14:30:00Z')
  },
  {
    id: 2,
    user: { name: 'Maria Garcia', avatar: 'MG', role: 'Frontend Dev' },
    action: 'updated',
    target: 'Task Analytics',
    type: 'task',
    time: new Date('2023-06-21T12:45:00Z')
  },
  {
    id: 3,
    user: { name: 'James Wilson', avatar: 'JW', role: 'Backend Dev' },
    action: 'commented',
    target: 'API Integration',
    type: 'discussion',
    time: new Date('2023-06-21T10:15:00Z')
  },
  {
    id: 4,
    user: { name: 'Sarah Kim', avatar: 'SK', role: 'UI/UX Designer' },
    action: 'uploaded',
    target: 'New Mockups',
    type: 'file',
    time: new Date('2023-06-20T16:20:00Z')
  },
  {
    id: 5,
    user: { name: 'David Lee', avatar: 'DL', role: 'QA Engineer' },
    action: 'reported',
    target: 'Bug #123',
    type: 'bug',
    time: new Date('2023-06-20T10:10:00Z')
  }
];

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

export default function RecentActivity() {
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
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.user.role}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {format(activity.time, 'h:mm a')}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  <span className="font-medium">{activity.action}</span>
                  <span className="mx-1">{activity.target}</span>
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
