"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  MoreHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function TaskList({ tasks, compact = false }) {
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [expandedTask, setExpandedTask] = useState(null);

  // Sort tasks based on current sort configuration
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950/30';
      case 'Medium':
        return 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/30';
      case 'Low':
        return 'text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30';
      default:
        return '';
    }
  };

  const toggleTaskExpand = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Checkbox id={`task-${task.id}`} checked={task.status === 'Completed'} />
              <div>
                <label 
                  htmlFor={`task-${task.id}`} 
                  className={`font-medium cursor-pointer ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{task.projectName}</span>
                  <span>•</span>
                  <span>Due {task.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                <span>{task.status}</span>
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('title')}>
              Title
              {sortConfig.key === 'title' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('projectName')}>
              Project
              {sortConfig.key === 'projectName' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('dueDate')}>
              Due Date
              {sortConfig.key === 'dueDate' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('priority')}>
              Priority
              {sortConfig.key === 'priority' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
              )}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
              Status
              {sortConfig.key === 'status' && (
                sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
              )}
            </TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <>
              <TableRow 
                key={task.id} 
                className={`${expandedTask === task.id ? 'border-b-0' : ''} ${task.status === 'Completed' ? 'bg-muted/50' : ''}`}
              >
                <TableCell>
                  <Checkbox id={`task-${task.id}`} checked={task.status === 'Completed'} />
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`cursor-pointer ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${task.projectColor || 'bg-primary'}`}></div>
                    {task.projectName}
                  </div>
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span>{task.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => toggleTaskExpand(task.id)}
                          >
                            {expandedTask === task.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{expandedTask === task.id ? 'Hide details' : 'Show details'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              {expandedTask === task.id && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={7} className="p-4">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-muted-foreground">{task.description || 'No description provided.'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Details</h4>
                          <div className="space-y-1 text-muted-foreground">
                            <p><span className="font-medium text-foreground">Created by:</span> {task.createdBy}</p>
                            <p><span className="font-medium text-foreground">Created on:</span> {task.createdDate}</p>
                            <p><span className="font-medium text-foreground">Last updated:</span> {task.updatedDate || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button size="sm" className="gap-1">
                          <ArrowRight className="h-4 w-4" />
                          <span>Open Task</span>
                        </Button>
                      </div>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}