"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertCircle, Bell, CheckCircle, ChevronDown, Filter, Clock, Info, Search, ShieldAlert, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for compliance alerts
const alertsData = [
  {
    id: "alert-001",
    title: "Equipment Calibration Due",
    description: "HPLC System #3 requires calibration within 3 days",
    status: "pending",
    severity: "moderate",
    category: "equipment",
    createdAt: "2025-03-21T09:30:00",
    dueDate: "2025-03-25T17:00:00"
  },
  {
    id: "alert-002",
    title: "Safety Protocol Update Required",
    description: "New guidelines for handling Class 3 reagents must be reviewed",
    status: "pending",
    severity: "critical",
    category: "safety",
    createdAt: "2025-03-20T14:45:00",
    dueDate: "2025-03-23T17:00:00"
  },
  {
    id: "alert-003",
    title: "Reagent Inventory Low",
    description: "Acetonitrile stock below 20% threshold, reorder recommended",
    status: "resolved",
    severity: "low",
    category: "inventory",
    createdAt: "2025-03-19T11:15:00",
    dueDate: "2025-03-22T17:00:00",
    resolvedAt: "2025-03-21T15:30:00"
  },
  {
    id: "alert-004",
    title: "Regulatory Documentation Outdated",
    description: "ISO compliance certificates need renewal",
    status: "pending",
    severity: "high",
    category: "regulatory",
    createdAt: "2025-03-18T10:45:00",
    dueDate: "2025-03-28T17:00:00"
  },
  {
    id: "alert-005",
    title: "Temperature Excursion Detected",
    description: "Sample Storage Refrigerator #2 reported temperature above threshold for 45 minutes",
    status: "pending",
    severity: "high",
    category: "equipment",
    createdAt: "2025-03-22T07:15:00",
    dueDate: "2025-03-22T12:00:00"
  },
  {
    id: "alert-006",
    title: "Method Validation Pending",
    description: "New analytical method MV-2025-03 awaiting validation procedure",
    status: "in-progress",
    severity: "moderate",
    category: "methods",
    createdAt: "2025-03-17T13:20:00",
    dueDate: "2025-03-27T17:00:00"
  },
  {
    id: "alert-007",
    title: "Training Certificate Expired",
    description: "2 team members have expired hazardous material handling certificates",
    status: "resolved",
    severity: "critical",
    category: "training",
    createdAt: "2025-03-15T09:10:00",
    dueDate: "2025-03-19T17:00:00",
    resolvedAt: "2025-03-18T16:45:00"
  }
]

export function ComplianceAlerts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    status: {
      'pending': true,
      'in-progress': true,
      'resolved': false
    },
    severity: {
      'critical': true,
      'high': true,
      'moderate': true,
      'low': true
    },
    category: {
      'equipment': true,
      'safety': true,
      'inventory': true,
      'regulatory': true,
      'methods': true,
      'training': true
    }
  })
  
  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Overdue";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${diffDays} days`;
    }
  };
  
  // Get severity information
  const getSeverityInfo = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-950/50',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: <ShieldAlert className="h-3.5 w-3.5 mr-1" />
        };
      case 'high':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200 dark:border-amber-800',
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'moderate':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-950/50',
          borderColor: 'border-orange-200 dark:border-orange-800',
          icon: <Bell className="h-3.5 w-3.5 mr-1" />
        };
      case 'low':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: <Info className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <Info className="h-3.5 w-3.5 mr-1" />
        };
    }
  };
  
  // Get status information
  const getStatusInfo = (status) => {
    switch (status) {
      case 'resolved':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/50',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
        };
      case 'in-progress':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200 dark:border-amber-800',
          icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
        };
    }
  };
  
  // Filter alerts based on search query and active filters
  const filteredAlerts = alertsData.filter(alert => {
    // Check status filter
    if (!activeFilters.status[alert.status]) {
      return false;
    }
    
    // Check severity filter
    if (!activeFilters.severity[alert.severity]) {
      return false;
    }
    
    // Check category filter
    if (!activeFilters.category[alert.category]) {
      return false;
    }
    
    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return alert.title.toLowerCase().includes(query) ||
             alert.description.toLowerCase().includes(query) ||
             alert.category.toLowerCase().includes(query) ||
             alert.id.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  // Get active filter counts
  const statusFilterCount = Object.values(activeFilters.status).filter(Boolean).length;
  const severityFilterCount = Object.values(activeFilters.severity).filter(Boolean).length;
  const categoryFilterCount = Object.values(activeFilters.category).filter(Boolean).length;
  
  // Reset all filters
  const resetAllFilters = () => {
    setActiveFilters({
      status: {
        'pending': true,
        'in-progress': true,
        'resolved': false
      },
      severity: {
        'critical': true,
        'high': true,
        'moderate': true,
        'low': true
      },
      category: {
        'equipment': true,
        'safety': true,
        'inventory': true,
        'regulatory': true,
        'methods': true,
        'training': true
      }
    });
    setSearchQuery("");
  };
  
  // Get count of critical and high priority pending alerts
  const criticalAlertCount = alertsData.filter(
    alert => (alert.severity === 'critical' || alert.severity === 'high') && 
    alert.status !== 'resolved'
  ).length;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <span>Compliance Alerts</span>
          {criticalAlertCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {criticalAlertCount} critical
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {statusFilterCount < 3 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {statusFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.status.pending}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    status: {
                      ...prev.status,
                      'pending': checked
                    }
                  }))
                }
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.status['in-progress']}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    status: {
                      ...prev.status,
                      'in-progress': checked
                    }
                  }))
                }
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.status.resolved}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    status: {
                      ...prev.status,
                      'resolved': checked
                    }
                  }))
                }
              >
                Resolved
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Severity filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Severity</span>
                {severityFilterCount < 4 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {severityFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.severity.critical}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    severity: {
                      ...prev.severity,
                      'critical': checked
                    }
                  }))
                }
              >
                Critical
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.severity.high}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    severity: {
                      ...prev.severity,
                      'high': checked
                    }
                  }))
                }
              >
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.severity.moderate}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    severity: {
                      ...prev.severity,
                      'moderate': checked
                    }
                  }))
                }
              >
                Moderate
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.severity.low}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    severity: {
                      ...prev.severity,
                      'low': checked
                    }
                  }))
                }
              >
                Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Category</span>
                {categoryFilterCount < 6 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {categoryFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.equipment}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'equipment': checked
                    }
                  }))
                }
              >
                Equipment
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.safety}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'safety': checked
                    }
                  }))
                }
              >
                Safety
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.inventory}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'inventory': checked
                    }
                  }))
                }
              >
                Inventory
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.regulatory}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'regulatory': checked
                    }
                  }))
                }
              >
                Regulatory
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.methods}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'methods': checked
                    }
                  }))
                }
              >
                Methods
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.category.training}
                onCheckedChange={(checked) => 
                  setActiveFilters(prev => ({
                    ...prev, 
                    category: {
                      ...prev.category,
                      'training': checked
                    }
                  }))
                }
              >
                Training
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="flex items-center border rounded-md mb-4">
            <Search className="h-4 w-4 text-muted-foreground ml-3" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
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
          
          <div className="space-y-3 overflow-y-auto max-h-[350px]">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => {
                const severityInfo = getSeverityInfo(alert.severity);
                const statusInfo = getStatusInfo(alert.status);
                
                return (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 border rounded-lg ${
                      alert.status === 'resolved' 
                        ? 'border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10' 
                        : 'border-border bg-card'
                    } relative`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 rounded-full p-1 ${severityInfo.bgColor} ${severityInfo.borderColor}`}>
                            {severityInfo.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {alert.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${statusInfo.color} ${statusInfo.bgColor} ${statusInfo.borderColor} flex items-center`}
                              >
                                {statusInfo.icon}
                                <span className="capitalize">{alert.status.replace('-', ' ')}</span>
                              </Badge>
                              <Badge variant="outline" className="capitalize text-xs">
                                {alert.category}
                              </Badge>
                              {alert.status !== 'resolved' && (
                                <Badge variant="outline" className={`text-xs ${
                                  formatDate(alert.dueDate) === 'Overdue' 
                                    ? 'text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200' 
                                    : formatDate(alert.dueDate) === 'Today' 
                                      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200'
                                      : 'text-muted-foreground'
                                }`}>
                                  Due: {formatDate(alert.dueDate)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {alert.status !== 'resolved' && (
                          <Button variant="outline" size="sm" className="h-7 px-2">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <div className="text-muted-foreground mb-2">No alerts match your current filters</div>
                <Button 
                  variant="link" 
                  className="mt-2" 
                  onClick={resetAllFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
