"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Clock, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadCount } from "@/services/notificationService";
import { getCurrentUser } from "@/services/authService";

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const prevOpenRef = useRef(open);
    const prevOpen = prevOpenRef.current;

    // Update the ref each time the component renders
    useEffect(() => {
        prevOpenRef.current = open;
    });

    // Get user from localStorage
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (open && !prevOpen && user) {
            fetchNotifications();
        }
    }, [open, user]);

    // Fetch unread count periodically
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getUserNotifications(user.id, { limit: 10 });
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            // Show error to user
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        if (!user) return;

        try {
            const count = await getUnreadCount(user.id);
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
            // Don't show error to user, just keep current count
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(notifications.map(n =>
                n._id === notificationId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead(user.id);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(notifications.filter(n => n._id !== notificationId));
            // Update unread count if the deleted notification was unread
            const deletedNotification = notifications.find(n => n._id === notificationId);
            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case "error": return <X className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "success": return "border-green-500/30";
            case "warning": return "border-amber-500/30";
            case "error": return "border-red-500/30";
            default: return "border-blue-500/30";
        }
    };

    const formatTime = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 p-0 overflow-hidden"
                sideOffset={8}
            >
                <div className="border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllAsRead();
                            }}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                {loading ? (
                    <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No notifications</div>
                ) : (
                    <>
                        <ScrollArea className="h-80">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification._id}
                                    className={`flex flex-col items-start p-3 ${notification.isRead ? 'bg-card' : 'bg-primary/5'} border-b ${getTypeColor(notification.type)}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex w-full gap-3">
                                        <div className="mt-0.5">
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{notification.title}</div>
                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {notification.message}
                                            </div>
                                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTime(notification.createdAt)}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleDelete(notification._id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </ScrollArea>
                        <div className="border-t p-2 flex justify-center">
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                                View all notifications
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}