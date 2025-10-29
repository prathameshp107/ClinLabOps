"use client";

import { useState, useEffect, useMemo } from "react";
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
    HelpCircle,
    Star
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
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getCurrentUser } from '@/services/authService';

export function ModernSidebar({ className, onToggle, isCollapsed }) {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState({
        main: true,
        lab: true,
        team: true,
        insights: true,
        system: true
    });
    // Simulate notification for settings
    const [hasSettingsNotification] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Load current user data
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    // Drag-and-drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Define the correct default order
    const DEFAULT_GROUP_ORDER = ['main', 'lab', 'insights', 'team', 'system'];

    // Group order state - always use the default order
    const [groupOrder, setGroupOrder] = useState(DEFAULT_GROUP_ORDER);

    const [itemOrder, setItemOrder] = useState({});

    // Grouped navigation items - using useMemo to ensure it updates when currentUser changes
    const navigationGroups = useMemo(() => [
        {
            key: 'main',
            label: 'Main',
            icon: <Home className="h-4 w-4" />,
            items: [
                { name: 'dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard', badge: null },
                { name: 'projects', label: 'Projects', icon: <ClipboardList className="h-5 w-5" />, path: '/projects', badge: null },
                { name: 'tasks', label: 'Tasks', icon: <ClipboardList className="h-5 w-5" />, path: '/tasks', badge: null },
                { name: 'experiments', label: 'Experiments', icon: <FlaskConical className="h-5 w-5" />, path: '/experiments', badge: null }
            ]
        },
        {
            key: 'lab',
            label: 'Laboratory',
            icon: <FlaskConical className="h-4 w-4" />,
            items: [
                { name: 'protocols', label: 'Protocols', icon: <BookOpen className="h-5 w-5" />, path: '/protocols', badge: null },
                { name: 'equipments', label: 'Equipments', icon: <Microscope className="h-5 w-5" />, path: '/equipments', badge: null },
                { name: 'inventory', label: 'Inventory', icon: <Database className="h-5 w-5" />, path: '/inventory', badge: null },
                { name: 'animals', label: 'Animals', icon: <span className="text-base">🐾</span>, path: '/animals', badge: null }
            ]
        },
        {
            key: 'insights',
            label: 'Insights',
            icon: <BarChart2 className="h-4 w-4" />,
            items: [
                { name: 'analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" />, path: '#', badge: null, comingSoon: true },
                { name: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5" />, path: '/reports', badge: null },
                { name: 'enquiries', label: 'Enquiries', icon: <MessageSquare className="h-5 w-5" />, path: '/enquiries', badge: null }
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
            ].filter(item => {
                // Only show user-management for power users
                if (item.name === 'user-management') {
                    return currentUser?.isPowerUser === true;
                }
                return true;
            })
        },
        {
            key: 'system',
            label: 'System',
            icon: <Cog className="h-4 w-4" />,
            items: [
                { name: 'settings', label: 'Settings', icon: <Cog className="h-5 w-5" />, path: '/settings', badge: null },
                // { name: 'compliance', label: 'Compliance', icon: <Shield className="h-5 w-5" />, path: '/compliance', badge: null },
                { name: 'help', label: 'Help & Support', icon: <HelpCircle className="h-5 w-5" />, path: '/help', badge: null }
            ]
        }
    ], [currentUser]);

    // Helper: get group/items in current order
    const orderedGroups = useMemo(() => {
        return groupOrder.map(key => navigationGroups.find(g => g.key === key)).filter(Boolean);
    }, [groupOrder, navigationGroups]);

    const getOrderedItems = useMemo(() => {
        return (group) => {
            const order = itemOrder[group.key] || group.items.map(i => i.name);
            // Remove pinning logic, just order by order array
            return group.items.slice().sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
        };
    }, [itemOrder]);

    // Drag-and-drop handlers
    const handleGroupDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = groupOrder.indexOf(active.id);
            const newIndex = groupOrder.indexOf(over.id);
            const newOrder = arrayMove(groupOrder, oldIndex, newIndex);
            setGroupOrder(newOrder);
            // Note: We're no longer persisting group order to localStorage
        }
    };
    const handleItemDragEnd = (groupKey) => (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const group = navigationGroups.find(g => g.key === groupKey);
            const order = itemOrder[groupKey] || group.items.map(i => i.name);
            const oldIndex = order.indexOf(active.id);
            const newIndex = order.indexOf(over.id);
            const newOrder = arrayMove(order, oldIndex, newIndex);
            setItemOrder((prev) => ({ ...prev, [groupKey]: newOrder }));
            // Note: We're no longer persisting item order to localStorage
        }
    };

    // Sortable wrappers
    function SortableGroup({ group, children }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.key });
        return (
            <div
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    opacity: isDragging ? 0.5 : 1
                }}
                {...attributes}
                {...listeners}
            >
                {children}
            </div>
        );
    }
    function SortableItem({ item, children }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.name });
        return (
            <div
                ref={setNodeRef}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    opacity: isDragging ? 0.5 : 1
                }}
                {...attributes}
                {...listeners}
            >
                {children}
            </div>
        );
    }

    const isActive = (path) => pathname === path;

    const toggleGroup = (key) => {
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper: check if group contains active route
    const groupIsActive = (group) => group.items.some(item => isActive(item.path));
    // Helper: get total badge count for group
    const groupBadgeCount = (group) => group.items.reduce((acc, item) => acc + (item.badge && item.badge.count ? Number(item.badge.count) : 0), 0);

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-40 h-screen flex flex-col justify-between font-sans",
                isCollapsed ? "w-0 opacity-0 -translate-x-full" : "w-[240px] opacity-100 translate-x-0",
                "transition-all duration-300 bg-background border-r border-border",
                "lg:fixed lg:translate-x-0",
                isCollapsed && "lg:-translate-x-full"
            )}
        >
            {/* New: Top Logo/Title Area */}
            <div className="flex items-center gap-2 pt-5 pb-2 px-4 min-h-[48px] justify-center">
                <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Microscope className="h-6 w-6 text-primary" />
                </div>
                {!isCollapsed && (
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/70">
                        LabTasker
                    </h1>
                )}
            </div>

            {/* Navigation with Groups */}
            <ScrollArea className={cn("flex-1 overflow-y-auto", isCollapsed ? "px-0" : "px-1")}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleGroupDragEnd}>
                    <SortableContext items={orderedGroups.map(g => g.key)} strategy={verticalListSortingStrategy}>
                        <nav className="space-y-2 mt-2">
                            <TooltipProvider>
                                {orderedGroups.map((group, idx) => (
                                    <SortableGroup key={group.key} group={group}>
                                        <div className="mb-1">
                                            {/* Group Header */}
                                            <div
                                                className={cn(
                                                    "flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-wider font-bold cursor-pointer select-none hover:text-primary",
                                                    isCollapsed && "justify-center px-0",
                                                    groupIsActive(group) && !isCollapsed && "bg-primary/10 text-primary rounded-md"
                                                )}
                                                onClick={() => !isCollapsed && toggleGroup(group.key)}
                                            >
                                                {isCollapsed ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="flex items-center justify-center h-7 w-7 relative">{group.icon}
                                                                {groupBadgeCount(group) > 0 && (
                                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{groupBadgeCount(group)}</span>
                                                                )}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right">{group.label}</TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    <>
                                                        <span>{group.label}</span>
                                                        {groupBadgeCount(group) > 0 && (
                                                            <span className="ml-2 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{groupBadgeCount(group)}</span>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-auto" tabIndex={-1}>
                                                            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", expandedGroups[group.key] ? "rotate-0" : "-rotate-90")} />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                            {/* Group Items */}
                                            {expandedGroups[group.key] && (
                                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd(group.key)}>
                                                    <SortableContext items={getOrderedItems(group).map(i => i.name)} strategy={verticalListSortingStrategy}>
                                                        <div className="space-y-1">
                                                            {getOrderedItems(group).map((item) => (
                                                                <SortableItem key={item.name} item={item}>
                                                                    <Tooltip delayDuration={300}>
                                                                        <TooltipTrigger asChild>
                                                                            <Link
                                                                                href={item.path}
                                                                                className={cn(
                                                                                    "flex items-center gap-3 px-3 py-2 rounded-md group transition-all duration-150 text-[15px] font-medium relative",
                                                                                    isActive(item.path)
                                                                                        ? "bg-primary/15 border-l-4 border-primary text-primary shadow-sm font-semibold"
                                                                                        : "hover:bg-primary/5 text-foreground hover:text-primary"
                                                                                )}
                                                                            >
                                                                                <span className={cn(
                                                                                    "flex items-center justify-center h-7 w-7 transition-colors",
                                                                                    isActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                                                                )}>
                                                                                    {item.icon}
                                                                                </span>
                                                                                {!isCollapsed && (
                                                                                    <div className="flex-1 flex items-center justify-between">
                                                                                        <span>{item.label}</span>
                                                                                        {item.comingSoon && (
                                                                                            <span className="text-xs text-muted-foreground ml-2">Coming soon</span>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                                {item.badge && !isCollapsed && (
                                                                                    <Badge
                                                                                        variant={isActive(item.path) ? "outline" : item.badge.variant}
                                                                                        className={cn(
                                                                                            "h-5 text-xs ml-2",
                                                                                            isActive(item.path) && "bg-primary/10 text-primary border-primary"
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
                                                                </SortableItem>
                                                            ))}
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                            )}
                                            {/* Divider between groups, except last */}
                                            {idx < orderedGroups.length - 1 && (
                                                <div className="h-px bg-border my-2 mx-2" />
                                            )}
                                        </div>
                                    </SortableGroup>
                                ))}
                            </TooltipProvider>
                        </nav>
                    </SortableContext>
                </DndContext>
            </ScrollArea>

            {/* Footer */}
            {!isCollapsed && (
                <div className={cn(
                    "p-4 border-t border-border bg-background flex items-center justify-between gap-2",
                    isCollapsed && "flex-col gap-3"
                )}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary relative" onClick={() => router.push('/settings')}>
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
                                    className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                                    onClick={() => router.push('/login')}
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Logout</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </aside>
    );
}
