"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Send, 
  MessageSquare, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { EnquiriesSidebar } from "@/components/enquiries/enquiries-sidebar"
import React from "react"

// Mock data for a single enquiry
const mockEnquiry = {
  id: "e2",
  customerName: "Emily Chen",
  email: "emily.chen@biotech.com",
  phone: "+1 (555) 987-6543",
  companyName: "BioTech Innovations",
  subject: "Protein Analysis Services",
  details: "Interested in your mass spectrometry services for protein characterization. We have a set of 15 protein samples that need to be analyzed for post-translational modifications. We would also like to discuss the possibility of an ongoing collaboration for regular analysis of our research samples.",
  priority: "Medium",
  assignedTo: "Dr. Michael Rodriguez",
  status: "In Progress",
  createdAt: "2025-03-18T14:15:00Z",
  updatedAt: "2025-03-21T09:45:00Z",
  documents: [
    { 
      id: "d2", 
      name: "Sample_Data.xlsx", 
      type: "xlsx", 
      size: "3.4 MB", 
      uploadedAt: "2025-03-18T14:15:00Z",
      uploadedBy: "Emily Chen" 
    },
    { 
      id: "d3", 
      name: "Protocol_Requirements.docx", 
      type: "docx", 
      size: "0.8 MB", 
      uploadedAt: "2025-03-19T11:20:00Z",
      uploadedBy: "Emily Chen" 
    },
    { 
      id: "d4", 
      name: "Preliminary_Analysis.pdf", 
      type: "pdf", 
      size: "2.1 MB", 
      uploadedAt: "2025-03-21T09:45:00Z",
      uploadedBy: "Dr. Michael Rodriguez",
      isReport: true
    }
  ],
  activities: [
    { 
      id: "a2", 
      action: "Enquiry created", 
      user: "Reception Staff", 
      timestamp: "2025-03-18T14:15:00Z",
      details: "Customer submitted enquiry through the website"
    },
    { 
      id: "a3", 
      action: "Assigned to Dr. Michael Rodriguez", 
      user: "Lab Manager", 
      timestamp: "2025-03-19T09:30:00Z",
      details: "Assigned based on expertise in protein analysis"
    },
    { 
      id: "a4", 
      action: "Status updated to In Progress", 
      user: "Dr. Michael Rodriguez", 
      timestamp: "2025-03-21T09:45:00Z",
      details: "Initial assessment completed, preliminary analysis started"
    },
    { 
      id: "a5", 
      action: "Document uploaded", 
      user: "Dr. Michael Rodriguez", 
      timestamp: "2025-03-21T09:45:00Z",
      details: "Uploaded preliminary analysis report"
    }
  ],
  comments: [
    {
      id: "c1",
      user: "Dr. Michael Rodriguez",
      userRole: "Senior Scientist",
      content: "I've reviewed the samples list and protocol requirements. We can definitely handle this type of analysis. I'll prepare a preliminary report with our approach.",
      timestamp: "2025-03-19T14:30:00Z"
    },
    {
      id: "c2",
      user: "Lab Manager",
      userRole: "Manager",
      content: "Great. Please also include estimated timeline and resource requirements in your preliminary report.",
      timestamp: "2025-03-20T10:15:00Z"
    },
    {
      id: "c3",
      user: "Dr. Michael Rodriguez",
      userRole: "Senior Scientist",
      content: "Preliminary analysis has been completed. I've uploaded the report with our proposed methodology, timeline, and cost estimates.",
      timestamp: "2025-03-21T09:50:00Z"
    }
  ],
  progress: 65
};

// Function to get file icon based on type
const getFileIcon = (fileType) => {
  switch (fileType) {
    case "pdf":
      return "📄";
    case "docx":
      return "📝";
    case "xlsx":
      return "📊";
    case "csv":
      return "📋";
    case "jpg":
    case "png":
      return "🖼️";
    default:
      return "📁";
  }
};

export default function EnquiryDetailsPage({ params }) {
  const id = React.use(params).id;
  const router = useRouter();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // In a real application, fetch the enquiry data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEnquiry(mockEnquiry);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: `c${Date.now()}`,
      user: "Current User", // In a real app, this would be the logged-in user
      userRole: "Lab Technician",
      content: newComment,
      timestamp: new Date().toISOString()
    };
    
    setEnquiry(prev => ({
      ...prev,
      comments: [...prev.comments, comment],
      activities: [...prev.activities, {
        id: `a${Date.now()}`,
        action: "Comment added",
        user: "Current User",
        timestamp: new Date().toISOString(),
        details: "Added a new comment to the enquiry"
      }]
    }));
    
    setNewComment("");
  };

  // Function to get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-800">
          <AlertCircle className="mr-1 h-3 w-3" /> In Progress
        </Badge>;
      case "Completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800">
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get priority badge variant
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-500">High</Badge>;
      case "Medium":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading enquiry details...</p>
        </div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Enquiries
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Enquiry Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The enquiry you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/enquiries")}>
                Return to Enquiries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
      <EnquiriesSidebar className="hidden md:block w-64 shrink-0" />
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Enquiries
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/enquiries/${enquiry.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Enquiry
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => router.push(`/enquiries/${enquiry.id}/upload`)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{enquiry.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Created on {format(parseISO(enquiry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(enquiry.status)}
                    {getPriorityBadge(enquiry.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Enquiry Details</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{enquiry.details}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Completion</span>
                          <span>{enquiry.progress}%</span>
                        </div>
                        <Progress value={enquiry.progress} className="h-2" />
                      </div>
                    </div>

                    {enquiry.documents.some(doc => doc.isReport) && (
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Final Reports</h3>
                        <div className="space-y-2">
                          {enquiry.documents
                            .filter(doc => doc.isReport)
                            .map(doc => (
                              <div 
                                key={doc.id} 
                                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <div className="mr-3 text-xl">{getFileIcon(doc.type)}</div>
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Uploaded by {doc.uploadedBy} on {format(parseISO(doc.uploadedAt), "MMM d, yyyy")}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">All Documents</h3>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {enquiry.documents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No documents have been uploaded yet.</p>
                        </div>
                      ) : (
                        enquiry.documents.map(doc => (
                          <motion.div 
                            key={doc.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <div className="mr-3 text-xl">{getFileIcon(doc.type)}</div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span>{doc.size}</span>
                                  <span className="mx-2">•</span>
                                  <span>Uploaded on {format(parseISO(doc.uploadedAt), "MMM d, yyyy")}</span>
                                  {doc.isReport && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <Badge variant="outline" className="text-xs h-5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                        Report
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="space-y-4">
                    <h3 className="font-medium">Activity History</h3>
                    
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {enquiry.activities.map((activity, index) => (
                          <motion.div 
                            key={activity.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            className="relative pl-6 pb-4"
                          >
                            {/* Timeline connector */}
                            {index < enquiry.activities.length - 1 && (
                              <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20 dark:from-primary dark:to-primary/10" />
                            )}
                            
                            {/* Activity dot */}
                            <motion.div 
                              className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.05 + 0.1, duration: 0.2 }}
                            />
                            
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm font-medium">
                                <span>{activity.action}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {activity.details}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                By: {activity.user}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="space-y-4">
                    <h3 className="font-medium">Discussion</h3>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {enquiry.comments.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No comments yet. Be the first to add a comment.</p>
                          </div>
                        ) : (
                          enquiry.comments.map((comment, index) => (
                            <motion.div 
                              key={comment.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="flex gap-3 p-3 rounded-lg bg-muted/50"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <div>
                                    <span className="font-medium">{comment.user}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{comment.userRole}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {format(parseISO(comment.timestamp), 'MMM d, h:mm a')}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-line">{comment.content}</p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Textarea 
                        placeholder="Add a comment..." 
                        className="min-h-[100px]"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{enquiry.customerName}</p>
                    {enquiry.companyName && (
                      <p className="text-sm text-muted-foreground">{enquiry.companyName}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${enquiry.email}`} className="text-sm hover:underline">
                    {enquiry.email}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${enquiry.phone}`} className="text-sm hover:underline">
                    {enquiry.phone}
                  </a>
                </div>
                
                {enquiry.companyName && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm">{enquiry.companyName}</p>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <p>Created: {format(parseISO(enquiry.createdAt), "MMMM d, yyyy")}</p>
                    <p className="text-muted-foreground">
                      Last Updated: {format(parseISO(enquiry.updatedAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <p>Priority: {enquiry.priority}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <p>Assigned to: {enquiry.assignedTo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Email Customer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Reassign Enquiry
                </Button>
                <Button className="w-full justify-start text-destructive" variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Enquiry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
