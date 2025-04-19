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
  Copy, 
  Archive, 
  Trash2, 
  MoreVertical,
  FileText,
  Clock,
  User,
  Tag
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ProtocolList({ 
  protocols, 
  onView, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete 
}) {
  const [view, setView] = useState("grid") // "grid" or "table"

  // Status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
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
          {protocols.map((protocol) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow border border-border/40">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border/30">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <h3 className="font-semibold text-lg line-clamp-1">{protocol.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          <span>{protocol.id}</span>
                        </div>
                      </div>
                      <Badge className={cn("ml-2 font-medium", getStatusVariant(protocol.status))}>
                        {protocol.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-1.5 font-medium">{protocol.category}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Author:</span>
                      <span className="ml-1.5 font-medium">{protocol.author}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="ml-1.5 font-medium">{formatDate(protocol.updatedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 border-t border-border/30 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(protocol)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(protocol)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDuplicate(protocol)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate</span>
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
                        <DropdownMenuItem onClick={() => onView(protocol)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(protocol)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(protocol)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onArchive(protocol.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          {protocol.status === "Archived" ? "Unarchive" : "Archive"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(protocol.id)}
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
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocol Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{protocol.title}</span>
                      <span className="text-xs text-muted-foreground">{protocol.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{protocol.category}</TableCell>
                  <TableCell>{protocol.author}</TableCell>
                  <TableCell>{formatDate(protocol.updatedAt)}</TableCell>
                  <TableCell>
                    <Badge className={cn("font-medium", getStatusVariant(protocol.status))}>
                      {protocol.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onView(protocol)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(protocol)}
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
                          <DropdownMenuItem onClick={() => onDuplicate(protocol)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onArchive(protocol.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            {protocol.status === "Archived" ? "Unarchive" : "Archive"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(protocol.id)}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}