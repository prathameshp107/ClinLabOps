"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BriefcaseMedical, 
  Clock, 
  Search, 
  Plus, 
  Filter, 
  ListFilter, 
  LayoutGrid, 
  ListChecks,
  Users,
  Trash2,
  CalendarClock,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

import { TaskTable } from "./task-management/task-table"
import { TaskBoard } from "./task-management/task-board"
import { TaskDetailsDialog } from "./task-management/task-details-dialog"
import { TaskFormDialog } from "./task-management/task-form-dialog"
import { TaskDeleteDialog } from "./task-management/task-delete-dialog"

// Mock data for tasks - in a real application this would come from an API
const mockTasks = [
  {
    id: 't1',
    name: 'Analyze blood samples for Project XYZ',
    experimentName: 'Compound A Toxicity Study',
    assignedTo: {
      id: 'u1',
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ'
    },
    priority: 'high',
    status: 'pending',
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    attachments: [
      { id: 'a1', name: 'protocol.pdf', type: 'pdf', size: '2.4 MB' }
    ],
    dependencies: [],
    activityLog: [
      {
        id: 'al1',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      }
    ]
  },
  {
    id: 't2',
    name: 'Prepare cell cultures for experiment',
    experimentName: 'Compound B Efficacy Test',
    assignedTo: {
      id: 'u3',
      name: 'Alex Wong',
      avatar: 'AW'
    },
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    attachments: [],
    dependencies: [],
    activityLog: [
      {
        id: 'al2',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al3',
        userId: 'u3',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        details: 'Status changed from "pending" to "in-progress"'
      }
    ]
  },
  {
    id: 't3',
    name: 'Document experiment results',
    experimentName: 'Compound A Toxicity Study',
    assignedTo: {
      id: 'u4',
      name: 'Emily Chen',
      avatar: 'EC'
    },
    priority: 'low',
    status: 'completed',
    dueDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (past due)
    createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    attachments: [
      { id: 'a2', name: 'results.xlsx', type: 'excel', size: '1.2 MB' },
      { id: 'a3', name: 'images.zip', type: 'zip', size: '18.5 MB' }
    ],
    dependencies: ['t1'],
    activityLog: [
      {
        id: 'al4',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al5',
        userId: 'u4',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
        details: 'Status changed from "pending" to "in-progress"'
      },
      {
        id: 'al6',
        userId: 'u4',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        details: 'Status changed from "in-progress" to "completed"'
      }
    ]
  },
  {
    id: 't4',
    name: 'Set up equipment for microscopy',
    experimentName: 'Compound C Cellular Study',
    assignedTo: {
      id: 'u5',
      name: 'James Wilson',
      avatar: 'JW'
    },
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    attachments: [
      { id: 'a4', name: 'equipment_manual.pdf', type: 'pdf', size: '4.8 MB' }
    ],
    dependencies: [],
    activityLog: [
      {
        id: 'al7',
        userId: 'u1',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      },
      {
        id: 'al8',
        userId: 'u5',
        action: 'updated',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
        details: 'Status changed from "pending" to "in-progress"'
      }
    ]
  },
  {
    id: 't5',
    name: 'Analyze data from previous experiment',
    experimentName: 'Compound B Efficacy Test',
    assignedTo: {
      id: 'u1',
      name: 'Dr. Sarah Johnson',
      avatar: 'SJ'
    },
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    attachments: [],
    dependencies: ['t2'],
    activityLog: [
      {
        id: 'al9',
        userId: 'u2',
        action: 'created',
        timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Task created'
      }
    ]
  }
];

// Mock data for users
const mockUsers = {
  'u1': { id: 'u1', name: 'Dr. Sarah Johnson', avatar: 'SJ', role: 'scientist' },
  'u2': { id: 'u2', name: 'Dr. Michael Lee', avatar: 'ML', role: 'admin' },
  'u3': { id: 'u3', name: 'Alex Wong', avatar: 'AW', role: 'technician' },
  'u4': { id: 'u4', name: 'Emily Chen', avatar: 'EC', role: 'scientist' },
  'u5': { id: 'u5', name: 'James Wilson', avatar: 'JW', role: 'technician' },
};

// Mock experiments data
const mockExperiments = [
  { id: 'e1', name: 'Compound A Toxicity Study' },
  { id: 'e2', name: 'Compound B Efficacy Test' },
  { id: 'e3', name: 'Compound C Cellular Study' },
  { id: 'e4', name: 'Biomarker Analysis Project' },
];

export const TaskManagement = () => {
  // State for tasks
  const [tasks, setTasks] = useState(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  
  // State for view mode
  const [viewMode, setViewMode] = useState("list");
  
  // State for dialogs
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskFormDialog, setShowTaskFormDialog] = useState(false); 
  const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create or edit
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [experimentFilter, setExperimentFilter] = useState("all");

  // Sort functionality
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc"
  });

  // Apply filters to tasks
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search query filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.name.toLowerCase().includes(lowerCaseQuery) ||
        task.experimentName.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    // Apply assignee filter
    if (assigneeFilter !== "all") {
      result = result.filter(task => task.assignedTo.id === assigneeFilter);
    }
    
    // Apply experiment filter
    if (experimentFilter !== "all") {
      result = result.filter(task => task.experimentName === experimentFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA < valueB) {
        comparison = -1;
      } else if (valueA > valueB) {
        comparison = 1;
      }
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter, experimentFilter, sortConfig]);

  // Function to request sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle task action (view, edit, delete, etc.)
  const handleTaskAction = (action, task) => {
    setSelectedTask(task);
    
    switch (action) {
      case "view":
        setShowTaskDetailsDialog(true);
        break;
      case "edit":
        setFormMode("edit");
        setShowTaskFormDialog(true);
        break;
      case "delete":
        setShowDeleteTaskDialog(true);
        break;
      case "statusChange":
        updateTaskStatus(task.id, task.status);
        break;
      default:
        break;
    }
  };

  // Function to create a new task
  const createTask = (newTask) => {
    // In a real app, you would send this to your API
    const taskWithMeta = {
      ...newTask,
      id: `t${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      activityLog: [
        {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'created',
          timestamp: new Date().toISOString(),
          details: 'Task created'
        }
      ]
    };
    
    setTasks(prevTasks => [...prevTasks, taskWithMeta]);
    setShowTaskFormDialog(false);
  };

  // Function to update an existing task
  const updateTask = (updatedTask) => {
    // In a real app, you would send this to your API
    const updatedTasks = tasks.map(task => {
      if (task.id === updatedTask.id) {
        // Add activity log entry for the update
        const newLog = {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'updated',
          timestamp: new Date().toISOString(),
          details: 'Task updated'
        };
        
        return {
          ...updatedTask,
          activityLog: [...task.activityLog, newLog]
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    setShowTaskFormDialog(false);
  };

  // Function to update task status
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newLog = {
          id: `al${Date.now()}`,
          userId: 'u2', // Current user ID would come from auth context
          action: 'updated',
          timestamp: new Date().toISOString(),
          details: `Status changed from "${task.status}" to "${newStatus}"`
        };
        
        return {
          ...task,
          status: newStatus,
          activityLog: [...task.activityLog, newLog]
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    // In a real app, you would send this to your API for soft delete
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setShowDeleteTaskDialog(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setExperimentFilter("all");
  };

  // Function to handle creating a new task
  const handleCreateNewTask = () => {
    setSelectedTask(null);
    setFormMode("create");
    setShowTaskFormDialog(true);
  };
  
  // Get unique experiments from tasks
  const uniqueExperiments = [...new Set(tasks.map(task => task.experimentName))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BriefcaseMedical className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Task Management</h2>
        </div>
        <Button onClick={handleCreateNewTask} className="gap-1">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Laboratory Tasks</CardTitle>
          <CardDescription>
            Manage tasks for your preclinical lab experiments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {Object.values(mockUsers).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={experimentFilter} onValueChange={setExperimentFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Experiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experiments</SelectItem>
                  {uniqueExperiments.map(experiment => (
                    <SelectItem key={experiment} value={experiment}>
                      {experiment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={resetFilters}>
                <ListFilter className="h-4 w-4" />
              </Button>
              
              <div className="border-l pl-2 flex">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <ListChecks className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "board" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("board")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === "list" ? (
                <TaskTable 
                  tasks={filteredTasks} 
                  onAction={handleTaskAction}
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                  users={mockUsers}
                />
              ) : (
                <TaskBoard 
                  tasks={filteredTasks} 
                  onAction={handleTaskAction}
                  onStatusChange={updateTaskStatus}
                  users={mockUsers}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Task Details Dialog */}
      <TaskDetailsDialog
        open={showTaskDetailsDialog}
        onOpenChange={setShowTaskDetailsDialog}
        task={selectedTask}
        onAction={handleTaskAction}
        users={mockUsers}
        experiments={mockExperiments}
      />
      
      {/* Task Form Dialog */}
      <TaskFormDialog
        open={showTaskFormDialog}
        onOpenChange={setShowTaskFormDialog}
        task={selectedTask}
        mode={formMode}
        onSubmit={formMode === "create" ? createTask : updateTask}
        users={mockUsers}
        experiments={mockExperiments}
        tasks={tasks}
      />
      
      {/* Delete Task Dialog */}
      <TaskDeleteDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        task={selectedTask}
        onDelete={deleteTask}
      />
    </div>
  );
};
