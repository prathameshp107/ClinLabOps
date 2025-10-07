"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Plus, MoreVertical, Mail, Phone, Calendar, MapPin, Building, UserCheck, UserX, Clock, Beaker, Microscope } from "lucide-react"
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
// Team data will be passed as props or fetched from API
import { Mail as LucideMail, MoreHorizontal, UserCog, UserMinus, UserPlus, Shield, Star, MessageSquare, Award, Activity, Crown, Zap } from "lucide-react"
import { AddMemberModal } from "./add-member-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  memberRoleConfig,
  memberStatusConfig,
  workloadConfig
} from "@/constants"

const MemberRoleBadge = ({ role, isLead = false }) => {
  const config = memberRoleConfig[role] || memberRoleConfig['Lab Technician'];
  const IconComponent = {
    'Crown': Crown,
    'Zap': Zap,
    'Shield': Shield,
    'Star': Star,
    'Award': Award,
    'Beaker': Beaker,
    'Microscope': Microscope,
    'Users': Users
  }[config.icon] || Users;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} shadow-lg ${config.glow} hover:shadow-xl transition-all duration-200 dark:bg-border/20`}>
      <IconComponent className="h-3 w-3" />
      {role}
    </div>
  );
};

const TeamMemberCard = ({ member, index, onAction }) => {
  const statusConfig = memberStatusConfig[member.status || 'online'];
  const workloadLevel = member.workload >= workloadConfig.high.threshold ? 'high' :
    member.workload >= workloadConfig.medium.threshold ? 'medium' : 'low';
  const workloadColor = workloadConfig[workloadLevel].color;

  // Real-time status indicator
  const getStatusIndicator = () => {
    switch (member.status) {
      case 'online':
        return <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-green-400 animate-pulse dark:border-border"></div>;
      case 'away':
        return <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-yellow-400 dark:border-border"></div>;
      case 'busy':
        return <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-red-400 animate-pulse dark:border-border"></div>;
      default:
        return <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-gray-400 dark:border-border"></div>;
    }
  };

  return (
    <div className="group relative p-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all duration-300 rounded-xl mx-2 my-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar with Status */}
          <div className="relative">
            <Avatar className="h-12 w-12 border-3 border-background shadow-lg group-hover:shadow-xl transition-all duration-300 ring-2 ring-muted group-hover:ring-blue-200 dark:ring-border">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {member.name.split(' ').map(n => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            {getStatusIndicator()}
          </div>

          {/* Member Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-blue-900 transition-colors dark:group-hover:text-blue-300">
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
              <span className="text-sm text-muted-foreground font-medium">{member.department}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Joined {member.joinedAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className={`px-2 py-0.5 rounded-full font-medium ${workloadColor} transition-all duration-300 dark:bg-border/20`}>
                  {member.workload || 65}% workload
                </span>
              </div>
              {member.status === 'online' && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium dark:text-green-400">Active</span>
                </div>
              )}
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
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-all duration-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
              onClick={() => onAction?.('message', member)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 rounded-xl transition-all duration-200 dark:hover:bg-green-900/30 dark:hover:text-green-400"
              onClick={() => onAction?.('email', member)}
            >
              <LucideMail className="h-4 w-4" />
            </Button>
          </div>

          {/* Real-time Performance Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Performance</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 transition-all duration-300 ${star <= (member.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            {member.status === 'online' && member.workload > 70 && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium dark:text-blue-400">Working</span>
              </div>
            )}
          </div>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-border/50 shadow-xl rounded-2xl p-2">
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-blue-50 transition-colors dark:hover:bg-blue-900/30">
                <LucideMail className="h-4 w-4 mr-3 text-blue-600 dark:text-blue-400" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-purple-50 transition-colors dark:hover:bg-purple-900/30">
                <UserCog className="h-4 w-4 mr-3 text-purple-600 dark:text-purple-400" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-green-50 transition-colors dark:hover:bg-green-900/30">
                <Award className="h-4 w-4 mr-3 text-green-600 dark:text-green-400" />
                View Performance
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-border/50" />
              <DropdownMenuItem className="text-sm py-3 px-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors dark:hover:bg-red-900/30 dark:text-red-400">
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
  const [realTimeTeam, setRealTimeTeam] = useState(team || []);
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  // Sync realTimeTeam with the team prop when it changes
  useEffect(() => {
    setRealTimeTeam(team || []);
  }, [team]);

  // Real-time status updates
  useEffect(() => {
    const updateMemberStatus = () => {
      setRealTimeTeam(prevTeam =>
        prevTeam.map(member => {
          // Randomly update status (online, away, busy)
          const statuses = ['online', 'away', 'busy'];
          const newStatus = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : member.status;

          // Randomly update workload
          const workloadChange = (Math.random() - 0.5) * 10; // ±5% change
          const newWorkload = Math.max(0, Math.min(100, (member.workload || 65) + workloadChange));

          // Randomly update performance rating
          const ratingChange = (Math.random() - 0.5) * 0.2; // ±0.1 change
          const newRating = Math.max(1, Math.min(5, (member.rating || 4) + ratingChange));

          return {
            ...member,
            status: newStatus,
            workload: Math.round(newWorkload),
            rating: Math.round(newRating * 10) / 10
          };
        })
      );
    };

    // Update every 5-10 seconds
    const interval = setInterval(updateMemberStatus, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time activity simulation
  useEffect(() => {
    const simulateActivity = () => {
      const activities = [
        'Updated task progress',
        'Added new comment',
        'Completed milestone',
        'Started new task',
        'Updated documentation',
        'Joined meeting',
        'Submitted report'
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const randomMember = realTimeTeam[Math.floor(Math.random() * realTimeTeam.length)];

      if (randomMember) {
        const newActivity = {
          id: Date.now(),
          member: randomMember.name,
          action: randomActivity,
          timestamp: new Date().toLocaleTimeString(),
          avatar: randomMember.avatar
        };

        setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep last 5 activities
        console.log(`${randomMember.name} ${randomActivity}`);
      }
    };

    // Simulate activity every 3-8 seconds
    const activityInterval = setInterval(simulateActivity, Math.random() * 5000 + 3000);

    return () => clearInterval(activityInterval);
  }, [realTimeTeam]);

  const handleMemberAction = (action, member) => {
    console.log(`${action} action for`, member.name);
  };

  // Calculate real-time team stats
  const onlineMembers = realTimeTeam.filter(m => m.status === 'online').length;
  const awayMembers = realTimeTeam.filter(m => m.status === 'away').length;
  const busyMembers = realTimeTeam.filter(m => m.status === 'busy').length;
  const averageWorkload = Math.round(realTimeTeam.reduce((sum, m) => sum + (m.workload || 0), 0) / realTimeTeam.length);
  const averageRating = Math.round((realTimeTeam.reduce((sum, m) => sum + (m.rating || 0), 0) / realTimeTeam.length) * 10) / 10;

  return (
    <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="px-6 py-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-border/50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm dark:bg-blue-900/30">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Project Team</span>
                {recentActivities.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium dark:text-green-400">Live</span>
                  </div>
                ) : realTimeTeam.length === 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Empty</span>
                  </div>
                )}
              </div>
              <div className="text-sm font-normal text-muted-foreground mt-0.5">
                {realTimeTeam.length > 0 ? `${realTimeTeam.length} active members` : 'No members assigned'}
              </div>
            </div>
          </CardTitle>

          <div className="flex items-center gap-3">
            {/* Real-time Team Stats */}
            {realTimeTeam.length > 0 ? (
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground bg-background/80 rounded-xl px-4 py-2 shadow-sm dark:bg-border/20">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{onlineMembers} Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>{awayMembers} Away</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{busyMembers} Busy</span>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/80 rounded-xl px-4 py-2 dark:bg-border/20">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>No team members</span>
              </div>
            )}

            <Button
              size="sm"
              onClick={onAddMember}
              className="h-10 px-4 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl dark:from-blue-700 dark:to-blue-800"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {realTimeTeam.length > 0 ? (
            realTimeTeam.map((member, index) => (
              <TeamMemberCard
                key={`${member.name}-${member.status}-${member.workload}`}
                member={member}
                index={index}
                onAction={handleMemberAction}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner dark:from-gray-800 dark:to-gray-900">
                <Users className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No Team Members</h3>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
                This project doesn't have any team members assigned yet. Add team members to start collaborating on this project.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={onAddMember}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 dark:from-blue-700 dark:to-blue-800"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-2 rounded-xl border-border hover:bg-muted transition-all duration-200"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Team Summary */}
        {realTimeTeam.length > 0 ? (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-border/50 dark:from-gray-900/30 dark:to-blue-900/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">Average Workload: <span className="font-semibold text-foreground">{averageWorkload}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-muted-foreground">Team Rating: <span className="font-semibold text-foreground">{averageRating}/5</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"></div>
                  <span className="text-muted-foreground">Active: <span className="font-semibold text-foreground">{onlineMembers + awayMembers}/{realTimeTeam.length}</span></span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30">
                View All Analytics
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-blue-50/30 border-t border-border/50 dark:from-gray-900/30 dark:to-blue-900/20">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-muted-foreground">No team data available</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddMember}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                Add Members
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}