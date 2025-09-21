"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Trash2, Copy, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export function DataTableRowActions({ row, onEdit, onDelete, onStatusChange, onView }) {
  const { toast } = useToast()
  const task = row.original

  // Ensure task has an id
  const taskId = task?.id || task?._id

  const handleCopyId = () => {
    if (!taskId) return
    navigator.clipboard.writeText(taskId)
    toast({
      title: "Copied!",
      description: "Task ID copied to clipboard.",
    })
  }

  const handleStatusChange = (status) => {
    if (!taskId) return
    try {
      onStatusChange?.(taskId, status)
      toast({
        title: "Status updated",
        description: `Task marked as ${status}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    if (!taskId) return
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        onDelete?.(taskId)
        toast({
          title: "Task deleted",
          description: "The task has been deleted.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onView?.(task);
          }}
        >
          <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(task);
          }}
        >
          <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
          <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" />
          Mark In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
          <AlertCircle className="mr-2 h-3.5 w-3.5 text-amber-500" />
          Mark To Do
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("review")}>
          <AlertCircle className="mr-2 h-3.5 w-3.5 text-purple-500" />
          Mark Review
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("done")}>
          <CheckCircle className="mr-2 h-3.5 w-3.5 text-green-500" />
          Mark Done
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Copy ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
