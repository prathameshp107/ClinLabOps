"use client"

import { useState, useEffect } from "react"
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
import { getUserActivities } from "@/services/userActivityService"
import { toast } from "@/components/ui/use-toast"

export function UserActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    actionType: {
      create: true,
      update: true,
      security: true,
      deactivate: true,
      activate: true,
      delete: true
    }
  })
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  // Fetch activities from backend
  useEffect(() => {
    fetchActivities()
  }, [searchQuery, activeFilters, pagination.currentPage])

  const fetchActivities = async () => {
    try {
      setIsLoading(true)

      // Build query parameters
      const params = {
        category: 'user_management',
        page: pagination.currentPage,
        limit: 20
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      // Add action type filters
      const enabledTypes = Object.keys(activeFilters.actionType).filter(
        key => activeFilters.actionType[key]
      )
      if (enabledTypes.length > 0 && enabledTypes.length < Object.keys(activeFilters.actionType).length) {
        // If not all types are selected, add type filter
        params.actionType = enabledTypes.join(',')
      }

      console.log('Fetching activities with params:', params)
      const response = await getUserActivities(params)
      console.log('Received response:', response)

      // Ensure activities is always an array
      const activitiesData = Array.isArray(response.activities) ? response.activities : []

      setActivities(activitiesData)
      setPagination({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0
      })

      console.log('Set activities:', activitiesData.length, 'activities')
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      toast({
        title: "Error loading activities",
        description: error.response?.data?.error || "Failed to load user activity logs.",
        variant: "destructive"
      })
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = () => {
    // Reset to first page when refreshing
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchActivities()
  }

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
        deactivate: true,
        activate: true,
        delete: true
      }
    })
    setSearchQuery("")
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Filter logs based on search query and active filters (for local filtering)
  const filteredLogs = activities.filter(log => {
    // Action type filter
    if (!activeFilters.actionType[log.actionType]) {
      return false
    }

    // Search filter (additional local filtering)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        log.user?.name?.toLowerCase().includes(query) ||
        log.user?.email?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.details?.toLowerCase().includes(query) ||
        log.target?.name?.toLowerCase().includes(query)
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
                      onChange={(e) => updateFilter("create", e.target.checked)}
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
                      onChange={(e) => updateFilter("update", e.target.checked)}
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
                      onChange={(e) => updateFilter("security", e.target.checked)}
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
                      onChange={(e) => updateFilter("deactivate", e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateFilter("activate", !activeFilters.actionType.activate)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={activeFilters.actionType.activate}
                      onChange={(e) => updateFilter("activate", e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateFilter("delete", !activeFilters.actionType.delete)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={activeFilters.actionType.delete}
                      onChange={(e) => updateFilter("delete", e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <UserX className="h-4 w-4 mr-1" />
                  User Deletion
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading activity logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FilterX className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No matching logs found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || filterCount < Object.keys(activeFilters.actionType).length
              ? "Try adjusting your search or filter criteria"
              : "No user activity logs available"}
          </p>
          {(searchQuery || filterCount < Object.keys(activeFilters.actionType).length) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          )}
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

      {!isLoading && filteredLogs.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {pagination.total} activities
          </p>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))
                }}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPagination(prev => ({ ...prev, currentPage: Math.min(prev.totalPages, prev.currentPage + 1) }))
                }}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
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
      case 'activate':
        return {
          icon: <UserCheck className="h-4 w-4" />,
          color: 'bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400'
        }
      case 'delete':
        return {
          icon: <UserX className="h-4 w-4" />,
          color: 'bg-red-500/15 text-red-600 dark:bg-red-500/25 dark:text-red-400'
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
  const exactTime = new Date(log.timestamp).toLocaleString()

  // Safely extract user and target information
  const userName = log.user?.name || 'Unknown User'
  const targetName = log.target?.name || 'Unknown Target'
  const actionDescription = log.action || 'Unknown Action'

  return (
    <div className="flex group hover:bg-muted/50 p-4 rounded-lg transition-colors border">
      <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center ${styles.color}`}>
        {styles.icon}
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="font-medium truncate">{actionDescription}</div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
            {formattedTime}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{userName}</span> performed action on <span className="font-medium text-foreground">{targetName}</span>
        </div>

        {log.details && (
          <div className="text-sm text-muted-foreground truncate">
            {log.details}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {exactTime}
        </div>
      </div>
    </div>
  )
}
