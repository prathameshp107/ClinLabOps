import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    MessageSquare,
    Clock,
    AlertTriangle,
    CheckCircle,
    User,
    Mail,
    Phone,
    Building,
    Calendar,
    FileText,
    Download,
    Star,
    X,
    Pause
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO, isValid } from "date-fns";

function getStatusBadgeVariant(status) {
    switch (status) {
        case "Pending": return "warning";
        case "In Progress": return "default";
        case "Completed": return "success";
        case "Cancelled": return "destructive";
        case "On Hold": return "secondary";
        default: return "secondary";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "Pending": return <Clock className="h-3 w-3 mr-1" />;
        case "In Progress": return <AlertTriangle className="h-3 w-3 mr-1" />;
        case "Completed": return <CheckCircle className="h-3 w-3 mr-1" />;
        case "Cancelled": return <X className="h-3 w-3 mr-1" />;
        case "On Hold": return <Pause className="h-3 w-3 mr-1" />;
        default: return null;
    }
}

function getPriorityBadgeVariant(priority) {
    switch (priority) {
        case "High": return "destructive";
        case "Medium": return "warning";
        case "Low": return "secondary";
        default: return "secondary";
    }
}

function getPriorityIcon(priority) {
    switch (priority) {
        case "High": return <Star className="h-3 w-3 mr-1 fill-current" />;
        case "Medium": return <Star className="h-3 w-3 mr-1" />;
        case "Low": return <Star className="h-3 w-3 mr-1" />;
        default: return null;
    }
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
        const date = parseISO(dateString);
        if (isValid(date)) {
            return format(date, "MMM d, yyyy");
        }
        return "Invalid date";
    } catch {
        return "Invalid date";
    }
}

function formatDateTime(dateString) {
    if (!dateString) return "N/A";
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

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function enquiryColumns(onEnquiryAction) {
    return [
        {
            accessorKey: "id",
            header: "Enquiry ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {row.original.id}
                </span>
            ),
        },
        {
            accessorKey: "customerName",
            header: "Customer",
            cell: ({ row }) => {
                const enquiry = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={enquiry.avatar} alt={enquiry.customerName} />
                            <AvatarFallback className="text-xs">
                                {getInitials(enquiry.customerName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{enquiry.customerName}</div>
                            <div className="text-xs text-muted-foreground">{enquiry.companyName}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="font-medium truncate">{row.original.subject}</div>
                    <div className="text-xs text-muted-foreground truncate">
                        {row.original.details}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => (
                <Badge variant={getPriorityBadgeVariant(row.original.priority)} className="gap-1">
                    {getPriorityIcon(row.original.priority)}
                    {row.original.priority}
                </Badge>
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
                    ${status === "Pending" ? "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" : ""} 
                    ${status === "In Progress" ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400 border-blue-200 dark:border-blue-800" : ""} 
                    ${status === "Completed" ? "bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400 border-green-200 dark:border-green-800" : ""}
                    ${status === "Cancelled" ? "bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400 border-red-200 dark:border-red-800" : ""} 
                    ${status === "On Hold" ? "bg-gray-500/15 text-gray-600 dark:bg-gray-500/25 dark:text-gray-400 border-gray-200 dark:border-gray-800" : ""}
                  `}
                                >
                                    {getStatusIcon(status)}
                                    {status}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-medium">{status}</p>
                                <p className="text-xs text-muted-foreground">
                                    {status === "Pending" && "Awaiting assignment or response"}
                                    {status === "In Progress" && "Work is currently being performed"}
                                    {status === "Completed" && "All work has been finished"}
                                    {status === "Cancelled" && "Enquiry has been cancelled"}
                                    {status === "On Hold" && "Work is temporarily paused"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
        },
        {
            accessorKey: "assignedTo",
            header: "Assigned To",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                            {getInitials(row.original.assignedTo)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{row.original.assignedTo}</span>
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help">
                                {formatDate(row.original.createdAt)}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {formatDateTime(row.original.createdAt)}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: "documents",
            header: "Documents",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{row.original.documents?.length || 0}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const enquiry = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEnquiryAction("view", enquiry)} className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEnquiryAction("edit", enquiry)} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Enquiry
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEnquiryAction("message", enquiry)} className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEnquiryAction("download", enquiry)} className="gap-2">
                                <Download className="h-4 w-4" />
                                Download Documents
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onEnquiryAction("delete", enquiry)}
                                className="gap-2 text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Enquiry
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
} 