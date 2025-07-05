"use client"

import { Flag, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { milestoneStatusConfig } from "@/data/projects-data"

const MilestoneStatus = ({ status }) => {
  const config = milestoneStatusConfig[status] || milestoneStatusConfig.pending;

  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium px-2 py-0.5 rounded ${config.color}`}
    >
      {config.label}
    </Badge>
  );
};

const getMilestoneStatus = (milestone) => {
  const today = new Date();
  const milestoneDate = new Date(milestone.date);
  
  if (milestone.completed) return 'completed';
  if (milestoneDate < today) return 'overdue';
  if (milestoneDate - today < 7 * 24 * 60 * 60 * 1000) return 'in_progress'; // Within 7 days
  return 'upcoming';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export function UpcomingMilestones({ project }) {
  // Calculate milestones from project data
  const calculateMilestones = () => {
    if (!project?.milestones || project.milestones.length === 0) return [];

    return project.milestones.map(milestone => ({
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      date: milestone.date,
      status: getMilestoneStatus(milestone),
      completed: milestone.completed || false
    })).sort((a, b) => {
      // Sort by date, upcoming first, then by completion status
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;
      return dateA - dateB;
    });
  };

  const milestones = calculateMilestones();

  // Show message when no milestones are available
  if (!project?.milestones || project.milestones.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-gray-100/50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Flag className="h-5 w-5 text-purple-600" />
            </div>
            Upcoming Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Flag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Milestones Available</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
              This project doesn't have any milestones defined yet. Add milestones to track important project deadlines and achievements.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="px-6 py-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-gray-100/50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Flag className="h-5 w-5 text-purple-600" />
          </div>
          Upcoming Milestones
          <Badge variant="outline" className="ml-auto">
            {milestones.filter(m => m.status !== 'completed').length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {milestones.map((milestone, i) => (
            <div 
              key={milestone.id || i} 
              className={`p-4 hover:bg-gray-50/80 transition-colors ${
                milestone.status === 'overdue' ? 'bg-red-50/30' : 
                milestone.status === 'completed' ? 'bg-green-50/30' : 
                milestone.status === 'in_progress' ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {milestone.name}
                    </h4>
                    <MilestoneStatus status={milestone.status} />
                    {milestone.status === 'overdue' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {milestone.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {milestone.status === 'in_progress' && (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {milestone.description}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(milestone.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}