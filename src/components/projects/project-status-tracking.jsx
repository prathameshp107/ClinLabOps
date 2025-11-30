"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart, Check, Clock, AlertTriangle, CheckCircle, Activity,
  ChevronDown, ChevronUp, BarChart2, TrendingUp, Calendar,
  Users, ArrowUpRight, ArrowDownRight, Filter, Search, Star, Zap
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
          icon: <Clock className="h-3.5 w-3.5" />
        }
      case "in progress":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-300 dark:border-blue-900",
          icon: <Activity className="h-3.5 w-3.5" />
        }
      case "on hold":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/20",
          text: "text-amber-700 dark:text-amber-300",
          border: "border-amber-300 dark:border-amber-900",
          icon: <AlertTriangle className="h-3.5 w-3.5" />
        }
      case "review":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/20",
          text: "text-purple-700 dark:text-purple-300",
          border: "border-purple-300 dark:border-purple-900",
          icon: <Check className="h-3.5 w-3.5" />
        }
      case "completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-700 dark:text-green-300",
          border: "border-green-300 dark:border-green-900",
          icon: <CheckCircle className="h-3.5 w-3.5" />
        }
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-300",
          border: "border-gray-300 dark:border-gray-700",
          icon: <Activity className="h-3.5 w-3.5" />
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
      <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Project Status Overview
              </CardTitle>
              <CardDescription className="mt-1">
                Track and manage project progress across your organization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 bg-background/50 border-border/50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-gray-400 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground text-sm">All Projects</div>
                    <div className="text-2xl font-bold group-hover:text-primary transition-colors">{projects.length}</div>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Total
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-blue-500 text-sm">In Progress</div>
                    <div className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{statusSummary['in progress'] || 0}</div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-purple-500 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-purple-500 text-sm">Review</div>
                    <div className="text-2xl font-bold group-hover:text-purple-600 transition-colors">{statusSummary['review'] || 0}</div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                    Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-amber-500 text-sm">On Hold</div>
                    <div className="text-2xl font-bold group-hover:text-amber-600 transition-colors">{statusSummary['on hold'] || 0}</div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                    Paused
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500 group">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium text-green-500 text-sm">Completed</div>
                    <div className="text-2xl font-bold group-hover:text-green-600 transition-colors">{statusSummary['completed'] || 0}</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    Done
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" onValueChange={setStatusFilter} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="bg-muted/50 p-1 h-auto">
                {["all", "In Progress", "Review", "On Hold", "Completed"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="h-[500px] rounded-xl border border-border/50 bg-background/30">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        Project
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort('progress')}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        Progress
                        {sortConfig.key === 'progress' && (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Team</TableHead>
                    <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProjects.map((project) => {
                    const statusStyle = getStatusColors(project.status)
                    return (
                      <TableRow key={project.id} className="group hover:bg-muted/30 border-border/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {project.name}
                            {project.isFavorite && (
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              statusStyle.bg,
                              statusStyle.text,
                              "gap-1.5 flex items-center px-2.5 py-0.5 border-transparent"
                            )}
                          >
                            {statusStyle.icon}
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full max-w-[180px]">
                            <div className="flex justify-between items-center mb-1.5 text-xs">
                              <span className="font-medium text-muted-foreground">{project.progress}%</span>
                            </div>
                            <div className="relative h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-500", getProgressColor(project.progress))}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-2.5 py-0.5 border-transparent flex w-fit items-center gap-1",
                              project.priority === "High"
                                ? "bg-red-500/10 text-red-600"
                                : project.priority === "Medium"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-blue-500/10 text-blue-600"
                            )}
                          >
                            <Zap className="h-3 w-3" />
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
                                      className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold border-2 border-background hover:ring-2 hover:ring-primary/20 transition-all cursor-help"
                                      style={{ zIndex: 10 - index }}
                                    >
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                            {project.team?.length > 3 && (
                              <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold border-2 border-background">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-4">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
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
                                    <p className="text-sm text-muted-foreground">
                                      Click to update the status of this project
                                    </p>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
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
              Change the status of <span className="font-medium text-foreground">{selectedProject?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start border-l-4 border-l-gray-400 h-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all hover:pl-5"
              onClick={() => handleStatusChange(selectedProject, "Not Started")}
            >
              <Clock className="mr-3 h-4 w-4 text-gray-500" />
              <span>Not Started</span>
            </Button>

            <Button
              variant="outline"
              className="justify-start border-l-4 border-l-blue-500 h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:pl-5"
              onClick={() => handleStatusChange(selectedProject, "In Progress")}
            >
              <Activity className="mr-3 h-4 w-4 text-blue-500" />
              <span>In Progress</span>
            </Button>

            <Button
              variant="outline"
              className="justify-start border-l-4 border-l-purple-500 h-12 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all hover:pl-5"
              onClick={() => handleStatusChange(selectedProject, "Review")}
            >
              <Check className="mr-3 h-4 w-4 text-purple-500" />
              <span>Review</span>
            </Button>

            <Button
              variant="outline"
              className="justify-start border-l-4 border-l-amber-500 h-12 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all hover:pl-5"
              onClick={() => handleStatusChange(selectedProject, "On Hold")}
            >
              <AlertTriangle className="mr-3 h-4 w-4 text-amber-500" />
              <span>On Hold</span>
            </Button>

            <Button
              variant="outline"
              className="justify-start border-l-4 border-l-green-500 h-12 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all hover:pl-5"
              onClick={() => handleStatusChange(selectedProject, "Completed")}
            >
              <CheckCircle className="mr-3 h-4 w-4 text-green-500" />
              <span>Completed</span>
            </Button>
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
