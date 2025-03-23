"use client"

import { useState } from "react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { motion } from "framer-motion"
import { 
  Search, Filter, RefreshCw, UserPlus, Settings, UserCog, 
  ShieldAlert, Lock, UserX, UserCheck, FilterX
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample user activity data
const activityLogsData = [
  {
    id: "log1",
    timestamp: "2025-03-22T20:15:22",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "create",
    action: "Created new user account",
    target: {
      id: "u5",
      name: "Olivia Taylor",
      type: "user"
    },
    details: "Added Olivia Taylor as Scientist in Microbiology department"
  },
  {
    id: "log2",
    timestamp: "2025-03-21T14:32:10",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "update",
    action: "Updated user role",
    target: {
      id: "u3",
      name: "Dr. Emily Chen",
      type: "user"
    },
    details: "Changed role from Scientist to Reviewer"
  },
  {
    id: "log3",
    timestamp: "2025-03-20T09:45:33",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "security",
    action: "Reset user password",
    target: {
      id: "u4",
      name: "James Rodriguez",
      type: "user"
    },
    details: "Sent password reset link via email"
  },
  {
    id: "log4",
    timestamp: "2025-03-18T16:20:45",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "security",
    action: "Enabled 2FA",
    target: {
      id: "u3",
      name: "Dr. Emily Chen",
      type: "user"
    },
    details: "Enabled two-factor authentication"
  },
  {
    id: "log5",
    timestamp: "2025-03-15T11:05:12",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "deactivate",
    action: "Deactivated user",
    target: {
      id: "u6",
      name: "Robert Kim",
      type: "user"
    },
    details: "Deactivated account due to extended leave"
  },
  {
    id: "log6",
    timestamp: "2025-03-10T13:25:30",
    user: {
      id: "u1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@labtasker.com",
    },
    actionType: "update",
    action: "Updated user information",
    target: {
      id: "u2",
      name: "Mark Williams",
      type: "user"
    },
    details: "Updated department from Chemistry to Biochemistry"
  }
]

export function UserActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    actionType: {
      create: true,
      update: true,
      security: true,
      deactivate: true
    }
  })

  // Count active filters
  const filterCount = Object.values(activeFilters.actionType).filter(Boolean).length

  // Update filter function
  const updateFilter = (option, value) => {
    setActiveFilters({
      ...activeFilters,
      actionType: {
        ...activeFilters.actionType,
        [option]: value
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      actionType: {
        create: true,
        update: true,
        security: true,
        deactivate: true
      }
    })
    setSearchQuery("")
  }

  // Filter logs based on search query and active filters
  const filteredLogs = activityLogsData.filter(log => {
    // Action type filter
    if (!activeFilters.actionType[log.actionType]) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.user.name.toLowerCase().includes(query) ||
        log.user.email.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.target.name.toLowerCase().includes(query)
      )
    }

    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {filterCount < Object.keys(activeFilters.actionType).length && (
                  <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal">
                    {Object.keys(activeFilters.actionType).length - filterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Logs</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => updateFilter("create", !activeFilters.actionType.create)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.actionType.create} 
                      onChange={() => {}} 
                      className="rounded"
                    />
                  </div>
                  <UserPlus className="h-4 w-4 mr-1" />
                  User Creation
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateFilter("update", !activeFilters.actionType.update)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.actionType.update} 
                      onChange={() => {}} 
                      className="rounded"
                    />
                  </div>
                  <UserCog className="h-4 w-4 mr-1" />
                  User Updates
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateFilter("security", !activeFilters.actionType.security)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.actionType.security} 
                      onChange={() => {}} 
                      className="rounded"
                    />
                  </div>
                  <Lock className="h-4 w-4 mr-1" />
                  Security Actions
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => updateFilter("deactivate", !activeFilters.actionType.deactivate)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      checked={activeFilters.actionType.deactivate} 
                      onChange={() => {}} 
                      className="rounded"
                    />
                  </div>
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2 px-2"
                onClick={resetFilters}
              >
                <FilterX className="h-4 w-4" />
                Reset Filters
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="icon" onClick={resetFilters} disabled={!searchQuery && filterCount === Object.keys(activeFilters.actionType).length}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FilterX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No matching logs found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filteredLogs.map((log, index) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ActivityLogItem log={log} />
            </motion.div>
          ))}
        </div>
      )}
      
      {filteredLogs.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Load More Logs
          </Button>
        </div>
      )}
    </div>
  )
}

function ActivityLogItem({ log }) {
  // Map action types to appropriate styling
  const getActionTypeStyles = (actionType) => {
    switch (actionType) {
      case 'create':
        return {
          icon: <UserPlus className="h-4 w-4" />,
          color: 'bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400'
        }
      case 'update':
        return {
          icon: <UserCog className="h-4 w-4" />,
          color: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/25 dark:text-blue-400'
        }
      case 'security':
        return {
          icon: <ShieldAlert className="h-4 w-4" />,
          color: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-400'
        }
      case 'deactivate':
        return {
          icon: <UserX className="h-4 w-4" />,
          color: 'bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400'
        }
      default:
        return {
          icon: <UserCheck className="h-4 w-4" />,
          color: 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/25 dark:text-gray-400'
        }
    }
  }

  const styles = getActionTypeStyles(log.actionType)
  const formattedTime = formatDistanceToNow(parseISO(log.timestamp), { addSuffix: true })

  return (
    <div className="flex group hover:bg-muted/50 p-4 rounded-lg transition-colors border">
      <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center ${styles.color}`}>
        {styles.icon}
      </div>
      
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="font-medium truncate">{log.action}</div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
            {formattedTime}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{log.user.name}</span> performed action on <span className="font-medium text-foreground">{log.target.name}</span>
        </div>
        
        <div className="text-sm text-muted-foreground truncate">
          {log.details}
        </div>
      </div>
    </div>
  )
}
