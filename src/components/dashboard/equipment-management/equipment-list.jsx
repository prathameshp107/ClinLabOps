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
  ClipboardCheck
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function EquipmentList({ 
  equipment, 
  onView, 
  onEdit, 
  onDelete,
  onUpdateStatus
}) {
  const [view, setView] = useState("grid") // "grid" or "table"

  // Status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Out of Order":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-muted rounded-lg p-1 flex">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="rounded-r-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
            Grid
          </Button>
          <Button
            variant={view === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
            className="rounded-l-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
            Table
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.length > 0 ? (
            equipment.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow border border-border/40">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-border/30">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            <span>{item.type}</span>
                          </div>
                        </div>
                        <Badge className={cn("ml-2 font-medium", getStatusVariant(item.status))}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="text-muted-foreground w-24">Serial No:</span>
                        <span className="font-medium">{item.serialNumber}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground w-20">Location:</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground w-20">Purchased:</span>
                        <span className="font-medium">{formatDate(item.purchaseDate)}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Wrench className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground w-20">Last Service:</span>
                        <span className="font-medium">{formatDate(item.lastMaintenanceDate)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 border-t border-border/30 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onView(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onView(item)}
                          className="h-8 w-8 p-0"
                        >
                          <QrCode className="h-4 w-4" />
                          <span className="sr-only">QR Code</span>
                        </Button>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Available")}>
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Mark as Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "In Use")}>
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Mark as In Use
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Under Maintenance")}>
                            <Wrench className="h-4 w-4 mr-2" />
                            Mark as Under Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/50 rounded-full p-3 mb-4">
                <Wrench className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No equipment found</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                No equipment matches your current search or filter criteria. Try adjusting your search or add new equipment.
              </p>
              <Button 
                onClick={() => onCreateEquipment()}
                className="mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border border-border/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Last Maintenance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length > 0 ? (
                equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.serialNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                    <TableCell>{formatDate(item.lastMaintenanceDate)}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium", getStatusVariant(item.status))}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onView(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Available")}>
                              <ClipboardCheck className="h-4 w-4 mr-2" />
                              Mark as Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "In Use")}>
                              <ClipboardCheck className="h-4 w-4 mr-2" />
                              Mark as In Use
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(item.id, "Under Maintenance")}>
                              <Wrench className="h-4 w-4 mr-2" />
                              Mark as Under Maintenance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDelete(item.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-muted/50 rounded-full p-3 mb-4">
                        <Wrench className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No equipment found</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        No equipment matches your current search or filter criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}