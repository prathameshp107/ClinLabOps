import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/tasks/user-avatar";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { MoreHorizontal, Pencil, Key, Trash, ShieldAlert, Shield, User, Clock, Lock, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO, isValid } from "date-fns";
import * as React from "react";

function getRoleBadgeVariant(role) {
    switch (role) {
        case "Admin": return "destructive";
        case "Scientist": return "default";
        case "Technician": return "secondary";
        case "Reviewer": return "outline";
        default: return "secondary";
    }
}

function getStatusBadgeVariant(status) {
    switch (status) {
        case "Active": return "success";
        case "Inactive": return "secondary";
        case "Pending": return "warning";
        case "Suspended": return "destructive";
        case "Invited": return "outline";
        case "Locked": return "default";
        default: return "secondary";
    }
}

function getRoleIcon(role) {
    switch (role) {
        case "Admin": return <ShieldAlert className="h-3 w-3 mr-1" />;
        case "Scientist": return <Shield className="h-3 w-3 mr-1" />;
        case "Technician": return <User className="h-3 w-3 mr-1" />;
        case "Reviewer": return <Clock className="h-3 w-3 mr-1" />;
        default: return null;
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "Active": return <CheckCircle className="h-3 w-3 mr-1" />;
        case "Inactive": return <User className="h-3 w-3 mr-1" />;
        case "Pending": return <Clock className="h-3 w-3 mr-1" />;
        case "Suspended": return <AlertTriangle className="h-3 w-3 mr-1" />;
        case "Invited": return <Mail className="h-3 w-3 mr-1" />;
        case "Locked": return <Lock className="h-3 w-3 mr-1" />;
        default: return null;
    }
}

function getStatusDescription(status) {
    switch (status) {
        case "Active": return "User can log in and use the system";
        case "Inactive": return "User account is disabled";
        case "Pending": return "User account is awaiting activation";
        case "Suspended": return "User account is temporarily suspended";
        case "Invited": return "User has been invited but not yet registered";
        case "Locked": return "User account is locked due to security reasons";
        default: return "Unknown status";
    }
}

function formatDate(dateString) {
    if (!dateString) return "Never logged in";
    try {
        const date = parseISO(dateString);
        if (isValid(date)) {
            return format(date, "MMM d, yyyy 'at' h:mm a");
        }
        return "Invalid date";
    } catch {
        return "Invalid date";
    }
}

export function userColumns(onUserAction) {
    return [
        {
            accessorKey: "id",
            header: "User ID",
            cell: ({ row }) => {
                const userId = row.original._id || row.original.id;
                return <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{userId}</span>;
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <UserAvatar user={user} size="md" />
                        <div>
                            <div className="font-medium">{user.name}</div>
                            {user.twoFactorEnabled && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-[10px] rounded-sm px-1 py-0">2FA</Badge>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <span>{row.original.email}</span>,
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => <span>{row.original.phone || <span className="text-muted-foreground italic">N/A</span>}</span>,
        },
        {
            accessorKey: "isPowerUser",
            header: "Power User",
            cell: ({ row }) => (
                <Badge variant={row.original.isPowerUser ? "destructive" : "secondary"}>
                    {row.original.isPowerUser ? "True" : "False"}
                </Badge>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const userRole = Array.isArray(row.original.roles) ? row.original.roles[0] : row.original.role;
                return (
                    <Badge variant={getRoleBadgeVariant(userRole)} className="gap-1 flex items-center">
                        {getRoleIcon(userRole)}
                        {userRole}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "lastLogin",
            header: "Last Login",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help">
                                {row.original.lastLogin ? formatDate(row.original.lastLogin).split(" at ")[0] : "Never"}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatDate(row.original.lastLogin)}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant={getStatusBadgeVariant(status)}
                                    className={`
                                        gap-1 flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105
                                        ${status === "Active" ? "bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400 border-green-200 dark:border-green-800" : ""} 
                                        ${status === "Inactive" ? "bg-gray-500/15 text-gray-600 dark:bg-gray-500/25 dark:text-gray-400 border-gray-200 dark:border-gray-800" : ""} 
                                        ${status === "Pending" ? "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" : ""}
                                        ${status === "Suspended" ? "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-200 dark:border-red-800" : ""} 
                                        ${status === "Invited" ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-200 dark:border-blue-800" : ""} 
                                        ${status === "Locked" ? "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-400 border-purple-200 dark:border-purple-800" : ""}
                                    `}
                                >
                                    {getStatusIcon(status)}
                                    {status}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-medium">{status}</p>
                                <p className="text-xs text-muted-foreground">{getStatusDescription(status)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => onUserAction("edit", user)} className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUserAction("resetPassword", user)} className="gap-2">
                                <Key className="h-4 w-4" />
                                Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onUserAction("delete", user)} className="text-destructive focus:text-destructive gap-2">
                                <Trash className="h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
} 