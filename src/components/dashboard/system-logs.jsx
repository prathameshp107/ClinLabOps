"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Terminal, Clock, Filter, Download, Search, Check, ChevronDown, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for system logs
const systemLogsData = [
  {
    id: "log-1",
    action: "User Login",
    user: "alex.johnson@labtasker.com",
    details: "Successful login from 192.168.1.105",
    timestamp: "2025-03-22T16:32:45",
    category: "authentication"
  },
  {
    id: "log-2",
    action: "Experiment Created",
    user: "sarah.miller@labtasker.com",
    details: "Created new experiment 'Enzyme Stability Analysis' (EXP-1023)",
    timestamp: "2025-03-22T16:18:22",
    category: "experiment"
  },
  {
    id: "log-3",
    action: "Permission Change",
    user: "admin@labtasker.com",
    details: "Updated user role for sarah.miller@labtasker.com to 'Admin'",
    timestamp: "2025-03-22T15:56:11",
    category: "admin"
  },
  {
    id: "log-4",
    action: "File Access",
    user: "david.chen@labtasker.com",
    details: "Downloaded experiment results for 'Substrate Specificity' (EXP-1025)",
    timestamp: "2025-03-22T15:42:37",
    category: "data"
  },
  {
    id: "log-5",
    action: "Task Update",
    user: "james.rivera@labtasker.com",
    details: "Changed task status from 'In Progress' to 'Review' for TASK-089",
    timestamp: "2025-03-22T15:31:04",
    category: "task"
  },
  {
    id: "log-6",
    action: "Failed Login",
    user: "unknown",
    details: "Failed login attempt for user 'emma.wilson@labtasker.com' from 198.51.100.12",
    timestamp: "2025-03-22T15:26:59",
    category: "security"
  }
]

export function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    authentication: true,
    experiment: true,
    admin: true,
    data: true,
    task: true,
    security: true
  })
  
  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  }

  // Helper function to get appropriate badge variant based on category
  const getBadgeVariant = (category) => {
    switch (category) {
      case "authentication":
        return "outline";
      case "experiment":
        return "secondary";
      case "admin":
        return "default";
      case "data":
        return "secondary";
      case "task":
        return "outline";
      case "security":
        return "destructive";
      default:
        return "outline";
    }
  }
  
  // Filter logs based on search query and active filters
  const filteredLogs = systemLogsData.filter(log => {
    // Check if log category is included in active filters
    if (!activeFilters[log.category]) {
      return false;
    }
    
    // Check if search query matches any field
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return log.action.toLowerCase().includes(query) ||
             log.user.toLowerCase().includes(query) ||
             log.details.toLowerCase().includes(query) ||
             log.category.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  
  // Toggle all filters
  const toggleAllFilters = (value) => {
    setActiveFilters({
      authentication: value,
      experiment: value,
      admin: value,
      data: value,
      task: value,
      security: value
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span>Recent System Logs</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {activeFilterCount < 6 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={Object.values(activeFilters).every(Boolean)}
                onCheckedChange={(checked) => toggleAllFilters(checked)}
              >
                All Categories
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.authentication}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, authentication: checked }))
                }
              >
                Authentication
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.experiment}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, experiment: checked }))
                }
              >
                Experiment
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.admin}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, admin: checked }))
                }
              >
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.data}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, data: checked }))
                }
              >
                Data
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.task}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, task: checked }))
                }
              >
                Task
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.security}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({ ...prev, security: checked }))
                }
              >
                Security
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="flex items-center border rounded-md mb-4">
            <Search className="h-4 w-4 text-muted-foreground ml-3" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <span className="sr-only">Clear search</span>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="overflow-y-auto max-h-[350px] -mx-6">
            <table className="w-full min-w-full divide-y divide-border">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 opacity-70" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        {log.action}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {log.user}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm">
                        <Badge variant={getBadgeVariant(log.category)}>
                          {log.category}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No logs match your current filters.
                      <br />
                      <Button 
                        variant="link" 
                        className="mt-2" 
                        onClick={() => {
                          setSearchQuery("");
                          toggleAllFilters(true);
                        }}
                      >
                        Clear all filters
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
