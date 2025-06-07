"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const teamWorkloadData = [
  { name: "Unassigned", value: 64, avatarFallback: "UA", color: "#6b7280" },
  { name: "Divyesh Bohra", value: 15, avatarFallback: "DB", color: "#3b82f6" },
  { name: "chaitail.sanap", value: 10, avatarFallback: "CS", color: "#f97316" },
  { name: "Mandar Deshpande", value: 5, avatarFallback: "MD", color: "#ef4444" },
  { name: "Pooja Misal", value: 6, avatarFallback: "PM", color: "#8b5cf6" },
];

export function TeamWorkload() {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-medium text-gray-900">
          Team workload
        </CardTitle>
        <p className="text-sm text-gray-600 mt-0.5">
          Monitor the capacity of your team.{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Reassign work items to get the right balance
          </a>
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-[120px_1fr] gap-x-4 items-center mb-2 text-sm font-semibold text-gray-700">
          <div>Assignee</div>
          <div>Work distribution</div>
        </div>
        <div className="space-y-4">
          {teamWorkloadData.map((member, index) => (
            <div key={index} className="grid grid-cols-[120px_1fr] gap-x-4 items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback style={{ backgroundColor: member.color }} className="text-white text-sm">
                    {member.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {member.name}
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-sm font-semibold text-gray-800 w-12 flex-shrink-0">
                        {member.value}%
                      </span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${member.value}%`, backgroundColor: member.color }}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.name}: {member.value}% workload</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 