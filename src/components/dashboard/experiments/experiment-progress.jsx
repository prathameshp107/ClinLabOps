"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FlaskConical, ArrowUpRight, Check, Clock, AlertTriangle, Filter, ChevronDown, Search, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function ExperimentProgress(experimentData) {
  const experimentsData = experimentData?.data;
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    status: {
      'in-progress': true,
      'delayed': true,
      'completed': true,
      'scheduled': true
    },
    department: {
      'Biochemistry': true,
      'Molecular Biology': true,
      'Genetics': true,
      'Cell Biology': true
    },
    priority: {
      'high': true,
      'medium': true,
      'low': true
    }
  })

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'in-progress':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      case 'delayed':
        return {
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-950/50',
          borderColor: 'border-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        };
      case 'completed':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950/50',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <Check className="h-3.5 w-3.5 mr-1" />
        };
      case 'scheduled':
        return {
          color: 'text-purple-500',
          bgColor: 'bg-purple-50 dark:bg-purple-950/50',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-900',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <Clock className="h-3.5 w-3.5 mr-1" />
        };
    }
  }

  // Filter experiments based on search query and active filters
  const filteredExperiments = experimentsData.filter(experiment => {
    // Check status filter
    if (!activeFilters.status[experiment.status]) {
      return false;
    }

    // Check department filter
    if (!activeFilters.department[experiment.department]) {
      return false;
    }

    // Check priority filter
    if (!activeFilters.priority[experiment.priority]) {
      return false;
    }

    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return experiment.name.toLowerCase().includes(query) ||
        experiment.owner.toLowerCase().includes(query) ||
        experiment.department.toLowerCase().includes(query) ||
        experiment.id.toLowerCase().includes(query);
    }

    return true;
  });

  // Get active filter counts
  const statusFilterCount = Object.values(activeFilters.status).filter(Boolean).length;
  const departmentFilterCount = Object.values(activeFilters.department).filter(Boolean).length;
  const priorityFilterCount = Object.values(activeFilters.priority).filter(Boolean).length;

  // Reset all filters
  const resetAllFilters = () => {
    setActiveFilters({
      status: {
        'in-progress': true,
        'delayed': true,
        'completed': true,
        'scheduled': true
      },
      department: {
        'Biochemistry': true,
        'Molecular Biology': true,
        'Genetics': true,
        'Cell Biology': true
      },
      priority: {
        'high': true,
        'medium': true,
        'low': true
      }
    });
    setSearchQuery("");
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <span>Experiment Progress</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {statusFilterCount < 4 && (
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
                checked={activeFilters.status.delayed}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    status: {
                      ...prev.status,
                      'delayed': checked
                    }
                  }))
                }
              >
                Delayed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.status.completed}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    status: {
                      ...prev.status,
                      'completed': checked
                    }
                  }))
                }
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.status.scheduled}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    status: {
                      ...prev.status,
                      'scheduled': checked
                    }
                  }))
                }
              >
                Scheduled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Department filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Dept</span>
                {departmentFilterCount < 4 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {departmentFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={activeFilters.department['Biochemistry']}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    department: {
                      ...prev.department,
                      'Biochemistry': checked
                    }
                  }))
                }
              >
                Biochemistry
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.department['Molecular Biology']}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    department: {
                      ...prev.department,
                      'Molecular Biology': checked
                    }
                  }))
                }
              >
                Molecular Biology
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.department['Genetics']}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    department: {
                      ...prev.department,
                      'Genetics': checked
                    }
                  }))
                }
              >
                Genetics
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.department['Cell Biology']}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    department: {
                      ...prev.department,
                      'Cell Biology': checked
                    }
                  }))
                }
              >
                Cell Biology
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority filter */}
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
                checked={activeFilters.priority.high}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    priority: {
                      ...prev.priority,
                      'high': checked
                    }
                  }))
                }
              >
                High Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.priority.medium}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    priority: {
                      ...prev.priority,
                      'medium': checked
                    }
                  }))
                }
              >
                Medium Priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={activeFilters.priority.low}
                onCheckedChange={(checked) =>
                  setActiveFilters(prev => ({
                    ...prev,
                    priority: {
                      ...prev.priority,
                      'low': checked
                    }
                  }))
                }
              >
                Low Priority
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
              placeholder="Search experiments..."
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

          <div className="space-y-4">
            {filteredExperiments.length > 0 ? (
              filteredExperiments.map((experiment, index) => {
                const { color, bgColor, borderColor, icon } = getStatusInfo(experiment.status);

                return (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-sm">{experiment.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className={`flex items-center ${color} ${bgColor} ${borderColor}`}>
                            {icon}
                            <span className="capitalize">{experiment.status.replace('-', ' ')}</span>
                          </Badge>
                          {getPriorityBadge(experiment.priority)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{experiment.department}</span>
                        <span className="font-medium">{experiment.progress}%</span>
                      </div>
                      <Progress value={experiment.progress} className="h-2" />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Start: {formatDate(experiment.startDate)}</div>
                      <div>End: {formatDate(experiment.endDate)}</div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Owner: {experiment.owner}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="text-lg font-medium mb-1">No Results Found</div>
                <div className="text-muted-foreground mb-4">
                  No experiments match your current filters
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={resetAllFilters}
                >
                  <Filter className="h-4 w-4" />
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
