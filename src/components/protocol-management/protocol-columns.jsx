"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Eye,
    Edit,
    Copy,
    Archive,
    Trash2,
    UserRound,
    FileText,
    FlaskConical,
    CalendarDays,
    MoreHorizontal,
    Hash
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtocolRowActions } from "./protocol-row-actions"

// Status badge variants
const getStatusVariant = (status) => {
    switch (status) {
        case "Draft":
            return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50"
        case "In Review":
            return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50"
        case "Approved":
            return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
        case "Archived":
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50"
    }
}

// Format date
const formatDate = (dateString) => {
    try {
        return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
        return dateString
    }
}

export const createProtocolColumns = (actions) => [
    {
        accessorKey: "_id",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary/60" />
                    <span className="hidden sm:inline">Protocol ID</span>
                    <span className="sm:hidden">ID</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const protocolId = row.getValue("_id")
            return (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-xs">
                    {protocolId?.substring(0, 8) + '...'}
                </Badge>
            )
        },
        meta: {
            className: "w-[120px] min-w-[120px]"
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary/60" />
                    <span>Protocol Name</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const protocol = row.original
            return (
                <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary/70 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[15px] group-hover:text-primary transition-colors duration-200 truncate">
                            {protocol.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            v{protocol.version}
                        </span>
                    </div>
                </div>
            )
        },
        meta: {
            className: "min-w-[200px] max-w-[300px]"
        }
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description")
            return (
                <div className="max-w-[200px] truncate text-muted-foreground text-sm">
                    {description || <span className="italic text-gray-400">No description</span>}
                </div>
            )
        },
        meta: {
            className: "hidden lg:table-cell min-w-[150px] max-w-[200px]"
        }
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category")
            return (
                <Badge className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium text-xs">
                    {category || "General"}
                </Badge>
            )
        },
        meta: {
            className: "w-[120px] min-w-[120px]"
        }
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary/50" />
                    <span className="hidden md:inline">Created By</span>
                    <span className="md:hidden">Author</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const createdBy = row.getValue("createdBy")
            return (
                <div className="flex items-center gap-2 min-w-0">
                    <UserRound className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <span className="text-sm truncate">{createdBy?.name || 'Unknown'}</span>
                </div>
            )
        },
        meta: {
            className: "hidden md:table-cell min-w-[120px] max-w-[150px]"
        }
    },
    {
        accessorKey: "lastModified",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary/50" />
                    <span className="hidden lg:inline">Last Updated</span>
                    <span className="lg:hidden">Updated</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const lastModified = row.getValue("lastModified") || row.original.updatedAt
            return (
                <div className="flex items-center gap-2 min-w-0">
                    <CalendarDays className="h-4 w-4 text-primary/60 flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">{formatDate(lastModified)}</span>
                </div>
            )
        },
        meta: {
            className: "hidden sm:table-cell min-w-[130px]"
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            return (
                <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold border flex items-center gap-1.5 shadow-sm whitespace-nowrap",
                    getStatusVariant(status)
                )}>
                    {status}
                </Badge>
            )
        },
        meta: {
            className: "w-[100px] min-w-[100px]"
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <ProtocolRowActions
                row={row}
                onView={actions.onView}
                onEdit={actions.onEdit}
                onDuplicate={actions.onDuplicate}
                onArchive={actions.onArchive}
                onDelete={actions.onDelete}
            />
        ),
        meta: {
            className: "w-[60px] min-w-[60px]"
        }
    },
] 