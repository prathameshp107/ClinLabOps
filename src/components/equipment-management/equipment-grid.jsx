"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    Calendar,
    MapPin,
    Tag,
    Wrench,
    QrCode,
    Settings,
    Zap,
    CheckCircle2,
    Clock,
    XCircle,
    User,
    Building,
    Activity,
    Sparkles,
    AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function EquipmentGrid({
    equipment,
    onView,
    onEdit,
    onDelete,
    onUpdateStatus
}) {
    const [hoveredCard, setHoveredCard] = useState(null)

    // Enhanced status configurations
    const statusConfig = {
        "Available": {
            icon: CheckCircle2,
            color: "emerald",
            gradient: "from-emerald-500/20 to-green-500/10",
            border: "border-emerald-200/50",
            text: "text-emerald-700",
            bg: "bg-emerald-50/80",
            dot: "bg-emerald-500"
        },
        "In Use": {
            icon: Zap,
            color: "blue",
            gradient: "from-blue-500/20 to-cyan-500/10",
            border: "border-blue-200/50",
            text: "text-blue-700",
            bg: "bg-blue-50/80",
            dot: "bg-blue-500"
        },
        "Under Maintenance": {
            icon: Clock,
            color: "amber",
            gradient: "from-amber-500/20 to-yellow-500/10",
            border: "border-amber-200/50",
            text: "text-amber-700",
            bg: "bg-amber-50/80",
            dot: "bg-amber-500"
        },
        "Out of Order": {
            icon: XCircle,
            color: "red",
            gradient: "from-red-500/20 to-rose-500/10",
            border: "border-red-200/50",
            text: "text-red-700",
            bg: "bg-red-50/80",
            dot: "bg-red-500"
        }
    }

    // Equipment type configurations
    const typeConfig = {
        "Analytical": {
            icon: Activity,
            color: "purple",
            bg: "bg-purple-100",
            text: "text-purple-700"
        },
        "Laboratory": {
            icon: Settings,
            color: "blue",
            bg: "bg-blue-100",
            text: "text-blue-700"
        },
        "Storage": {
            icon: Building,
            color: "emerald",
            bg: "bg-emerald-100",
            text: "text-emerald-700"
        },
        "Imaging": {
            icon: Sparkles,
            color: "pink",
            bg: "bg-pink-100",
            text: "text-pink-700"
        }
    }

    const getStatusConfig = (status) => {
        return statusConfig[status] || {
            icon: AlertTriangle,
            color: "gray",
            gradient: "from-gray-500/20 to-slate-500/10",
            border: "border-gray-200/50",
            text: "text-gray-700",
            bg: "bg-gray-50/80",
            dot: "bg-gray-500"
        }
    }

    const getTypeConfig = (type) => {
        return typeConfig[type] || {
            icon: Tag,
            color: "gray",
            bg: "bg-gray-100",
            text: "text-gray-700"
        }
    }

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy")
        } catch (error) {
            return dateString
        }
    }

    const statusOptions = [
        { value: "Available", label: "Available", icon: CheckCircle2, color: "emerald" },
        { value: "In Use", label: "In Use", icon: Zap, color: "blue" },
        { value: "Under Maintenance", label: "Under Maintenance", icon: Clock, color: "amber" },
        { value: "Out of Order", label: "Out of Order", icon: XCircle, color: "red" },
    ]

    if (equipment.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-lg border border-slate-200/50">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
                            <Settings className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">No equipment found</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                    We couldn't find any equipment matching your search criteria. Try adjusting your search or add new equipment.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipment.map((item, index) => {
                const statusConf = getStatusConfig(item.status)
                const typeConf = getTypeConfig(item.type)
                const StatusIcon = statusConf.icon
                const TypeIcon = typeConf.icon

                return (
                    <div
                        key={item.id}
                        className="group relative"
                        onMouseEnter={() => setHoveredCard(item.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                    >
                        {/* Hover glow effect */}
                        <div className={cn(
                            "absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl opacity-0 transition-all duration-500",
                            hoveredCard === item.id && "opacity-100"
                        )} />

                        <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02] h-full">
                            {/* Status indicator bar */}
                            <div className={cn("h-1 w-full", `bg-gradient-to-r ${statusConf.dot} to-transparent`)} />

                            <CardContent className="p-6 space-y-4 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs font-mono bg-primary/5 text-primary border-primary/20",
                                                    typeConf.bg,
                                                    typeConf.text
                                                )}
                                            >
                                                {item.id}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <TypeIcon className={cn("h-4 w-4", typeConf.text)} />
                                            <span className="font-medium">{item.type}</span>
                                        </div>
                                    </div>
                                    <Badge className={cn(
                                        "font-semibold px-3 py-1.5 shadow-sm border flex items-center gap-1.5",
                                        statusConf.bg,
                                        statusConf.border,
                                        statusConf.text
                                    )}>
                                        <StatusIcon className="h-3.5 w-3.5" />
                                        {item.status}
                                    </Badge>
                                </div>

                                {/* Equipment details */}
                                <div className="space-y-3 flex-1">
                                    {/* Serial Number */}
                                    <div className="bg-gradient-to-r from-slate-50/50 to-transparent p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground font-medium">Serial Number</span>
                                            <span className="font-bold text-slate-900 font-mono bg-white px-2 py-1 rounded border text-xs">
                                                {item.serialNumber}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info grid */}
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                                            <MapPin className="h-4 w-4 mr-3 text-emerald-500 group-hover/item:scale-110 transition-transform duration-200" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-muted-foreground text-xs">Location</span>
                                                <div className="font-semibold text-slate-900 truncate">{item.location}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                                            <Building className="h-4 w-4 mr-3 text-blue-500 group-hover/item:scale-110 transition-transform duration-200" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-muted-foreground text-xs">Manufacturer</span>
                                                <div className="font-semibold text-slate-900 truncate">{item.manufacturer}</div>
                                            </div>
                                        </div>

                                        {item.assignedTo && (
                                            <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                                                <User className="h-4 w-4 mr-3 text-purple-500 group-hover/item:scale-110 transition-transform duration-200" />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-muted-foreground text-xs">Assigned To</span>
                                                    <div className="font-semibold text-slate-900 truncate">{item.assignedTo}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                                            <Calendar className="h-4 w-4 mr-3 text-amber-500 group-hover/item:scale-110 transition-transform duration-200" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-muted-foreground text-xs">Next Maintenance</span>
                                                <div className="font-semibold text-slate-900">{formatDate(item.nextMaintenanceDate)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView(item)}
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(item)}
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:scale-110 transition-all duration-200"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView(item)}
                                                className="h-9 w-9 p-0 rounded-xl hover:bg-purple-50 hover:text-purple-600 hover:scale-110 transition-all duration-200"
                                            >
                                                <QrCode className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 hover:scale-110 transition-all duration-200"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-2 min-w-[200px]"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => onView(item)}
                                                    className="rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                                                >
                                                    <Eye className="h-4 w-4 mr-3" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onEdit(item)}
                                                    className="rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
                                                >
                                                    <Edit className="h-4 w-4 mr-3" />
                                                    Edit Equipment
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-200/50" />
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="rounded-lg hover:bg-slate-50 transition-colors duration-200">
                                                        <Wrench className="h-4 w-4 mr-3" />
                                                        Update Status
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuSubContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-xl">
                                                        {statusOptions.map((status) => (
                                                            <DropdownMenuItem
                                                                key={status.value}
                                                                onClick={() => onUpdateStatus(item.id, status.value)}
                                                                className={cn(
                                                                    "rounded-lg transition-colors duration-200",
                                                                    item.status === status.value ? "bg-accent" : "",
                                                                    `hover:bg-${status.color}-50 hover:text-${status.color}-700`
                                                                )}
                                                            >
                                                                <status.icon className="h-4 w-4 mr-3" />
                                                                {status.label}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator className="bg-slate-200/50" />
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(item.id)}
                                                    className="rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200 text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-3" />
                                                    Delete Equipment
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
} 