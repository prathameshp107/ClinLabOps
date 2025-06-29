"use client"

import { Activity, CheckCircle2, MessageCircle, Upload, UserPlus, Plus, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { defaultActivities, defaultTeam } from "@/data/projects-data"

const ActivityIcon = ({ type }) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'task_completed':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bg: 'bg-gradient-to-br from-emerald-100 to-green-100',
          ring: 'ring-emerald-200',
          glow: 'shadow-emerald-200'
        };
      case 'comment_added':
        return {
          icon: MessageCircle,
          color: 'text-blue-600',
          bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
          ring: 'ring-blue-200',
          glow: 'shadow-blue-200'
        };
      case 'document_uploaded':
        return {
          icon: Upload,
          color: 'text-purple-600',
          bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
          ring: 'ring-purple-200',
          glow: 'shadow-purple-200'
        };
      case 'member_joined':
        return {
          icon: UserPlus,
          color: 'text-orange-600',
          bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
          ring: 'ring-orange-200',
          glow: 'shadow-orange-200'
        };
      case 'task_created':
        return {
          icon: Plus,
          color: 'text-indigo-600',
          bg: 'bg-gradient-to-br from-indigo-100 to-blue-100',
          ring: 'ring-indigo-200',
          glow: 'shadow-indigo-200'
        };
      default:
        return {
          icon: Activity,
          color: 'text-slate-600',
          bg: 'bg-gradient-to-br from-slate-100 to-gray-100',
          ring: 'ring-slate-200',
          glow: 'shadow-slate-200'
        };
    }
  };

  const config = getIconConfig(type);
  const IconComponent = config.icon;

  return (
    <div className={`
      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
      ${config.bg} ${config.color} ring-2 ${config.ring} shadow-lg ${config.glow}
      group-hover:scale-110 group-hover:shadow-xl
    `}>
      <IconComponent className="h-5 w-5" />
    </div>
  );
};

const ActivityBadge = ({ type }) => {
  const getBadgeConfig = (type) => {
    switch (type) {
      case 'task_completed':
        return { text: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'comment_added':
        return { text: 'Comment', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'document_uploaded':
        return { text: 'Upload', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'member_joined':
        return { text: 'Joined', color: 'bg-orange-100 text-orange-800 border-orange-300' };
      case 'task_created':
        return { text: 'Created', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      default:
        return { text: 'Activity', color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const config = getBadgeConfig(type);

  return (
    <Badge className={`text-xs px-2 py-1 rounded-lg font-medium border ${config.color} transition-all duration-200`}>
      {config.text}
    </Badge>
  );
};

export function RecentActivity({ activities = [], team = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const activityData = activities.length > 0 ? activities : defaultActivities;
  const teamData = team.length > 0 ? team : defaultTeam;

  const getTimeColor = (time) => {
    if (time.includes('minute')) return 'text-emerald-600 bg-emerald-50';
    if (time.includes('hour')) return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="bg-white border-0 shadow-2xl shadow-slate-200/50 overflow-hidden">
      <CardHeader className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              Recent Activity
            </CardTitle>
            <p className="text-sm text-slate-300 mt-1">
              Latest team updates and progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {teamData.slice(0, 3).map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-white ring-2 ring-white/20">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    {getUserInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {activityData.map((activity, i) => {
            const isHovered = hoveredIndex === i;
            const teamMember = teamData.find(m => m.id === activity.userId);

            return (
              <div
                key={activity.id || i}
                className={`
                  group flex items-start gap-4 p-5 border-b border-slate-100/50 last:border-b-0
                  transition-all duration-300 ease-out cursor-pointer relative overflow-hidden
                  ${isHovered ? 'bg-gradient-to-r from-slate-50/80 to-blue-50/30 transform scale-[1.01]' : 'hover:bg-slate-50/50'}
                `}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated background gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent
                  transition-all duration-500 transform
                  ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
                `} />

                <div className="relative z-10 flex-shrink-0">
                  <Avatar className={`
                    h-12 w-12 border-3 transition-all duration-300
                    ${isHovered ? 'border-blue-200 shadow-lg scale-110' : 'border-slate-200 shadow-sm'}
                  `}>
                    <AvatarImage
                      src={teamMember?.avatar}
                      alt={activity.user}
                    />
                    <AvatarFallback className="text-sm bg-gradient-to-br from-slate-600 to-slate-700 text-white font-semibold">
                      {getUserInitials(activity.user)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <ActivityIcon type={activity.type} />
                      <ActivityBadge type={activity.type} />
                    </div>
                    <div className={`
                      px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1
                      ${getTimeColor(activity.time)}
                    `}>
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-slate-900 mr-1">{activity.user}</span>
                      {activity.type === 'task_completed' && (
                        <>
                          completed task
                          <span className="mx-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
                            {activity.task}
                          </span>
                        </>
                      )}
                      {activity.type === 'comment_added' && (
                        <>
                          commented on
                          <span className="mx-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                            {activity.task}
                          </span>
                        </>
                      )}
                      {activity.type === 'document_uploaded' && (
                        <>
                          uploaded
                          <span className="mx-1 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                            {activity.document}
                          </span>
                        </>
                      )}
                      {activity.type === 'member_joined' && (
                        <span className="text-slate-700">joined the project team</span>
                      )}
                      {activity.type === 'task_created' && (
                        <>
                          created task
                          <span className="mx-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">
                            {activity.task}
                          </span>
                        </>
                      )}
                    </p>

                    {activity.comment && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-300">
                        <p className="text-sm text-slate-700 italic">"{activity.comment}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Summary */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-800">{activityData.length}</div>
                <div className="text-xs text-slate-600">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {activityData.filter(a => a.type === 'task_completed').length}
                </div>
                <div className="text-xs text-slate-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {teamData.length}
                </div>
                <div className="text-xs text-slate-600">Team Members</div>
              </div>
            </div>
            <Badge className="bg-white text-slate-700 border-slate-300 shadow-sm">
              Live Updates
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}