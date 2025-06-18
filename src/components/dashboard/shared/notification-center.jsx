"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Clock, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Experiment PCR-2023-42 completed",
      description: "The experiment has been marked as complete by Dr. Smith",
      time: "10 minutes ago",
      read: false,
      type: "success"
    },
    {
      id: 2,
      title: "New task assigned",
      description: "You have been assigned to 'Sample Analysis' by Lab Manager",
      time: "1 hour ago",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Reagent stock low",
      description: "Ethanol (95%) is running low. Current stock: 2 bottles",
      time: "3 hours ago",
      read: false,
      type: "warning"
    },
    {
      id: 4,
      title: "System maintenance",
      description: "Scheduled maintenance on Saturday, 10:00 PM - 2:00 AM",
      time: "Yesterday",
      read: true,
      type: "info"
    },
    {
      id: 5,
      title: "Report approval",
      description: "Your report 'Q3 Lab Analysis' has been approved",
      time: "2 days ago",
      read: true,
      type: "success"
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error": return <X className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
              <CardDescription>Stay updated with lab activities</CardDescription>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-muted-foreground">Recent notifications</div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[280px] pr-4">
          <AnimatePresence initial={false}>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-lg p-3 ${notification.read ? 'bg-card' : 'bg-primary/5'} border border-border/50`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notification.description}</div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
        
        <Button variant="outline" className="w-full mt-4 text-sm h-9">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  );
}