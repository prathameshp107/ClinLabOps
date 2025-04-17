"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  PlusCircle, 
  Edit, 
  Trash2,
  Link,
  User,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ActivityTimeline({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return <PlusCircle className="h-4 w-4" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'comment_added':
        return <MessageSquare className="h-4 w-4" />;
      case 'document_added':
        return <FileText className="h-4 w-4" />;
      case 'task_edited':
        return <Edit className="h-4 w-4" />;
      case 'task_deleted':
        return <Trash2 className="h-4 w-4" />;
      case 'user_added':
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task_created':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'task_completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'comment_added':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'document_added':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300';
      case 'task_edited':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300';
      case 'task_deleted':
        return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
      case 'user_added':
        return 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
          
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                  
                  {activity.project && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Link className="h-3 w-3" />
                      <span>Project: {activity.project}</span>
                    </div>
                  )}
                  
                  {activity.user && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{activity.user.name}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm">
              View All Activity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}