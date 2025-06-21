"use client";
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, RadialBarChart, RadialBar, ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

// Sample data - replace with actual API calls in production
const generateTaskData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      completed: Math.floor(Math.random() * 20) + 5,
      created: Math.floor(Math.random() * 15) + 5,
      overdue: Math.floor(Math.random() * 10)
    });
  }
  
  return data;
};

const taskData = [
  { name: 'Completed', value: 68, color: '#10B981' },
  { name: 'In Progress', value: 42, color: '#3B82F6' },
  { name: 'Overdue', value: 15, color: '#F59E0B' },
  { name: 'Not Started', value: 25, color: '#9CA3AF' },
];

const priorityData = [
  { name: 'High', value: 35, color: '#EF4444' },
  { name: 'Medium', value: 85, color: '#F59E0B' },
  { name: 'Low', value: 30, color: '#10B981' },
];

const teamData = [
  { name: 'Alex J.', tasks: 12, completed: 8, color: '#8B5CF6' },
  { name: 'Sam P.', tasks: 15, completed: 12, color: '#3B82F6' },
  { name: 'Jordan M.', tasks: 8, completed: 5, color: '#10B981' },
  { name: 'Taylor R.', tasks: 10, completed: 7, color: '#F59E0B' },
];

const agingData = [
  { name: '0-3 days', value: 45, color: '#10B981' },
  { name: '4-7 days', value: 30, color: '#3B82F6' },
  { name: '8-14 days', value: 15, color: '#F59E0B' },
  { name: '15+ days', value: 10, color: '#EF4444' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg text-sm">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex justify-between items-center gap-4">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
            </div>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TaskAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  
  const timeRanges = {
    week: 7,
    month: 30,
    quarter: 90
  };
  
  const chartData = generateTaskData(timeRanges[timeRange] || 30);
  const totalTasks = taskData.reduce((sum, item) => sum + item.value, 0);
  const completionRate = ((taskData[0].value / totalTasks) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Analytics</h2>
          <p className="text-muted-foreground">Track and analyze task performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" className="ml-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📋</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">✅</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskData[0].value}</div>
              <p className="text-xs text-muted-foreground">
                {completionRate}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskData[1].value}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((taskData[1].value / totalTasks) * 100)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">⚠️</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskData[2].value}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((taskData[2].value / totalTasks) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
              <CardDescription>Distribution of tasks by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Priority</CardTitle>
              <CardDescription>Distribution of tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="trends" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Task Completion Trends</CardTitle>
                <CardDescription>Track task completion over time</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setTimeRange('week')}>
                  Week
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTimeRange('month')}>
                  Month
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTimeRange('quarter')}>
                  Quarter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--muted))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--muted))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="created" 
                    name="Tasks Created"
                    stroke="#8B5CF6" 
                    fill="url(#colorCreated)" 
                    fillOpacity={0.4}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    name="Tasks Completed"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overdue" 
                    name="Tasks Overdue"
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Aging</CardTitle>
              <CardDescription>How long tasks have been in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="20%" 
                    outerRadius="100%" 
                    barSize={10}
                    data={agingData}
                  >
                    <RadialBar
                      label={{ 
                        position: 'insideStart', 
                        fill: 'hsl(var(--foreground))',
                        fontSize: 12,
                      }}
                      background
                      dataKey="value"
                    >
                      {agingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RadialBar>
                    <Legend 
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      formatter={(value, entry, index) => {
                        const data = agingData[index];
                        return (
                          <span className="text-xs text-muted-foreground">
                            {data.name}: {data.value}%
                          </span>
                        );
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Daily completion rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--muted))' }}
                      axisLine={{ stroke: 'hsl(var(--muted))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--muted))' }}
                      axisLine={{ stroke: 'hsl(var(--muted))' }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Completion Rate']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={data => {
                        const item = chartData.find(d => d.date === data.date);
                        return item ? (item.completed / item.created * 100).toFixed(0) : 0;
                      }} 
                      name="Completion Rate"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="team" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Workload</CardTitle>
            <CardDescription>Task distribution across team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--muted))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--muted))' }}
                    axisLine={{ stroke: 'hsl(var(--muted))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="completed" 
                    name="Completed"
                    stackId="a"
                    radius={[0, 4, 4, 0]}
                    fill="hsl(var(--primary))"
                  />
                  <Bar 
                    dataKey={data => data.tasks - data.completed} 
                    name="In Progress"
                    stackId="a"
                    radius={[0, 4, 4, 0]}
                    fill="hsl(var(--muted))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Team member performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamData.map((member, index) => {
                const completionRate = Math.round((member.completed / member.tasks) * 100) || 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.completed} of {member.tasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{completionRate}%</p>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{
                          width: `${completionRate}%`,
                          backgroundColor: member.color,
                          transition: 'width 0.5s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TaskAnalytics;