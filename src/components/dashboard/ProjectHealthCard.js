'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Custom progress bar implementation used instead of shadcn/ui Progress component
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Circle } from 'lucide-react';

const statusColors = {
  'on track': 'bg-green-500',
  'at risk': 'bg-amber-500',
  'delayed': 'bg-red-500',
  'on hold': 'bg-blue-500',
  'completed': 'bg-purple-500'
};

const statusIcons = {
  'on track': <TrendingUp className="h-4 w-4" />,
  'at risk': <AlertCircle className="h-4 w-4" />,
  'delayed': <Clock className="h-4 w-4" />,
  'on hold': <Circle className="h-3 w-3" />,
  'completed': <CheckCircle2 className="h-4 w-4" />
};

const ProjectHealthCard = ({ project }) => {
  const {
    id,
    name,
    status,
    progress,
    startDate,
    endDate,
    budget,
    spent,
    tasks,
    risks = []
  } = project;

  const completionPercentage = Math.round(progress * 100);
  const budgetUsed = Math.round((spent / budget) * 100);
  const daysRemaining = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription className="text-sm">
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 ${
              status === 'on track' ? 'border-green-500/20 text-green-600' :
              status === 'at risk' ? 'border-amber-500/20 text-amber-600' :
              status === 'delayed' ? 'border-red-500/20 text-red-600' :
              status === 'completed' ? 'border-purple-500/20 text-purple-600' :
              'border-blue-500/20 text-blue-600'
            }`}
          >
            <span className="flex items-center gap-1">
              {statusIcons[status] || <Circle className="h-2 w-2" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className={`relative h-2 w-full overflow-hidden rounded-full ${
            completionPercentage < 30 ? 'bg-red-100' :
            completionPercentage < 70 ? 'bg-amber-100' :
            'bg-green-100'
          }`}>
            <div 
              className={`h-full ${
                completionPercentage < 30 ? 'bg-red-500' :
                completionPercentage < 70 ? 'bg-amber-500' :
                'bg-green-500'
              }`} 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">
              ${spent.toLocaleString()} of ${budget.toLocaleString()} ({budgetUsed}%)
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-100">
            <div 
              className={`h-full ${
                budgetUsed > 90 ? 'bg-red-500' :
                budgetUsed > 70 ? 'bg-amber-500' :
                'bg-blue-500'
              }`} 
              style={{ width: `${budgetUsed}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Timeline</span>
            <span className={`font-medium ${
              isOverdue ? 'text-red-500' : 'text-foreground'
            }`}>
              {isOverdue ? 
                `${Math.abs(daysRemaining)} days overdue` : 
                `${daysRemaining} days remaining`}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-muted mt-1">
              <div 
                style={{ width: `${completionPercentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  status === 'on track' ? 'bg-green-500' :
                  status === 'at risk' ? 'bg-amber-500' :
                  status === 'delayed' ? 'bg-red-500' :
                  status === 'completed' ? 'bg-purple-500' :
                  'bg-blue-500'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Task Summary */}
        <div className="mt-auto pt-2 border-t">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tasks: {tasks.completed} of {tasks.total} completed</span>
            <span className="font-medium">
              {Math.round((tasks.completed / tasks.total) * 100)}%
            </span>
          </div>
          
          {risks.length > 0 && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">Risks:</div>
              <div className="space-y-1">
                {risks.slice(0, 2).map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span className="line-clamp-2">{risk}</span>
                  </div>
                ))}
                {risks.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{risks.length - 2} more risk{risks.length > 3 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHealthCard;
