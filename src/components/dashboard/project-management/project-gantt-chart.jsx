"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Calendar, AlertCircle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  ArrowLeftRight, Eye, EyeOff, Filter, Download, Link, Unlink,
  Settings, Palette, SlidersHorizontal, Clock, CalendarDays, CalendarRange
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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

// Helper function to calculate project duration
const getDuration = (project) => {
  return differenceInDays(new Date(project.endDate), new Date(project.startDate)) + 1
}

export function ProjectGanttChart({ projects, dependencies = [] }) {
  const scrollAreaRef = useRef(null)
  const containerRef = useRef(null)

  const [zoomLevel, setZoomLevel] = useState(60) // Controls day width
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addMonths(new Date(), 6))
  const [viewPeriod, setViewPeriod] = useState("6months") // 3months, 6months, 1year
  const [timeScale, setTimeScale] = useState("month") // day, week, month, quarter, year
  const [showDependencies, setShowDependencies] = useState(true)
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [visibleProjects, setVisibleProjects] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [colorMode, setColorMode] = useState("status") // status, priority, custom
  const [customColors, setCustomColors] = useState({
    "p1": "#4f46e5", // indigo
    "p2": "#0ea5e9", // sky
    "p3": "#8b5cf6", // violet
    "p4": "#ec4899", // pink
    "p5": "#10b981", // emerald
    "p6": "#f59e0b", // amber
  })

  // Calculate dates for display based on timeScale
  const getDayWidth = () => {
    switch (timeScale) {
      case "day": return zoomLevel
      case "week": return Math.max(zoomLevel / 2, 20) // Ensure minimum width to prevent overlap
      case "month": return Math.max(zoomLevel / 3, 15) // Ensure minimum width to prevent overlap
      case "quarter": return Math.max(zoomLevel / 6, 12) // Ensure minimum width to prevent overlap
      case "year": return Math.max(zoomLevel / 12, 10) // Ensure minimum width to prevent overlap
      default: return zoomLevel
    }
  }

  const dayWidth = getDayWidth()
  const cellWidth = dayWidth
  const headerHeight = 70 // Increased height for better visibility
  const rowHeight = 70 // Increased for better spacing
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

    // Sort projects by start date
    filtered.sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate)
    })

    setVisibleProjects(filtered)

    // Set the start date to the earliest project start date if available
    if (filtered.length > 0) {
      const earliestDate = filtered.reduce((earliest, project) => {
        const projectStart = new Date(project.startDate)
        return projectStart < earliest ? projectStart : earliest
      }, new Date(filtered[0].startDate))

      // Set start date to 5 days before the earliest project
      setStartDate(addDays(earliestDate, -5))
    }
  }, [projects, filterPriority, filterStatus])

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

    // Calculate position
    const daysFromStart = differenceInDays(projectStart, startDate)
    const projectDuration = differenceInDays(projectEnd, projectStart) + 1

    // Return position and width values
    return {
      left: `${daysFromStart * dayWidth}px`,
      width: `${projectDuration * dayWidth}px`,
      height: `${rowHeight - 20}px`,
      top: '10px'
    }
  }

  // Returns true if the date should be highlighted as a month boundary
  const isMonthStart = (date, index) => {
    return index === 0 || !isSameMonth(date, days[index - 1])
  }

  // Get CSS class for today
  const getTodayClass = (date) => {
    return isSameDay(date, new Date()) ? 'bg-blue-100 dark:bg-blue-900/20 font-bold' : ''
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
      case "pending":
        return {
          bg: "bg-orange-200 dark:bg-orange-800/40",
          border: "border-orange-300 dark:border-orange-700",
          text: "text-orange-800 dark:text-orange-200"
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

  // Export Gantt chart as image (simplified version - in a real app, would use html2canvas or similar)
  const exportChart = () => {
    alert('In a production app, this would export the Gantt chart as an image or PDF')
  }

  // Draw dependency lines (simplified)
  const renderDependencies = () => {
    if (!showDependencies || !dependencies.length) return null

    return dependencies.map((dep, index) => {
      const sourceProject = projects.find(p => p.id === dep.sourceId)
      const targetProject = projects.find(p => p.id === dep.targetId)

      if (!sourceProject || !targetProject) return null

      // Get source and target project indexes in the visible projects array
      const sourceIndex = visibleProjects.findIndex(p => p.id === sourceProject.id)
      const targetIndex = visibleProjects.findIndex(p => p.id === targetProject.id)

      if (sourceIndex === -1 || targetIndex === -1) return null

      // Calculate positions based on project dates and type
      const sourceDate = dep.type.startsWith('start') ?
        new Date(sourceProject.startDate) : new Date(sourceProject.endDate)
      const targetDate = dep.type.endsWith('start') ?
        new Date(targetProject.startDate) : new Date(targetProject.endDate)

      const sourceLeft = differenceInDays(sourceDate, startDate) * dayWidth + (dayWidth / 2)
      const targetLeft = differenceInDays(targetDate, startDate) * dayWidth + (dayWidth / 2)

      const sourceTop = (sourceIndex * rowHeight) + (rowHeight / 2)
      const targetTop = (targetIndex * rowHeight) + (rowHeight / 2)

      // Simple diagonal line parameters
      const pathStyle = {
        stroke: '#888',
        strokeWidth: 1.5,
        strokeDasharray: '5,5',
        fill: 'none',
        markerEnd: 'url(#arrowhead)'
      }

      return (
        <g key={`dep-${index}`}>
          <path
            d={`M ${sourceLeft} ${sourceTop} C ${(sourceLeft + targetLeft) / 2} ${sourceTop}, ${(sourceLeft + targetLeft) / 2} ${targetTop}, ${targetLeft} ${targetTop}`}
            style={pathStyle}
          />
        </g>
      )
    })
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          Project Timeline (Gantt Chart)
        </CardTitle>
        <CardDescription>
          Visualize project timelines and dependencies with advanced timeline controls
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Controls bar with glassmorphism effect */}
        <div className="p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
          <div className="flex flex-wrap justify-between items-center gap-3">
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

            {/* Middle group - timeline scale */}
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
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-wrap">
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

        <div className="relative border-t">
          {/* Chart Header */}
          <div
            className="sticky top-0 z-10 flex border-b bg-white dark:bg-gray-950"
            style={{ height: `${headerHeight}px` }}
          >
            {/* Empty cell for project names column */}
            <div
              className="border-r bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center px-4"
              style={{ width: '250px', minWidth: '250px' }}
            >
              <span className="font-medium text-sm">Projects</span>
            </div>

            {/* Timeline headers */}
            <div className="flex overflow-hidden" style={{ width: `${chartWidth}px` }}>
              {/* Month headers */}
              <div className="absolute left-0 top-0 flex border-b border-gray-200 dark:border-gray-800" style={{ height: `${headerHeight / 2}px` }}>
                {allDays.map((day, i) => {
                  // Only show month headers on the first day of the month to prevent overlap
                  if (i === 0 || day.getDate() === 1) {
                    // Get month width based on days in month
                    const monthStart = new Date(day.getFullYear(), day.getMonth(), 1);
                    const monthEnd = new Date(day.getFullYear(), day.getMonth() + 1, 0);
                    const daysInMonth = monthEnd.getDate();
                    const monthWidth = Math.max(daysInMonth * dayWidth, 60); // Ensure minimum width

                    return (
                      <div
                        key={`month-${i}`}
                        className="border-r border-gray-200 dark:border-gray-800 flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent"
                        style={{ width: `${monthWidth}px`, height: '100%' }}
                      >
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {format(day, 'MMMM yyyy')}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Day headers */}
              <div className="absolute left-0 top-0 flex" style={{ marginTop: `${headerHeight / 2}px` }}>
                {allDays.map((day, i) => {
                  const isWeekend = [0, 6].includes(day.getDay());
                  const isToday = isSameDay(day, new Date());
                  let dayClasses = "border-r border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-xs";

                  if (isWeekend) {
                    dayClasses += " bg-gray-50 dark:bg-gray-900/50";
                  }

                  if (isToday) {
                    dayClasses += " bg-blue-50 dark:bg-blue-900/20 font-medium";
                  }

                  // Show simplified day content based on zoom level
                  const shouldShowDate = dayWidth >= 15 || day.getDate() === 1 || isToday;
                  
                  return (
                    <div
                      key={`day-${i}`}
                      className={dayClasses}
                      style={{ width: `${dayWidth}px`, height: `${headerHeight / 2}px` }}
                    >
                      {shouldShowDate ? (
                        <>
                          <span className={`${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                            {format(day, 'd')}
                          </span>
                          {dayWidth >= 25 && (
                            <span className="text-[9px] text-gray-400">
                              {format(day, 'EEE')}
                            </span>
                          )}
                          {isToday && dayWidth >= 20 && (
                            <span className="text-[8px] text-blue-600 font-medium">Today</span>
                          )}
                        </>
                      ) : isToday ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      ) : null}
                    </div>
                  );
                })}
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
                      <span className="font-medium truncate max-w-[200px]">{project.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{project.id}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project bars */}
              {projects.map((project, i) => {
                const projectBarProps = getProjectBarStyle(project);

                // Skip if project is filtered out
                if (filterStatus !== "all" && project.status !== filterStatus) {
                  return null;
                }

                // Determine color based on color mode
                let barColor;
                if (colorMode === "status") {
                  const statusColors = getStatusColors(project.status);
                  barColor = statusColors.bg;
                } else if (colorMode === "priority") {
                  switch (project.priority?.toLowerCase()) {
                    case "high":
                      barColor = "bg-red-500 dark:bg-red-600";
                      break;
                    case "medium":
                      barColor = "bg-amber-500 dark:bg-amber-600";
                      break;
                    case "low":
                      barColor = "bg-blue-500 dark:bg-blue-600";
                      break;
                    case "critical":
                      barColor = "bg-purple-500 dark:bg-purple-600";
                      break;
                    default:
                      barColor = "bg-gray-500 dark:bg-gray-600";
                  }
                } else {
                  // Custom color mode with gradient
                  const colorKey = `p${parseInt(project.id.replace(/\D/g, '')) % 6 + 1}`;
                  const hexColor = customColors[colorKey] || "#4f46e5";
                  barColor = ""; // Custom style will be applied
                }

                // Calculate project duration for display
                const projectStart = new Date(project.startDate);
                const projectEnd = new Date(project.endDate);
                const duration = differenceInDays(projectEnd, projectStart) + 1;
                const durationDisplay = duration > 1 ? `${duration} days` : `${duration} day`;

                return (
                  <HoverCard key={`bar-${project.id}`} openDelay={100}>
                    <HoverCardTrigger asChild>
                      <motion.div
                        whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                        className={`absolute rounded-md border border-gray-300 dark:border-gray-700 shadow-sm cursor-pointer
                          ${barColor} hover:shadow-md transition-all duration-200 flex items-center`}
                        style={{
                          ...projectBarProps,
                          left: `${250 + parseInt(projectBarProps.left)}px`,
                          top: `${i * rowHeight + rowHeight / 4}px`,
                          height: `${rowHeight / 2}px`,
                          background: colorMode === "custom" ?
                            `linear-gradient(90deg, ${customColors[`p${parseInt(project.id.replace(/\D/g, '')) % 6 + 1}`]} 0%, ${customColors[`p${(parseInt(project.id.replace(/\D/g, '')) % 6 + 1) % 6 + 1}`]} 100%)` : undefined
                        }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <div className="h-full w-full relative px-2 py-1 flex items-center overflow-hidden">
                          <span className="text-xs font-medium truncate text-white drop-shadow-sm">
                            {project.name}
                          </span>

                          {/* Duration badge for bars with sufficient width */}
                          {parseInt(projectBarProps.width) > 100 && (
                            <span className="ml-2 bg-white/20 text-white text-[9px] px-1 py-0.5 rounded">
                              {durationDisplay}
                            </span>
                          )}

                          {project.completion > 0 && project.completion < 100 && (
                            <div
                              className="absolute top-0 left-0 h-full bg-black/20 dark:bg-white/10 rounded-l-md"
                              style={{ width: `${project.completion}%` }}
                            />
                          )}

                          {/* Add milestone markers for long projects */}
                          {duration > 7 && project.milestones?.map((milestone, idx) => {
                            const milestoneDate = new Date(milestone.date);
                            const daysFromStart = differenceInDays(milestoneDate, projectStart);
                            const position = (daysFromStart / duration) * 100;

                            if (position >= 0 && position <= 100) {
                              return (
                                <div
                                  key={`milestone-${idx}`}
                                  className="absolute top-0 h-full w-1 bg-white/50 flex items-center justify-center"
                                  style={{ left: `${position}%` }}
                                  title={milestone.name}
                                >
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                              );
                            }
                            return null;
                          })}
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
                          <p className="text-sm font-medium">{durationDisplay}</p>
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
                            style={{ width: `${project.completion || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1 mr-4">{project.completion || 0}%</p>
                      </div>

                      {project.assignedTo && (
                        <div>
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 px-4 mt-2">Assigned To</h5>
                          <div className="flex items-center space-x-2 px-4 pb-4 mt-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-xs">{project.assignedTo.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <span className="text-sm font-medium">{project.assignedTo}</span>
                          </div>
                        </div>
                      )}

                      {/* Add upcoming milestones section */}
                      {project.milestones && project.milestones.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                          <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-2">Milestones</h5>
                          <div className="space-y-2">
                            {project.milestones.map((milestone, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                                  <span className="text-sm">{milestone.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(milestone.date), 'MMM d, yyyy')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add quick actions */}
                      <div className="border-t border-gray-200 dark:border-gray-800 p-2 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}

              {/* Add new "Quick Add Project" button */}
              <div className="absolute bottom-4 right-4 z-20">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        onClick={() => alert("Quick add project feature coming soon!")}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
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
        </div>
      </CardContent>
    </Card>
  )
}
