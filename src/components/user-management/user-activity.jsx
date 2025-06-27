"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Users, Activity, Clock, MoreHorizontal, Filter, ChevronDown, Search, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/tasks/user-avatar"



export function UserActivity(activitesData) {
  const activityData = activitesData?.activityData;
  const activeUsersData = activitesData?.activeUsersData;
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    experiment: true,
    protocol: true,
    data: true,
    task: true,
    report: true
  })

  // Format timestamp to readable time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Filter activities based on search query and active filters
  const filteredActivities = activityData.filter(activity => {
    // Check if activity type is included in active filters
    if (!activeFilters[activity.type]) {
      return false;
    }

    // Check if search query matches any field
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return activity.user.name.toLowerCase().includes(query) ||
        activity.user.email.toLowerCase().includes(query) ||
        activity.action.toLowerCase().includes(query) ||
        activity.actionDetail.toLowerCase().includes(query) ||
        activity.type.toLowerCase().includes(query);
    }

    return true;
  });

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // Toggle all filters
  const toggleAllFilters = (value) => {
    setActiveFilters({
      experiment: value,
      protocol: value,
      data: value,
      task: value,
      report: value
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>User Activity</span>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {activeFilterCount < 5 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Activity Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={Object.values(activeFilters).every(Boolean)}
              onCheckedChange={(checked) => toggleAllFilters(checked)}
            >
              All Activity Types
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={activeFilters.experiment}
              onCheckedChange={(checked) =>
                setActiveFilters(prev => ({ ...prev, experiment: checked }))
              }
            >
              Experiment
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.protocol}
              onCheckedChange={(checked) =>
                setActiveFilters(prev => ({ ...prev, protocol: checked }))
              }
            >
              Protocol
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.data}
              onCheckedChange={(checked) =>
                setActiveFilters(prev => ({ ...prev, data: checked }))
              }
            >
              Data
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.task}
              onCheckedChange={(checked) =>
                setActiveFilters(prev => ({ ...prev, task: checked }))
              }
            >
              Task
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activeFilters.report}
              onCheckedChange={(checked) =>
                setActiveFilters(prev => ({ ...prev, report: checked }))
              }
            >
              Report
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Daily Active Users</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              <span>Current: 31</span>
            </Badge>
          </div>
          <div className="h-[200px] w-full">
            {activeUsersData && activeUsersData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeUsersData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis
                    dataKey="name"
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ddd' }}
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#ddd' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value) => [`${value} users`, 'Active Users']}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
                <div className="rounded-full bg-muted/30 p-3">
                  <Activity className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground font-medium mb-1">No Activity Data Available</p>
                  <p className="text-sm text-muted-foreground/60">
                    User activity data will appear here once available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
          </div>

          <div className="relative">
            <div className="flex items-center border rounded-md mb-4">
              <Search className="h-4 w-4 text-muted-foreground ml-3" />
              <input
                type="text"
                placeholder="Search activities..."
                className="flex-1 py-2 px-3 bg-transparent focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="sr-only">Clear search</span>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[300px] space-y-3">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <UserAvatar user={activity.user} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{activity.user.name}</p>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm truncate">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-muted-foreground"> • {activity.actionDetail}</span>
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 px-1.5 h-5 text-xs capitalize"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full -mt-1 -mr-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center bg-muted/10 rounded-lg border border-dashed">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🔍</span>
                    <div className="text-muted-foreground">
                      <p className="font-medium mb-1">No matching activities found</p>
                      <p className="text-sm">Try adjusting your filters or search terms</p>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 gap-2"
                      onClick={() => {
                        setSearchQuery("");
                        toggleAllFilters(true);
                      }}
                    >
                      <span>🔄</span>
                      Reset all filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
