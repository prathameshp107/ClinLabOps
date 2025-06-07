"use client"

import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ActivityIcon = ({ type }) => {
  const getIconColor = (type) => {
    switch (type) {
      case 'task_completed':
        return 'text-green-600 bg-green-50';
      case 'comment_added':
        return 'text-blue-600 bg-blue-50';
      case 'document_uploaded':
        return 'text-purple-600 bg-purple-50';
      case 'member_joined':
        return 'text-orange-600 bg-orange-50';
      case 'task_created':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(type)}`}>
      <Activity className="h-4 w-4" />
    </div>
  );
};

export function RecentActivity({ activities, team }) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {activities?.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage 
                    src={team?.find(m => m.id === activity.userId)?.avatar} 
                    alt={activity.user} 
                  />
                  <AvatarFallback className="text-xs bg-gray-50 text-gray-600">
                    {activity.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <ActivityIcon type={activity.type} />
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    {activity.type === 'task_completed' && (
                      <>completed task <span className="font-medium text-green-600">{activity.task}</span></>
                    )}
                    {activity.type === 'comment_added' && (
                      <>commented on <span className="font-medium text-blue-600">{activity.task}</span>: "<span className="text-gray-600">{activity.comment}</span>"</>
                    )}
                    {activity.type === 'document_uploaded' && (
                      <>uploaded document <span className="font-medium text-purple-600">{activity.document}</span></>
                    )}
                    {activity.type === 'member_joined' && (
                      <>joined the project</>
                    )}
                    {activity.type === 'task_created' && (
                      <>created task <span className="font-medium text-indigo-600">{activity.task}</span></>
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}