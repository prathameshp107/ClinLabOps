'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, PieChart as PieChartIcon, TrendingUp, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
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

// Mock data - in a real app, this would come from an API
const mockProjects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    status: 'on track',
    progress: 0.65,
    startDate: '2025-05-15',
    endDate: '2025-07-20',
    budget: 50000,
    spent: 32000,
    tasks: {
      total: 45,
      completed: 28,
      inProgress: 12,
      overdue: 5
    },
    risks: [
      'Potential delay in content delivery from marketing team',
      'Third-party API integration pending approval'
    ]
  },
  {
    id: 'p2',
    name: 'Mobile App',
    status: 'at risk',
    progress: 0.35,
    startDate: '2025-06-01',
    endDate: '2025-08-15',
    budget: 75000,
    spent: 60000,
    tasks: {
      total: 68,
      completed: 22,
      inProgress: 25,
      overdue: 8
    },
    risks: [
      'Backend API performance issues',
      'App store review process may cause delays'
    ]
  },
  {
    id: 'p3',
    name: 'Data Migration',
    status: 'delayed',
    progress: 0.2,
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    budget: 30000,
    spent: 28000,
    tasks: {
      total: 30,
      completed: 6,
      inProgress: 8,
      overdue: 4
    },
    risks: [
      'Data validation taking longer than expected',
      'Legacy system compatibility issues'
    ]
  },
  {
    id: 'p4',
    name: 'Marketing Campaign',
    status: 'on track',
    progress: 0.8,
    startDate: '2025-06-10',
    endDate: '2025-07-30',
    budget: 45000,
    spent: 35000,
    tasks: {
      total: 38,
      completed: 31,
      inProgress: 5,
      overdue: 2
    },
    risks: [
      'Creative assets approval pending'
    ]
  },
  {
    id: 'p5',
    name: 'Server Upgrade',
    status: 'on hold',
    progress: 0.1,
    startDate: '2025-06-20',
    endDate: '2025-07-10',
    budget: 20000,
    spent: 5000,
    tasks: {
      total: 15,
      completed: 2,
      inProgress: 3,
      overdue: 0
    },
    risks: [
      'Waiting for hardware delivery'
    ]
  }
];

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

const ProjectAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // Process data for charts - simplified to ensure proper pie chart rendering
  const statusCounts = mockProjects.reduce((acc, project) => {
    const status = project.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: COLORS[status] || '#8884d8'
  }));

  const progressData = mockProjects.map(project => ({
    name: project.name,
    progress: project.progress * 100,
    status: project.status,
    budget: project.budget / 1000, // in thousands for better scaling
    spent: project.spent / 1000,
    budgetUtilization: (project.spent / project.budget) * 100,
    tasks: project.tasks.completed / project.tasks.total * 100,
    daysRemaining: Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))
  }));

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
        {`${Math.round(value)}%`}
      </text>
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Project Status Distribution
                </CardTitle>
                <CardDescription>Overview of projects by status</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  On Track
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                  At Risk
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  Delayed
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<EnhancedCustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry, index) => {
                      const data = statusData[index];
                      return (
                        <div className="flex items-center gap-1 text-xs">
                          <div
                            className="w-3 h-3 rounded-full mr-1"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                      );
                    }}
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
              {mockProjects
                .filter(p => p.risks.length > 0)
                .sort((a, b) => b.risks.length - a.risks.length)
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectAnalytics;