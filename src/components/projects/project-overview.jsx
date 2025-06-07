"use client"

import { BarChart3, FileText, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RecentActivity } from "./recent-activity"
import { UpcomingMilestones } from "./upcoming-milestones"
import { TaskStatusOverview } from "./task-status-overview"
import { PriorityBreakdown } from "./priority-breakdown"
import { TeamWorkload } from "./team-workload"

const StatProgress = ({ label, value, total, progress, color = "blue" }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}/{total}</span>
    </div>
    <Progress
      value={progress}
      className={`h-1.5 rounded-full bg-${color}-100`}
      indicatorClassName={`bg-${color}-500`}
    />
  </div>
);

export function ProjectOverview({ project }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Project Description */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="px-4 py-3 border-b border-gray-100">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {project.description || "This project aims to develop a new laboratory management system that streamlines sample tracking, experiment scheduling, and result reporting."}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-900">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(project.tags || ["Research", "Development", "Laboratory", "Software"]).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-gray-50 text-gray-700 border-gray-200 px-2 py-0.5 text-xs font-medium rounded"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={project.activities} team={project.team} />

        {/* Upcoming Milestones */}
        <UpcomingMilestones milestones={project.milestones} />

        {/* Priority Breakdown */}
        <PriorityBreakdown />
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Project Stats */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="px-4 py-3 border-b border-gray-100">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <StatProgress
              label="Tasks"
              value="12"
              total="20"
              progress={60}
              color="blue"
            />
            <StatProgress
              label="Budget"
              value="$8,500"
              total="$15,000"
              progress={56}
              color="green"
            />
            <StatProgress
              label="Timeline"
              value="45"
              total="90 days"
              progress={50}
              color="yellow"
            />
          </CardContent>
        </Card>

        {/* Task Status Overview */}
        <TaskStatusOverview />

        {/* Team Workload */}
        <TeamWorkload />
      </div>
    </div>
  )
}