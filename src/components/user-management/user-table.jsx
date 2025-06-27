"use client"

import { useState, useMemo } from "react"
import { format, parseISO, isValid } from "date-fns"
import { motion } from "framer-motion"
import { 
  ChevronUp, ChevronDown, MoreHorizontal, Pencil, Key, Trash, User, ShieldAlert, Shield, Clock,
  CheckCircle, AlertTriangle, UserX, HelpCircle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/tasks/user-avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserTable({ users, onUserAction, className }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc"
  })
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key 
        ? prevConfig.direction === "asc" ? "desc" : "asc"
        : "asc"
    }))
  }

  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users]
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]
        
        // Special handling for dates
        if (sortConfig.key === "lastLogin") {
          // Handle cases where a user has never logged in
          if (!aValue) return sortConfig.direction === "asc" ? 1 : -1
          if (!bValue) return sortConfig.direction === "asc" ? -1 : 1
          
          // Parse the ISO date strings
          const aDate = parseISO(aValue)
          const bDate = parseISO(bValue)
          
          if (isValid(aDate) && isValid(bDate)) {
            return sortConfig.direction === "asc" 
              ? aDate - bDate 
              : bDate - aDate
          }
        }
        
        // Default string comparison for other fields
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableUsers
  }, [users, sortConfig])

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "Admin": return "destructive"
      case "Scientist": return "default"
      case "Technician": return "secondary"
      case "Reviewer": return "outline" 
      default: return "secondary"
    }
  }
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active": return "success"
      case "Inactive": return "secondary"
      case "Pending": return "warning"
      default: return "secondary"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin": return <ShieldAlert className="h-3 w-3 mr-1" />
      case "Scientist": return <Shield className="h-3 w-3 mr-1" />
      case "Technician": return <User className="h-3 w-3 mr-1" />
      case "Reviewer": return <Clock className="h-3 w-3 mr-1" />
      default: return null
    }
  }

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "Never logged in"
    
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, "MMM d, yyyy 'at' h:mm a")
      }
      return "Invalid date"
    } catch (error) {
      return "Invalid date"
    }
  }

  // Column headers with sortable functionality
  const SortableHeader = ({ label, field }) => (
    <div 
      onClick={() => handleSort(field)}
      className="group flex items-center gap-1 cursor-pointer select-none"
    >
      <span>{label}</span>
      {sortConfig.key === field ? (
        sortConfig.direction === "asc" ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" />
        )
      ) : (
        <div className="opacity-0 group-hover:opacity-40 transition-opacity">
          <ChevronUp className="h-4 w-4" />
        </div>
      )}
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <tr>
      <td colSpan="6" className="h-32 text-center">
        <div className="flex flex-col items-center justify-center">
          <User className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No users found</p>
          <p className="text-muted-foreground text-xs mt-1">Try adjusting your filters or search criteria</p>
        </div>
      </td>
    </tr>
  )

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + pageSize)

  // Handle pagination
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(4, totalPages - 1)
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3)
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...')
      }
      
      // Add visible page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className={`relative w-full overflow-auto ${className}`}>
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b sticky top-0 bg-background z-10">
          <tr className="text-left">
            <th className="h-10 px-4 text-muted-foreground font-medium">
              <SortableHeader label="Name" field="name" />
            </th>
            <th className="h-10 px-4 text-muted-foreground font-medium">
              <SortableHeader label="Email" field="email" />
            </th>
            <th className="h-10 px-4 text-muted-foreground font-medium">
              <SortableHeader label="Role" field="role" />
            </th>
            <th className="h-10 px-4 text-muted-foreground font-medium">
              <SortableHeader label="Last Login" field="lastLogin" />
            </th>
            <th className="h-10 px-4 text-muted-foreground font-medium">
              <SortableHeader label="Status" field="status" />
            </th>
            <th className="h-10 w-[80px] text-muted-foreground font-medium text-right pr-4">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody className="divide-y">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.twoFactorEnabled && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] rounded-sm px-1 py-0">2FA</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1 flex items-center">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4 text-sm">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground cursor-help">
                          {user.lastLogin ? formatDate(user.lastLogin).split(" at ")[0] : "Never"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDate(user.lastLogin)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="p-4">
                  <Badge 
                    variant={getStatusBadgeVariant(user.status)}
                    className={`
                      ${user.status === "Active" ? "bg-green-500/15 text-green-600 dark:bg-green-500/25 dark:text-green-400" : ""} 
                      ${user.status === "Inactive" ? "bg-gray-500/15 text-gray-600 dark:bg-gray-500/25 dark:text-gray-400" : ""} 
                      ${user.status === "Pending" ? "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-400" : ""}
                    `}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onUserAction("edit", user)} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUserAction("reset-password", user)} className="gap-2">
                        <Key className="h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUserAction("delete", user)} className="text-destructive focus:text-destructive gap-2">
                        <Trash className="h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))
          ) : (
            <EmptyState />
          )}
        </tbody>
      </table>
      
      {users.length > 0 && (
        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              Showing {Math.min(users.length, startIndex + 1)}-{Math.min(users.length, startIndex + pageSize)} of {users.length} users
            </p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              
              {getPageNumbers().map((page, i) => (
                typeof page === 'number' ? (
                  <Button
                    key={i}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ) : (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 pointer-events-none"
                    disabled
                  >
                    {page}
                  </Button>
                )
              ))}
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
