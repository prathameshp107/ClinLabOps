"use client"

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
  UserRound,
  FileText,
  FlaskConical,
  CalendarDays
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ProtocolList({
  protocols,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete
}) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border/40 overflow-hidden bg-gradient-to-br from-white/80 via-blue-50/60 to-slate-100/80 dark:from-card/90 dark:via-slate-900/80 dark:to-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-border/60 transition-all duration-300"
    >
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-primary/5 to-background/80 backdrop-blur-md">
            <TableRow>
              <TableHead className="font-semibold text-base py-4 flex items-center gap-2">
                <FlaskConical className="inline-block h-5 w-5 text-primary/60 mr-1" /> Protocol Name
              </TableHead>
              <TableHead className="font-semibold text-base py-4">Description</TableHead>
              <TableHead className="font-semibold text-base py-4">Type</TableHead>
              <TableHead className="font-semibold text-base py-4 flex items-center gap-2"><UserRound className="inline-block h-4 w-4 text-primary/50 mr-1" />Created By</TableHead>
              <TableHead className="font-semibold text-base py-4 flex items-center gap-2"><CalendarDays className="inline-block h-4 w-4 text-primary/50 mr-1" />Last Updated</TableHead>
              <TableHead className="font-semibold text-base py-4">Status</TableHead>
              <TableHead className="text-right font-semibold text-base py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {protocols.map((protocol, index) => (
              <motion.tr
                key={protocol.id}
                className={cn(
                  "transition-all duration-200 cursor-pointer group",
                  index % 2 === 0 ? "bg-white/60 dark:bg-card/70" : "bg-blue-50/30 dark:bg-card/60",
                  "hover:bg-primary/10 dark:hover:bg-primary/20"
                )}
                onClick={() => onView(protocol)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <TableCell className="font-semibold py-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary/70" />
                    <span className="group-hover:text-primary transition-colors duration-200 truncate">{protocol.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">{protocol.id}</div>
                </TableCell>
                <TableCell className="py-4 max-w-sm truncate text-muted-foreground text-sm">
                  {protocol.description || <span className="italic text-gray-400">No description</span>}
                </TableCell>
                <TableCell className="py-4 text-sm">
                  <Badge className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                    {protocol.type || "General"}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-primary/60" />
                    {protocol.author}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary/60" />
                    {formatDate(protocol.updatedAt)}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold border flex items-center gap-1.5 shadow-sm",
                    getStatusVariant(protocol.status)
                  )}>
                    {protocol.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4" onClick={e => e.stopPropagation()}>
                  <TooltipProvider>
                    <div className="flex justify-end space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
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
                            onClick={e => {
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

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onDuplicate(protocol);
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Duplicate</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">Duplicate protocol</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onArchive(protocol.id);
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          >
                            <Archive className="h-4 w-4" />
                            <span className="sr-only">Archive</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">{protocol.status === "Archived" ? "Unarchive" : "Archive"} protocol</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onDelete(protocol.id);
                            }}
                            className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p className="text-xs">Delete protocol</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}