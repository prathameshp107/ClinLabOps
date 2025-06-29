"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, PlusCircle, Filter, User, UserPlus, Shield, Users,
  AlertTriangle, CheckCircle, Lock, Unlock, UserX, RefreshCw,
  ArrowUpDown, ChevronDown, Download, FileSpreadsheet, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddUserDialog } from "./add-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import { UserTable } from "./user-table"
import { UserActivityLogs } from "./user-activity-logs"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { toast } from "@/components/ui/use-toast"
import { mockUsers } from "@/data/projects-data"

// Helper functions for status badges (duplicated from user-columns.jsx for StatusLegend)
function getStatusBadgeVariant(status) {
  switch (status) {
    case "Active": return "success";
    case "Inactive": return "secondary";
    case "Pending": return "warning";
    case "Suspended": return "destructive";
    case "Invited": return "outline";
    case "Locked": return "default";
    default: return "secondary";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "Active": return "✓";
    case "Inactive": return "○";
    case "Pending": return "⏱";
    case "Suspended": return "⚠";
    case "Invited": return "✉";
    case "Locked": return "🔒";
    default: return "";
  }
}

// Helper function to format dates for export
function formatDate(dateString) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function UserManagement() {
  // State for search, filters, and selected user
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    role: { Admin: true, Scientist: true, Technician: true, Reviewer: true },
    status: { Active: true, Inactive: true, Pending: true },
    lastLogin: { recent: true, older: true, never: true }
  })
  const [activeTab, setActiveTab] = useState("all-users")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)

  // State for users
  const [users, setUsers] = useState(Object.values(mockUsers));

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Count active filters
  const filterCounts = {
    role: Object.values(activeFilters.role).filter(Boolean).length,
    status: Object.values(activeFilters.status).filter(Boolean).length,
    lastLogin: Object.values(activeFilters.lastLogin).filter(Boolean).length
  }

  // Update filter function
  const updateFilter = (category, option, value) => {
    setActiveFilters({
      ...activeFilters,
      [category]: {
        ...activeFilters[category],
        [option]: value
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      role: { Admin: true, Scientist: true, Technician: true, Reviewer: true },
      status: { Active: true, Inactive: true, Pending: true },
      lastLogin: { recent: true, older: true, never: true }
    })
    setSearchQuery("")
  }

  // Last login filter logic
  const isWithinDays = (dateString, days) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= days
  }

  // Filter users based on search query and active filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !user.name.toLowerCase().includes(query) &&
          !user.email.toLowerCase().includes(query) &&
          !user.role.toLowerCase().includes(query) &&
          !user.department?.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Role filter
      if (!activeFilters.role[user.role]) {
        return false
      }

      // Status filter
      if (!activeFilters.status[user.status]) {
        return false
      }

      // Last login filter
      const isRecent = isWithinDays(user.lastLogin, 7)
      const isOlder = user.lastLogin && !isRecent
      const hasNeverLoggedIn = !user.lastLogin

      if (
        (isRecent && !activeFilters.lastLogin.recent) ||
        (isOlder && !activeFilters.lastLogin.older) ||
        (hasNeverLoggedIn && !activeFilters.lastLogin.never)
      ) {
        return false
      }

      return true
    })
  }, [searchQuery, activeFilters, users])

  // Add user handler: ensures unique numeric ID
  const handleAddUser = (userData) => {
    // Find the lowest unused positive integer
    const usedIds = new Set(users.map(u => u.id));
    let newId = 1;
    while (usedIds.has(newId)) newId++;
    const newUser = {
      ...userData,
      id: newId,
      twoFactorEnabled: !!userData.enable2FA,
      lastLogin: null,
    };
    setUsers(prev => [...prev, newUser]);
  };

  // Handle user actions
  const handleUserAction = (action, user) => {
    setSelectedUser(user)

    switch (action) {
      case "edit":
        setShowEditUserDialog(true)
        break
      case "resetPassword":
        setShowResetPasswordDialog(true)
        break
      case "delete":
        setShowDeleteUserDialog(true)
        break
      case "toggleStatus":
        // In a real app, this would call an API to toggle the user's status
        console.log(`Toggling status for user: ${user.id}`)
        break
      case "toggle2FA":
        // In a real app, this would call an API to toggle 2FA
        console.log(`Toggling 2FA for user: ${user.id}`)
        break
      default:
        break
    }
  }

  // Export users to CSV/Excel
  const handleExport = (format = "xlsx") => {
    const exportData = filteredUsers.map(u => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Phone: u.phone || "N/A",
      "Power User": u.isPowerUser ? "Yes" : "No",
      Role: u.role,
      Department: u.department || "N/A",
      Status: u.status,
      "Last Login": u.lastLogin ? formatDate(u.lastLogin) : "Never",
      "2FA": u.twoFactorEnabled ? "Yes" : "No",
      Avatar: u.avatar ? "Uploaded" : "None",
    }));

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `users_${timestamp}.${format}`;

    if (format === "csv") {
      // Export as CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(","),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, filename);
    } else {
      // Export as Excel
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
    }

    toast({
      title: "Export successful",
      description: `${exportData.length} users exported to ${filename}`,
    });
  };



  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User & Role Management</h2>
            <p className="text-muted-foreground">
              Manage system users, roles, and permissions
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Users
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setShowAddUserDialog(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add New User
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all-users" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <TabsList className="mb-2 sm:mb-0">
              <TabsTrigger value="all-users" className="gap-2">
                <Users className="h-4 w-4" />
                <span>All Users</span>
              </TabsTrigger>
              <TabsTrigger value="activity-logs" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>Activity Logs</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "all-users" && (
              <div className="flex flex-1 items-center gap-2 max-w-md ml-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, email, role..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {Object.values(filterCounts).some(count => count < Object.keys(activeFilters[Object.keys(activeFilters)[Object.values(filterCounts).indexOf(count)]]).length) && (
                        <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal">
                          {Object.values(filterCounts).reduce((acc, count, index) => {
                            const key = Object.keys(activeFilters)[index]
                            const total = Object.keys(activeFilters[key]).length
                            return acc + (total - count)
                          }, 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        Role {filterCounts.role < Object.keys(activeFilters.role).length && `(${filterCounts.role}/${Object.keys(activeFilters.role).length})`}
                      </DropdownMenuLabel>
                      {Object.keys(activeFilters.role).map(role => (
                        <DropdownMenuItem key={role} onSelect={(e) => e.preventDefault()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`role-${role}`}
                              checked={activeFilters.role[role]}
                              onChange={(e) => updateFilter("role", role, e.target.checked)}
                              className="rounded border-input"
                            />
                            <label htmlFor={`role-${role}`} className="flex-1 cursor-pointer">
                              {role}
                            </label>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        Status {filterCounts.status < Object.keys(activeFilters.status).length && `(${filterCounts.status}/${Object.keys(activeFilters.status).length})`}
                      </DropdownMenuLabel>
                      {Object.keys(activeFilters.status).map(status => (
                        <DropdownMenuItem key={status} onSelect={(e) => e.preventDefault()}>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`status-${status}`}
                              checked={activeFilters.status[status]}
                              onChange={(e) => updateFilter("status", status, e.target.checked)}
                              className="rounded border-input"
                            />
                            <label htmlFor={`status-${status}`} className="flex-1 cursor-pointer">
                              {status}
                            </label>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        Last Login {filterCounts.lastLogin < Object.keys(activeFilters.lastLogin).length && `(${filterCounts.lastLogin}/${Object.keys(activeFilters.lastLogin).length})`}
                      </DropdownMenuLabel>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="login-recent"
                            checked={activeFilters.lastLogin.recent}
                            onChange={(e) => updateFilter("lastLogin", "recent", e.target.checked)}
                            className="rounded border-input"
                          />
                          <label htmlFor="login-recent" className="flex-1 cursor-pointer">
                            Last 7 days
                          </label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="login-older"
                            checked={activeFilters.lastLogin.older}
                            onChange={(e) => updateFilter("lastLogin", "older", e.target.checked)}
                            className="rounded border-input"
                          />
                          <label htmlFor="login-older" className="flex-1 cursor-pointer">
                            More than 7 days
                          </label>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="login-never"
                            checked={activeFilters.lastLogin.never}
                            onChange={(e) => updateFilter("lastLogin", "never", e.target.checked)}
                            className="rounded border-input"
                          />
                          <label htmlFor="login-never" className="flex-1 cursor-pointer">
                            Never logged in
                          </label>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center"
                      onClick={resetFilters}
                    >
                      Reset all filters
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <TabsContent value="all-users" className="space-y-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-center py-24"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading users...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">
                      {filteredUsers.length} of {users.length} users
                    </span>
                  </div>
                  <UserTable
                    users={filteredUsers}
                    onUserAction={handleUserAction}
                    className="table-auto w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="activity-logs" className="space-y-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex items-center justify-center py-24"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading activity logs...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserActivityLogs />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* User Management Dialogs */}
      <AnimatePresence>
        {showAddUserDialog && (
          <AddUserDialog
            open={showAddUserDialog}
            onOpenChange={setShowAddUserDialog}
            onAddUser={handleAddUser}
          />
        )}

        {showEditUserDialog && selectedUser && (
          <EditUserDialog
            open={showEditUserDialog}
            onOpenChange={setShowEditUserDialog}
            user={selectedUser}
          />
        )}

        {showResetPasswordDialog && selectedUser && (
          <ResetPasswordDialog
            open={showResetPasswordDialog}
            onOpenChange={setShowResetPasswordDialog}
            user={selectedUser}
          />
        )}

        {showDeleteUserDialog && selectedUser && (
          <DeleteUserDialog
            open={showDeleteUserDialog}
            onOpenChange={setShowDeleteUserDialog}
            user={selectedUser}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
