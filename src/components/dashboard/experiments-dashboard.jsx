"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Calendar,
  Users,
  Clock,
  Filter,
  Plus,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Beaker,
  FileText,
  BarChart3,
  ArrowRight,
  Microscope,
  Atom
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverGlowCard, GlowingStarsBackgroundCard } from "@/components/ui/aceternity/cards";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SparklesCore } from "@/components/ui/aceternity/sparkles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ExperimentsDashboard() {
  const [experiments, setExperiments] = useState([
    {
      id: "EXP-2023-001",
      title: "PCR Optimization for CRISPR Gene Editing",
      description: "Optimizing PCR conditions for CRISPR-Cas9 gene editing in mammalian cells",
      status: "in-progress",
      priority: "high",
      startDate: "2023-05-15",
      endDate: "2023-07-30",
      progress: 65,
      lead: {
        name: "Dr. Sarah Chen",
        avatar: "SC",
        initials: "SC"
      },
      team: [
        { name: "Alex Johnson", avatar: "AJ", initials: "AJ" },
        { name: "Morgan Smith", avatar: "MS", initials: "MS" },
        { name: "Jamie Lee", avatar: "JL", initials: "JL" }
      ],
      tags: ["PCR", "CRISPR", "Gene Editing"],
      phases: [
        { name: "Planning", status: "completed", progress: 100 },
        { name: "Setup", status: "completed", progress: 100 },
        { name: "Execution", status: "in-progress", progress: 70 },
        { name: "Analysis", status: "not-started", progress: 0 },
        { name: "Reporting", status: "not-started", progress: 0 }
      ],
      recentActivity: [
        { date: "2023-06-10", action: "Sample analysis completed", user: "Alex Johnson" },
        { date: "2023-06-08", action: "Protocol modified", user: "Dr. Sarah Chen" },
        { date: "2023-06-05", action: "New samples collected", user: "Jamie Lee" }
      ]
    },
    {
      id: "EXP-2023-002",
      title: "Protein Expression in E. coli",
      description: "Optimizing conditions for recombinant protein expression in E. coli BL21(DE3)",
      status: "completed",
      priority: "medium",
      startDate: "2023-04-10",
      endDate: "2023-06-05",
      progress: 100,
      lead: {
        name: "Dr. Michael Wong",
        avatar: "MW",
        initials: "MW"
      },
      team: [
        { name: "Taylor Kim", avatar: "TK", initials: "TK" },
        { name: "Jamie Lee", avatar: "JL", initials: "JL" }
      ],
      tags: ["Protein Expression", "E. coli", "Recombinant"],
      phases: [
        { name: "Planning", status: "completed", progress: 100 },
        { name: "Setup", status: "completed", progress: 100 },
        { name: "Execution", status: "completed", progress: 100 },
        { name: "Analysis", status: "completed", progress: 100 },
        { name: "Reporting", status: "completed", progress: 100 }
      ],
      recentActivity: [
        { date: "2023-06-05", action: "Final report submitted", user: "Dr. Michael Wong" },
        { date: "2023-06-01", action: "Data analysis completed", user: "Taylor Kim" },
        { date: "2023-05-28", action: "Protein purification completed", user: "Jamie Lee" }
      ]
    },
    {
      id: "EXP-2023-003",
      title: "Antibody Screening for Cancer Biomarkers",
      description: "Screening antibody library against novel cancer biomarkers",
      status: "planned",
      priority: "high",
      startDate: "2023-07-01",
      endDate: "2023-09-30",
      progress: 0,
      lead: {
        name: "Dr. Emily Rodriguez",
        avatar: "ER",
        initials: "ER"
      },
      team: [
        { name: "Alex Johnson", avatar: "AJ", initials: "AJ" },
        { name: "Morgan Smith", avatar: "MS", initials: "MS" }
      ],
      tags: ["Antibody", "Cancer", "Biomarkers", "Screening"],
      phases: [
        { name: "Planning", status: "in-progress", progress: 80 },
        { name: "Setup", status: "not-started", progress: 0 },
        { name: "Execution", status: "not-started", progress: 0 },
        { name: "Analysis", status: "not-started", progress: 0 },
        { name: "Reporting", status: "not-started", progress: 0 }
      ],
      recentActivity: [
        { date: "2023-06-15", action: "Protocol finalized", user: "Dr. Emily Rodriguez" },
        { date: "2023-06-12", action: "Equipment reserved", user: "Morgan Smith" },
        { date: "2023-06-08", action: "Initial planning meeting", user: "Alex Johnson" }
      ]
    },
    {
      id: "EXP-2023-004",
      title: "Cell Culture Optimization",
      description: "Optimizing growth conditions for primary neuronal cultures",
      status: "on-hold",
      priority: "medium",
      startDate: "2023-05-01",
      endDate: "2023-08-15",
      progress: 35,
      lead: {
        name: "Dr. James Wilson",
        avatar: "JW",
        initials: "JW"
      },
      team: [
        { name: "Taylor Kim", avatar: "TK", initials: "TK" },
        { name: "Jamie Lee", avatar: "JL", initials: "JL" }
      ],
      tags: ["Cell Culture", "Neurons", "Optimization"],
      phases: [
        { name: "Planning", status: "completed", progress: 100 },
        { name: "Setup", status: "completed", progress: 100 },
        { name: "Execution", status: "in-progress", progress: 40 },
        { name: "Analysis", status: "not-started", progress: 0 },
        { name: "Reporting", status: "not-started", progress: 0 }
      ],
      recentActivity: [
        { date: "2023-06-10", action: "Experiment put on hold due to equipment failure", user: "Dr. James Wilson" },
        { date: "2023-06-05", action: "Initial cultures established", user: "Taylor Kim" },
        { date: "2023-06-01", action: "Media preparation completed", user: "Jamie Lee" }
      ]
    },
    {
      id: "EXP-2023-005",
      title: "RNA-Seq Analysis of Stress Response",
      description: "Transcriptomic analysis of cellular stress response pathways",
      status: "in-progress",
      priority: "high",
      startDate: "2023-04-15",
      endDate: "2023-07-15",
      progress: 75,
      lead: {
        name: "Dr. Sarah Chen",
        avatar: "SC",
        initials: "SC"
      },
      team: [
        { name: "Alex Johnson", avatar: "AJ", initials: "AJ" },
        { name: "Morgan Smith", avatar: "MS", initials: "MS" }
      ],
      tags: ["RNA-Seq", "Transcriptomics", "Stress Response"],
      phases: [
        { name: "Planning", status: "completed", progress: 100 },
        { name: "Setup", status: "completed", progress: 100 },
        { name: "Execution", status: "completed", progress: 100 },
        { name: "Analysis", status: "in-progress", progress: 60 },
        { name: "Reporting", status: "not-started", progress: 0 }
      ],
      recentActivity: [
        { date: "2023-06-12", action: "Differential expression analysis started", user: "Morgan Smith" },
        { date: "2023-06-08", action: "RNA-Seq data received from sequencing facility", user: "Dr. Sarah Chen" },
        { date: "2023-06-01", action: "Samples submitted for sequencing", user: "Alex Johnson" }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const filteredExperiments = experiments.filter(experiment => {
    // Filter by search query
    const matchesSearch = experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "in-progress") return matchesSearch && experiment.status === "in-progress";
    if (activeTab === "planned") return matchesSearch && experiment.status === "planned";
    if (activeTab === "completed") return matchesSearch && experiment.status === "completed";
    if (activeTab === "on-hold") return matchesSearch && experiment.status === "on-hold";

    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "in-progress": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "on-hold": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "planned": return <Calendar className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "on-hold": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPhaseStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "in-progress": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "not-started": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {selectedExperiment ? (
        <ExperimentDetail
          experiment={selectedExperiment}
          onBack={() => setSelectedExperiment(null)}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Experiments Dashboard</h1>
              <p className="text-muted-foreground">Manage and track all your laboratory experiments</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                New Experiment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Experiment List</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search experiments..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <CardDescription>View and manage your laboratory experiments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Experiments</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="planned">Planned</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="on-hold">On Hold</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[500px] pr-4">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        {filteredExperiments.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10">
                            <div className="bg-primary/10 p-3 rounded-full mb-3">
                              <FlaskConical className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium">No experiments found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchQuery ? "Try a different search term" : "Start by creating a new experiment"}
                            </p>
                          </div>
                        ) : (
                          filteredExperiments.map((experiment) => (
                            <motion.div key={experiment.id} variants={itemVariants}>
                              <HoverGlowCard
                                className="bg-card border rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedExperiment(experiment)}
                              >
                                <div className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{experiment.title}</h3>
                                        <Badge variant="outline" className={getStatusColor(experiment.status)}>
                                          <span className="flex items-center gap-1">
                                            {getStatusIcon(experiment.status)}
                                            <span className="capitalize">{experiment.status.replace("-", " ")}</span>
                                          </span>
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">{experiment.description}</p>
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
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Experiment</DropdownMenuItem>
                                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Delete Experiment</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                      <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                                      <div className="text-sm">
                                        {formatDate(experiment.startDate)} - {formatDate(experiment.endDate)}
                                      </div>
                                    </div>

                                    <div>
                                      <div className="text-xs text-muted-foreground mb-1">Lead Researcher</div>
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-5 w-5">
                                          <AvatarImage src={experiment.lead.avatar} alt={experiment.lead.name} />
                                          <AvatarFallback className="text-[10px]">{experiment.lead.initials}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{experiment.lead.name}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3">
                                    <div className="flex flex-wrap gap-1">
                                      {experiment.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs">{experiment.team.length + 1}</span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <span className={getPriorityColor(experiment.priority)}>
                                          <AlertTriangle className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="text-xs capitalize">{experiment.priority}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3">
                                    <div className="flex justify-between items-center text-xs mb-1">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span>{experiment.progress}%</span>
                                    </div>
                                    <Progress value={experiment.progress} className="h-1.5" />
                                  </div>
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
                    Showing {filteredExperiments.length} of {experiments.length} experiments
                  </div>
                  <Button variant="outline" size="sm">
                    View All Experiments
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Experiment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded">
                          <FlaskConical className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">Total Experiments</span>
                      </div>
                      <span className="font-medium">{experiments.length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded">
                          <Clock className="h-4 w-4 text-amber-800 dark:text-amber-100" />
                        </div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="font-medium">{experiments.filter(e => e.status === "in-progress").length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded">
                          <Calendar className="h-4 w-4 text-blue-800 dark:text-blue-100" />
                        </div>
                        <span className="text-sm">Planned</span>
                      </div>
                      <span className="font-medium">{experiments.filter(e => e.status === "planned").length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded">
                          <CheckCircle2 className="h-4 w-4 text-green-800 dark:text-green-100" />
                        </div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-medium">{experiments.filter(e => e.status === "completed").length}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                          <AlertTriangle className="h-4 w-4 text-slate-800 dark:text-slate-100" />
                        </div>
                        <span className="text-sm">On Hold</span>
                      </div>
                      <span className="font-medium">{experiments.filter(e => e.status === "on-hold").length}</span>
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
                    {experiments
                      .filter(exp => exp.status !== "completed" && calculateDaysRemaining(exp.endDate) > 0)
                      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                      .slice(0, 3)
                      .map(exp => (
                        <div key={exp.id} className="flex items-start gap-3">
                          <div className="p-1.5 rounded mt-0.5 bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium line-clamp-1">{exp.title}</div>
                            <div className="text-xs text-muted-foreground">
                              Due: {formatDate(exp.endDate)}
                              <span className="ml-1">
                                ({calculateDaysRemaining(exp.endDate)} days left)
                              </span>
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
                  <CardTitle className="text-base">Research Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(experiments.flatMap(exp => exp.tags))).map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Beaker className="h-3 w-3" />
                        <span>{tag}</span>
                        <span className="ml-1 text-xs bg-primary/10 px-1.5 rounded-full">
                          {experiments.filter(exp => exp.tags.includes(tag)).length}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExperimentDetail({ experiment, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "in-progress": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "on-hold": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "planned": return <Calendar className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle2 className="h-4 w-4" />;
      case "on-hold": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPhaseStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "in-progress": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
      case "not-started": return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
          <ArrowRight className="h-4 w-4 rotate-180" />
        </Button>
        <h1 className="text-2xl font-bold">Experiment Details</h1>
      </div>

      <GlowingStarsBackgroundCard className="bg-background/60 backdrop-blur-md border border-border/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{experiment.title}</h2>
              <Badge variant="outline" className={getStatusColor(experiment.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(experiment.status)}
                  <span className="capitalize">{experiment.status.replace("-", " ")}</span>
                </span>
              </Badge>
            </div>
            <p className="text-muted-foreground">{experiment.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Manage Team
            </Button>
            <Button size="sm">
              <Beaker className="h-4 w-4 mr-2" />
              Log Results
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">ID</div>
            <div className="font-medium">{experiment.id}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Timeline</div>
            <div className="font-medium">{formatDate(experiment.startDate)} - {formatDate(experiment.endDate)}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Lead Researcher</div>
            <div className="flex items-center gap-2 font-medium">
              <Avatar className="h-6 w-6">
                <AvatarImage src={experiment.lead.avatar} alt={experiment.lead.name} />
                <AvatarFallback>{experiment.lead.initials}</AvatarFallback>
              </Avatar>
              {experiment.lead.name}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">Progress</div>
          <div className="flex items-center gap-2">
            <Progress value={experiment.progress} className="h-2 flex-1" />
            <span className="text-sm font-medium">{experiment.progress}%</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {experiment.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </GlowingStarsBackgroundCard>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Experiment Phases</CardTitle>
                <CardDescription>Current progress through experiment phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiment.phases.map((phase, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPhaseStatusColor(phase.status)}>
                            {phase.status === "completed" ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : phase.status === "in-progress" ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-current" />
                            )}
                          </Badge>
                          <span className="text-sm font-medium">{phase.name}</span>
                        </div>
                        <span className="text-xs">{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Latest updates on this experiment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiment.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm">{activity.action}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatDate(activity.date)}</span>
                          <span>•</span>
                          <span>{activity.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
              <CardDescription>People working on this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={experiment.lead.avatar} alt={experiment.lead.name} />
                    <AvatarFallback>{experiment.lead.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{experiment.lead.name}</div>
                    <div className="text-xs text-muted-foreground">Lead Researcher</div>
                  </div>
                </div>

                {experiment.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">Team Member</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage the team working on this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Lead Researcher</h3>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-background/50">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={experiment.lead.avatar} alt={experiment.lead.name} />
                      <AvatarFallback>{experiment.lead.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-medium">{experiment.lead.name}</div>
                      <div className="text-sm text-muted-foreground">Principal Investigator</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button variant="outline" size="sm">Message</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Team Members</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {experiment.team.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">Research Assistant</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">View Profile</Button>
                          <Button variant="ghost" size="sm">Message</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Timeline</CardTitle>
              <CardDescription>Track the progress and milestones of this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l border-border/50 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-800 dark:text-green-100" />
                  </div>
                  <div className="mb-1 text-base font-medium">Experiment Planning</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(experiment.startDate)}
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                    Initial planning and protocol development completed. Team assignments finalized.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-800 dark:text-green-100" />
                  </div>
                  <div className="mb-1 text-base font-medium">Equipment Setup</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 5)))}
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                    All necessary equipment calibrated and prepared for experiment execution.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-amber-100 dark:bg-amber-900">
                    <Clock className="h-4 w-4 text-amber-800 dark:text-amber-100" />
                  </div>
                  <div className="mb-1 text-base font-medium">Data Collection</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 15)))}
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                    Currently collecting experimental data. Progress: 65% complete.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-4 w-4 rounded-full border border-slate-400 dark:border-slate-500" />
                  </div>
                  <div className="mb-1 text-base font-medium">Data Analysis</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Scheduled: {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 30)))}
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                    Statistical analysis and interpretation of experimental results.
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[25px] p-1 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-4 w-4 rounded-full border border-slate-400 dark:border-slate-500" />
                  </div>
                  <div className="mb-1 text-base font-medium">Final Report</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Deadline: {formatDate(experiment.endDate)}
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-background/50 text-sm">
                    Preparation and submission of final experiment report and findings.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Results</CardTitle>
              <CardDescription>View and analyze the results of this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              {experiment.status === "completed" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                      <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                      <div className="text-2xl font-bold">92%</div>
                    </div>

                    <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                      <div className="text-sm text-muted-foreground mb-1">Samples Processed</div>
                      <div className="text-2xl font-bold">48</div>
                    </div>

                    <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                      <div className="text-sm text-muted-foreground mb-1">Data Points</div>
                      <div className="text-2xl font-bold">1,245</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                    <h3 className="text-lg font-medium mb-3">Key Findings</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-green-100 dark:bg-green-900 p-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 text-green-800 dark:text-green-100" />
                        </div>
                        <span>Optimized PCR conditions increased yield by 35% compared to standard protocol</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-green-100 dark:bg-green-900 p-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 text-green-800 dark:text-green-100" />
                        </div>
                        <span>Identified optimal annealing temperature of 58°C for target sequence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-green-100 dark:bg-green-900 p-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3 text-green-800 dark:text-green-100" />
                        </div>
                        <span>Modified buffer composition improved specificity and reduced non-specific amplification</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-8 text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Detailed Results Available</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        View comprehensive data analysis, charts, and statistical results
                      </p>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Results
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Microscope className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Results Not Available Yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    This experiment is still in progress. Results will be available once data collection and analysis are complete.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Check Status
                    </Button>
                    <Button>
                      <Beaker className="h-4 w-4 mr-2" />
                      Log Preliminary Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Notes</CardTitle>
              <CardDescription>Important notes and observations about this experiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={experiment.lead.avatar} alt={experiment.lead.name} />
                        <AvatarFallback>{experiment.lead.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{experiment.lead.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 2)))}
                    </span>
                  </div>
                  <p className="text-sm">
                    Initial protocol established. We'll be using a modified version of the standard PCR protocol with the following adjustments: increased primer concentration (0.5μM), extended annealing time (45s), and modified buffer composition.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={experiment.team[0].avatar} alt={experiment.team[0].name} />
                        <AvatarFallback>{experiment.team[0].initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{experiment.team[0].name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 7)))}
                    </span>
                  </div>
                  <p className="text-sm">
                    First batch of samples processed. Observed some non-specific amplification in samples 3, 7, and 12. Might need to adjust annealing temperature in the next run. All other samples show good specificity and yield.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={experiment.team[1].avatar} alt={experiment.team[1].name} />
                        <AvatarFallback>{experiment.team[1].initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{experiment.team[1].name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(new Date(experiment.startDate).setDate(new Date(experiment.startDate).getDate() + 14)))}
                    </span>
                  </div>
                  <p className="text-sm">
                    Equipment calibration check performed. All instruments are functioning within expected parameters. Thermal cycler temperature verification shows ±0.3°C accuracy across all wells.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}