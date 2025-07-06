"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Sparkles,
  User,
  Flag,
  Target,
  Calendar as CalendarDays
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AddTaskModal({ open, onOpenChange, project, onAddTask }) {
  const initialFormData = {
    title: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: null,
    status: "todo",
    labels: [],
    attachments: []
  }
  const [formData, setFormData] = useState(initialFormData)
  const [focusedField, setFocusedField] = useState(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData(initialFormData)
    }
  }, [open])

  const handleSubmit = () => {
    if (!formData.title.trim()) return
    let taskToSend = { ...formData }
    // Convert assignee ID to name if possible
    if (formData.assignee && project?.team) {
      const member = project.team.find(m => m.id === formData.assignee)
      if (member) {
        taskToSend.assignee = member.name
      }
    }
    onAddTask(taskToSend)
    onOpenChange(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSubmit()
    }
  }

  const priorityConfig = {
    high: { color: "text-red-500", bg: "bg-red-50 border-red-200", icon: AlertCircle },
    medium: { color: "text-amber-500", bg: "bg-amber-50 border-amber-200", icon: Clock },
    low: { color: "text-green-500", bg: "bg-green-50 border-green-200", icon: CheckCircle2 }
  }

  const statusConfig = {
    todo: { color: "text-slate-600", bg: "bg-slate-50" },
    "in-progress": { color: "text-blue-600", bg: "bg-blue-50" },
    review: { color: "text-purple-600", bg: "bg-purple-50" },
    done: { color: "text-green-600", bg: "bg-green-50" }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden p-0 gap-0 border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        {/* Header with gradient */}
        <DialogHeader className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-slate-200/50">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          <div className="relative">
            <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              Create New Task
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 mt-2 flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/70 border border-slate-200 rounded text-xs font-mono">⌘</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-white/70 border border-slate-200 rounded text-xs font-mono">Enter</kbd>
              <span className="ml-1">to save</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6 overflow-auto">
          {/* Title Input */}
          <div className="space-y-3">
            <Label htmlFor="task-name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-500" />
              Title*
            </Label>
            <div className="relative">
              <Input
                id="task-name"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "h-11 text-base border-2 transition-all duration-200 bg-white/50",
                  focusedField === 'title'
                    ? "border-indigo-300 shadow-lg shadow-indigo-100"
                    : "border-slate-200 hover:border-slate-300"
                )}
              />
              {focusedField === 'title' && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md blur-sm opacity-50"></div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="task-description" className="text-sm font-medium text-slate-700">
              Description
            </Label>
            <Textarea
              id="task-description"
              placeholder="Add more details about this task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "min-h-[100px] resize-none border-2 transition-all duration-200 bg-white/50",
                focusedField === 'description'
                  ? "border-indigo-300 shadow-lg shadow-indigo-100"
                  : "border-slate-200 hover:border-slate-300"
              )}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee */}
            <div className="space-y-3">
              <Label htmlFor="task-assignee" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-500" />
                Assignee
              </Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
              >
                <SelectTrigger
                  id="task-assignee"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 transition-all duration-200"
                >
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl">
                  {(project?.team || []).map((member, i) => (
                    <SelectItem key={i} value={member.id} className="hover:bg-indigo-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label htmlFor="task-priority" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Flag className="h-4 w-4 text-indigo-500" />
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger
                  id="task-priority"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 transition-all duration-200"
                >
                  <SelectValue placeholder="Set priority level" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl">
                  {Object.entries(priorityConfig).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <SelectItem key={key} value={key} className="hover:bg-indigo-50">
                        <div className={cn("flex items-center gap-3 p-2 rounded-md", config.bg)}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-3">
              <Label htmlFor="task-status" className="text-sm font-medium text-slate-700">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger
                  id="task-status"
                  className="h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 transition-all duration-200"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl">
                  <SelectItem value="todo" className="hover:bg-indigo-50">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-slate-50">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <span>To Do</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress" className="hover:bg-indigo-50">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-blue-50">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span>In Progress</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="review" className="hover:bg-indigo-50">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-purple-50">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <span>In Review</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="done" className="hover:bg-indigo-50">
                    <div className="flex items-center gap-3 p-2 rounded-md bg-green-50">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span>Done</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-3">
              <Label htmlFor="task-due-date" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11 border-2 border-slate-200 hover:border-slate-300 bg-white/50 transition-all duration-200",
                      !formData.dueDate && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4 w-4 text-indigo-500" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                    initialFocus
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-500" />
              Labels
            </Label>
            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 border-2 border-slate-200 rounded-lg bg-white/50 transition-all duration-200 hover:border-slate-300">
              {formData.labels.map((label, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 hover:from-red-100 hover:to-red-200 hover:text-red-700 hover:border-red-200 cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={() => setFormData({
                    ...formData,
                    labels: formData.labels.filter((_, index) => index !== i)
                  })}
                >
                  {label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              <Input
                placeholder="Add label and press Enter..."
                className="border-0 h-7 text-sm bg-transparent focus:ring-0 focus:border-0 flex-1 min-w-[160px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setFormData({
                      ...formData,
                      labels: [...formData.labels, e.target.value.trim()]
                    })
                    e.target.value = ""
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200/50">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-300 hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200 transition-all duration-200 transform hover:scale-105 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:transform-none"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}