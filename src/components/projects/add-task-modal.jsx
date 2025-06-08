"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Paperclip, Tag, AlertCircle, CheckCircle2, Clock, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddTaskModal({ open, onOpenChange, project, onAddTask }) {
  const [activeTab, setActiveTab] = useState("details")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: null,
    status: "todo",
    labels: [],
    attachments: []
  })

  const handleSubmit = () => {
    if (!formData.title.trim()) return
    onAddTask(formData)
    onOpenChange(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.metaKey) {
      handleSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-lg bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 mt-1.5">
            Add a new task to your project. Press ⌘+Enter to save.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4 px-6">
            <TabsTrigger value="details" className="rounded-l-md">Task Details</TabsTrigger>
            <TabsTrigger value="attachments" className="rounded-r-md">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-2 space-y-6 px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name" className="text-sm font-medium flex items-center gap-2">
                  <span className="bg-primary/10 p-1 rounded-full">
                    <Plus className="h-3.5 w-3.5 text-primary" />
                  </span>
                  Title*
                </Label>
                <Input
                  id="task-name"
                  placeholder="Enter task name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="focus-visible:ring-primary/70 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px] focus-visible:ring-primary/70 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-assignee" className="text-sm font-medium">Assignee</Label>
                  <Select
                    value={formData.assignee}
                    onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                  >
                    <SelectTrigger id="task-assignee" className="focus-visible:ring-primary/70">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {(project?.team || []).map((member, i) => (
                        <SelectItem key={i} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-priority" className="text-sm font-medium">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="task-priority" className="focus-visible:ring-primary/70">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span>High</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>Medium</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Low</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-status" className="text-sm font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="task-status" className="focus-visible:ring-primary/70">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-due-date" className="text-sm font-medium">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Labels
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.labels.map((label, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
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
                    placeholder="Add label..."
                    className="w-32 h-7 text-sm"
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
          </TabsContent>

          <TabsContent value="attachments" className="pt-2 space-y-6 px-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to upload</p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-border/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title.trim()}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}