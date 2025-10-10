'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, PieChart as PieChartIcon, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle, ChevronRight, ArrowRight, PauseCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  Scatter
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/services/projectService";

const COLORS = {
  'on track': '#10B981',
  'at risk': '#F59E0B',
  'delayed': '#EF4444',
  'on hold': '#3B82F6',
  'completed': '#8B5CF6',
  'budget': '#3B82F6',
  'spent': '#8B5CF6',
  'overbudget': '#EF4444'
};

const STATUS_ICONS = {
  'on track': <CheckCircle className="h-4 w-4" />,
  'at risk': <AlertTriangle className="h-4 w-4" />,
  'delayed': <Clock className="h-4 w-4" />,
  'on hold': <PauseCircle className="h-4 w-4" />,
  'completed': <CheckCircle className="h-4 w-4" />
};

const STATUS_DESCRIPTIONS = {
  'on track': 'Projects progressing as planned',
  'at risk': 'Projects with potential delays or issues',
  'delayed': 'Projects behind schedule',
  'on hold': 'Projects currently paused',
  'completed': 'Successfully completed projects'
};

// Enhanced Custom Tooltip
const EnhancedCustomTooltip = ({ active, payload, label, dataKey, unit, name }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/80 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg text-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-item-${index}`} className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-semibold text-foreground">
              {`${entry.value}${unit || ''}`}
            </span>
          </div>
        ))}
        {data.status && (
          <div className="flex justify-between items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#A855F7' }} />
              <span className="text-muted-foreground">Status:</span>
            </div>
            <span className="font-semibold text-foreground capitalize">{data.status}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ProjectAnalytics = ({ projects: initialProjects = [] }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      // Only fetch if we don't have initial projects or if we want to refresh
      if (initialProjects.length === 0 || isLoading) {
        try {
          setIsLoading(true);
          setError(null);
          const projectData = await getProjects();
          setProjects(Array.isArray(projectData) ? projectData : []);
        } catch (err) {
          setError(err.message);
          console.error('Error fetching projects:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [initialProjects.length, isLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
    // This will trigger the useEffect to fetch fresh data
  };

  // Process data for charts with enhanced status information
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status?.toLowerCase() || 'unknown';
    if (!acc[status]) {
      acc[status] = {
        count: 0,
        projects: [],
        totalTasks: 0,
        completedTasks: 0
      };
    }
    acc[status].count += 1;
    acc[status].projects.push(project);

    // Calculate task counts if available
    if (project.tasks) {
      const totalTasks = project.tasks.total || project.tasks.length || 0;
      const completedTasks = project.tasks.completed ||
        (Array.isArray(project.tasks) ? project.tasks.filter(t => t.status === 'completed').length : 0) || 0;
      acc[status].totalTasks += totalTasks;
      acc[status].completedTasks += completedTasks;
    }

    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, data]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: data.count,
    count: data.count,
    projects: data.projects,
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    progress: data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0,
    color: COLORS[status] || '#8884d8',
    icon: STATUS_ICONS[status] || <FileText className="h-4 w-4" />,
    description: STATUS_DESCRIPTIONS[status] || 'Project status',
    status: status
  }));

  const progressData = projects.map(project => {
    // Calculate progress based on available data
    let progress = 0;
    if (project.progress !== undefined) {
      progress = project.progress * 100;
    } else if (project.tasks) {
      const totalTasks = project.tasks.total || project.tasks.length || 0;
      const completedTasks = project.tasks.completed ||
        (Array.isArray(project.tasks) ? project.tasks.filter(t => t.status === 'completed').length : 0) || 0;
      progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    }

    return {
      name: project.name || 'Unnamed Project',
      progress: progress,
      status: project.status?.toLowerCase() || 'unknown',
      budget: (project.budget || 0) / 1000, // in thousands for better scaling
      spent: (project.spent || 0) / 1000,
      budgetUtilization: (project.budget && project.spent) ? (project.spent / project.budget) * 100 : 0,
      tasks: progress,
      daysRemaining: project.endDate ? Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0
    };
  });

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
        {`${Math.round(value)}%`}
      </text>
    );
  };

  // Loading state
  if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Project Analytics</h2>
            <p className="text-muted-foreground">
              Loading project performance and metrics...
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing
            </Button>
            <Tabs value={timeRange} className="w-[180px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-pulse">Loading chart data...</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Project Analytics</h2>
            <p className="text-muted-foreground">
              Error loading project data: {error}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Tabs value={timeRange} className="w-[180px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardContent className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Failed to load project data</h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading the project analytics. Please try again.
              </p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Analytics</h2>
          <p className="text-muted-foreground">
            Visual overview of project performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Enhanced Status Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Project Status Distribution
                </CardTitle>
                <CardDescription>Overview of projects by status with detailed tooltips</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {statusData.map((entry, index) => (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${index})`}
                        stroke="#ffffff"
                        strokeWidth={2}
                        style={{
                          filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.1))',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover/95 backdrop-blur-sm p-4 border border-border rounded-lg shadow-xl text-sm w-64">
                            <div className="flex items-center gap-3 mb-3">
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: `${data.color}20`,
                                  color: data.color
                                }}
                              >
                                {data.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-base">{data.name}</h3>
                                <p className="text-xs text-muted-foreground">{data.description}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Projects</span>
                                  <span className="font-medium text-foreground">
                                    {data.count} {data.count === 1 ? 'project' : 'projects'}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: '100%',
                                      backgroundColor: data.color,
                                      opacity: 0.2
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Task Completion</span>
                                  <span className="font-medium text-foreground">
                                    {data.completedTasks} of {data.totalTasks} tasks
                                  </span>
                                </div>
                                <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                      width: `${data.progress}%`,
                                      backgroundColor: data.color,
                                      backgroundImage: `linear-gradient(90deg, ${data.color} 0%, ${data.color}99 100%)`
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-muted-foreground">Progress</span>
                                  <span className="text-xs font-medium text-foreground">
                                    {data.progress}% complete
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-border">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs h-8 gap-1.5"
                                >
                                  View {data.name} Projects
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    content={({ payload }) => (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {payload.map((entry, index) => {
                          const data = statusData[index];
                          return (
                            <div
                              key={`legend-${index}`}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-muted-foreground">
                                {data.name} ({data.count})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Project Progress Comparison
            </CardTitle>
            <CardDescription>Progress percentage across all projects</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<EnhancedCustomTooltip dataKey="progress" unit="%" />} />
                <Legend />
                <Bar
                  dataKey="progress"
                  name="Progress %"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right' }}
                >
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.status] || '#8884d8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Spent */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget vs Spent (in $K)
            </CardTitle>
            <CardDescription>Comparison of budgeted vs actual spending</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={progressData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Amount ($K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<EnhancedCustomTooltip unit="K" />} />
                <Legend />
                <Bar
                  dataKey="budget"
                  name="Budget"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="spent"
                  name="Spent"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="budgetUtilization"
                  name="Utilization %"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  yAxisId="right"
                />
                <YAxis yAxisId="right" orientation="right" domain={[0, 150]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Task Completion Rate
            </CardTitle>
            <CardDescription>Percentage of completed tasks by project</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<EnhancedCustomTooltip dataKey="tasks" unit="%" />} />
                <Legend />
                <Bar
                  dataKey="tasks"
                  name="Task Completion %"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  label={CustomLabel}
                >
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.status] || '#10B981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Risk Analysis
            </CardTitle>
            <CardDescription>Projects with the highest identified risks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects
                .filter(p => p.risks && p.risks.length > 0)
                .sort((a, b) => (b.risks?.length || 0) - (a.risks?.length || 0))
                .slice(0, 3) // Show top 3 projects with most risks
                .map(project => (
                  <div key={project.id} className="p-3 bg-muted/50 rounded-lg border border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{project.name}</h4>
                      <Badge variant="destructive" className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {project.risks.length} {project.risks.length > 1 ? 'Risks' : 'Risk'}
                      </Badge>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                      {project.risks.map((risk, index) => (
                        <li key={index}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                ))}

              {/* Show message if no risks found */}
              {projects.filter(p => p.risks && p.risks.length > 0).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No significant risks identified in current projects</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAnalytics;