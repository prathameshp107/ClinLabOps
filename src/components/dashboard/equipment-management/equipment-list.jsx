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
  Sparkles
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function EquipmentList({
  equipment,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onCreateEquipment
}) {
  const [view, setView] = useState("grid") // "grid" or "table"
  const [hoveredCard, setHoveredCard] = useState(null)

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

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="font-medium">
              {equipment.length} {equipment.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 flex border border-slate-200/50 shadow-sm">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className={cn(
              "rounded-lg transition-all duration-300",
              view === "grid"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                : "hover:bg-slate-50"
            )}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className={cn(
              "rounded-lg transition-all duration-300",
              view === "table"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                : "hover:bg-slate-50"
            )}
          >
            <List className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.length > 0 ? (
            equipment.map((item, index) => {
              const statusConf = getStatusConfig(item.status)
              const StatusIcon = statusConf.icon

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
                  {/* Animated background glow */}
                  <div className={cn(
                    "absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500",
                    hoveredCard === item.id && "opacity-100"
                  )}></div>

                  <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-t-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02] flex flex-col h-full">
                    {/* Status indicator strip */}
                    <div className={cn("h-1.5 w-full", `bg-gradient-to-r ${statusConf.dot.replace('bg-', 'from-')} to-transparent`)}></div>

                    <CardContent className="p-6 space-y-4 flex-grow flex flex-col">
                      {/* Header with status */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1 min-w-0">
                          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium">{item.type}</span>
                          </div>
                        </div>
                        <Badge className={cn(
                          "ml-3 font-semibold px-3 py-1.5 shadow-sm border",
                          statusConf.variant
                        )}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                          {item.status}
                        </Badge>
                      </div>

                      {/* Equipment details */}
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-slate-50/50 to-transparent p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Serial Number</span>
                            <span className="font-bold text-slate-900 font-mono bg-white px-2 py-1 rounded border">
                              {item.serialNumber}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                            <MapPin className="h-4 w-4 mr-3 text-emerald-500 group-hover/item:scale-110 transition-transform duration-200" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Location</span>
                              <div className="font-semibold text-slate-900">{item.location}</div>
                            </div>
                          </div>

                          <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                            <Calendar className="h-4 w-4 mr-3 text-blue-500 group-hover/item:scale-110 transition-transform duration-200" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Purchased</span>
                              <div className="font-semibold text-slate-900">{formatDate(item.purchaseDate)}</div>
                            </div>
                          </div>

                          <div className="flex items-center text-sm group/item hover:bg-slate-50/50 p-2 rounded-lg transition-colors duration-200">
                            <Wrench className="h-4 w-4 mr-3 text-purple-500 group-hover/item:scale-110 transition-transform duration-200" />
                            <div className="flex-1">
                              <span className="text-muted-foreground">Last Service</span>
                              <div className="font-semibold text-slate-900">{formatDate(item.lastMaintenanceDate)}</div>
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
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50">
                  <TableHead className="font-bold text-slate-700 h-12">Equipment Details</TableHead>
                  <TableHead className="font-bold text-slate-700">Type & Location</TableHead>
                  <TableHead className="font-bold text-slate-700">Purchase Info</TableHead>
                  <TableHead className="font-bold text-slate-700">Maintenance</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.length > 0 ? (
                  equipment.map((item, index) => {
                    const statusConf = getStatusConfig(item.status)
                    const StatusIcon = statusConf.icon

                    return (
                      <TableRow
                        key={item.id}
                        className="border-slate-200/30 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 transition-all duration-300 group"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fadeIn 0.5s ease-out forwards'
                        }}
                      >
                        <TableCell className="font-medium py-4">
                          <div className="flex flex-col space-y-1">
                            <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono bg-slate-50">
                                {item.serialNumber}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Tag className="h-3.5 w-3.5 mr-2 text-blue-500" />
                              <span className="font-medium">{item.type}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-2 text-blue-500" />
                            <span className="font-medium">{formatDate(item.purchaseDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Wrench className="h-3.5 w-3.5 mr-2 text-purple-500" />
                            <span className="font-medium">{formatDate(item.lastMaintenanceDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-semibold px-3 py-1.5 shadow-sm border",
                            statusConf.variant
                          )}>
                            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(item)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:scale-110 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 hover:scale-110 transition-all duration-200"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl p-2"
                              >
                                <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Available")}>
                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                  Mark Available
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "In Use")}>
                                  <Zap className="h-4 w-4 mr-2 text-blue-600" />
                                  Mark In Use
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Under Maintenance")}>
                                  <Wrench className="h-4 w-4 mr-2 text-amber-600" />
                                  Under Maintenance
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onDelete(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}