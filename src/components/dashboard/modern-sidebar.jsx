"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    HoverGlowCard,
    GlowingStarsBackgroundCard
} from "@/components/ui/aceternity/cards";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import {
    Home,
    FlaskConical,
    ClipboardList,
    Users,
    BarChart2,
    Settings,
    Bell,
    Calendar,
    FileText,
    Database,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    ChevronDown,
    User,
    Moon,
    Sun,
    Microscope,
    Beaker,
    Atom,
    BookOpen,
    Briefcase,
    Cog,
    MessageSquare,
    AlertCircle,
    Clock,
    Star,
    ToggleRight,
    ToggleLeft,
    LayoutDashboard,
    BarChart3,
    CheckSquare,
    FolderKanban,
    Package,
    FileUser
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Add this import

export function ModernSidebar({ className, onToggle }) {
    const pathname = usePathname();
    const router = useRouter(); // Add router
    const [expandedSections, setExpandedSections] = useState(['main', 'lab', 'team', 'insights', 'system']);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false); // Add state for logout dialog
    const [userData, setUserData] = useState(null); // Add state for user data

    // Load user data from localStorage on component mount
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

    // Logout function
    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    // Confirm logout function
    const confirmLogout = () => {
        // Clear localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');

        // Redirect to login page
        router.push('/login');
    };

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    // Handle sidebar collapse toggle
    const handleToggle = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        // Notify parent component about the state change
        if (onToggle) {
            onToggle(newCollapsedState);
        }
    };

    // Check if a route is active
    const isActive = (path) => {
        return pathname === path;
    };

    // Update the navigationItems array to include Experiments
    const navigationItems = [
        {
            section: 'main',
            label: 'Main',
            items: [
                {
                    name: 'dashboard',
                    label: 'Dashboard',
                    icon: <Home className="h-5 w-5" />,
                    path: '/admin-dashboard',
                    badge: null
                },
                {
                    name: 'projects',
                    label: 'Projects',
                    icon: <ClipboardList className="h-5 w-5" />,
                    path: '/projects',
                    badge: { count: 12, variant: 'default' }
                },
                {
                    name: 'tasks',
                    label: 'Tasks',
                    icon: <ClipboardList className="h-5 w-5" />,
                    path: '/tasks',
                    badge: { count: 12, variant: 'default' }
                },
                {
                    name: 'experiments',
                    label: 'Experiments',
                    icon: <FlaskConical className="h-5 w-5" />,
                    path: '/experiments',
                    badge: { count: 5, variant: 'outline' }
                },
            ]
        },
        {
            section: 'lab',
            label: 'Laboratory',
            items: [
                {
                    name: 'protocols',
                    label: 'Protocols',
                    icon: <BookOpen className="h-5 w-5" />,
                    path: '/protocols',
                    badge: null
                },
                {
                    name: 'equipments',
                    label: 'Equipments',
                    icon: <Microscope className="h-5 w-5" />,
                    path: '/equipments',
                    badge: null
                },
                {
                    name: 'inventory',
                    label: 'Inventory',
                    icon: <Database className="h-5 w-5" />,
                    path: '/inventory',
                    badge: { count: 3, variant: 'destructive' }
                },
            ]
        },
        {
            section: 'team',
            label: 'Team',
            items: [
                {
                    name: 'user-management',
                    label: 'User Management',
                    icon: <Briefcase className="h-5 w-5" />,
                    path: '/user-management',
                    badge: null
                },
                {
                    name: 'messages',
                    label: 'Messages',
                    icon: <MessageSquare className="h-5 w-5" />,
                    path: '#',
                    badge: {
                        count: "Soon",
                        variant: 'secondary',
                        className: "bg-amber-100 text-amber-800 border-amber-200 px-2 text-[10px]"
                    },
                    renderItem: (item, isActive) => (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm my-1",
                                        "bg-muted/20 text-muted-foreground cursor-not-allowed opacity-70 border border-dashed border-muted/50",
                                        isActive && "bg-muted/30"
                                    )}>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground bg-muted/10">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <span className="flex-1">Messages</span>
                                        <Badge variant="outline" className="ml-auto text-xs uppercase">
                                            Soon
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    <p className="max-w-[200px]">This feature is in development. We will release it soon.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                },
                {
                    name: 'my page',
                    label: 'My Page',
                    icon: <FileUser className="h-5 w-5" />,
                    path: '/my-page',
                    badge: null
                },
                {
                    name: 'profile',
                    label: 'Profile',
                    icon: <User className="h-5 w-5" />,
                    path: '/profile',
                    badge: null
                }

            ]
        },
        {
            section: 'insights',
            label: 'Insights',
            items: [
                {
                    name: 'analytics',
                    label: 'Analytics',
                    icon:
                        <BarChart2 className="h-5 w-5" />,
                    path: '#',
                    badge: {
                        count: "Soon",
                        variant: 'secondary',
                        className: "bg-amber-100 text-amber-800 border-amber-200 px-2 text-[10px]"
                    },
                    renderItem: (item, isActive) => (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm my-1"
                                        , "bg-muted/20 text-muted-foreground cursor-not-allowed opacity-70 border border-dashed border-muted/50"
                                        , isActive && "bg-muted/30")}>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground bg-muted/10">
                                            {item.icon}
                                        </div>
                                        <span className="flex-1">{item.label}</span>
                                        <Badge variant="outline" className="ml-auto text-xs uppercase">
                                            Soon
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    <p className="max-w-[200px]">This feature is in development. We will release it soon.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                },
                {
                    name: 'reports',
                    label: 'Reports',
                    icon:
                        <FileText className="h-5 w-5" />,
                    path: '#',
                    badge: {
                        count: "Soon",
                        variant: 'secondary',
                        className: "bg-amber-100 text-amber-800 border-amber-200 px-2 text-[10px]"
                    },
                    renderItem: (item, isActive) => (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm my-1"
                                        , "bg-muted/20 text-muted-foreground cursor-not-allowed opacity-70 border border-dashed border-muted/50"
                                        , isActive && "bg-muted/30")}>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground bg-muted/10">
                                            {item.icon}
                                        </div>
                                        <span className="flex-1">{item.label}</span>
                                        <Badge variant="outline" className="ml-auto text-xs uppercase">
                                            Soon
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    <p className="max-w-[200px]">This feature is in development. We will release it soon.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                },
                {
                    name: 'enquiries',
                    label: 'Enquiries',
                    icon: <MessageSquare className="h-5 w-5" />,
                    path: '/enquiries',
                    badge: null
                },
            ]
        },
        {
            section: 'system',
            label: 'System',
            items: [
                {
                    name: 'settings',
                    label: 'Settings',
                    icon:
                        <MessageSquare className="h-5 w-5" />,
                    path: '#',
                    badge: {
                        count: "Soon",
                        variant: 'secondary',
                        className: "bg-amber-100 text-amber-800 border-amber-200 px-2 text-[10px]"
                    },
                    renderItem: (item, isActive) => (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm my-1"
                                        , "bg-muted/20 text-muted-foreground cursor-not-allowed opacity-70 border border-dashed border-muted/50",
                                        isActive && "bg-muted/30")}>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground bg-muted/10">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <span className="flex-1">Messages</span>
                                        <Badge variant="outline" className="ml-auto text-xs uppercase">
                                            Soon
                                        </Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    <p className="max-w-[200px]">This feature is in development. We will release it soon.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                },
                {
                    name: 'compliance',
                    label: 'Compliance',
                    icon: <Shield className="h-5 w-5" />,
                    path: '/compliance',
                    badge: null
                },
                {
                    name: 'help',
                    label: 'Help & Support',
                    icon: <HelpCircle className="h-5 w-5" />,
                    path: '/help',
                    badge: null
                },
            ]
        }
    ];

    // Recent activities for the sidebar
    const recentActivities = [
        {
            title: "PCR Protocol Updated",
            time: "10 min ago",
            icon: <Atom className="h-4 w-4 text-blue-500" />
        },
        {
            title: "Sample Analysis Complete",
            time: "1 hour ago",
            icon: <Beaker className="h-4 w-4 text-green-500" />
        },
        {
            title: "New Task Assigned",
            time: "3 hours ago",
            icon: <ClipboardList className="h-4 w-4 text-amber-500" />
        }
    ];

    // Quick stats for the sidebar
    const quickStats = [
        { label: "Tasks Due Today", value: 7, icon: <Clock className="h-4 w-4 text-amber-500" /> },
        { label: "Active Experiments", value: 12, icon: <FlaskConical className="h-4 w-4 text-blue-500" /> },
        { label: "Team Utilization", value: 78, icon: <Users className="h-4 w-4 text-green-500" /> }
    ];

    return (
        <div
            className={cn(
                "h-screen fixed left-0 top-0 z-30 flex flex-col",
                isCollapsed ? "w-[70px]" : "w-[280px]",
                "bg-background/90 backdrop-blur-xl border-r border-border/40",
                "shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
                "transition-all duration-300 ease-in-out",
                className
            )}
        >
            {/* Header with Logo and Toggle */}
            <div className="flex items-center justify-between p-5 h-16 border-b border-border/40 bg-gradient-to-r from-background to-background/95">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            <Microscope className="h-5 w-5 text-primary" />
                            <div className="absolute inset-0 rounded-xl">
                                <SparklesCore
                                    id="tsparticles-logo"
                                    background="transparent"
                                    minSize={0.4}
                                    maxSize={0.8}
                                    particleDensity={60}
                                    className="w-full h-full"
                                    particleColor="#8B5CF6"
                                />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight">LabTasker</span>
                    </div>
                )}

                {isCollapsed && (
                    <div className="mx-auto">
                        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            <Microscope className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggle}
                    className="h-14 w-14 rounded-full hover:bg-primary/20 hover:text-primary transition-colors shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <div className="flex items-center justify-center w-full h-full">
                        {isCollapsed ? (
                            <ToggleLeft className="h-8 w-8 text-primary" />
                        ) : (
                            <ToggleRight className="h-8 w-8 text-primary" />
                        )}
                    </div>
                </Button>
            </div>

            { }
            <ScrollArea className="flex-1 px-3 overflow-y-auto">
                <div className="py-4 space-y-6">
                    {navigationItems.map((section) => (
                        <div key={section.section} className="space-y-1">
                            {/* Section Header */}
                            {!isCollapsed && (
                                <div
                                    className="flex items-center justify-between px-2 py-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold cursor-pointer"
                                    onClick={() => toggleSection(section.section)}
                                >
                                    <span>{section.label}</span>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-primary/10">
                                        <ChevronDown
                                            className={cn(
                                                "h-3 w-3 transition-transform duration-200",
                                                expandedSections.includes(section.section) ? "rotate-0" : "-rotate-90"
                                            )}
                                        />
                                    </Button>
                                </div>
                            )}

                            {isCollapsed && (
                                <div className="flex justify-center py-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
                                                    {section.section === 'main' && <Home className="h-4 w-4 text-primary" />}
                                                    {section.section === 'lab' && <FlaskConical className="h-4 w-4 text-primary" />}
                                                    {section.section === 'team' && <Users className="h-4 w-4 text-primary" />}
                                                    {section.section === 'insights' && <BarChart2 className="h-4 w-4 text-primary" />}
                                                    {section.section === 'system' && <Settings className="h-4 w-4 text-primary" />}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>{section.label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )}

                            {/* Section Items */}
                            <AnimatePresence initial={false}>
                                {(!isCollapsed && expandedSections.includes(section.section)) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        {section.items.map((item) => (
                                            item.renderItem
                                                ? item.renderItem(item, isActive(item.path))
                                                : (
                                                    <Link
                                                        key={item.name}
                                                        href={item.path}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm my-1",
                                                            "transition-all duration-200 group",
                                                            isActive(item.path)
                                                                ? "bg-primary text-primary-foreground font-medium shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
                                                                : "hover:bg-accent/50 hover:translate-x-1 hover:shadow-sm"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "relative flex items-center justify-center w-8 h-8 rounded-md",
                                                            isActive(item.path)
                                                                ? "text-primary-foreground bg-primary-foreground/10"
                                                                : "text-muted-foreground group-hover:text-foreground bg-background/80 group-hover:bg-background shadow-sm"
                                                        )}>
                                                            {item.icon}
                                                        </div>
                                                        <span className="flex-1">{item.label}</span>
                                                        {item.badge && (
                                                            <Badge
                                                                variant={isActive(item.path) ? "outline" : item.badge.variant}
                                                                className={cn(
                                                                    "h-5 text-xs shadow-sm",
                                                                    isActive(item.path) && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                                                                )}
                                                            >
                                                                {item.badge.count}
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                )
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Collapsed Menu Items */}
                            {isCollapsed && (
                                <div className="space-y-3 py-2">
                                    {section.items.map((item) => (
                                        <TooltipProvider key={item.name}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.path}
                                                        className={cn(
                                                            "flex justify-center items-center h-10 w-10 rounded-lg mx-auto",
                                                            "transition-all duration-200",
                                                            isActive(item.path)
                                                                ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(139,92,246,0.25)]"
                                                                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                                        )}
                                                    >
                                                        <div className="relative">
                                                            {item.icon}
                                                            {item.badge && (
                                                                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                                                    {item.badge.count}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p>{item.label}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Quick Stats */}
            {/* {!isCollapsed && (
                <div className="border-t border-border/40 p-4 bg-muted/30 backdrop-blur-sm">
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-1 uppercase tracking-wider">Quick Stats</h4>
                        <div className="space-y-2.5">
                            {quickStats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-background/80 transition-colors hover:shadow-sm">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-background p-1.5 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
                                            {stat.icon}
                                        </div>
                                        <span className="text-xs font-medium">{stat.label}</span>
                                    </div>
                                    {typeof stat.value === 'number' && stat.label === 'Team Utilization' ? (
                                        <div className="flex items-center gap-2 w-24">
                                            <Progress value={stat.value} className="h-1.5" />
                                            <span className="text-xs font-medium">{stat.value}%</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-semibold bg-background px-2 py-1 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]">{stat.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )} */}

            {/* User Profile Section */}
            {!isCollapsed ? (
                <div className="border-t border-border/40 p-4 bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-primary/5 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                            <AvatarImage src="/avatars/user.jpg" alt="User" />
                            <AvatarFallback>{userData?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{userData?.fullName || 'User'}</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10">
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 shadow-lg border-border/60">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="hover:bg-accent/70 cursor-pointer" onClick={() => router.push('/profile')}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="hover:bg-accent/70 cursor-pointer" onClick={() => router.push('/settings')}>
                                            <Cog className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setIsDarkMode(!isDarkMode)} className="hover:bg-accent/70 cursor-pointer">
                                            {isDarkMode ? (
                                                <>
                                                    <Sun className="mr-2 h-4 w-4" />
                                                    <span>Light Mode</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Moon className="mr-2 h-4 w-4" />
                                                    <span>Dark Mode</span>
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">Senior Researcher</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-t border-border/40 p-4 flex justify-center">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-primary/5 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                        <AvatarImage src="/avatars/user.jpg" alt="User" />
                        <AvatarFallback>{userData?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                    </Avatar>
                </div>
            )}

            {/* Footer with Notifications */}
            {!isCollapsed && (
                <div className="p-4 border-t border-border/40 bg-background/70 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg relative hover:bg-primary/10 hover:text-primary transition-colors shadow-sm hover:shadow-md">
                                <Bell className="h-4 w-4" />
                                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center shadow-sm">
                                    3
                                </Badge>
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors shadow-sm hover:shadow-md">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 text-xs rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm hover:shadow-md"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-3.5 w-3.5 mr-1.5" />
                            Logout
                        </Button>
                    </div>
                </div>
            )}

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
        </div>
    )
};
