"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  CheckSquare, 
  Plus, 
  Trash, 
  GripVertical, 
  Edit, 
  Calendar, 
  Clock, 
  User, 
  Flag, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  X,
  Trash2,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockUsers = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

const priorities = ["high", "medium", "low"];
const statuses = ["not_started", "in_progress", "completed"];

export function SubtasksList({ task, setTask }) {
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [editingId, setEditingId] = useState(null);
  const [newSubtask, setNewSubtask] = useState(null);

  // Add new subtask row
  const handleAddSubtask = () => {
    setNewSubtask({
      id: `ST-${Date.now()}`,
      title: "",
      assignee: mockUsers[0].id,
      priority: "medium",
      status: "not_started",
      dueDate: "",
    });
    setEditingId("new");
  };

  // Save new or edited subtask
  const handleSave = (subtask) => {
    if (editingId === "new") {
      setSubtasks([...subtasks, subtask]);
      setNewSubtask(null);
    } else {
      setSubtasks(subtasks.map(st => st.id === subtask.id ? subtask : st));
    }
    setEditingId(null);
  };

  // Edit existing subtask
  const handleEdit = (id) => {
    setEditingId(id);
    setNewSubtask(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setNewSubtask(null);
  };

  // Delete subtask
  const handleDelete = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
    if (editingId === id) handleCancel();
  };

  // Render a row (editable or static)
  const renderRow = (subtask, isEditing) => (
    <TableRow key={subtask.id}>
      <TableCell>
                      {isEditing ? (
                        <Input
            value={subtask.title}
            onChange={e => setNewSubtask({ ...subtask, title: e.target.value })}
            placeholder="Subtask Name"
                        />
                      ) : (
          subtask.title
        )}
      </TableCell>
      <TableCell>
                      {isEditing ? (
          <Select
            value={subtask.assignee}
            onValueChange={val => setNewSubtask({ ...subtask, assignee: val })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          mockUsers.find(u => u.id === subtask.assignee)?.name || "-"
        )}
      </TableCell>
      <TableCell>
                      {isEditing ? (
          <Select
            value={subtask.priority}
            onValueChange={val => setNewSubtask({ ...subtask, priority: val })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {priorities.map(p => (
                <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          subtask.priority.charAt(0).toUpperCase() + subtask.priority.slice(1)
        )}
      </TableCell>
      <TableCell>
                    {isEditing ? (
          <Select
            value={subtask.status}
            onValueChange={val => setNewSubtask({ ...subtask, status: val })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          subtask.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        )}
      </TableCell>
      <TableCell>
                    {isEditing ? (
                        <Input
                          type="date"
            value={subtask.dueDate ? format(new Date(subtask.dueDate), 'yyyy-MM-dd') : ''}
            onChange={e => setNewSubtask({ ...subtask, dueDate: e.target.value })}
                        />
                      ) : (
          subtask.dueDate ? format(new Date(subtask.dueDate), 'MMM d, yyyy') : "-"
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="icon" variant="success" onClick={() => handleSave(subtask)}><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}><X className="h-4 w-4" /></Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => handleEdit(subtask.id)}><Save className="h-4 w-4" /></Button>
            <Button size="icon" variant="destructive" onClick={() => handleDelete(subtask.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Subtasks</h3>
        <Button onClick={handleAddSubtask} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add Subtask</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subtask Name</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtasks.map(st =>
            editingId === st.id
              ? renderRow(newSubtask || st, true)
              : renderRow(st, false)
          )}
          {editingId === "new" && newSubtask && renderRow(newSubtask, true)}
        </TableBody>
      </Table>
    </div>
  );
}