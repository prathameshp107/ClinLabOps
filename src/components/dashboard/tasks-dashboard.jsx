"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  SortAsc, 
  Tag, 
  User, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverGlowCard } from "@/components/ui/aceternity/cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskAnalytics from "./TaskAnalytics";

export function TasksDashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "PCR Analysis for Sample A-123",
      description: "Complete PCR analysis for the sample collected on 2023-05-10",
      status: "in-progress",
      priority: "high",
      dueDate: "2023-06-15",
      assignee: {
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        initials: "AJ"
      },
      tags: ["PCR", "Analysis", "Sample A"],
      progress: 65
    },
    {
      id: 2,
      title: "Prepare Quarterly Lab Report",
      description: "Compile all experiment results from Q2 into a comprehensive report",
      status: "todo",
      priority: "medium",
      dueDate: "2023-06-30",
      assignee: {
        name: "Morgan Smith",
        avatar: "/avatars/morgan.jpg",
        initials: "MS"
      },
      tags: ["Report", "Q2", "Documentation"],
      progress: 0
    },
    {
      id: 3,
      title: "Calibrate Spectrometer",
      description: "Perform routine calibration of the main lab spectrometer",
      status: "completed",
      priority: "low",
      dueDate: "2023-06-05",
      assignee: {
        name: "Jamie Lee",
        avatar: "/avatars/jamie.jpg",
        initials: "JL"
      },
      tags: ["Maintenance", "Equipment", "Calibration"],
      progress: 100
    },
    {
      id: 4,
      title: "Order New Reagents",
      description: "Place order for new reagents that are running low in inventory",
      status: "todo",
      priority: "high",
      dueDate: "2023-06-10",
      assignee: {
        name: "Taylor Kim",
        avatar: "/avatars/taylor.jpg",
        initials: "TK"
      },
      tags: ["Inventory", "Reagents", "Order"],
      progress: 0
    },
    {
      id: 5,
      title: "Review Research Proposal",
      description: "Review and provide feedback on the new research proposal from Dr. Smith",
      status: "in-progress",
      priority: "medium",
      dueDate: "2023-06-20",
      assignee: {
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        initials: "AJ"
      },
      tags: ["Research", "Review", "Proposal"],
      progress: 30
    },
    {
      id: 6,
      title: "Clean Cell Culture Room",
      description: "Perform weekly cleaning and sterilization of the cell culture room",
      status: "todo",
      priority: "medium",
      dueDate: "2023-06-12",
      assignee: {
        name: "Jamie Lee",
        avatar: "/avatars/jamie.jpg",
        initials: "JL"
      },
      tags: ["Maintenance", "Cleaning", "Cell Culture"],
      progress: 0
    },
    {
      id: 7,
      title: "Analyze Sequencing Results",
      description: "Analyze the DNA sequencing results from last week's experiment",
      status: "completed",
      priority: "high",
      dueDate: "2023-06-08",
      assignee: {
        name: "Morgan Smith",
        avatar: "/avatars/morgan.jpg",
        initials: "MS"
      },
      tags: ["Analysis", "DNA", "Sequencing"],
      progress: 100
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTasks = tasks.filter(task => {
    // Filter by search query
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "todo") return matchesSearch && task.status === "todo";
    if (activeTab === "in-progress") return matchesSearch && task.status === "in-progress";
    if (activeTab === "completed") return matchesSearch && task.status === "completed";
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default: return "bg-slate-200 text-slate-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      case "low": return "text-green-500";
      default: return "text-slate-500";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <AlertCircle className="h-4 w-4" />;
      case "low": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today && dueDate.toDateString() !== today.toDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tasks Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your laboratory tasks</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Task List</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search tasks..." 
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <CardDescription>View and manage your assigned tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                      <TabsTrigger value="todo">To Do</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    
                    <ScrollArea className="h-[500px] pr-4">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        {filteredTasks.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="bg-primary/10 p-3 rounded-full mb-3">
                              <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">No tasks found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchQuery ? "Try a different search term" : "You're all caught up!"}
                            </p>
                          </div>
                        ) : (
                          filteredTasks.map((task) => (
                            <motion.div key={task.id} variants={itemVariants}>
                              <HoverGlowCard className="bg-card border rounded-lg overflow-hidden">
                                <div className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{task.title}</h3>
                                        <Badge variant="outline" className={getStatusColor(task.status)}>
                                          {task.status === "in-progress" ? "In Progress" : 
                                           task.status === "todo" ? "To Do" : "Completed"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="12" cy="5" r="1" />
                                            <circle cx="12" cy="19" r="1" />
                                          </svg>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                                        <DropdownMenuItem>Reassign</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                                    <div className="flex flex-wrap gap-1">
                                      {task.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="flex items-center gap-1">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        <div className="flex items-center gap-1">
                                          <Avatar className="h-5 w-5">
                                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                            <AvatarFallback className="text-[10px]">{task.assignee.initials}</AvatarFallback>
                                          </Avatar>
                                          <span className="text-xs">{task.assignee.name}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-1">
                                        <span className={getPriorityColor(task.priority)}>
                                          {getPriorityIcon(task.priority)}
                                        </span>
                                        <span className="text-xs capitalize">{task.priority}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1">
                                        <Clock className={`h-3.5 w-3.5 ${isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground"}`} />
                                        <span className={`text-xs ${isOverdue(task.dueDate) ? "text-destructive" : ""}`}>
                                          {formatDate(task.dueDate)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {task.status !== "todo" && (
                                    <div className="mt-3">
                                      <div className="flex justify-between items-center text-xs mb-1">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{task.progress}%</span>
                                      </div>
                                      <Progress value={task.progress} className="h-1.5" />
                                    </div>
                                  )}
                                </div>
                              </HoverGlowCard>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    </ScrollArea>
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </div>
                  <Button variant="outline" size="sm">
                    View All Tasks
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Task Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm">Total Tasks</span>
                      </div>
                      <span className="font-medium">{tasks.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded">
                          <Clock className="h-4 w-4 text-blue-800 dark:text-blue-100" />
                        </div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="font-medium">{tasks.filter(t => t.status === "in-progress").length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded">
                          <AlertCircle className="h-4 w-4 text-amber-800 dark:text-amber-100" />
                        </div>
                        <span className="text-sm">To Do</span>
                      </div>
                      <span className="font-medium">{tasks.filter(t => t.status === "todo").length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded">
                          <CheckCircle2 className="h-4 w-4 text-green-800 dark:text-green-100" />
                        </div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-medium">{tasks.filter(t => t.status === "completed").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.status !== "completed")
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .slice(0, 3)
                      .map(task => (
                        <div key={task.id} className="flex items-start gap-3">
                          <div className={`p-1.5 rounded mt-0.5 ${isOverdue(task.dueDate) ? "bg-red-100 dark:bg-red-900" : "bg-slate-100 dark:bg-slate-800"}`}>
                            <Calendar className={`h-4 w-4 ${isOverdue(task.dueDate) ? "text-red-800 dark:text-red-100" : ""}`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium line-clamp-1">{task.title}</div>
                            <div className={`text-xs ${isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground"}`}>
                              {isOverdue(task.dueDate) ? "Overdue: " : "Due: "}
                              {formatDate(task.dueDate)}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Task Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(tasks.flatMap(task => task.tags))).map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                        <span className="ml-1 text-xs bg-primary/10 px-1.5 rounded-full">
                          {tasks.filter(task => task.tags.includes(tag)).length}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <TaskAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}