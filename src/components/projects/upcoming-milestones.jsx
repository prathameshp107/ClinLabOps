"use client"

import { Flag, Calendar } from "lucide-react"
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