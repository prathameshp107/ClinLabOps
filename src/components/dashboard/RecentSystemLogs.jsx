"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";

// Mock data for system logs
const systemLogs = [
  {
    id: 1,
    time: '2025-06-22T10:30:00',
    action: 'User Login',
    user: 'admin@labtasker.com',
    details: 'Successful login from 192.168.1.1',
    category: 'authentication'
  },
  {
    id: 2,
    time: '2025-06-22T10:15:22',
    action: 'Experiment Created',
    user: 'researcher@lab.com',
    details: 'Created new experiment "Protein Analysis 2025"',
    category: 'experiment'
  },
  {
    id: 3,
    time: '2025-06-22T09:45:10',
    action: 'Permission Change',
    user: 'admin@labtasker.com',
    details: 'Updated permissions for user: lab.assistant@lab.com',
    category: 'security'
  },
  {
    id: 4,
    time: '2025-06-22T09:30:55',
    action: 'File Access',
    user: 'researcher2@lab.com',
    details: 'Accessed file: /documents/research/protocols/protocol_v2.pdf',
    category: 'file'
  },
  {
    id: 5,
    time: '2025-06-22T09:15:33',
    action: 'Task Update',
    user: 'lab.assistant@lab.com',
    details: 'Marked task "Prepare samples for analysis" as completed',
    category: 'task'
  },
  {
    id: 6,
    time: '2025-06-22T09:00:12',
    action: 'Failed Login',
    user: 'unknown@example.com',
    details: 'Failed login attempt - Invalid credentials',
    category: 'security'
  }
];

const getCategoryVariant = (category) => {
  switch (category.toLowerCase()) {
    case 'authentication':
      return 'default';
    case 'security':
      return 'destructive';
    case 'experiment':
      return 'success';
    case 'file':
      return 'outline';
    case 'task':
      return 'secondary';
    default:
      return 'outline';
  }
};

export function RecentSystemLogs({ formatTime, formatDate }) {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Recent System Logs</CardTitle>
            <CardDescription>Track system activities and events</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="w-full pl-8 sm:w-[200px] md:w-[250px]"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] md:min-w-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[140px]">
                      TIME
                    </th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[150px]">
                      ACTION
                    </th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[180px]">
                      USER
                    </th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      DETAILS
                    </th>
                    <th className="h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[120px]">
                      CATEGORY
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {systemLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="text-muted-foreground">
                          {formatTime ? formatTime(log.time) : new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate ? formatDate(log.time) : new Date(log.time).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {log.action}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="truncate max-w-[160px]">
                          {log.user}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="line-clamp-1">
                          {log.details}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getCategoryVariant(log.category)} className="text-xs">
                          {log.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div className="text-xs">
                Last updated: {new Date().toLocaleString()}
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View activity log
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
