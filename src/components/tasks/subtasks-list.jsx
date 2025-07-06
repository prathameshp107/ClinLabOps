"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  Save,
  X,
  Edit,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTablePagination } from "@/components/tasks-v2/data-table-pagination";
import { subtaskPriorities, subtaskStatuses, mockTaskUsers } from "@/data/tasks-data";
import { addTaskSubtask, updateTaskSubtask, removeTaskSubtask } from "@/services/taskService";

// Helper function to generate unique task ID
const generateTaskId = (existingSubtasks) => {
  if (existingSubtasks.length === 0) {
    return "ST-001";
  }

  // Extract all existing ID numbers
  const existingNumbers = existingSubtasks
    .map(st => st.id)
    .filter(id => id && typeof id === 'string' && id.startsWith('ST-'))
    .map(id => {
      const match = id.match(/ST-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);

  // Find the highest number and increment by 1
  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = maxNumber + 1;

  return `ST-${nextNumber.toString().padStart(3, '0')}`;
};

// Helper functions
const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-700 border-red-200";
    case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low": return "bg-green-100 text-green-700 border-green-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700 border-green-200";
    case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
    case "not_started": return "bg-gray-100 text-gray-700 border-gray-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4" />;
    case "in_progress": return <Clock className="h-4 w-4" />;
    case "not_started": return <AlertCircle className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

// Mock table object for pagination
const createMockTable = (data, pagination, setPagination) => ({
  getFilteredRowModel: () => ({ rows: data }),
  getFilteredSelectedRowModel: () => ({ rows: [] }),
  getState: () => ({ pagination }),
  setPageSize: (pageSize) => setPagination(prev => ({ ...prev, pageSize })),
  setPageIndex: (pageIndex) => setPagination(prev => ({ ...prev, pageIndex })),
  getPageCount: () => Math.ceil(data.length / pagination.pageSize),
  getCanPreviousPage: () => pagination.pageIndex > 0,
  getCanNextPage: () => pagination.pageIndex < Math.ceil(data.length / pagination.pageSize) - 1,
  previousPage: () => setPagination(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) })),
  nextPage: () => setPagination(prev => ({
    ...prev,
    pageIndex: Math.min(Math.ceil(data.length / prev.pageSize) - 1, prev.pageIndex + 1)
  })),
});

export function SubtasksList({ task, setTask }) {
  const [subtasks, setSubtasks] = useState(() => {
    // Ensure all existing subtasks have unique IDs
    const existingSubtasks = task.subtasks || [];
    return existingSubtasks.map((st, index) => ({
      ...st,
      id: st.id || generateTaskId(existingSubtasks.slice(0, index))
    }));
  });
  const [editingId, setEditingId] = useState(null);
  const [newSubtask, setNewSubtask] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Calculate progress
  const completedSubtasks = subtasks.filter(st => st.status === "completed").length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Sort and filter subtasks
  const sortedAndFilteredSubtasks = subtasks
    .filter(st => filterStatus === "all" || st.status === filterStatus)
    .sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "assignee") {
        aVal = mockTaskUsers.find(u => u.id === a.assignee)?.name || "";
        bVal = mockTaskUsers.find(u => u.id === b.assignee)?.name || "";
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Get current page data
  const startIndex = pagination.pageIndex * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentPageSubtasks = sortedAndFilteredSubtasks.slice(startIndex, endIndex);

  // Create mock table object for pagination component
  const mockTable = createMockTable(sortedAndFilteredSubtasks, pagination, setPagination);

  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [filterStatus, sortConfig]);

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  // Add new subtask row
  const handleAddSubtask = () => {
    const newId = generateTaskId(subtasks);
    setNewSubtask({
      id: newId,
      title: "",
      assignee: mockTaskUsers[0].id,
      priority: "medium",
      status: "not_started",
      dueDate: null,
    });
    setEditingId("new");
  };

  // Save new or edited subtask
  const handleSave = async (subtask) => {
    if (!subtask.title.trim()) {
      alert("Subtask title is required");
      return;
    }
    try {
      if (editingId === "new") {
        const added = await addTaskSubtask(task.id, { ...subtask, title: subtask.title.trim() });
        setSubtasks([...subtasks, added]);
        setTask(prev => ({ ...prev, subtasks: [...(prev.subtasks || []), added] }));
        setNewSubtask(null);
      } else {
        const updated = await updateTaskSubtask(task.id, subtask.id, { ...subtask, title: subtask.title.trim() });
        setSubtasks(subtasks.map(st => st.id === subtask.id ? updated : st));
        setTask(prev => ({ ...prev, subtasks: prev.subtasks.map(st => st.id === subtask.id ? updated : st) }));
      }
      setEditingId(null);
    } catch (err) {
      alert("Failed to save subtask: " + err.message);
    }
  };

  // Edit existing subtask
  const handleEdit = (id) => {
    const subtask = subtasks.find(st => st.id === id);
    setNewSubtask({ ...subtask });
    setEditingId(id);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setNewSubtask(null);
  };

  // Delete subtask
  const handleDelete = async (id) => {
    try {
      await removeTaskSubtask(task.id, id);
      setSubtasks(subtasks.filter(st => st.id !== id));
      setTask(prev => ({ ...prev, subtasks: prev.subtasks.filter(st => st.id !== id) }));
    } catch (err) {
      alert("Failed to delete subtask: " + err.message);
    }
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setNewSubtask(prev => ({ ...prev, dueDate: date }));
  };

  // Render a row (editable or static)
  const renderRow = (subtask, isEditing) => (
    <motion.tr
      key={subtask.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "hover:bg-muted/50 transition-colors border-b border-border/50",
        isEditing && "bg-muted/30"
      )}
    >
      <TableCell className="font-mono text-sm">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          {subtask.id}
        </Badge>
      </TableCell>

      <TableCell className="font-medium">
        {isEditing ? (
          <Input
            value={subtask.title}
            onChange={e => setNewSubtask({ ...subtask, title: e.target.value })}
            placeholder="Enter subtask name..."
            className="max-w-[200px]"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className={cn(
              subtask.status === "completed" && "line-through text-muted-foreground"
            )}>
              {subtask.title}
            </span>
          </div>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={subtask.assignee}
            onValueChange={val => setNewSubtask({ ...subtask, assignee: val })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(mockTaskUsers).map(user => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {Object.values(mockTaskUsers).find(u => u.id === subtask.assignee)?.avatar || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {Object.values(mockTaskUsers).find(u => u.id === subtask.assignee)?.name || "Unassigned"}
            </span>
          </div>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={subtask.priority}
            onValueChange={val => setNewSubtask({ ...subtask, priority: val })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map(p => (
                <SelectItem key={p} value={p}>
                  <Badge variant="outline" className={getPriorityColor(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline" className={getPriorityColor(subtask.priority)}>
            {subtask.priority.charAt(0).toUpperCase() + subtask.priority.slice(1)}
          </Badge>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={subtask.status}
            onValueChange={val => setNewSubtask({ ...subtask, status: val })}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(s)}
                    {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline" className={getStatusColor(subtask.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(subtask.status)}
              {subtask.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </Badge>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <DatePicker
            selectedDate={subtask.dueDate}
            onDateChange={handleDateChange}
            placeholder="Select due date"
            className="w-[140px]"
            showClearButton={true}
            showTodayButton={true}
          />
        ) : (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {subtask.dueDate ? format(new Date(subtask.dueDate), 'MMM d, yyyy') : "No due date"}
          </div>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleSave(subtask)}
              className="h-8 px-2"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleEdit(subtask.id)}
              className="h-8 px-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(subtask.id)}
              className="h-8 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </motion.tr>
  );

  return (
    <div className="w-full space-y-4">
      {/* Header with progress */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Subtasks</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{completedSubtasks} of {subtasks.length} completed</span>
            <span>•</span>
            <span>{progress}% complete</span>
          </div>
        </div>
        <Button onClick={handleAddSubtask} variant="default" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Subtask
        </Button>
      </div>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Filters and sorting */}
      <div className="flex justify-between items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("id")}
                  className="h-auto p-0 font-medium"
                >
                  Task ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="h-auto p-0 font-medium"
                >
                  Subtask Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("assignee")}
                  className="h-auto p-0 font-medium"
                >
                  Assigned To
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("priority")}
                  className="h-auto p-0 font-medium"
                >
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-auto p-0 font-medium"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("dueDate")}
                  className="h-auto p-0 font-medium"
                >
                  Due Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {currentPageSubtasks.map(st =>
                editingId === st.id
                  ? renderRow(newSubtask || st, true)
                  : renderRow(st, false)
              )}
              {editingId === "new" && newSubtask && renderRow(newSubtask, true)}
            </AnimatePresence>

            {sortedAndFilteredSubtasks.length === 0 && (
              <TableRow className="border-b border-border/50">
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-8 w-8" />
                    <p>No subtasks found</p>
                    <p className="text-sm">Add a subtask to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedAndFilteredSubtasks.length > 0 && (
        <DataTablePagination table={mockTable} />
      )}
    </div>
  );
}