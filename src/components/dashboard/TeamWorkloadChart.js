'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Star,
  User,
  ChevronDown,
  ChevronUp,
  Zap,
  BarChart2,
  Users,
  Target,
  TrendingUp,
  SortAsc
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for team members and their tasks
const mockTeamData = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Team Lead',
    avatar: 'AP',
    email: 'alex.j@example.com',
    lastActive: '2023-06-20T14:30:00Z',
    performance: 0.92,
    skills: ['React', 'Node.js', 'Project Management'],
    tasks: {
      completed: 12,
      inProgress: 3,
      overdue: 1,
      total: 16,
      efficiency: 0.92,
      onTimeRate: 0.94
    }
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'Frontend Dev',
    avatar: 'MG',
    email: 'maria.g@example.com',
    lastActive: '2023-06-21T09:15:00Z',
    performance: 0.78,
    skills: ['React', 'TypeScript', 'UI/UX'],
    tasks: {
      completed: 8,
      inProgress: 5,
      overdue: 0,
      total: 13,
      efficiency: 0.82,
      onTimeRate: 0.88
    }
  },
  {
    id: 3,
    name: 'James Wilson',
    role: 'Backend Dev',
    avatar: 'JW',
    email: 'james.w@example.com',
    lastActive: '2023-06-21T11:45:00Z',
    performance: 0.65,
    skills: ['Node.js', 'Python', 'Database Design'],
    tasks: {
      completed: 15,
      inProgress: 2,
      overdue: 2,
      total: 19,
      efficiency: 0.75,
      onTimeRate: 0.72
    }
  },
  {
    id: 4,
    name: 'Sarah Kim',
    role: 'UI/UX Designer',
    avatar: 'SK',
    email: 'sarah.k@example.com',
    lastActive: '2023-06-20T16:20:00Z',
    performance: 0.88,
    skills: ['Figma', 'User Research', 'Prototyping'],
    tasks: {
      completed: 10,
      inProgress: 4,
      overdue: 1,
      total: 15,
      efficiency: 0.85,
      onTimeRate: 0.9
    }
  },
  {
    id: 5,
    name: 'David Lee',
    role: 'QA Engineer',
    avatar: 'DL',
    email: 'david.l@example.com',
    lastActive: '2023-06-21T10:10:00Z',
    performance: 0.72,
    skills: ['Test Automation', 'Manual Testing', 'Bug Tracking'],
    tasks: {
      completed: 7,
      inProgress: 6,
      overdue: 0,
      total: 13,
      efficiency: 0.78,
      onTimeRate: 0.81
    }
  },
  {
    id: 6,
    name: 'Alex Johnson',
    role: 'Team Lead',
    avatar: 'AP',
    email: 'alex.j@example.com',
    lastActive: '2023-06-20T14:30:00Z',
    performance: 0.92,
    skills: ['React', 'Node.js', 'Project Management'],
    tasks: {
      completed: 12,
      inProgress: 3,
      overdue: 1,
      total: 16,
      efficiency: 0.92,
      onTimeRate: 0.94
    }
  },
  {
    id: 7,
    name: 'Maria Garcia',
    role: 'Frontend Dev',
    avatar: 'MG',
    email: 'maria.g@example.com',
    lastActive: '2023-06-21T09:15:00Z',
    performance: 0.78,
    skills: ['React', 'TypeScript', 'UI/UX'],
    tasks: {
      completed: 8,
      inProgress: 5,
      overdue: 0,
      total: 13,
      efficiency: 0.82,
      onTimeRate: 0.88
    }
  },
  {
    id: 8,
    name: 'James Wilson',
    role: 'Backend Dev',
    avatar: 'JW',
    email: 'james.w@example.com',
    lastActive: '2023-06-21T11:45:00Z',
    performance: 0.65,
    skills: ['Node.js', 'Python', 'Database Design'],
    tasks: {
      completed: 15,
      inProgress: 2,
      overdue: 2,
      total: 19,
      efficiency: 0.75,
      onTimeRate: 0.72
    }
  },
  {
    id: 9,
    name: 'Sarah Kim',
    role: 'UI/UX Designer',
    avatar: 'SK',
    email: 'sarah.k@example.com',
    lastActive: '2023-06-20T16:20:00Z',
    performance: 0.88,
    skills: ['Figma', 'User Research', 'Prototyping'],
    tasks: {
      completed: 10,
      inProgress: 4,
      overdue: 1,
      total: 15,
      efficiency: 0.85,
      onTimeRate: 0.9
    }
  },
  {
    id: 10,
    name: 'David Lee',
    role: 'QA Engineer',
    avatar: 'DL',
    email: 'david.l@example.com',
    lastActive: '2023-06-21T10:10:00Z',
    performance: 0.72,
    skills: ['Test Automation', 'Manual Testing', 'Bug Tracking'],
    tasks: {
      completed: 7,
      inProgress: 6,
      overdue: 0,
      total: 13,
      efficiency: 0.78,
      onTimeRate: 0.81
    }
  },
];

// Status colors for the chart
const statusColors = {
  completed: 'hsl(142.1, 76.2%, 36.3%)',
  inProgress: 'hsl(221.2, 83.2%, 53.3%)',
  overdue: 'hsl(0, 84.2%, 60.2%)',
};

// Performance levels and colors
const performanceLevels = {
  high: { label: 'High Performer', color: 'hsl(38, 92%, 50%)', threshold: 0.8 },
  medium: { label: 'On Track', color: 'hsl(262.1, 83.3%, 57.8%)', threshold: 0.5 },
  low: { label: 'Needs Attention', color: 'hsl(0, 84.2%, 60.2%)', threshold: 0 }
};

// Helper function to determine performance level
const getPerformanceLevel = (score) => {
  if (score >= performanceLevels.high.threshold) return 'high';
  if (score >= performanceLevels.medium.threshold) return 'medium';
  return 'low';
};

// Format date to relative time (e.g., '2h ago', '1d ago')
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

const sortOptions = {
  total: 'Total Tasks',
  completed: 'Completed',
  overdue: 'Overdue',
  performance: 'Performance',
  name: 'Name',
  role: 'Role'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-3 border rounded-lg shadow-lg text-sm">
        <p className="font-medium">{data.name}</p>
        <div className="mt-1 space-y-1">
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="capitalize">{entry.name}</span>
              </div>
              <span className="font-medium ml-2">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TeamWorkloadChart = () => {
  const [sortBy, setSortBy] = useState('total');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMember, setExpandedMember] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    performance: 'all',
    showDetails: false
  });

  // Filter and sort team members
  const filteredTeamData = useMemo(() => {
    let data = [...mockTeamData];

    // Apply role filter
    if (filters.role !== 'all') {
      data = data.filter(member =>
        member.role.toLowerCase().includes(filters.role.toLowerCase())
      );
    }

    // Apply performance filter
    if (filters.performance !== 'all') {
      data = data.filter(member => {
        const completionRate = member.tasks.completed / (member.tasks.completed + member.tasks.inProgress + member.tasks.overdue || 1);
        const perfLevel = getPerformanceLevel(completionRate);
        return perfLevel === filters.performance;
      });
    }

    // Sort data
    return data.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'role') {
        return a.role.localeCompare(b.role);
      } else if (sortBy === 'performance') {
        return b.performance - a.performance;
      } else {
        return (b.tasks[sortBy] || 0) - (a.tasks[sortBy] || 0);
      }
    });
  }, [sortBy, filters]);

  const toggleMemberExpansion = (memberId) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Pagination logic
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredTeamData.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeamData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeamData, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const getPaginationItems = () => {
    const items = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        startPage = 2;
        endPage = 4;
      }
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={currentPage === i} onClick={() => setCurrentPage(i)} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 px-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>Team Workload</span>
                <Badge variant="outline" className="text-xs font-medium">
                  {filteredTeamData.length} members
                </Badge>
              </CardTitle>
              <CardDescription>Task distribution and performance metrics</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Role</p>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                      >
                        <option value="all">All Roles</option>
                        <option value="dev">Developers</option>
                        <option value="design">Designers</option>
                        <option value="qa">QA</option>
                        <option value="lead">Team Lead</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Performance</p>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={filters.performance}
                        onChange={(e) => setFilters({ ...filters, performance: e.target.value })}
                      >
                        <option value="all">All Performance</option>
                        <option value="high">High Performers</option>
                        <option value="medium">On Track</option>
                        <option value="low">Needs Attention</option>
                      </select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <SortAsc className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      Sort by: {sortOptions[sortBy]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(sortOptions).map(([key, value]) => (
                    <DropdownMenuItem key={key} onClick={() => setSortBy(key)}>
                      {value}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-9 w-9 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Avg. Completion</p>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {Math.round(
                  (filteredTeamData.reduce((sum, member) => sum + (member.tasks.completed / member.tasks.total), 0) /
                    (filteredTeamData.length || 1)) * 100
                )}%
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">On Time Rate</p>
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {Math.round(
                  (filteredTeamData.reduce((sum, member) => sum + (member.tasks.onTimeRate || 0), 0) /
                    (filteredTeamData.length || 1)) * 100
                )}%
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">High Performers</p>
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {filteredTeamData.filter(member => getPerformanceLevel(member.performance) === 'high').length}
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Needs Attention</p>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {filteredTeamData.filter(member => getPerformanceLevel(member.performance) === 'low').length}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-2 py-2 px-4">
            {currentItems.length > 0 ? (
              currentItems.map((member) => {
                const completionRate = member.tasks.completed / (member.tasks.completed + member.tasks.inProgress + member.tasks.overdue || 1);
                const performanceLevel = getPerformanceLevel(completionRate);
                const performance = performanceLevels[performanceLevel];
                const isExpanded = expandedMember === member.id;

                return (
                  <motion.div
                    key={member.id}
                    className="border rounded-lg overflow-hidden bg-card"
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : '72px',
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleMemberExpansion(member.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{member.name}</h4>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden md:flex items-center gap-2">
                            <div className="text-center">
                              <p className="text-sm font-medium">{member.tasks.completed}</p>
                              <p className="text-xs text-muted-foreground">Done</p>
                            </div>
                            <div className="h-5 w-px bg-border" />
                            <div className="text-center">
                              <p className="text-sm font-medium">{member.tasks.inProgress}</p>
                              <p className="text-xs text-muted-foreground">In Progress</p>
                            </div>
                            <div className="h-5 w-px bg-border" />
                            <div className="text-center">
                              <p className="text-sm font-medium">{member.tasks.overdue}</p>
                              <p className="text-xs text-muted-foreground">Overdue</p>
                            </div>
                          </div>
                          <div className="w-24">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${completionRate * 100}%`,
                                  backgroundColor: performance.color
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-right mt-1">
                              {Math.round(completionRate * 100)}%
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMemberExpansion(member.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t p-4 bg-muted/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium mb-3">Task Distribution</h4>
                                <div className="h-[200px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={[member]}
                                      layout="vertical"
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                      barGap={1}
                                      barCategoryGap={8}
                                    >
                                      <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--muted))"
                                        horizontal={true}
                                        vertical={false}
                                      />
                                      <XAxis
                                        type="number"
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                                        tickLine={{ stroke: 'hsl(var(--muted))' }}
                                        axisLine={{ stroke: 'hsl(var(--muted))' }}
                                      />
                                      <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={30}
                                        tick={false}
                                        axisLine={false}
                                      />
                                      <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.3 }}
                                      />
                                      <Bar
                                        dataKey="tasks.completed"
                                        name="Completed"
                                        stackId="a"
                                        fill={statusColors.completed}
                                        radius={[0, 4, 4, 0]}
                                      >
                                        <Cell
                                          fill={statusColors.completed}
                                          className="transition-all duration-200 hover:opacity-80"
                                        />
                                      </Bar>
                                      <Bar
                                        dataKey="tasks.inProgress"
                                        name="In Progress"
                                        stackId="a"
                                        fill={statusColors.inProgress}
                                      >
                                        <Cell
                                          fill={statusColors.inProgress}
                                          className="transition-all duration-200 hover:opacity-80"
                                        />
                                      </Bar>
                                      <Bar
                                        dataKey="tasks.overdue"
                                        name="Overdue"
                                        stackId="a"
                                        fill={statusColors.overdue}
                                        radius={[4, 0, 0, 4]}
                                      >
                                        <Cell
                                          fill={statusColors.overdue}
                                          className="transition-all duration-200 hover:opacity-80"
                                        />
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Efficiency</span>
                                      <span className="font-medium">
                                        {Math.round(member.tasks.efficiency * 100)}%
                                      </span>
                                    </div>
                                    <Progress value={member.tasks.efficiency * 100} className="h-2" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">On Time Rate</span>
                                      <span className="font-medium">
                                        {Math.round(member.tasks.onTimeRate * 100)}%
                                      </span>
                                    </div>
                                    <Progress value={member.tasks.onTimeRate * 100} className="h-2" />
                                  </div>
                                  <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Task Completion</span>
                                      <span className="font-medium">
                                        {Math.round(completionRate * 100)}%
                                      </span>
                                    </div>
                                    <Progress value={completionRate * 100} className="h-2" />
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <h5 className="text-xs font-medium text-muted-foreground mb-2">Skills</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {member.skills.map((skill, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <User className="h-10 w-10 text-muted-foreground mb-2" />
                <h4 className="text-sm font-medium">No team members found</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters or adding new team members
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="py-4 px-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={cn("cursor-pointer", currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
                      />
                    </PaginationItem>

                    {getPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={cn("cursor-pointer", currentPage === totalPages ? 'pointer-events-none opacity-50' : '')}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamWorkloadChart;
