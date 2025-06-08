"use client"

import { Flag, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MilestoneStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(status)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export function UpcomingMilestones({ milestones }) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
          <Flag className="h-4 w-4 text-gray-500" />
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {milestones?.map((milestone, i) => (
            <div 
              key={i} 
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {milestone.name}
                    </h4>
                    <MilestoneStatus status={milestone.status} />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {milestone.description}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{milestone.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}