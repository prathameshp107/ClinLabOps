"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ClipboardCheck, Filter, Check, X, ChevronDown, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function PendingApprovals(pendingApprovalsData) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    high: true,
    medium: true,
    low: true,
    validation: true,
    purchase: true,
    maintenance: true,
    protocol: true,
    access: true
  })

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper function to get badge variant based on priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  }

  // Helper function to get badge for type
  const getTypeBadge = (type) => {
    switch (type) {
      case "validation":
        return <Badge variant="secondary">Validation</Badge>;
      case "purchase":
        return <Badge variant="secondary">Purchase</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>;
      case "protocol":
        return <Badge variant="secondary">Protocol</Badge>;
      case "access":
        return <Badge variant="secondary">Access</Badge>;
      default:
        return <Badge variant="secondary">Other</Badge>;
    }
  }

  // Get filtered data based on search query and active filters
  const filteredApprovals = pendingApprovalsData?.data?.filter(task => {
    // Check priority and type filters
    if (!activeFilters[task.priority] || !activeFilters[task.type]) {
      return false;
    }

    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return task.name.toLowerCase().includes(query) ||
        task.submitter.name.toLowerCase().includes(query) ||
        task.submitter.email.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query);
    }

    return true;
  });

  // Get active filter count - excluding type filters
  const priorityFilterCount = [
    activeFilters.high ? 1 : 0,
    activeFilters.medium ? 1 : 0,
    activeFilters.low ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  // Get active type filter count
  const typeFilterCount = [
    activeFilters.validation ? 1 : 0,
    activeFilters.purchase ? 1 : 0,
    activeFilters.maintenance ? 1 : 0,
    activeFilters.protocol ? 1 : 0,
    activeFilters.access ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <span>Pending Approvals</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Priority</span>
                {priorityFilterCount < 3 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {priorityFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.high}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, high: checked }))
                }
              >
                High Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.medium}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, medium: checked }))
                }
              >
                Medium Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.low}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, low: checked }))
                }
              >
                Low Priority
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Type</span>
                {typeFilterCount < 5 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {typeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.validation}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, validation: checked }))
                }
              >
                Validation
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.purchase}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, purchase: checked }))
                }
              >
                Purchase
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.maintenance}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, maintenance: checked }))
                }
              >
                Maintenance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.protocol}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, protocol: checked }))
                }
              >
                Protocol
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.access}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({ ...prev, access: checked }))
                }
              >
                Access
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
              placeholder="Search approvals..."
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

          <div className="space-y-3 -mx-2">
            {filteredApprovals.length > 0 ? (
              filteredApprovals.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <Avatar className="h-10 w-10 hidden sm:flex">
                      <AvatarImage src={task.submitter.avatar} />
                      <AvatarFallback>{task.submitter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">{task.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        {getPriorityBadge(task.priority)}
                        {getTypeBadge(task.type)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submitted by {task.submitter.name} on {formatDate(task.submitted)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      Details
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto gap-1">
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-muted-foreground mb-2">No approvals match your current filters</div>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilters({
                      high: true,
                      medium: true,
                      low: true,
                      validation: true,
                      purchase: true,
                      maintenance: true,
                      protocol: true,
                      access: true
                    });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
