"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Plus, MoreVertical, Mail, Phone, Calendar, MapPin, Building, UserCheck, UserX, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { defaultTeam } from "@/data/projects-data"
import { Mail as LucideMail, MoreHorizontal, UserCog, UserMinus, UserPlus, Shield, Star, MessageSquare, Award, Activity, Crown, Zap } from "lucide-react"

const MemberRoleBadge = ({ role, isLead = false }) => {
  const getRoleConfig = (role) => {
    const configs = {
      'Project Lead': {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        text: 'text-white',
        icon: Crown,
        glow: 'shadow-blue-200'
      },
      'Data Scientist': {
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        text: 'text-white',
        icon: Zap,
        glow: 'shadow-purple-200'
      },
      'Developer': {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        text: 'text-white',
        icon: Shield,
        glow: 'shadow-green-200'
      },
      'Designer': {
        bg: 'bg-gradient-to-r from-pink-500 to-pink-600',
        text: 'text-white',
        icon: Star,
        glow: 'shadow-pink-200'
      },
      'QA Engineer': {
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
        text: 'text-white',
        icon: Award,
        glow: 'shadow-amber-200'
      }
    };
    return configs[role] || {
      bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-white',
      icon: Users,
      glow: 'shadow-gray-200'
    };
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} shadow-lg ${config.glow} hover:shadow-xl transition-all duration-200`}>
      <Icon className="h-3 w-3" />
      {role}
    </div>
  );
};

const TeamMemberCard = ({ member, index, onAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400 border-green-300';
      case 'away': return 'bg-yellow-400 border-yellow-300';
      case 'busy': return 'bg-red-400 border-red-300';
      default: return 'bg-gray-300 border-gray-200';
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 80) return 'text-red-600 bg-red-50';
    if (workload >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="group relative p-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 rounded-xl mx-2 my-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar with Status */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-gray-100 group-hover:ring-blue-200">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {member.name.split(' ').map(n => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status || 'online')}`}></div>
          </div>

          {/* Member Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                {member.name}
              </h3>
              {member.role === 'Project Lead' && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs rounded-full font-semibold shadow-md">
                  <Crown className="h-3 w-3" />
                  Lead
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <MemberRoleBadge role={member.role} isLead={member.role === 'Project Lead'} />
              <span className="text-sm text-gray-500 font-medium">{member.department}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Joined {member.joinedAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className={`px-2 py-0.5 rounded-full font-medium ${getWorkloadColor(member.workload || 65)}`}>
                  {member.workload || 65}% workload
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden group-hover:flex items-center gap-2 transition-all duration-200">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-all duration-200"
              onClick={() => onAction?.('message', member)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 rounded-xl transition-all duration-200"
              onClick={() => onAction?.('email', member)}
            >
              <LucideMail className="h-4 w-4" />
            </Button>
          </div>

          {/* Performance Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-semibold text-gray-600">Performance</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= (member.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-gray-200/50 shadow-xl rounded-2xl p-2">
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-blue-50 transition-colors">
                <LucideMail className="h-4 w-4 mr-3 text-blue-600" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-purple-50 transition-colors">
                <UserCog className="h-4 w-4 mr-3 text-purple-600" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-green-50 transition-colors">
                <Award className="h-4 w-4 mr-3 text-green-600" />
                View Performance
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                <UserMinus className="h-4 w-4 mr-3" />
                Remove from Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export function ProjectTeam({ team, onAddMember }) {
  const mockTeam = team || defaultTeam;

  const handleMemberAction = (action, member) => {
    console.log(`${action} action for`, member.name);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="px-6 py-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span>Project Team</span>
              <div className="text-sm font-normal text-gray-500 mt-0.5">
                {mockTeam.length} active members
              </div>
            </div>
          </CardTitle>
          
          <div className="flex items-center gap-3">
            {/* Team Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 bg-white/80 rounded-xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{mockTeam.filter(m => m.status === 'online').length} Online</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{mockTeam.filter(m => m.status === 'away').length} Away</span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={onAddMember}
              className="h-10 px-4 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {mockTeam.map((member, index) => (
            <TeamMemberCard
              key={index}
              member={member}
              index={index}
              onAction={handleMemberAction}
            />
          ))}
        </div>

        {/* Team Summary */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-gray-100/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                <span className="text-gray-600">Average Workload: <span className="font-semibold text-gray-900">71%</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-gray-600">Team Rating: <span className="font-semibold text-gray-900">4.4/5</span></span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
              View All Analytics
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}