"use client";

import { useState, useEffect } from "react";
import { X, FileText, Clock, User, AlertCircle, Check, XCircle, MessageSquare, Paperclip, Calendar, Clock3, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return { variant: 'destructive', label: 'High Priority' };
    case 'medium':
      return { variant: 'warning', label: 'Medium Priority' };
    case 'low':
      return { variant: 'default', label: 'Low Priority' };
    default:
      return { variant: 'outline', label: 'Normal' };
  }
};

const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return { variant: 'success', icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> };
    case 'rejected':
      return { variant: 'destructive', icon: <XCircle className="h-3.5 w-3.5 mr-1" /> };
    case 'pending':
    default:
      return { variant: 'secondary', icon: <Clock3 className="h-3.5 w-3.5 mr-1" /> };
  }
};

const mockComments = [
  {
    id: 1,
    user: {
      name: 'You',
      email: 'admin@labtasker.com',
      avatar: '/avatars/admin.png'
    },
    comment: 'Please provide more details about the equipment specifications.',
    timestamp: '2025-06-22T10:30:00'
  },
  {
    id: 2,
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lab.com',
      avatar: '/avatars/sarah.png'
    },
    comment: 'The equipment is for the new spectroscopy lab. Model: XYZ-2000, required for the upcoming research project.',
    timestamp: '2025-06-22T11:15:00'
  }
];

const mockHistory = [
  { id: 1, action: 'Created', by: 'Sarah Johnson', timestamp: '2025-06-19T14:15:00' },
  { id: 2, action: 'Updated', by: 'System', timestamp: '2025-06-19T14:16:00', details: 'Status changed to In Review' },
  { id: 3, action: 'Commented', by: 'You', timestamp: '2025-06-20T10:30:00' },
  { id: 4, action: 'Replied', by: 'Sarah Johnson', timestamp: '2025-06-20T11:15:00' },
];

export function ApprovalDetailsModal({ 
  isOpen, 
  onClose, 
  approval, 
  onApprove, 
  onReject,
  onComment,
  isProcessing 
}) {
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen || !approval) return null;

  const priority = getPriorityBadge(approval.priority);
  const status = getStatusBadge(approval.status);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onComment(approval.id, comment);
      setComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {approval.type}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2 items-center">
                      <Badge variant={priority.variant} className="text-xs">
                        {priority.label}
                      </Badge>
                      <Badge variant={status.variant} className="text-xs">
                        {status.icon}
                        {approval.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        #{approval.id}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <Tabs defaultValue="details" className="mt-6" onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="comments">Comments ({mockComments.length})</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    <TabsContent value="details">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Requested By</h4>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/avatars/${approval.requester.toLowerCase().split(' ')[0]}.png`} />
                                <AvatarFallback>{approval.requester.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{approval.requester}</p>
                                <p className="text-xs text-muted-foreground">{approval.requesterEmail || 'No email provided'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Date Requested</h4>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDateTime(approval.dateRequested)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                          <p className="text-sm">{approval.details}</p>
                        </div>

                        {approval.additionalInfo && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Additional Information</h4>
                            <div className="bg-muted/50 p-4 rounded-md">
                              <pre className="text-sm font-mono whitespace-pre-wrap">
                                {JSON.stringify(approval.additionalInfo, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="comments">
                      <div className="space-y-6">
                        <ScrollArea className="h-64 pr-4 -mr-4">
                          <div className="space-y-4">
                            {mockComments.map((comment) => (
                              <div key={comment.id} className="flex gap-3">
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={comment.user.avatar} />
                                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-medium">{comment.user.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimeAgo(comment.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.comment}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <form onSubmit={handleSubmitComment} className="space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            disabled={isSubmitting}
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              size="sm"
                              disabled={!comment.trim() || isSubmitting}
                            >
                              {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </TabsContent>

                    <TabsContent value="history">
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted -translate-x-1/2"></div>
                          {mockHistory.map((item, index) => (
                            <div key={item.id} className="relative pl-10 pb-4">
                              <div className="absolute left-5 top-1 h-3 w-3 rounded-full bg-primary -translate-x-1/2"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{item.action}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDateTime(item.timestamp)}
                                  </p>
                                  {item.details && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {item.details}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {item.by}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="attachments">
                      <div className="border border-dashed rounded-lg p-6 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h4 className="mt-2 text-sm font-medium">No attachments</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          No files have been attached to this request.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Paperclip className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="space-x-2">
              {approval.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => onReject(approval.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing === `reject-${approval.id}` ? (
                      <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button 
                    onClick={() => onApprove(approval.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing === `approve-${approval.id}` ? (
                      <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
