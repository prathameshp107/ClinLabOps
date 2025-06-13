"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart, Check, Clock, AlertTriangle, CheckCircle, Activity,
  ChevronDown, ChevronUp, BarChart2, TrendingUp, Calendar,
  Users, ArrowUpRight, ArrowDownRight, Filter, Search, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function ProjectStatusTracking({ projects, onUpdateProjectStatus }) {
  const [showStatusDetail, setShowStatusDetail] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortedProjects, setSortedProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: 'progress', direction: 'desc' })

  useEffect(() => {
    // Apply filters, search, and sorting
    let filtered = [...projects]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'progress') {
        return sortConfig.direction === 'asc' ? a.progress - b.progress : b.progress - a.progress
      }
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      return 0
    })

    setSortedProjects(filtered)
  }, [projects, statusFilter, searchQuery, sortConfig])

  const handleStatusChange = (project, newStatus) => {
    if (onUpdateProjectStatus) {
      onUpdateProjectStatus(project.id, newStatus)
    }
    setShowStatusDetail(false)
  }

  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "not started":
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-300 dark:border-gray-700",
          icon: <Clock className="h-4 w-4" />
        }
      case "in progress":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-300 dark:border-blue-900",
          icon: <Activity className="h-4 w-4" />
        }
      case "on hold":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/20",
          text: "text-amber-700 dark:text-amber-300",
          border: "border-amber-300 dark:border-amber-900",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case "review":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/20",
          text: "text-purple-700 dark:text-purple-300",
          border: "border-purple-300 dark:border-purple-900",
          icon: <Check className="h-4 w-4" />
        }
      case "completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-300 dark:border-green-900",
          icon: <CheckCircle className="h-4 w-4" />
        }
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-300 dark:border-gray-700",
          icon: <Activity className="h-4 w-4" />
        }
    }
  }

  // Calculate summary metrics
  const statusSummary = projects.reduce((acc, project) => {
    const status = project.status.toLowerCase()
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status]++
    return acc
  }, {})

  const getProgressColor = (progress) => {
    if (progress < 25) return "bg-red-500"
    if (progress < 50) return "bg-orange-500"
    if (progress < 75) return "bg-blue-500"
    return "bg-green-500"
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                Project Status Overview
              </CardTitle>
              <CardDescription>
                Track and manage project progress across your organization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                icon={<Search className="h-4 w-4" />}
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all border-l-4 border-l-gray-400">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-500 dark:text-gray-400">All Projects</div>
                    <div className="text-2xl font-bold">{projects.length}</div>
                  </div>
                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                    Total
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-blue-500">In Progress</div>
                    <div className="text-2xl font-bold">{statusSummary['in progress'] || 0}</div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all border-l-4 border-l-purple-400">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-purple-500">Review</div>
                    <div className="text-2xl font-bold">{statusSummary['review'] || 0}</div>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                    Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-400">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-amber-500">On Hold</div>
                    <div className="text-2xl font-bold">{statusSummary['on hold'] || 0}</div>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                    Paused
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-950 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-400">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-green-500">Completed</div>
                    <div className="text-2xl font-bold">{statusSummary['completed'] || 0}</div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                    Done
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                <TabsTrigger value="Review">Review</TabsTrigger>
                <TabsTrigger value="On Hold">On Hold</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Project
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('progress')}
                    >
                      <div className="flex items-center gap-2">
                        Progress
                        {sortConfig.key === 'progress' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => {
                    const statusStyle = getStatusColors(project.status)
                    return (
                      <TableRow key={project.id} className="group">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {project.name}
                            {project.isFavorite && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              statusStyle.bg,
                              statusStyle.text,
                              "gap-1 flex items-center"
                            )}
                          >
                            {statusStyle.icon}
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="relative">
                              <Progress
                                value={project.progress}
                                className="h-2"
                                indicatorclassname={getProgressColor(project.progress)}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              project.priority === "High"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                                : project.priority === "Medium"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            )}
                          >
                            {project.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {project.team?.slice(0, 3).map((member, index) => (
                              <TooltipProvider key={member.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background hover:ring-2 hover:ring-primary/20 transition-all"
                                      style={{ zIndex: 10 - index }}
                                    >
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                            {project.team?.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setSelectedProject(project)
                                    setShowStatusDetail(true)
                                  }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Change Status</h4>
                                    <p className="text-sm">
                                      Click to update the status of this project
                                    </p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => router.push(`/projects/${project.id}/analytics`)}
                            >
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDetail} onOpenChange={setShowStatusDetail}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Project Status</DialogTitle>
            <DialogDescription>
              Change the status of <span className="font-medium">{selectedProject?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="justify-start border-l-4 border-l-gray-400 h-12 hover:bg-gray-50 dark:hover:bg-gray-900"
                onClick={() => handleStatusChange(selectedProject, "Not Started")}
              >
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span>Not Started</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start border-l-4 border-l-blue-400 h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleStatusChange(selectedProject, "In Progress")}
              >
                <Activity className="mr-2 h-4 w-4 text-blue-500" />
                <span>In Progress</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start border-l-4 border-l-purple-400 h-12 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => handleStatusChange(selectedProject, "Review")}
              >
                <Check className="mr-2 h-4 w-4 text-purple-500" />
                <span>Review</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start border-l-4 border-l-amber-400 h-12 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={() => handleStatusChange(selectedProject, "On Hold")}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                <span>On Hold</span>
              </Button>

              <Button
                variant="outline"
                className="justify-start border-l-4 border-l-green-400 h-12 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => handleStatusChange(selectedProject, "Completed")}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Completed</span>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDetail(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
