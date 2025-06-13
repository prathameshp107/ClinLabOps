"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  ArrowLeftRight, Eye, EyeOff, Filter, Download, Link, Unlink,
  Settings, Palette, SlidersHorizontal, Clock, CalendarDays, CalendarRange,
  BarChart2, Users, Tag, Star, MessageSquare, CheckCircle2, XCircle,
  ArrowUpRight, ArrowDownRight, Search, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { format, addDays, differenceInDays, addMonths, addWeeks, addQuarters, addYears, isSameMonth, isSameDay, isSameWeek, parseISO, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Helper function to calculate project duration
const getDuration = (project) => {
  return differenceInDays(new Date(project.endDate), new Date(project.startDate)) + 1
}

export function ProjectGanttChart({ projects, dependencies = [] }) {
  const scrollAreaRef = useRef(null)
  const containerRef = useRef(null)

  const [zoomLevel, setZoomLevel] = useState(60)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addMonths(new Date(), 6))
  const [viewPeriod, setViewPeriod] = useState("6months")
  const [timeScale, setTimeScale] = useState("month")
  const [showDependencies, setShowDependencies] = useState(true)
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [visibleProjects, setVisibleProjects] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [colorMode, setColorMode] = useState("status")
  const [searchQuery, setSearchQuery] = useState("")
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectDetails, setShowProjectDetails] = useState(false)

  // Calculate dates for display based on timeScale
  const getDayWidth = () => {
    switch (timeScale) {
      case "day": return zoomLevel
      case "week": return Math.max(zoomLevel / 2, 20)
      case "month": return Math.max(zoomLevel / 3, 15)
      case "quarter": return Math.max(zoomLevel / 6, 12)
      case "year": return Math.max(zoomLevel / 12, 10)
      default: return zoomLevel
    }
  }

  const dayWidth = getDayWidth()
  const cellWidth = dayWidth
  const headerHeight = 80
  const rowHeight = 80
  const totalDays = differenceInDays(endDate, startDate) + 1
  const chartWidth = totalDays * dayWidth

  // Generate an array of all days between start and end date
  const days = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i))
  const allDays = days

  // Handle zoom level changes
  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom[0])
  }

  // Apply filters and set visible projects
  useEffect(() => {
    let filtered = [...projects]

    if (filterPriority !== "all") {
      filtered = filtered.filter(project => project.priority === filterPriority)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(project => project.status === filterStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort projects by start date
    filtered.sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate)
    })

    setVisibleProjects(filtered)

    if (filtered.length > 0) {
      const earliestDate = filtered.reduce((earliest, project) => {
        const projectStart = new Date(project.startDate)
        return projectStart < earliest ? projectStart : earliest
      }, new Date(filtered[0].startDate))

      setStartDate(addDays(earliestDate, -5))
    }
  }, [projects, filterPriority, filterStatus, searchQuery])

  // Adjust view period
  useEffect(() => {
    switch (viewPeriod) {
      case "3months":
        setEndDate(addMonths(startDate, 3))
        break
      case "6months":
        setEndDate(addMonths(startDate, 6))
        break
      case "1year":
        setEndDate(addMonths(startDate, 12))
        break
      default:
        setEndDate(addMonths(startDate, 6))
    }
  }, [startDate, viewPeriod])

  // Calculate position and width for project bars
  const getProjectBarStyle = (project) => {
    const projectStart = new Date(project.startDate)
    const projectEnd = new Date(project.endDate)

    const daysFromStart = differenceInDays(projectStart, startDate)
    const projectDuration = differenceInDays(projectEnd, projectStart) + 1

    return {
      left: `${daysFromStart * dayWidth}px`,
      width: `${projectDuration * dayWidth}px`,
      height: `${rowHeight - 20}px`,
      top: '10px'
    }
  }

  // Get status colors for projects
  const getStatusColors = (status) => {
    switch (status.toLowerCase()) {
      case "not started":
        return {
          bg: "bg-gray-200 dark:bg-gray-700",
          border: "border-gray-300 dark:border-gray-600",
          text: "text-gray-800 dark:text-gray-200"
        }
      case "in progress":
        return {
          bg: "bg-blue-200 dark:bg-blue-800/40",
          border: "border-blue-300 dark:border-blue-700",
          text: "text-blue-800 dark:text-blue-200"
        }
      case "on hold":
        return {
          bg: "bg-amber-200 dark:bg-amber-800/40",
          border: "border-amber-300 dark:border-amber-700",
          text: "text-amber-800 dark:text-amber-200"
        }
      case "review":
        return {
          bg: "bg-purple-200 dark:bg-purple-800/40",
          border: "border-purple-300 dark:border-purple-700",
          text: "text-purple-800 dark:text-purple-200"
        }
      case "completed":
        return {
          bg: "bg-green-200 dark:bg-green-800/40",
          border: "border-green-300 dark:border-green-700",
          text: "text-green-800 dark:text-green-200"
        }
      default:
        return {
          bg: "bg-gray-200 dark:bg-gray-700",
          border: "border-gray-300 dark:border-gray-600",
          text: "text-gray-800 dark:text-gray-200"
        }
    }
  }

  // Handle time navigation
  const navigateTime = (direction) => {
    if (direction === 'forward') {
      setStartDate(addMonths(startDate, 1))
    } else {
      setStartDate(addMonths(startDate, -1))
    }
  }

  // Export Gantt chart as image
  const exportChart = () => {
    alert('Export functionality coming soon!')
  }

  // Handle project click
  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setShowProjectDetails(true)
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Project Timeline
              </CardTitle>
              <CardDescription>
                Visualize and manage project timelines with advanced controls
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowQuickAdd(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Gantt Chart */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="p-0">
          {/* Controls bar */}
          <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Time navigation controls */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-1 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateTime('back')}
                    className="h-8 w-8 rounded-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Select
                    value={viewPeriod}
                    onValueChange={setViewPeriod}
                  >
                    <SelectTrigger className="w-36 h-8 border-0 bg-transparent">
                      <SelectValue placeholder="View period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateTime('forward')}
                    className="h-8 w-8 rounded-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm font-medium">
                  {format(startDate, 'MMM yyyy')} - {format(endDate, 'MMM yyyy')}
                </div>
              </div>

              {/* Middle controls */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-1 flex items-center">
                  <Select
                    value={timeScale}
                    onValueChange={setTimeScale}
                  >
                    <SelectTrigger className="w-32 h-8 border-0 bg-transparent">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                        <SelectValue placeholder="Scale" />
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Daily View</SelectItem>
                      <SelectItem value="week">Weekly View</SelectItem>
                      <SelectItem value="month">Monthly View</SelectItem>
                      <SelectItem value="quarter">Quarterly View</SelectItem>
                      <SelectItem value="year">Yearly View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center rounded-md border px-3 py-1.5 gap-2 h-8 bg-white dark:bg-gray-950">
                  <ZoomOut className="h-3.5 w-3.5 text-gray-500" />
                  <Slider
                    value={[zoomLevel]}
                    min={30}
                    max={120}
                    step={5}
                    onValueChange={handleZoomChange}
                    className="w-24"
                  />
                  <ZoomIn className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle
                        pressed={showDependencies}
                        onPressedChange={setShowDependencies}
                        size="sm"
                        className="h-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
                      >
                        {showDependencies ? <Link className="h-4 w-4 mr-1.5" /> : <Unlink className="h-4 w-4 mr-1.5" />}
                        Dependencies
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show or hide dependency lines</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 h-8 bg-white dark:bg-gray-950">
                    <span className="flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 opacity-70" />
                      <SelectValue placeholder="Status" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-gray-950">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Appearance Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="color-mode" className="text-sm font-normal">Color Mode</Label>
                        <Select value={colorMode} onValueChange={setColorMode} id="color-mode">
                          <SelectTrigger className="w-24 h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="status">By Status</SelectItem>
                            <SelectItem value="priority">By Priority</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smooth-transitions" className="text-sm font-normal">Smooth Transitions</Label>
                        <Switch id="smooth-transitions" defaultChecked />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChart}
                  className="h-8 bg-white dark:bg-gray-950"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Chart content */}
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[calc(100vh-300px)] min-h-[400px]"
            orientation="both"
          >
            <div
              ref={containerRef}
              className="relative"
              style={{ width: `${250 + chartWidth}px`, height: `${projects.length * rowHeight}px` }}
            >
              {/* Background grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Horizontal grid lines */}
                {projects.map((_, i) => (
                  <div
                    key={`grid-h-${i}`}
                    className="absolute border-b border-gray-200 dark:border-gray-800 w-full"
                    style={{ top: `${(i + 1) * rowHeight}px` }}
                  />
                ))}

                {/* Today vertical line */}
                {allDays.findIndex(day => isSameDay(day, new Date())) > -1 && (
                  <div
                    className="absolute h-full border-l-2 border-blue-500 dark:border-blue-400 z-10"
                    style={{
                      left: `${250 + allDays.findIndex(day => isSameDay(day, new Date())) * dayWidth}px`,
                      opacity: 0.7
                    }}
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400" />
                  </div>
                )}

                {/* Vertical grid lines (month boundaries) */}
                {allDays.map((day, i) => {
                  if (day.getDate() === 1) {
                    return (
                      <div
                        key={`grid-v-${i}`}
                        className="absolute h-full border-l border-gray-300 dark:border-gray-700 z-1"
                        style={{ left: `${250 + i * dayWidth}px` }}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              {/* Project names column */}
              <div className="absolute left-0 top-0 bg-white dark:bg-gray-950 z-10 border-r border-gray-200 dark:border-gray-800" style={{ width: '250px' }}>
                {projects.map((project, i) => (
                  <div
                    key={`name-${project.id}`}
                    className="border-b border-gray-200 dark:border-gray-800 px-4 flex items-center"
                    style={{ height: `${rowHeight}px` }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate max-w-[200px]">{project.name}</span>
                        {project.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          project.priority === "High" ? "bg-red-100 text-red-700" :
                            project.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                              "bg-blue-100 text-blue-700"
                        )}>
                          {project.priority}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {project.team?.length || 0} members
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project bars */}
              {projects.map((project, i) => {
                const projectBarProps = getProjectBarStyle(project);
                const statusColors = getStatusColors(project.status);

                return (
                  <HoverCard key={`bar-${project.id}`} openDelay={100}>
                    <HoverCardTrigger asChild>
                      <motion.div
                        whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                        className={cn(
                          "absolute rounded-md border shadow-sm cursor-pointer",
                          statusColors.bg,
                          statusColors.border,
                          "hover:shadow-md transition-all duration-200"
                        )}
                        style={{
                          ...projectBarProps,
                          left: `${250 + parseInt(projectBarProps.left)}px`,
                          top: `${i * rowHeight + rowHeight / 4}px`,
                          height: `${rowHeight / 2}px`,
                        }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="h-full w-full relative px-2 py-1 flex items-center overflow-hidden">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium truncate text-white drop-shadow-sm">
                              {project.name}
                            </span>
                            {project.progress > 0 && (
                              <div className="mt-1">
                                <Progress
                                  value={project.progress}
                                  className="h-1 bg-white/20"
                                  indicatorClassName="bg-white"
                                />
                              </div>
                            )}
                          </div>

                          {/* Duration badge */}
                          {parseInt(projectBarProps.width) > 100 && (
                            <span className="ml-2 bg-white/20 text-white text-[9px] px-1 py-0.5 rounded">
                              {getDuration(project)} days
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-0 shadow-lg" side="top">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-t-md">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg mb-1">{project.name}</h4>
                          <Badge variant={project.status === "Completed" ? "success" :
                            project.status === "In Progress" ? "default" :
                              project.status === "On Hold" ? "warning" :
                                project.status === "Review" ? "info" : "outline"
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.description || "No description provided."}
                        </p>
                      </div>
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</h5>
                          <p className="text-sm font-medium">{format(new Date(project.startDate), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</h5>
                          <p className="text-sm font-medium">{format(new Date(project.endDate), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</h5>
                          <p className="text-sm font-medium">{getDuration(project)} days</p>
                        </div>
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</h5>
                          <p className="text-sm font-medium">{project.priority || "Medium"}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-4">Progress</h5>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mx-4">
                          <div
                            className={`h-2.5 rounded-full ${project.status === "Completed" ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1 mr-4">{project.progress || 0}%</p>
                      </div>

                      {project.team && project.team.length > 0 && (
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 px-4 mt-2">Team Members</h5>
                          <div className="flex items-center space-x-2 px-4 pb-4 mt-2">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <TooltipProvider key={member.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium border-2 border-background hover:ring-2 hover:ring-primary/20 transition-all"
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
                              {project.team.length > 3 && (
                                <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium border-2 border-background">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick actions */}
                      <div className="border-t border-gray-200 dark:border-gray-800 p-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}

              {/* Quick Add Project Button */}
              <div className="absolute bottom-4 right-4 z-20">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        onClick={() => setShowQuickAdd(true)}
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add New Project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={showProjectDetails} onOpenChange={setShowProjectDetails}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  Project details and timeline information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Project details content */}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick Add Project Dialog */}
      <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new project and add it to the timeline
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Quick add project form */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
