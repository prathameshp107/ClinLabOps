"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Check, X, Clock, FileText, User, AlertCircle, MoreHorizontal, Search, Filter, Download, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ApprovalDetailsModal } from "./ApprovalDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

// Mock data for pending approvals
const mockApprovals = [
  {
    id: 'AP-1001',
    type: 'Leave Request',
    requester: 'John Doe',
    requesterEmail: 'john.doe@lab.com',
    date: '2025-06-20',
    status: 'pending',
    details: 'Annual leave request for 3 days',
    dateRequested: '2025-06-19T10:30:00',
    priority: 'high',
    additionalInfo: {
      startDate: '2025-07-10',
      endDate: '2025-07-12',
      daysRequested: 3,
      leaveType: 'Paid Time Off',
      notes: 'Family vacation',
      coverage: 'Sarah Johnson will cover my responsibilities'
    },
    attachments: []
  },
  {
    id: 'AP-1002',
    type: 'Purchase Order',
    requester: 'Sarah Johnson',
    requesterEmail: 'sarah.johnson@lab.com',
    date: '2025-06-21',
    status: 'pending',
    details: 'Lab equipment purchase - $1,250.00',
    dateRequested: '2025-06-19T14:15:00',
    priority: 'medium',
    additionalInfo: {
      vendor: 'LabTech Solutions',
      poNumber: 'PO-2025-0456',
      items: [
        { name: 'Centrifuge X-2000', quantity: 1, unitPrice: 850.00, total: 850.00 },
        { name: 'Microscope Slides (100pk)', quantity: 4, unitPrice: 100.00, total: 400.00 }
      ],
      subtotal: 1250.00,
      tax: 100.00,
      total: 1350.00,
      shippingAddress: '123 Research Dr, Lab Building A, Floor 3, San Francisco, CA 94107',
      paymentTerms: 'Net 30',
      notes: 'Urgent - needed for Q3 research project'
    },
    attachments: [
      { name: 'quote.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'specs.pdf', size: '1.8 MB', type: 'pdf' }
    ]
  },
  {
    id: 'AP-1003',
    type: 'Document Approval',
    requester: 'Michael Chen',
    requesterEmail: 'michael.chen@lab.com',
    date: '2025-06-22',
    status: 'pending',
    details: 'Q3 Research Report - Final Draft',
    dateRequested: '2025-06-20T09:45:00',
    priority: 'low',
    additionalInfo: {
      documentType: 'Research Report',
      project: 'Q3 Clinical Trial Analysis',
      version: '1.2.0',
      pages: 42,
      lastUpdated: '2025-06-19T16:30:00',
      reviewers: ['Dr. Emily Wilson', 'Prof. Robert Taylor'],
      notes: 'Please review the statistical analysis section (pages 12-18) and conclusions.'
    },
    attachments: [
      { name: 'q3_research_report_v1.2.0.pdf', size: '4.7 MB', type: 'pdf' },
      { name: 'data_analysis.xlsx', size: '1.2 MB', type: 'xlsx' },
      { name: 'appendix_a.pdf', size: '3.1 MB', type: 'pdf' }
    ]
  },
];

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return { 
        variant: 'destructive', 
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        label: 'High'
      };
    case 'medium':
      return { 
        variant: 'warning', 
        icon: <Clock className="h-3.5 w-3.5" />,
        label: 'Medium'
      };
    case 'low':
    default:
      return { 
        variant: 'default', 
        icon: <FileText className="h-3.5 w-3.5" />,
        label: 'Low'
      };
  }
};

const getTypeIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'leave request':
      return { 
        icon: <Clock className="h-4 w-4" />, 
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
      };
    case 'purchase order':
      return { 
        icon: <FileText className="h-4 w-4" />, 
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
      };
    case 'document approval':
      return { 
        icon: <FileText className="h-4 w-4" />, 
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10'
      };
    default:
      return { 
        icon: <FileText className="h-4 w-4" />, 
        color: 'text-gray-500',
        bg: 'bg-gray-500/10'
      };
  }
};

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

export function PendingApprovals() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [isLoading, setIsLoading] = useState({});
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    dateRange: 'all',
  });

  // Memoize the filtered approvals to prevent unnecessary recalculations
  const filteredApprovals = useMemo(() => {
    const searchQueryLower = searchQuery.toLowerCase().trim();
    const typeFilterLower = filters.type?.toLowerCase() || 'all';
    
    return approvals.filter(approval => {
      try {
        // Filter by search query (case-insensitive, partial match)
        const matchesSearch = searchQueryLower === '' || [
          approval.type?.toLowerCase(),
          approval.requester?.toLowerCase(),
          approval.details?.toLowerCase(),
          approval.id?.toLowerCase()
        ].some(field => field?.includes(searchQueryLower));
        
        // Filter by status tab
        const matchesTab = 
          activeTab === 'all' || 
          (activeTab === 'pending' && approval.status === 'pending') ||
          (activeTab === 'approved' && approval.status === 'approved') ||
          (activeTab === 'rejected' && approval.status === 'rejected');
        
        // Filter by type (case-insensitive)
        const matchesType = 
          typeFilterLower === 'all' || 
          approval.type?.toLowerCase() === typeFilterLower;
        
        // Filter by priority
        const matchesPriority = 
          filters.priority === 'all' || 
          approval.priority === filters.priority;
        
        // Filter by date range if specified
        let matchesDateRange = true;
        if (filters.dateRange !== 'all') {
          const approvalDate = new Date(approval.dateRequested);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          switch (filters.dateRange) {
            case 'today':
              matchesDateRange = approvalDate >= today;
              break;
            case 'thisWeek':
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
              matchesDateRange = approvalDate >= startOfWeek;
              break;
            case 'thisMonth':
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              matchesDateRange = approvalDate >= startOfMonth;
              break;
            case 'older':
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              matchesDateRange = new Date(approval.dateRequested) < oneMonthAgo;
              break;
          }
        }
        
        return matchesSearch && matchesTab && matchesType && matchesPriority && matchesDateRange;
      } catch (error) {
        console.error('Error filtering approval:', approval, error);
        return false; // Exclude items that cause errors in filtering
      }
    });
  }, [approvals, searchQuery, activeTab, filters]);

  const priorityBadge = getPriorityBadge('high');
  const typeIcon = getTypeIcon('leave request');

  const handleApprove = useCallback(async (id) => {
    try {
      setIsLoading(prev => ({ ...prev, [id]: 'approving' }));
      
      // Simulate API call with error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // Simulate a 10% chance of error
            if (Math.random() < 0.1) {
              throw new Error('Failed to approve request. Please try again.');
            }
            
            setApprovals(prevApprovals => 
              prevApprovals.map(approval => 
                approval.id === id 
                  ? { ...approval, status: 'approved' } 
                  : approval
              )
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });
      
      // Show success message
      console.log(`Successfully approved request ${id}`);
      // In a real app, you might want to show a toast notification here
      // toast.success('Request approved successfully');
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedApproval(null);
      }, 500);
      
    } catch (error) {
      console.error('Failed to approve request:', error);
      // In a real app, you might want to show an error toast here
      // toast.error(error.message || 'Failed to approve request');
    } finally {
      setIsLoading(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  }, []);

  const handleReject = useCallback(async (id) => {
    try {
      setIsLoading(prev => ({ ...prev, [id]: 'rejecting' }));
      
      // Simulate API call with error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // Simulate a 10% chance of error
            if (Math.random() < 0.1) {
              throw new Error('Failed to reject request. Please try again.');
            }
            
            setApprovals(prevApprovals => 
              prevApprovals.map(approval => 
                approval.id === id 
                  ? { ...approval, status: 'rejected' } 
                  : approval
              )
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });
      
      // Show success message
      console.log(`Successfully rejected request ${id}`);
      // In a real app, you might want to show a toast notification here
      // toast.success('Request rejected successfully');
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedApproval(null);
      }, 500);
      
    } catch (error) {
      console.error('Failed to reject request:', error);
      // In a real app, you might want to show an error toast here
      // toast.error(error.message || 'Failed to reject request');
    } finally {
      setIsLoading(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  }, []);

  const handleViewDetails = useCallback((approval) => {
    setSelectedApproval(approval);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedApproval(null);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleComment = useCallback(async (id, comment) => {
    // In a real app, this would call an API to add the comment
    console.log(`Adding comment to approval ${id}:`, comment);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }, []);

  const handleExport = useCallback(() => {
    // In a real app, this would generate and download a CSV or PDF
    console.log('Exporting approvals:', filteredApprovals);
  }, [filteredApprovals]);

  const handleViewAll = useCallback(() => {
    // In a real app, this would navigate to a dedicated approvals page
    console.log('View all approvals');
  }, []);

  // Loading state
  if (isRefreshing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>Loading approvals...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (filteredApprovals.length === 0) {
    const hasActiveFilters = 
      searchQuery || 
      activeTab !== 'all' || 
      filters.type !== 'all' || 
      filters.priority !== 'all' ||
      filters.dateRange !== 'all';

    return (
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>
                {hasActiveFilters 
                  ? 'No approvals match the current filters' 
                  : 'No items requiring your approval'}
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setFilters({
                    type: 'all',
                    priority: 'all',
                    dateRange: 'all'
                  });
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-muted/10 to-transparent">
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/10 rounded-full opacity-50 blur-sm"></div>
            <div className="relative bg-white dark:bg-background p-4 rounded-full">
              {hasActiveFilters ? (
                <Search className="h-8 w-8 text-muted-foreground" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1">
            {hasActiveFilters ? 'No results found' : 'All caught up!'}
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria'
              : 'You don\'t have any pending approvals at the moment.'}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            {hasActiveFilters ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                  setFilters({
                    type: 'all',
                    priority: 'all',
                    dateRange: 'all'
                  });
                }}
              >
                Clear all filters
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                View history
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if any filters are active
  const activeFilters = [
    searchQuery && 'search',
    activeTab !== 'all' && 'status',
    filters.type !== 'all' && 'type',
    filters.priority !== 'all' && 'priority',
    filters.dateRange !== 'all' && 'date range'
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
                <Badge variant="outline" className="px-2 py-0.5 text-xs">
                  {filteredApprovals.length} {filteredApprovals.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {activeFilters.length > 0 ? (
                  <span className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filtered by {activeFilters.join(', ')}
                  </span>
                ) : (
                  'Items requiring your attention'
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleExport}
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="px-6 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search approvals..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 opacity-50 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Leave Request">Leave Request</SelectItem>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Document Approval">Document Approval</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.priority}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 opacity-50 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredApprovals.map((approval) => {
                const priorityBadge = getPriorityBadge(approval.priority);
                const typeIcon = getTypeIcon(approval.type);
                
                return (
                  <div 
                    key={approval.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${typeIcon.bg}`}>
                          {typeIcon.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{approval.type}</h4>
                            <Badge variant={priorityBadge.variant} className="gap-1 text-xs">
                              {priorityBadge.icon}
                              {priorityBadge.label}
                            </Badge>
                            {approval.status !== 'pending' && (
                              <Badge 
                                variant={approval.status === 'approved' ? 'success' : 'destructive'} 
                                className="text-xs"
                              >
                                {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{approval.details}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>{approval.requester}</span>
                            </div>
                            <div>{formatTimeAgo(approval.dateRequested)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleApprove(approval.id)}
                          disabled={!!isLoading[approval.id]}
                        >
                          {isLoading[approval.id] === 'approving' ? (
                            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleReject(approval.id)}
                          disabled={!!isLoading[approval.id]}
                        >
                          {isLoading[approval.id] === 'rejecting' ? (
                            <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(approval)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Report Issue</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {selectedApproval && (
        <ApprovalDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          approval={selectedApproval}
          onApprove={() => handleApprove(selectedApproval.id)}
          onReject={() => handleReject(selectedApproval.id)}
          onComment={handleComment}
          isProcessing={!!isLoading[selectedApproval.id]}
        />
      )}
    </div>
  );
}
