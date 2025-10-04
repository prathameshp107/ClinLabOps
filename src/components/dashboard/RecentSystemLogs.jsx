"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";
import { getSystemLogs } from "@/services/dashboardService";

const getCategoryVariant = (category) => {
  switch (category?.toLowerCase()) {
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logData = await getSystemLogs({ limit: 10 });
        setLogs(logData.logs || logData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching system logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action?.toLowerCase().includes(query) ||
      log.user?.toLowerCase().includes(query) ||
      log.details?.toLowerCase().includes(query) ||
      log.category?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Recent System Logs</CardTitle>
          <CardDescription>Loading system logs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                <div className="h-4 bg-muted rounded w-40 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Recent System Logs</CardTitle>
          <CardDescription>Error loading system logs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load system logs: {error}</p>
        </CardContent>
      </Card>
    );
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-sm whitespace-nowrap">
                          <div className="text-muted-foreground">
                            {formatTime && log.timestamp ? formatTime(log.timestamp) :
                              log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                'Unknown time'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate && log.timestamp ? formatDate(log.timestamp) :
                              log.timestamp ? new Date(log.timestamp).toLocaleDateString() :
                                'Unknown date'}
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium">
                          {log.action || log.type || 'Unknown action'}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="truncate max-w-[160px]">
                            {log.user || 'System'}
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="line-clamp-1">
                            {log.message || log.details || 'No details'}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getCategoryVariant(log.category)} className="text-xs">
                            {log.category || 'general'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-muted-foreground">
                        No logs found matching your search criteria.
                      </td>
                    </tr>
                  )}
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