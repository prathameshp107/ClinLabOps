"use client"

import { Badge } from "@/components/ui/badge"
import {
    Settings,
    Hash,
    MapPin,
    User,
    Calendar,
    Wrench,
    CheckCircle2,
    Clock,
    XCircle,
    Zap
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { EquipmentRowActions } from "./equipment-row-actions"

// Status badge variants
const getStatusVariant = (status) => {
    switch (status) {
        case "Available":
            return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
        case "In Use":
            return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50"
        case "Under Maintenance":
            return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50"
        case "Out of Order":
            return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50"
    }
}

// Status icon
const getStatusIcon = (status) => {
    switch (status) {
        case "Available":
            return <CheckCircle2 className="h-4 w-4" />
        case "In Use":
            return <Zap className="h-4 w-4" />
        case "Under Maintenance":
            return <Wrench className="h-4 w-4" />
        case "Out of Order":
            return <XCircle className="h-4 w-4" />
        default:
            return <Clock className="h-4 w-4" />
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

// Get equipment type color
const getTypeColor = (type) => {
    switch (type) {
        case "Analytical":
            return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50"
        case "Laboratory":
            return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50"
        case "Storage":
            return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50"
        case "Imaging":
            return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50"
    }
}

export const createEquipmentColumns = (actions) => [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary/60" />
                    <span>Equipment ID</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const equipmentId = row.getValue("id")
            return (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-xs">
                    {equipmentId}
                </Badge>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary/60" />
                    <span>Equipment Name</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const equipment = row.original
            return (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[15px] group-hover:text-primary transition-colors duration-200">
                        {equipment.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {equipment.model}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type")
            return (
                <Badge className={cn(
                    "px-2 py-0.5 rounded-full font-medium text-xs",
                    getTypeColor(type)
                )}>
                    {type}
                </Badge>
            )
        },
    },
    {
        accessorKey: "manufacturer",
        header: "Manufacturer",
        cell: ({ row }) => {
            const manufacturer = row.getValue("manufacturer")
            return (
                <span className="text-sm text-muted-foreground">
                    {manufacturer}
                </span>
            )
        },
    },
    {
        accessorKey: "location",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/50" />
                    <span>Location</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const location = row.getValue("location")
            return (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/60" />
                    <span className="text-sm">{location}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "assignedTo",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/50" />
                    <span>Assigned To</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const assignedTo = row.getValue("assignedTo")
            return (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/60" />
                    <span className="text-sm">
                        {assignedTo || <span className="italic text-gray-400">Unassigned</span>}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            return (
                <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold border flex items-center gap-1.5 shadow-sm",
                    getStatusVariant(status)
                )}>
                    {getStatusIcon(status)}
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "nextMaintenanceDate",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/50" />
                    <span>Next Maintenance</span>
                </div>
            )
        },
        cell: ({ row }) => {
            const nextMaintenanceDate = row.getValue("nextMaintenanceDate")
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/60" />
                    <span className="text-sm">{formatDate(nextMaintenanceDate)}</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <EquipmentRowActions
                row={row}
                onView={actions.onView}
                onEdit={actions.onEdit}
                onDelete={actions.onDelete}
                onUpdateStatus={actions.onUpdateStatus}
            />
        ),
    },
] 