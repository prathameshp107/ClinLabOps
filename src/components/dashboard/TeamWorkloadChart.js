'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button"


// Mock data for team members and their tasks
const mockTeamData = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Team Lead',
    avatar: '/avatars/01.png',
    tasks: {
      completed: 12,
      inProgress: 3,
      overdue: 1,
      total: 16
    }
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'Frontend Dev',
    avatar: '/avatars/02.png',
    tasks: {
      completed: 8,
      inProgress: 5,
      overdue: 0,
      total: 13
    }
  },
  {
    id: 3,
    name: 'James Wilson',
    role: 'Backend Dev',
    avatar: '/avatars/03.png',
    tasks: {
      completed: 15,
      inProgress: 2,
      overdue: 2,
      total: 19
    }
  },
  {
    id: 4,
    name: 'Sarah Kim',
    role: 'UI/UX Designer',
    avatar: '/avatars/04.png',
    tasks: {
      completed: 10,
      inProgress: 4,
      overdue: 1,
      total: 15
    }
  },
  {
    id: 5,
    name: 'David Lee',
    role: 'QA Engineer',
    avatar: '/avatars/05.png',
    tasks: {
      completed: 7,
      inProgress: 6,
      overdue: 0,
      total: 13
    }
  },
];

const statusColors = {
  completed: '#10b981',
  inProgress: '#3b82f6',
  overdue: '#ef4444'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.tasks.completed + data.tasks.inProgress + data.tasks.overdue;

    return (
      <div className="bg-background p-4 border rounded-lg shadow-lg w-64">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium text-foreground">
              {data.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium">{data.name}</p>
            <p className="text-xs text-muted-foreground">{data.role}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Completed</span>
            </div>
            <span className="text-xs font-medium">
              {data.tasks.completed} ({Math.round((data.tasks.completed / total) * 100)}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs">In Progress</span>
            </div>
            <span className="text-xs font-medium">
              {data.tasks.inProgress} ({Math.round((data.tasks.inProgress / total) * 100)}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs">Overdue</span>
            </div>
            <span className="text-xs font-medium">
              {data.tasks.overdue} ({data.tasks.overdue > 0 ? Math.round((data.tasks.overdue / total) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TeamWorkloadChart = () => {
  const [sortBy, setSortBy] = useState('total');
  const [isLoading, setIsLoading] = useState(false);

  // Sort team members based on selected criteria
  const sortedTeamData = useMemo(() => {
    const data = [...mockTeamData];

    return data.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'role') {
        return a.role.localeCompare(b.role);
      } else {
        return b.tasks[sortBy] - a.tasks[sortBy];
      }
    });
  }, [sortBy]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Team Workload</CardTitle>
            <CardDescription>Task distribution across team members</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tabs
              defaultValue="total"
              value={sortBy}
              onValueChange={setSortBy}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="total" className="text-xs">Total</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                <TabsTrigger value="overdue" className="text-xs">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-9"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px] p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedTeamData}
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
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--muted))' }}
              axisLine={{ stroke: 'hsl(var(--muted))' }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'hsl(var(--muted))', fillOpacity: 0.3 }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'center',
                gap: '16px'
              }}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  {value === 'completed' ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Completed
                    </>
                  ) : value === 'inProgress' ? (
                    <>
                      <Clock className="h-3 w-3 text-blue-500" />
                      In Progress
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      Overdue
                    </>
                  )}
                </span>
              )}
            />
            <Bar
              dataKey="tasks.completed"
              name="Completed"
              stackId="a"
              fill={statusColors.completed}
              radius={[0, 4, 4, 0]}
            >
              {sortedTeamData.map((entry, index) => (
                <Cell
                  key={`completed-cell-${index}`}
                  fill={statusColors.completed}
                  className="transition-all duration-200 hover:opacity-80"
                />
              ))}
            </Bar>
            <Bar
              dataKey="tasks.inProgress"
              name="In Progress"
              stackId="a"
              fill={statusColors.inProgress}
            >
              {sortedTeamData.map((entry, index) => (
                <Cell
                  key={`inprogress-cell-${index}`}
                  fill={statusColors.inProgress}
                  className="transition-all duration-200 hover:opacity-80"
                />
              ))}
            </Bar>
            <Bar
              dataKey="tasks.overdue"
              name="Overdue"
              stackId="a"
              fill={statusColors.overdue}
              radius={[4, 0, 0, 4]}
            >
              {sortedTeamData.map((entry, index) => (
                <Cell
                  key={`overdue-cell-${index}`}
                  fill={statusColors.overdue}
                  className="transition-all duration-200 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamWorkloadChart;
