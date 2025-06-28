"use client"

import { useState } from "react"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  MapPin,
  Tag,
  Wrench,
  QrCode,
  ClipboardCheck,
  Grid3x3,
  List,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Activity,
  Settings2,
  Sparkles,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { EquipmentGrid } from "./equipment-grid"

export function EquipmentList({
  equipment,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onCreateEquipment,
  view // 'grid' or 'table', now controlled by parent
}) {
  // Sorting state for table view
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc") // 'asc' or 'desc'

  // Enhanced status configurations with icons and colors
  const statusConfig = {
    "Available": {
      icon: CheckCircle2,
      variant: "bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border-emerald-200 shadow-emerald-100/50",
      dot: "bg-emerald-600",
      glow: "shadow-emerald-500/30"
    },
    "In Use": {
      icon: Zap,
      variant: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200/60 shadow-blue-100/50",
      dot: "bg-blue-500",
      glow: "shadow-blue-500/20"
    },
    "Under Maintenance": {
      icon: Clock,
      variant: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200/60 shadow-amber-100/50",
      dot: "bg-amber-500",
      glow: "shadow-amber-500/20"
    },
    "Out of Order": {
      icon: XCircle,
      variant: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200/60 shadow-red-100/50",
      dot: "bg-red-500",
      glow: "shadow-red-500/20"
    }
  }

  // Get status configuration
  const getStatusConfig = (status) => {
    return statusConfig[status] || {
      icon: AlertTriangle,
      variant: "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200/60 shadow-gray-100/50",
      dot: "bg-gray-500",
      glow: "shadow-gray-500/20"
    }
  }

  // Format date with enhanced styling
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Enhanced empty state
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-lg border border-slate-200/50">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-xl">
            <Settings2 className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      <div className="text-center mt-6 space-y-3">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          No Equipment Found
        </h3>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          No equipment matches your current search or filter criteria. Try adjusting your search parameters or add new equipment to get started.
        </p>
        {onCreateEquipment && (
          <Button
            onClick={onCreateEquipment}
            className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Equipment
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  // Sorting logic
  const getSortedEquipment = () => {
    if (view !== "table") return equipment
    const sorted = [...equipment]
    sorted.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "location":
          aValue = a.location
          bValue = b.location
          break
        case "manufacturer":
          aValue = a.manufacturer
          bValue = b.manufacturer
          break
        case "purchaseDate":
          aValue = a.purchaseDate
          bValue = b.purchaseDate
          break
        case "lastMaintenanceDate":
          aValue = a.lastMaintenanceDate
          bValue = b.lastMaintenanceDate
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.name
          bValue = b.name
      }
      if (!aValue) aValue = ""
      if (!bValue) bValue = ""
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
    return sorted
  }

  const sortedEquipment = getSortedEquipment()

  return (
    <div className="space-y-6 p-6">
      {/* Removed Enhanced View Toggle */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span className="font-medium">
            {equipment.length} {equipment.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </div>

      {view === "grid" ? (
        <EquipmentGrid
          equipment={equipment}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
        />
      ) : (
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50">
                  <TableHead
                    className="font-bold text-slate-700 h-12 cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "name") setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      else { setSortBy("name"); setSortOrder("asc") }
                    }}
                  >
                    Equipment Details
                    {sortBy === "name" && (sortOrder === "asc" ? <ArrowUp className="inline ml-1 w-4 h-4" /> : <ArrowDown className="inline ml-1 w-4 h-4" />)}
                  </TableHead>
                  <TableHead
                    className="font-bold text-slate-700 cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "type") setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      else { setSortBy("type"); setSortOrder("asc") }
                    }}
                  >
                    Type & Location
                    {sortBy === "type" && (sortOrder === "asc" ? <ArrowUp className="inline ml-1 w-4 h-4" /> : <ArrowDown className="inline ml-1 w-4 h-4" />)}
                  </TableHead>
                  <TableHead
                    className="font-bold text-slate-700 cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "purchaseDate") setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      else { setSortBy("purchaseDate"); setSortOrder("asc") }
                    }}
                  >
                    Purchase Info
                    {sortBy === "purchaseDate" && (sortOrder === "asc" ? <ArrowUp className="inline ml-1 w-4 h-4" /> : <ArrowDown className="inline ml-1 w-4 h-4" />)}
                  </TableHead>
                  <TableHead
                    className="font-bold text-slate-700 cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "lastMaintenanceDate") setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      else { setSortBy("lastMaintenanceDate"); setSortOrder("asc") }
                    }}
                  >
                    Maintenance
                    {sortBy === "lastMaintenanceDate" && (sortOrder === "asc" ? <ArrowUp className="inline ml-1 w-4 h-4" /> : <ArrowDown className="inline ml-1 w-4 h-4" />)}
                  </TableHead>
                  <TableHead
                    className="font-bold text-slate-700 cursor-pointer select-none"
                    onClick={() => {
                      if (sortBy === "status") setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      else { setSortBy("status"); setSortOrder("asc") }
                    }}
                  >
                    Status
                    {sortBy === "status" && (sortOrder === "asc" ? <ArrowUp className="inline ml-1 w-4 h-4" /> : <ArrowDown className="inline ml-1 w-4 h-4" />)}
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEquipment.length > 0 ? (
                  sortedEquipment.map((item, index) => {
                    const statusConf = getStatusConfig(item.status)
                    const StatusIcon = statusConf.icon

                    return (
                      <TableRow
                        key={item.id}
                        className="border-slate-200/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 transition-all duration-300 group"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono bg-primary/5 text-primary border-primary/20">
                                {item.id}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg group-hover:text-blue-700 transition-colors duration-300">
                              {item.name}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Tag className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="font-medium">{item.type}</span>
                            </div>
                            <div className="text-sm font-mono bg-slate-50 p-2 rounded border">
                              {item.serialNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                              <span className="font-semibold">{item.location}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.manufacturer}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="font-semibold">Purchased</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(item.purchaseDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Wrench className="h-4 w-4 mr-2 text-purple-500" />
                              <span className="font-semibold">Last Service</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(item.lastMaintenanceDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={cn(
                            "font-semibold px-3 py-1.5 shadow-sm border",
                            statusConf.variant
                          )}>
                            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end space-x-1">
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 hover:scale-110 transition-all duration-200"
                                >
                                  <MoreVertical className="h-4 w-4" />
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
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(item.id, "Available")}
                                  className="rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-3" />
                                  Mark Available
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(item.id, "In Use")}
                                  className="rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                                >
                                  <Zap className="h-4 w-4 mr-3" />
                                  Mark In Use
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(item.id, "Under Maintenance")}
                                  className="rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors duration-200"
                                >
                                  <Wrench className="h-4 w-4 mr-3" />
                                  Under Maintenance
                                </DropdownMenuItem>
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
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32">
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}