"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  PlusCircle, ClipboardEdit, Users, Star, Clock,
  BarChart3, History, Filter
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ActivityLogDialog({ open, onOpenChange, project, users }) {
  const [dateFilter, setDateFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [activityFilter, setActivityFilter] = useState("all")
  
  const filteredLogs = project?.activityLog?.filter(log => {
    // Apply date filter
    if (dateFilter === "today") {
      const logDate = new Date(log.timestamp).toDateString()
      const today = new Date().toDateString()
      if (logDate !== today) return false
    }
    else if (dateFilter === "week") {
      const logDate = new Date(log.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      if (logDate < weekAgo) return false
    }
    else if (dateFilter === "month") {
      const logDate = new Date(log.timestamp)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      if (logDate < monthAgo) return false
    }
    
    // Apply user filter
    if (userFilter !== "all" && log.userId !== userFilter) {
      return false
    }
    
    // Apply activity type filter
    if (activityFilter !== "all" && log.action !== activityFilter) {
      return false
    }
    
    return true
  }) || []

  // Count activity types for filter
  const activityTypes = {}
  project?.activityLog?.forEach(log => {
    if (!activityTypes[log.action]) {
      activityTypes[log.action] = 0
    }
    activityTypes[log.action]++
  })
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  const getActionLabel = (action) => {
    switch (action) {
      case "created": return "Created project"
      case "updated": return "Updated project"
      case "added_member": return "Added team member"
      case "marked_favorite": return "Marked as favorite"
      case "unmarked_favorite": return "Removed from favorites"
      default: return action.replace('_', ' ')
    }
  }
  
  const getActionIcon = (action) => {
    switch (action) {
      case "created": return <PlusCircle className="h-4 w-4" />
      case "updated": return <ClipboardEdit className="h-4 w-4" />
      case "added_member": return <Users className="h-4 w-4" />
      case "marked_favorite": return <Star className="h-4 w-4 fill-yellow-500" />
      case "unmarked_favorite": return <Star className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Activity Log
          </DialogTitle>
          <DialogDescription>
            History of changes for "{project?.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {project?.team?.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filter by activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                {Object.keys(activityTypes).map(actionType => (
                  <SelectItem key={actionType} value={actionType}>
                    {getActionLabel(actionType)} ({activityTypes[actionType]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="max-h-[400px] overflow-y-auto pr-1">
            {filteredLogs.length > 0 ? (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredLogs
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((log, index) => (
                    <motion.div 
                      key={log.id} 
                      className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{users[log.userId]?.avatar || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{users[log.userId]?.name || 'Unknown User'}</p>
                          <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getActionIcon(log.action)}
                          <span className="text-sm">{getActionLabel(log.action)}</span>
                        </div>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                      </div>
                    </motion.div>
                  ))
                }
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No activity logs found</h3>
                <p className="text-muted-foreground text-sm mt-1 text-center">
                  {filteredLogs.length === 0 && project?.activityLog?.length > 0 ?
                    "Try adjusting your filters" :
                    "This project doesn't have any activity logs yet"
                  }
                </p>
              </motion.div>
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
