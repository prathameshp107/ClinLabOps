import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format, isToday, isTomorrow, isPast, isThisWeek, isThisYear } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, Flag, User, Folder, MoreVertical, CheckCircle, Clock as ClockIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import UserAvatar from "@/components/tasks/user-avatar"

export function TaskGrid({ tasks = [], selectedTasks = [], onTaskSelect, onTaskClick }) {
    const [hoveredTask, setHoveredTask] = React.useState(null)

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-300 dark:border-red-700 shadow-red-100/30'
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700 shadow-yellow-100/30'
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-300 dark:border-green-700 shadow-green-100/30'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border-gray-300 dark:border-gray-700 shadow-gray-100/20'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-200 text-green-900 dark:bg-green-900/50 dark:text-green-300 border-green-400 dark:border-green-700 shadow-green-200/30'
            case 'in-progress': return 'bg-blue-200 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300 border-blue-400 dark:border-blue-700 shadow-blue-200/30'
            case 'pending': return 'bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 border-amber-400 dark:border-amber-700 shadow-amber-200/30'
            default: return 'bg-gray-200 text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 border-gray-400 dark:border-gray-700 shadow-gray-200/20'
        }
    }


    const formatDueDate = (dateString) => {
        if (!dateString) return 'No due date'
        const date = new Date(dateString)
        if (isToday(date)) return 'Today'
        if (isTomorrow(date)) return 'Tomorrow'
        if (isPast(date)) return `Overdue: ${format(date, 'MMM d')}`
        if (isThisWeek(date)) return format(date, 'EEEE')
        if (isThisYear(date)) return format(date, 'MMM d')
        return format(date, 'MMM d, yyyy')
    }

    const getProgressValue = (status) => {
        switch (status) {
            case 'pending': return 30
            case 'in-progress': return 65
            case 'completed': return 100
            default: return 0
        }
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No tasks found
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 p-2 w-full">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={cn(
                            "relative border rounded-2xl p-5 transition-all duration-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 hover:shadow-2xl group h-full flex flex-col overflow-hidden",
                            "dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/50",
                            selectedTasks.includes(task.id) && "ring-2 ring-primary/60 border-primary/40 scale-[1.02]",
                            hoveredTask === task.id && "shadow-xl scale-[1.01] border-primary/30",
                            onTaskClick && "cursor-pointer"
                        )}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                        onClick={() => onTaskClick?.(task)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onTaskClick?.(task);
                            }
                        }}
                        tabIndex={onTaskClick ? 0 : -1}
                        role={onTaskClick ? 'button' : 'article'}
                        aria-label={`Task: ${task.title || 'Untitled Task'}. Click to view details.`}
                    >
                        {/* Status Badge - now top right, floating */}
                        <div className="absolute top-4 right-4 z-10">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-full px-3 py-1 text-xs font-bold border shadow-md drop-shadow-md",
                                    getStatusColor(task.status)
                                )}
                            >
                                {task.status?.replace('-', ' ') || 'No status'}
                            </Badge>
                        </div>

                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        checked={selectedTasks.includes(task.id)}
                                        onCheckedChange={(checked) => onTaskSelect?.(task.id, checked)}
                                        onClick={(e) => e.stopPropagation()}
                                        className={cn(
                                            "h-5 w-5 rounded-md border-2 transition-opacity focus:ring-2 focus:ring-primary/60 focus:border-primary/60",
                                            (hoveredTask === task.id || selectedTasks.includes(task.id))
                                                ? "opacity-100"
                                                : "opacity-0 group-hover:opacity-100"
                                        )}
                                    />
                                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 dark:text-gray-100">
                                        {task.title || 'Untitled Task'}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Task Progress */}
                        <div className="mb-5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span className="font-semibold">{getProgressValue(task.status)}%</span>
                            </div>
                            <Progress value={getProgressValue(task.status)} className="h-2 rounded-full transition-all duration-500" style={{ transition: 'width 0.5s' }} />
                        </div>

                        {/* Task Meta - improved layout and value highlighting */}
                        <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-900/30 rounded-lg px-3 py-2 mb-2 border border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {/* Due */}
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                                    <span>Due</span>
                                </div>
                                <div className={cn(
                                    "flex items-center font-semibold justify-end",
                                    task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-blue-700 dark:text-blue-300'
                                )}>
                                    {task.status === 'completed' ? (
                                        <span className="flex items-center text-green-600 dark:text-green-400">
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Completed
                                        </span>
                                    ) : task.dueDate && isPast(new Date(task.dueDate)) ? (
                                        <span className="flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1 animate-bounce" />
                                            {formatDueDate(task.dueDate)}
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
                                        </span>
                                    )}
                                </div>
                                {/* Assigned */}
                                <div className="flex items-center text-muted-foreground">
                                    <User className="h-4 w-4 mr-2 opacity-70" />
                                    <span>Assigned</span>
                                </div>
                                <div className="flex items-center justify-end font-semibold text-gray-800 dark:text-gray-100">
                                    <UserAvatar user={task.assignedTo} size="sm" />
                                </div>
                                {/* Project */}
                                <div className="flex items-center text-muted-foreground">
                                    <Folder className="h-4 w-4 mr-2 opacity-70" />
                                    <span>Project</span>
                                </div>
                                <div className="flex items-center justify-end font-semibold text-gray-700 dark:text-gray-200">
                                    <span className="truncate">{task.project?.name || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Task Footer */}
                        <div className="mt-auto pt-4 border-t flex items-center justify-between gap-2">
                            <div className="flex -space-x-2">
                                <UserAvatar user={task.assignedTo} size="sm" />
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                                {task.createdAt && `Created ${format(new Date(task.createdAt), 'MMM d, yyyy')}`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TooltipProvider>
    )
}
