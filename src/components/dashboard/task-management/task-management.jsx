"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, Filter, ClipboardList, 
  KanbanSquare, Grid3X3, Calendar, ChevronDown, Check, X,
  Trash2, Users, AlertCircle, CheckSquare, Square
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskTemplates } from "./task-templates";
import { TaskTable } from "./task-table";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for development
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatarUrl: "" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatarUrl: "" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", avatarUrl: "" },
];

const mockExperiments = [
  { id: "1", name: "PCR Analysis" },
  { id: "2", name: "Cell Culture Experiment" },
  { id: "3", name: "Protein Extraction" },
];

// Generate initial tasks with varying priorities
const generateMockTasks = () => {
  const priorities = ["low", "medium", "high", "critical"];
  const statuses = ["pending", "in-progress", "review", "completed"];
  
  return Array(12).fill().map((_, i) => ({
    id: `task-${i + 1}`,
    title: `Task ${i + 1}`,
    description: `Description for task ${i + 1}. This is a sample task for demonstration purposes.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
    assigneeId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    experimentId: Math.random() > 0.3 ? mockExperiments[Math.floor(Math.random() * mockExperiments.length)].id : null,
    parentTaskId: Math.random() > 0.8 ? `task-${Math.floor(Math.random() * i) + 1}` : null,
    tags: Math.random() > 0.5 ? ["lab", "urgent"] : ["documentation"],
    subtasks: Array(Math.floor(Math.random() * 5)).fill().map((_, j) => ({
      id: `subtask-${i}-${j}`,
      description: `Subtask ${j + 1} for Task ${i + 1}`,
      completed: Math.random() > 0.5,
      deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    })),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));
};

// Generate initial templates
const generateMockTemplates = () => {
  return [
    {
      id: "template-1",
      name: "PCR Analysis",
      description: "Standard PCR analysis template with common subtasks",
      defaultPriority: "medium",
      defaultStatus: "pending",
      categoryTags: ["lab", "analysis"],
      subtasks: [
        { description: "Prepare samples", completed: false },
        { description: "Run PCR machine", completed: false },
        { description: "Analyze results", completed: false },
        { description: "Document findings", completed: false }
      ]
    },
    {
      id: "template-2",
      name: "Weekly Report",
      description: "Template for creating weekly progress reports",
      defaultPriority: "low",
      defaultStatus: "pending",
      categoryTags: ["documentation", "reporting"],
      subtasks: [
        { description: "Gather experiment data", completed: false },
        { description: "Analyze results", completed: false },
        { description: "Create charts and graphs", completed: false },
        { description: "Write summary", completed: false },
        { description: "Review with team", completed: false }
      ]
    },
    {
      id: "template-3",
      name: "Urgent Bug Fix",
      description: "Template for critical system issues that need immediate attention",
      defaultPriority: "critical",
      defaultStatus: "in-progress",
      categoryTags: ["bug", "urgent"],
      subtasks: [
        { description: "Identify root cause", completed: false },
        { description: "Create fix", completed: false },
        { description: "Test solution", completed: false },
        { description: "Deploy fix", completed: false },
        { description: "Document incident", completed: false }
      ]
    }
  ];
};

export const TaskManagement = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState("list");
  const [activeTab, setActiveTab] = useState("tasks");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
  });
  const [sortBy, setSortBy] = useState("dueDate");
  const [tasks, setTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // For bulk actions
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkActionsMenuOpen, setBulkActionsMenuOpen] = useState(false);
  
  // Initialize with mock data
  useEffect(() => {
    setTasks(generateMockTasks());
    setTemplates(generateMockTemplates());
  }, []);

  // Handle task creation/editing
  const handleTaskSubmit = (data) => {
    if (formMode === "create") {
      // Create new task
      const newTask = {
        id: `task-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks([...tasks, newTask]);
    } else {
      // Edit existing task
      const updatedTasks = tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...data, updatedAt: new Date() } 
          : task
      );
      setTasks(updatedTasks);
    }
    setFormOpen(false);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Handle status update for task
  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date() } 
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle task creation from template
  const handleCreateFromTemplate = (template) => {
    setSelectedTask(null);
    setFormMode("create");
    setFormOpen(true);
    // Template data will be handled by the form dialog
  };

  // Handle template submission
  const handleTemplateSubmit = (template) => {
    if (template.id) {
      // Edit existing template
      const updatedTemplates = templates.map(t => 
        t.id === template.id ? template : t
      );
      setTemplates(updatedTemplates);
    } else {
      // Create new template
      const newTemplate = {
        id: `template-${Date.now()}`,
        ...template,
        createdAt: new Date(),
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(task.status)) {
      return false;
    }
    
    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
      return false;
    }
    
    // Assignee filter
    if (filters.assignee.length > 0 && !filters.assignee.includes(task.assigneeId)) {
      return false;
    }
    
    // Search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort tasks based on current sort criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "priority":
        const priorityOrder = { "critical": 0, "high": 1, "medium": 2, "low": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "title":
        return a.title.localeCompare(b.title);
      case "createdAt":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  // Group tasks by status for Kanban view
  const tasksByStatus = {
    pending: sortedTasks.filter(task => task.status === "pending"),
    "in-progress": sortedTasks.filter(task => task.status === "in-progress"),
    review: sortedTasks.filter(task => task.status === "review"),
    completed: sortedTasks.filter(task => task.status === "completed"),
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-blue-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Get subtasks progress percentage
  const getSubtasksProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedCount / subtasks.length) * 100);
  };

  // Handle task selection for bulk actions
  const handleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
    
    // Show bulk actions menu when tasks are selected
    if (!selectedTasks.includes(taskId)) {
      // If we're adding a task to selection and it's the first one
      if (selectedTasks.length === 0) {
        setBulkActionsMenuOpen(true);
      }
    } else {
      // If we're removing the last task from selection
      if (selectedTasks.length === 1) {
        setBulkActionsMenuOpen(false);
      }
    }
  };

  // Select/deselect all visible tasks
  const handleSelectAllTasks = () => {
    if (selectedTasks.length === sortedTasks.length) {
      // Deselect all
      setSelectedTasks([]);
      setBulkActionsMenuOpen(false);
    } else {
      // Select all
      setSelectedTasks(sortedTasks.map(task => task.id));
      setBulkActionsMenuOpen(true);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus) => {
    const updatedTasks = tasks.map(task => 
      selectedTasks.includes(task.id) 
        ? { ...task, status: newStatus, updatedAt: new Date() } 
        : task
    );
    setTasks(updatedTasks);
    setBulkActionsMenuOpen(false);
  };

  // Handle bulk priority update
  const handleBulkPriorityUpdate = (newPriority) => {
    const updatedTasks = tasks.map(task => 
      selectedTasks.includes(task.id) 
        ? { ...task, priority: newPriority, updatedAt: new Date() } 
        : task
    );
    setTasks(updatedTasks);
    setBulkActionsMenuOpen(false);
  };

  // Handle bulk assignee update
  const handleBulkAssigneeUpdate = (newAssigneeId) => {
    const updatedTasks = tasks.map(task => 
      selectedTasks.includes(task.id) 
        ? { ...task, assigneeId: newAssigneeId, updatedAt: new Date() } 
        : task
    );
    setTasks(updatedTasks);
    setBulkActionsMenuOpen(false);
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    setTasks(updatedTasks);
    setSelectedTasks([]);
    setBulkActionsMenuOpen(false);
  };

  // Render task card
  const renderTaskCard = (task) => (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedTasks.includes(task.id)}
              onCheckedChange={(checked) => handleTaskSelection(task.id)}
              onClick={(e) => e.stopPropagation()}
              className="mr-1"
            />
            <div className="flex-grow" onClick={() => router.push(`/tasks/${task.id}`)}>
              <CardTitle className="text-lg">{task.title}</CardTitle>
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0" onClick={() => router.push(`/tasks/${task.id}`)}>
          <CardDescription className="text-sm mt-1 line-clamp-2">
            {task.description}
          </CardDescription>
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Subtasks Progress</span>
                <span>{getSubtasksProgress(task.subtasks)}%</span>
              </div>
              <Progress value={getSubtasksProgress(task.subtasks)} className="h-1.5" />
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadgeClass(task.status)}>
                {task.status.replace("-", " ")}
              </Badge>
              
              {task.dueDate && (
                <div className="text-xs flex items-center gap-1 text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(task.dueDate), "MMM dd, yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <div className="flex items-center">
            {task.assigneeId && (
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback>
                  {mockUsers.find(u => u.id === task.assigneeId)?.name.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedTask(task);
                setFormMode("edit");
                setFormOpen(true);
              }}
            >
              Edit
            </Button>
            {activeView === "list" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Status <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={task.status === "pending"}
                    onCheckedChange={() => handleStatusChange(task.id, "pending")}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={task.status === "in-progress"}
                    onCheckedChange={() => handleStatusChange(task.id, "in-progress")}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={task.status === "review"}
                    onCheckedChange={() => handleStatusChange(task.id, "review")}
                  >
                    Review
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleStatusChange(task.id, "completed")}
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "review":
        return "bg-purple-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Button 
          onClick={() => {
            setSelectedTask(null);
            setFormMode("create");
            setFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                variant={activeView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("list")}
              >
                <ClipboardList className="mr-2 h-4 w-4" /> List
              </Button>
              <Button 
                variant={activeView === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("kanban")}
              >
                <KanbanSquare className="mr-2 h-4 w-4" /> Kanban
              </Button>
            </div>
            
            <div className="flex gap-2">
              {selectedTasks.length > 0 && (
                <Button onClick={() => setBulkActionsMenuOpen(true)}>
                  Bulk Actions ({selectedTasks.length}) <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              )}
              <DropdownMenu open={bulkActionsMenuOpen && selectedTasks.length > 0} onOpenChange={setBulkActionsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button className="hidden">
                    Bulk Actions <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Update Selected Tasks</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center px-2 py-1.5 text-sm">
                      <span className="flex-grow text-left">Set Status</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkStatusUpdate("pending")}>
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkStatusUpdate("in-progress")}>
                        In Progress
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkStatusUpdate("review")}>
                        Review
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkStatusUpdate("completed")}>
                        Completed
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center px-2 py-1.5 text-sm">
                      <span className="flex-grow text-left">Set Priority</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkPriorityUpdate("low")}>
                        Low
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkPriorityUpdate("medium")}>
                        Medium
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkPriorityUpdate("high")}>
                        High
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkPriorityUpdate("critical")}>
                        Critical
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full flex items-center px-2 py-1.5 text-sm">
                      <span className="flex-grow text-left">Assign To</span>
                      <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem onSelect={() => handleBulkAssigneeUpdate("unassigned")}>
                        Unassigned
                      </DropdownMenuCheckboxItem>
                      {mockUsers.map(user => (
                        <DropdownMenuCheckboxItem 
                          key={user.id} 
                          onSelect={() => handleBulkAssigneeUpdate(user.id)}
                        >
                          {user.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    onSelect={handleBulkDelete}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={filters.status.includes("pending")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        status: checked 
                          ? [...filters.status, "pending"] 
                          : filters.status.filter(s => s !== "pending")
                      });
                    }}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.status.includes("in-progress")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        status: checked 
                          ? [...filters.status, "in-progress"] 
                          : filters.status.filter(s => s !== "in-progress")
                      });
                    }}
                  >
                    In Progress
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.status.includes("review")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        status: checked 
                          ? [...filters.status, "review"] 
                          : filters.status.filter(s => s !== "review")
                      });
                    }}
                  >
                    Review
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.status.includes("completed")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        status: checked 
                          ? [...filters.status, "completed"] 
                          : filters.status.filter(s => s !== "completed")
                      });
                    }}
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuLabel className="mt-2">Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={filters.priority.includes("critical")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        priority: checked 
                          ? [...filters.priority, "critical"] 
                          : filters.priority.filter(p => p !== "critical")
                      });
                    }}
                  >
                    Critical
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.priority.includes("high")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        priority: checked 
                          ? [...filters.priority, "high"] 
                          : filters.priority.filter(p => p !== "high")
                      });
                    }}
                  >
                    High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.priority.includes("medium")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        priority: checked 
                          ? [...filters.priority, "medium"] 
                          : filters.priority.filter(p => p !== "medium")
                      });
                    }}
                  >
                    Medium
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={filters.priority.includes("low")}
                    onCheckedChange={(checked) => {
                      setFilters({
                        ...filters,
                        priority: checked 
                          ? [...filters.priority, "low"] 
                          : filters.priority.filter(p => p !== "low")
                      });
                    }}
                  >
                    Low
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Grid3X3 className="mr-2 h-4 w-4" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem 
                    checked={sortBy === "dueDate"}
                    onCheckedChange={() => setSortBy("dueDate")}
                  >
                    Due Date
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={sortBy === "priority"}
                    onCheckedChange={() => setSortBy("priority")}
                  >
                    Priority
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={sortBy === "title"}
                    onCheckedChange={() => setSortBy("title")}
                  >
                    Title
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={sortBy === "createdAt"}
                    onCheckedChange={() => setSortBy("createdAt")}
                  >
                    Created Date
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {activeView === "list" ? (
            <div className="grid grid-cols-1 gap-4">
              {selectedTasks.length > 0 && (
                <div className="flex justify-between items-center bg-muted p-2 rounded-md mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                    onClick={handleSelectAllTasks}
                  >
                    {selectedTasks.length === sortedTasks.length ? (
                      <>
                        <CheckSquare className="h-4 w-4 mr-2" /> Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4 mr-2" /> Select All
                      </>
                    )}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
              
              {/* Use TaskTable for tabular view */}
              <TaskTable 
                tasks={sortedTasks}
                selectedTasks={selectedTasks}
                onSelectionChange={(selectedIds) => {
                  setSelectedTasks(selectedIds);
                  setBulkActionsMenuOpen(selectedIds.length > 0);
                }}
                onTaskClick={(action, task) => {
                  if (action === "edit") {
                    setSelectedTask(task);
                    setFormMode("edit");
                    setFormOpen(true);
                  } else if (action === "delete") {
                    handleDeleteTask(task.id);
                  } else if (action === "statusChange") {
                    handleStatusChange(task.id, task.status);
                  }
                }}
              />
              
              {/* Original card view - uncomment if needed
              <AnimatePresence>
                {sortedTasks.map(task => renderTaskCard(task))}
              </AnimatePresence>
              */}
              
              {sortedTasks.length === 0 && (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium">No tasks found</h3>
                  <p className="text-gray-500">Create a new task or adjust your filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    {status === "pending" && "Pending"}
                    {status === "in-progress" && "In Progress"}
                    {status === "review" && "Review"}
                    {status === "completed" && "Completed"}
                    <Badge className="ml-2 bg-gray-200 text-gray-800">
                      {statusTasks.length}
                    </Badge>
                  </h3>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {statusTasks.map(task => renderTaskCard(task))}
                    </AnimatePresence>
                    
                    {statusTasks.length === 0 && (
                      <div className="text-center py-8 border border-dashed rounded-lg text-gray-400">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="templates">
          <TaskTemplates 
            templates={templates} 
            onTemplateSubmit={handleTemplateSubmit} 
            onApplyTemplate={handleCreateFromTemplate}
          />
        </TabsContent>
      </Tabs>
      
      <TaskFormDialog 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        task={selectedTask} 
        mode={formMode} 
        onSubmit={handleTaskSubmit}
        users={mockUsers}
        experiments={mockExperiments}
        tasks={tasks}
        templates={templates}
      />
    </div>
  );
};
