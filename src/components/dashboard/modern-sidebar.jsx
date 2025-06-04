"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Home,
    FlaskConical,
    ClipboardList,
    Users,
    BarChart2,
    Settings,
    LogOut,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    User,
    Microscope,
    BookOpen,
    Briefcase,
    Cog,
    MessageSquare,
    FileUser,
    FileText,
    Database,
    Shield,
    HelpCircle
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ModernSidebar({ className, onToggle }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userData, setUserData] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({
        main: true,
        lab: true,
        team: true,
        insights: true,
        system: true
    });
    // Simulate notification for settings
    const [hasSettingsNotification] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                try {
                    setUserData(JSON.parse(storedUserData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
    }, []);

    const handleLogout = () => setShowLogoutDialog(true);
    const confirmLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        router.push('/login');
    };
    const handleToggle = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggle) onToggle(newCollapsedState);
    };
    const isActive = (path) => pathname === path;

    // Grouped navigation items
    const navigationGroups = [
        {
            key: 'main',
            label: 'Main',
            icon: <Home className="h-4 w-4" />,
            items: [
                { name: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/admin-dashboard', badge: null },
                { name: 'projects', label: 'Projects', icon: <ClipboardList className="h-5 w-5" />, path: '/projects', badge: { count: 12, variant: 'default' } },
                { name: 'tasks', label: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, path: '/tasks', badge: { count: 12, variant: 'default' } },
                { name: 'experiments', label: 'Experiments', icon: <FlaskConical className="h-5 w-5" />, path: '/experiments', badge: { count: 5, variant: 'outline' } }
            ]
        },
        {
            key: 'lab',
            label: 'Laboratory',
            icon: <FlaskConical className="h-4 w-4" />,
            items: [
                { name: 'protocols', label: 'Protocols', icon: <BookOpen className="h-5 w-5" />, path: '/protocols', badge: null },
                { name: 'equipments', label: 'Equipments', icon: <Microscope className="h-5 w-5" />, path: '/equipments', badge: null },
                { name: 'inventory', label: 'Inventory', icon: <Database className="h-5 w-5" />, path: '/inventory', badge: { count: 3, variant: 'destructive' } }
            ]
        },
        {
            key: 'team',
            label: 'Team',
            icon: <Users className="h-4 w-4" />,
            items: [
                { name: 'user-management', label: 'User Management', icon: <Briefcase className="h-5 w-5" />, path: '/user-management', badge: null },
                { name: 'my page', label: 'My Page', icon: <FileUser className="h-5 w-5" />, path: '/my-page', badge: null },
                { name: 'profile', label: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile', badge: null }
            ]
        },
        {
            key: 'insights',
            label: 'Insights',
            icon: <BarChart2 className="h-4 w-4" />,
            items: [
                { name: 'analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" />, path: '#', badge: null },
                { name: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5" />, path: '#', badge: null },
                { name: 'enquiries', label: 'Enquiries', icon: <MessageSquare className="h-5 w-5" />, path: '/enquiries', badge: null }
            ]
        },
        {
            key: 'system',
            label: 'System',
            icon: <Cog className="h-4 w-4" />,
            items: [
                { name: 'settings', label: 'Settings', icon: <Cog className="h-5 w-5" />, path: '/settings', badge: null },
                { name: 'compliance', label: 'Compliance', icon: <Shield className="h-5 w-5" />, path: '/compliance', badge: null },
                { name: 'help', label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" />, path: '/help', badge: null }
            ]
        }
    ];

    const toggleGroup = (key) => {
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-40 h-screen flex flex-col justify-between font-sans",
                isCollapsed ? "w-[72px]" : "w-[240px]",
                "transition-all duration-300 bg-[#f4f5f7] border-r border-[#e5e7eb]"
            )}
        >
            {/* Collapse/Expand Button (unchanged position) */}
            <div className="absolute -right-4 top-6 z-50">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleToggle}
                    className="rounded-full border border-[#e5e7eb] bg-white hover:bg-[#e5e7eb]"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-6 w-6 text-[#2563eb]" />
                    ) : (
                        <ChevronLeft className="h-6 w-6 text-[#2563eb]" />
                    )}
                </Button>
            </div>

            {/* Compact Profile */}
            <div className="flex items-center gap-2 pt-5 pb-2 px-4 min-h-[48px]">
                <div className="relative">
                    <Avatar className="h-8 w-8 border border-[#e5e7eb]">
                        <AvatarImage src="/avatars/user.jpg" alt="User" />
                        <AvatarFallback>{userData?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                    </Avatar>
                    {/* Status dot */}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                </div>
                {!isCollapsed && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-1 px-1 py-0 h-8 min-w-0">
                                <span className="font-semibold text-[14px] text-[#1e293b] truncate max-w-[90px]">{userData?.fullName || 'User'}</span>
                                <ChevronDown className="h-4 w-4 text-[#64748b]" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                <User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Navigation with Groups */}
            <ScrollArea className="flex-1 px-1 overflow-y-auto">
                <nav className="space-y-2 mt-2">
                    <TooltipProvider>
                        {navigationGroups.map((group, idx) => (
                            <div key={group.key} className="mb-1">
                                {/* Group Header */}
                                <div
                                    className={cn(
                                        "flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-wider text-[#64748b] font-bold cursor-pointer select-none hover:text-[#2563eb]",
                                        isCollapsed && "justify-center px-0"
                                    )}
                                    onClick={() => !isCollapsed && toggleGroup(group.key)}
                                >
                                    {isCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="flex items-center justify-center h-7 w-7">{group.icon}</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">{group.label}</TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <span>{group.label}</span>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-auto" tabIndex={-1}>
                                                <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", expandedGroups[group.key] ? "rotate-0" : "-rotate-90")} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                {/* Group Items */}
                                {expandedGroups[group.key] && (
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <Tooltip key={item.name} delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.path}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2 rounded-md group transition-all duration-150 text-[15px] font-medium relative",
                                                            isActive(item.path)
                                                                ? "bg-white border-l-4 border-[#2563eb] text-[#2563eb] shadow-sm"
                                                                : "hover:bg-[#e0e7ff] text-[#1e293b]"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "flex items-center justify-center h-7 w-7",
                                                            isActive(item.path) ? "text-[#2563eb]" : "text-[#64748b] group-hover:text-[#2563eb]"
                                                        )}>
                                                            {item.icon}
                                                        </span>
                                                        {!isCollapsed && <span className="flex-1">{item.label}</span>}
                                                        {item.badge && !isCollapsed && (
                                                            <Badge
                                                                variant={isActive(item.path) ? "outline" : item.badge.variant}
                                                                className={cn(
                                                                    "h-5 text-xs ml-2",
                                                                    isActive(item.path) && "bg-[#e0e7ff] text-[#2563eb] border-[#2563eb]"
                                                                )}
                                                            >
                                                                {item.badge.count}
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="text-xs">
                                                    {item.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                )}
                                {/* Divider between groups, except last */}
                                {idx < navigationGroups.length - 1 && (
                                    <div className="h-px bg-[#e5e7eb] my-2 mx-2" />
                                )}
                            </div>
                        ))}
                    </TooltipProvider>
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className={cn(
                "p-4 border-t border-[#e5e7eb] bg-[#f4f5f7] flex items-center justify-between gap-2",
                isCollapsed && "flex-col gap-3"
            )}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#64748b] hover:text-[#2563eb] relative" onClick={() => router.push('/settings')}>
                                <Settings className="h-5 w-5" />
                                {hasSettingsNotification && (
                                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full text-[#64748b] hover:text-[#ef4444]"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Logout</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out of LabTasker?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be logged out of your account. You will need to log in again to access your data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmLogout}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </aside>
    );
}
