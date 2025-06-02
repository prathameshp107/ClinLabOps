"use client"

import { useState, useEffect } from "react"
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
  Tag,
  Grid,
  List,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProtocolList({ 
  protocols, 
  onView, 
  onEdit, 
  onDuplicate, 
  onArchive, 
  onDelete 
}) {
  const [view, setView] = useState("grid") // "grid" or "table"
  const [hoveredCard, setHoveredCard] = useState(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Draft":
        return <AlertCircle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
      case "In Review":
        return <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      case "Approved":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      case "Archived":
        return <Archive className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
      default:
        return <FileText className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
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
    <div className="space-y-6">
      {/* View Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <p className="text-sm text-muted-foreground flex items-center">
          <Filter className="h-3.5 w-3.5 mr-2 text-primary/70" />
          <span>
            {protocols.length} {protocols.length === 1 ? 'protocol' : 'protocols'} found
          </span>
        </p>
        <TooltipProvider>
          <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-1 flex shadow-sm border border-border/30 hover:border-border/50 transition-all duration-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className={cn(
                    "rounded-r-none transition-all duration-200",
                    view === "grid" ? "shadow-sm" : "hover:bg-muted/80"
                  )}
                >
                  <Grid className="h-4 w-4 mr-1.5" />
                  Grid
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Grid view</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("table")}
                  className={cn(
                    "rounded-l-none transition-all duration-200",
                    view === "table" ? "shadow-sm" : "hover:bg-muted/80"
                  )}
                >
                  <List className="h-4 w-4 mr-1.5" />
                  Table
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Table view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </motion.div>

      <AnimatePresence mode="wait">
        {protocols.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-xl border border-border/30 shadow-sm"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-5">
              <FileText className="h-8 w-8 text-primary/80" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No protocols found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no protocols matching your current filters.
            </p>
          </motion.div>
        ) : view === "grid" ? (
          <motion.div 
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {protocols.map((protocol, index) => (
              <motion.div
                key={protocol.id}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(protocol.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="h-full"
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300 border border-border/40 bg-card/50 backdrop-blur-sm h-full flex flex-col",
                  hoveredCard === protocol.id ? "shadow-md border-primary/30 scale-[1.01] bg-card/70" : "shadow-sm hover:shadow-md hover:border-primary/20"
                )}>
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="p-5 border-b border-border/30">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5 flex-1 mr-3">
                          <h3 className="font-semibold text-lg line-clamp-1 tracking-tight group-hover:text-primary transition-colors duration-200">
                            {protocol.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{protocol.id}</span>
                          </div>
                        </div>
                        <Badge className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium border flex items-center gap-1.5", 
                          getStatusVariant(protocol.status)
                        )}>
                          {getStatusIcon(protocol.status)}
                          {protocol.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-3 flex-1 bg-gradient-to-b from-transparent to-muted/10">
                      <div className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <Tag className="h-3 w-3 text-primary/80" />
                        </div>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="ml-1.5 font-medium truncate">{protocol.category}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <User className="h-3 w-3 text-primary/80" />
                        </div>
                        <span className="text-muted-foreground">Author:</span>
                        <span className="ml-1.5 font-medium truncate">{protocol.author}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                          <Clock className="h-3 w-3 text-primary/80" />
                        </div>
                        <span className="text-muted-foreground">Updated:</span>
                        <span className="ml-1.5 font-medium">{formatDate(protocol.updatedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-b from-muted/20 to-muted/30 border-t border-border/30 mt-auto">
                      <div className="flex justify-between items-center">
                        <TooltipProvider>
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onView(protocol)}
                                  className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p className="text-xs">View protocol</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onEdit(protocol)}
                                  className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p className="text-xs">Edit protocol</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onDuplicate(protocol)}
                                  className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                                >
                                  <Copy className="h-4 w-4" />
                                  <span className="sr-only">Duplicate</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p className="text-xs">Duplicate protocol</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 w-9 p-0 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="w-52 rounded-xl border-border/50 shadow-lg animate-in fade-in-0 zoom-in-95"
                          >
                            <DropdownMenuItem 
                              onClick={() => onView(protocol)}
                              className="flex items-center py-2.5 hover:bg-primary/5 focus:bg-primary/5"
                            >
                              <Eye className="h-4 w-4 mr-3" />
                              <span>View Protocol</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onEdit(protocol)}
                              className="flex items-center py-2.5 hover:bg-primary/5 focus:bg-primary/5"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              <span>Edit Protocol</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDuplicate(protocol)}
                              className="flex items-center py-2.5 hover:bg-primary/5 focus:bg-primary/5"
                            >
                              <Copy className="h-4 w-4 mr-3" />
                              <span>Duplicate Protocol</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem 
                              onClick={() => onArchive(protocol.id)}
                              className="flex items-center py-2.5 hover:bg-primary/5 focus:bg-primary/5"
                            >
                              <Archive className="h-4 w-4 mr-3" />
                              <span>{protocol.status === "Archived" ? "Unarchive Protocol" : "Archive Protocol"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(protocol.id)}
                              className="flex items-center py-2.5 text-destructive hover:bg-destructive/5 focus:bg-destructive/5"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              <span>Delete Protocol</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-border/50 transition-all duration-300"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 bg-muted/30">
                  <TableHead className="font-semibold">Protocol Name</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Created By</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.map((protocol, index) => (
                  <motion.tr 
                    key={protocol.id} 
                    className="hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                    onClick={() => onView(protocol)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex flex-col">
                        <span className="text-base group-hover:text-primary transition-colors duration-200">{protocol.title}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{protocol.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{protocol.category}</TableCell>
                    <TableCell className="py-4">{protocol.author}</TableCell>
                    <TableCell className="py-4">{formatDate(protocol.updatedAt)}</TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium border flex items-center gap-1.5", 
                        getStatusVariant(protocol.status)
                      )}>
                        {getStatusIcon(protocol.status)}
                        {protocol.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4" onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <div className="flex justify-end space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onView(protocol);
                                }}
                                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="text-xs">View protocol</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(protocol);
                                }}
                                className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="text-xs">Edit protocol</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 transition-all duration-200">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-xs">More options</p>
                              </TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-48 border-border/50 rounded-lg shadow-lg">
                              <DropdownMenuItem onClick={() => onDuplicate(protocol)} className="flex items-center py-2">
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onArchive(protocol.id)} className="flex items-center py-2">
                                <Archive className="h-4 w-4 mr-2" />
                                {protocol.status === "Archived" ? "Unarchive" : "Archive"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => onDelete(protocol.id)}
                                className="text-destructive focus:text-destructive flex items-center py-2"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}