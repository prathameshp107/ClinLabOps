"use client";

import { useState, useEffect, useRef } from "react";
import {
    Bell,
    Check,
    X,
    Clock,
    AlertTriangle,
    Info,
    CheckCircle2,
    Search,
    Filter,
    Eye,
    User,
    Hash,
    Package,
    FlaskConical,
    Settings,
    UserCircle,
    ChevronDown,
    ChevronUp,
    CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadCount } from "@/services/notificationService";
import { getCurrentUser } from "@/services/authService";
import { getSettings } from "@/services/settingsService";

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [readFilter, setReadFilter] = useState("all");
    const [expandedNotifications, setExpandedNotifications] = useState(new Set());
    const [notificationSettings, setNotificationSettings] = useState(null);
    const [settingsLoading, setSettingsLoading] = useState(false);
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

    // Fetch user settings when dropdown opens
    useEffect(() => {
        if (open && !prevOpen && user) {
            fetchUserSettings();
        }
    }, [open, user]);

    // Fetch notifications when dropdown opens and settings are loaded
    useEffect(() => {
        if (open && !prevOpen && user && !settingsLoading) {
            fetchNotifications();
        }
    }, [open, user, settingsLoading]);

    // Fetch unread count periodically
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30 * 60 * 1000); // Refresh every 30 minutes
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUserSettings = async () => {
        if (!user) return;

        setSettingsLoading(true);
        try {
            const settings = await getSettings();
            setNotificationSettings(settings.notifications || {});
        } catch (error) {
            console.error("Failed to fetch user settings:", error);
            setNotificationSettings({});
        } finally {
            setSettingsLoading(false);
        }
    };

    const fetchNotifications = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getUserNotifications(user.id, { limit: 50 }); // Increased limit for better filtering
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
            // Collapse all expanded notifications
            setExpandedNotifications(new Set());
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
            // Remove from expanded notifications if it was expanded
            setExpandedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificationId);
                return newSet;
            });
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const toggleNotificationExpansion = (notificationId) => {
        setExpandedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(notificationId)) {
                newSet.delete(notificationId);
            } else {
                newSet.add(notificationId);
            }
            return newSet;
        });
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
            case "success": return "border-green-500/30 bg-green-50 dark:bg-green-950/20";
            case "warning": return "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20";
            case "error": return "border-red-500/30 bg-red-50 dark:bg-red-950/20";
            default: return "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "task": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
            case "project": return <Hash className="h-4 w-4 text-purple-500" />;
            case "experiment": return <FlaskConical className="h-4 w-4 text-green-500" />;
            case "inventory": return <Package className="h-4 w-4 text-amber-500" />;
            case "user": return <User className="h-4 w-4 text-pink-500" />;
            case "system": return <Settings className="h-4 w-4 text-gray-500" />;
            default: return <Info className="h-4 w-4 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent": return "bg-red-500";
            case "high": return "bg-orange-500";
            case "medium": return "bg-yellow-500";
            default: return "bg-gray-300";
        }
    };

    const formatTime = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    const formatFullTime = (date) => {
        return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
    };

    // Filter notifications based on search, category, and read status
    const filteredNotifications = notifications.filter(notification => {
        // Search filter
        if (searchTerm &&
            !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Category filter
        if (categoryFilter !== "all" && notification.category !== categoryFilter) {
            return false;
        }

        // Read status filter
        if (readFilter === "read" && !notification.isRead) {
            return false;
        }
        if (readFilter === "unread" && notification.isRead) {
            return false;
        }

        return true;
    });

    // Get unique categories for filter dropdown
    const categories = [...new Set(notifications.map(n => n.category))].filter(Boolean);

    // Check if notifications are disabled
    const areNotificationsDisabled = notificationSettings &&
        (!notificationSettings.inApp || notificationSettings.inApp.enabled === false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && !areNotificationsDisabled && (
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
                className="w-[500px] p-0 overflow-hidden"
                sideOffset={8}
            >
                {/* Header with title and mark all as read */}
                <div className="border-b p-4 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && !areNotificationsDisabled && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAllAsRead();
                            }}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Show message if notifications are disabled */}
                {areNotificationsDisabled ? (
                    <div className="p-8 text-center">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <h3 className="font-medium text-lg mb-2">Notifications Disabled</h3>
                        <p className="text-muted-foreground mb-4">
                            Notification system is currently disabled for your account.
                            To see notifications, please enable in-app notifications in your settings.
                        </p>
                        <Button
                            variant="default"
                            onClick={() => {
                                // In a real app, this would navigate to the settings page
                                window.location.href = '/settings#notifications';
                            }}
                        >
                            Go to Settings
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Search and filters */}
                        <div className="p-3 border-b bg-muted/50">
                            <div className="flex gap-2 mb-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search notifications..."
                                        className="pl-8 h-9 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <Filter className="h-3 w-3 mr-1" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category} className="capitalize">
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={readFilter} onValueChange={setReadFilter}>
                                    <SelectTrigger className="h-8 text-xs">
                                        <Eye className="h-3 w-3 mr-1" />
                                        <SelectValue placeholder="Read Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="read">Read</SelectItem>
                                        <SelectItem value="unread">Unread</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Notifications list */}
                        {loading || settingsLoading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                Loading notifications...
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
                                <p className="font-medium">No notifications found</p>
                                <p className="text-sm mt-1">
                                    {notifications.length === 0
                                        ? "You don't have any notifications yet"
                                        : "Try adjusting your search or filter criteria"}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="h-96">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`border-b ${getTypeColor(notification.type)} ${notification.isRead ? 'opacity-80' : ''}`}
                                        >
                                            <div
                                                className="flex items-start p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => toggleNotificationExpansion(notification._id)}
                                            >
                                                <div className="mt-0.5 mr-3">
                                                    {getTypeIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="font-medium text-sm truncate flex-1">
                                                            {notification.title}
                                                        </div>
                                                        <div className="flex items-center gap-1 ml-2">
                                                            {/* Priority indicator */}
                                                            <div
                                                                className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`}
                                                                title={`Priority: ${notification.priority}`}
                                                            />
                                                            {/* Category icon */}
                                                            <div title={`Category: ${notification.category}`}>
                                                                {getCategoryIcon(notification.category)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </div>
                                                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        <span title={formatFullTime(notification.createdAt)}>
                                                            {formatTime(notification.createdAt)}
                                                        </span>
                                                        {notification.sender && (
                                                            <>
                                                                <span className="mx-2">•</span>
                                                                <UserCircle className="h-3 w-3 mr-1" />
                                                                <span>{notification.sender.name}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 ml-2">
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(notification._id);
                                                            }}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(notification._id);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Expanded content */}
                                            {expandedNotifications.has(notification._id) && (
                                                <div className="px-3 pb-3 pt-1 border-t bg-muted/30">
                                                    <div className="text-xs space-y-2">
                                                        <div>
                                                            <span className="font-medium">Full message:</span>
                                                            <p className="mt-1">{notification.message}</p>
                                                        </div>
                                                        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                                                            <div>
                                                                <span className="font-medium">Metadata:</span>
                                                                <div className="mt-1 grid grid-cols-2 gap-1">
                                                                    {Object.entries(notification.metadata).map(([key, value]) => (
                                                                        <div key={key} className="flex">
                                                                            <span className="text-muted-foreground mr-1">{key}:</span>
                                                                            <span className="truncate">{String(value)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {notification.actionUrl && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="mt-2 h-7 text-xs"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // In a real app, this would navigate to the action URL
                                                                    console.log("Navigate to:", notification.actionUrl);
                                                                }}
                                                            >
                                                                View Details
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </ScrollArea>

                                {/* Footer with notification count and view all button */}
                                <div className="border-t p-2 flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground px-2">
                                        Showing {filteredNotifications.length} of {notifications.length} notifications
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                        View all notifications
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}