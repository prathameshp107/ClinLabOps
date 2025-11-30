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
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200",
      config.bg, config.text, config.glow
    )}>
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
        return <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-green-500 animate-pulse"></div>;
      case 'away':
        return <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-yellow-500"></div>;
      case 'busy':
        return <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-red-500 animate-pulse"></div>;
      default:
        return <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-gray-400"></div>;
    }
  };

  return (
    <div className="group relative p-4 hover:bg-muted/30 transition-all duration-300 rounded-2xl mx-2 my-2 border border-transparent hover:border-border/50 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar with Status */}
          <div className="relative">
            <Avatar className="h-14 w-14 border-2 border-background shadow-md group-hover:scale-105 transition-all duration-300">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-base font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                {member.name.split(' ').map(n => n.charAt(0)).join('')}
              </AvatarFallback>
            </Avatar>
            {getStatusIndicator()}
          </div>

          {/* Member Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              {member.role === 'Project Lead' && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-500/20 text-[10px] rounded-full font-bold shadow-sm">
                  <Crown className="h-3 w-3" />
                  LEAD
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              <MemberRoleBadge role={member.role} isLead={member.role === 'Project Lead'} />
              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-md">{member.department}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Joined {member.joinedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span className={cn("px-2 py-0.5 rounded-full font-semibold bg-muted", workloadColor)}>
                  {member.workload || 65}% workload
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden group-hover:flex items-center gap-2 transition-all duration-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-blue-500/10 hover:text-blue-600 rounded-xl transition-all"
                    onClick={() => onAction?.('message', member)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Message</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-green-500/10 hover:text-green-600 rounded-xl transition-all"
                    onClick={() => onAction?.('email', member)}
                  >
                    <LucideMail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Email</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Real-time Performance Indicator */}
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Performance</div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3.5 w-3.5 transition-all duration-300",
                    star <= (member.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-muted/50"
                  )}
                />
              ))}
            </div>
          </div>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-muted rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl rounded-xl p-1.5">
              <DropdownMenuItem className="text-xs font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 cursor-pointer">
                <LucideMail className="h-3.5 w-3.5 mr-3 text-primary" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 cursor-pointer">
                <UserCog className="h-3.5 w-3.5 mr-3 text-primary" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs font-medium py-2.5 px-3 rounded-lg hover:bg-primary/5 cursor-pointer">
                <Award className="h-3.5 w-3.5 mr-3 text-primary" />
                View Performance
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border/50" />
              <DropdownMenuItem className="text-xs font-medium py-2.5 px-3 rounded-lg hover:bg-red-500/10 text-red-600 cursor-pointer focus:bg-red-500/10 focus:text-red-600">
                <UserMinus className="h-3.5 w-3.5 mr-3" />
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
    <Card className="bg-card/40 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-border/50 bg-muted/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold text-foreground">Project Team</CardTitle>
                {recentActivities.length > 0 ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-200/50 text-[10px] px-2 py-0.5 h-5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></div>
                    LIVE
                  </Badge>
                ) : realTimeTeam.length === 0 && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-5">Empty</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {realTimeTeam.length > 0 ? `${realTimeTeam.length} active members collaborating` : 'No members assigned yet'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Real-time Team Stats */}
            {realTimeTeam.length > 0 ? (
              <div className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground bg-background/50 rounded-xl p-1 border border-border/50">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{onlineMembers} Online</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <span>{awayMembers} Away</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>{busyMembers} Busy</span>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"></div>
                <span>No team members</span>
              </div>
            )}

            <Button
              onClick={onAddMember}
              className="h-10 px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 rounded-xl"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {realTimeTeam.length > 0 ? (
            <div className="divide-y divide-border/50">
              {realTimeTeam.map((member, index) => (
                <TeamMemberCard
                  key={`${member.name}-${member.status}-${member.workload}`}
                  member={member}
                  index={index}
                  onAction={handleMemberAction}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6 border border-border/50">
                <Users className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No Team Members</h3>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-8">
                This project doesn't have any team members assigned yet. Add team members to start collaborating on this project.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  onClick={onAddMember}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-2.5 rounded-xl border-border/50 hover:bg-muted transition-all"
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
          <div className="px-8 py-4 bg-muted/20 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <Activity className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">Avg Workload: <span className="text-foreground font-bold">{averageWorkload}%</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-yellow-500/10 rounded-md">
                    <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">Team Rating: <span className="text-foreground font-bold">{averageRating}/5</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-green-500/10 rounded-md">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-green-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">Active: <span className="text-foreground font-bold">{onlineMembers + awayMembers}/{realTimeTeam.length}</span></span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 rounded-lg font-medium">
                View Analytics
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-8 py-4 bg-muted/20 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                <span className="text-muted-foreground">No team data available</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddMember}
                className="text-primary hover:text-primary hover:bg-primary/10 rounded-lg font-medium"
              >
                <UserPlus className="h-3.5 w-3.5 mr-2" />
                Add Members
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}