"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  CalendarClock,
  ClipboardEdit,
  Eye,
  Trash2,
  AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Helper to check if a date is in the past
const isPastDue = (dateString) => {
  const dueDate = new Date(dateString);
  const now = new Date();
  return dueDate < now;
};

export const TaskTable = ({
  tasks = [],
  onTaskClick,
  onSelectionChange = () => { },
  selectedTasks = []
}) => {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc"
  });

  // Function to get the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700">To Do</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700">In Progress</Badge>;
      case "review":
        return <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-200 border-yellow-200 text-yellow-700">Review</Badge>;
      case "done":
        return <Badge variant="outline" className="bg-green-100 hover:bg-green-200 border-green-200 text-green-700">Done</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 hover:bg-red-200 border-red-200 text-red-700">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-orange-100 hover:bg-orange-200 border-orange-200 text-orange-700">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 hover:bg-green-200 border-green-200 text-green-700">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Function to get sort direction icon
  const getSortDirectionIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1" />
      );
    }
    return null;
  };

  // Column headers
  const columns = [
    { name: "name", label: "Task Name" },
    { name: "experimentName", label: "Experiment" },
    { name: "assignedTo", label: "Assigned To" },
    { name: "priority", label: "Priority" },
    { name: "status", label: "Status" },
    { name: "dueDate", label: "Due Date" },
    { name: "actions", label: "Actions" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-md border"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">
              <Checkbox
                checked={selectedTasks.length > 0 && selectedTasks.length === tasks.length}
                onCheckedChange={(checked) => {
                  if (typeof onSelectionChange === 'function') {
                    if (checked) {
                      // Select all tasks
                      onSelectionChange(tasks.map(task => task.id));
                    } else {
                      // Deselect all tasks
                      onSelectionChange([]);
                    }
                  }
                }}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.name} className={column.name === "actions" ? "w-[80px]" : ""}>
                {column.name !== "actions" ? (
                  <Button
                    variant="ghost"
                    className="p-0 font-medium flex items-center"
                    onClick={() => setSortConfig({
                      key: column.name,
                      direction: sortConfig.direction === "asc" ? "desc" : "asc"
                    })}
                  >
                    {column.label}
                    {getSortDirectionIcon(column.name)}
                  </Button>
                ) : (
                  column.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-accent/30"
              >
                <TableCell
                  className="w-[30px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={(checked) => {
                        if (typeof onSelectionChange === 'function') {
                          const newSelectedTasks = checked
                            ? [...selectedTasks, task.id]
                            : selectedTasks.filter(id => id !== task.id);
                          onSelectionChange(newSelectedTasks);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell
                  className="font-medium"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="max-w-md truncate">
                    {task.title || task.name}
                    {task.dependencies?.length > 0 && (
                      <span className="ml-2 inline-flex items-center">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >{task.experimentName}</TableCell>
                <TableCell
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignedTo.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >{getPriorityBadge(task.priority)}</TableCell>
                <TableCell
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >{getStatusBadge(task.status)}</TableCell>
                <TableCell
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="flex items-center">
                    <CalendarClock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span className={isPastDue(task.dueDate) && task.status !== "done" ? "text-red-500 font-medium" : ""}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tasks/${task.id}`);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick("edit", task);
                      }}>
                        <ClipboardEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {task.status !== "done" && (
                        <>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            const newStatus = task.status === "todo" ? "in-progress" :
                              task.status === "in-progress" ? "review" : "done";
                            onTaskClick("statusChange", { ...task, status: newStatus });
                          }}>
                            {task.status === "todo" ? "Mark as In Progress" :
                              task.status === "in-progress" ? "Mark as Review" : "Mark as Done"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick("delete", task);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};
