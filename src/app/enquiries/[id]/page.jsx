"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
  Users,
  MoreHorizontal,
  Share2,
  Bookmark,
  Bell,
  Zap,
  BarChart4,
  ChevronRight,
  ExternalLink,
  Copy,
  Star
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import React from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import UploadReportDialog from "@/components/enquiries/UploadReportDialog"
import { toast } from "@/components/ui/use-toast"
// Enquiries will be fetched from API

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

// Function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "On Hold":
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

// Function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "Low":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    default: 
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

export default function EnquiryDetailsPage({ params }) {
  // TODO: Fetch enquiry from API using params.id
  const enquiry = null; // Will be replaced with API call
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isWatching, setIsWatching] = useState(true);
  const [showUploadReport, setShowUploadReport] = useState(false);

  if (!enquiry) {
    return (
      <DashboardLayout>
        <div className="w-full px-8 py-6 space-y-6">
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
                <Button onClick={() => router.push("/enquiries")}>Return to Enquiries</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {enquiry.subject}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enquiry #{enquiry.id} • Created {format(parseISO(enquiry.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={isBookmarked ? "text-yellow-500" : ""}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsWatching(!isWatching)}
                        className={isWatching ? "text-blue-500" : ""}
                      >
                        <Bell className={`h-4 w-4 ${isWatching ? "fill-current" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isWatching ? "Stop watching" : "Watch enquiry"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => router.push(`/enquiries/${enquiry.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Enquiry
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Enquiry
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => setShowUploadReport(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <div className="space-y-6">
            {/* Main Content - Full width */}
            <div className="space-y-6">

              {/* Tabs Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="border-b border-slate-200 dark:border-slate-700">
                        <TabsList className="grid grid-cols-4 w-full bg-transparent border-0 h-12">
                          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">
                            Documents
                          </TabsTrigger>
                          <TabsTrigger value="activity" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">
                            Activity
                          </TabsTrigger>
                          <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">
                            Comments
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <div className="p-6">
                        <TabsContent value="overview" className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Enquiry Details</h3>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {enquiry.details}
                              </p>
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <User className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">{enquiry.customerName}</p>
                                  {enquiry.companyName && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{enquiry.companyName}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <Mail className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                <a href={`mailto:${enquiry.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  {enquiry.email}
                                </a>
                              </div>

                              <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <Phone className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                <a href={`tel:${enquiry.phone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  {enquiry.phone}
                                </a>
                              </div>

                              {enquiry.companyName && (
                                <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <Building className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                  <p className="text-sm text-slate-700 dark:text-slate-300">{enquiry.companyName}</p>
                                </div>
                              )}

                              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center">
                                  <Calendar className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                  <span className="text-sm font-medium">Created</span>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  {format(parseISO(enquiry.createdAt), "MMM d, yyyy")}
                                </span>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center">
                                  <Tag className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                  <span className="text-sm font-medium">Priority</span>
                                </div>
                                <Badge className={`text-xs ${getPriorityColor(enquiry.priority)}`}>
                                  {enquiry.priority}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center">
                                  <Users className="h-5 w-5 mr-3 text-slate-500 dark:text-slate-400" />
                                  <span className="text-sm font-medium">Assigned to</span>
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400">{enquiry.assignedTo}</span>
                              </div>
                            </div>
                          </div>

                          {enquiry.documents.some(doc => doc.isReport) && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Final Reports</h3>
                              <div className="space-y-3">
                                {enquiry.documents
                                  .filter(doc => doc.isReport)
                                  .map(doc => (
                                    <motion.div
                                      key={doc.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <div className="flex items-center">
                                        <div className="mr-3 text-2xl">{getFileIcon(doc.type)}</div>
                                        <div>
                                          <p className="font-medium text-slate-900 dark:text-slate-100">{doc.name}</p>
                                          <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Uploaded by {doc.uploadedBy} on {format(parseISO(doc.uploadedAt), "MMM d, yyyy")}
                                          </p>
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="icon">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Documents</h3>
                            <Button variant="outline" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Document
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {enquiry.documents.length === 0 ? (
                              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No documents uploaded yet</p>
                                <p className="text-sm">Upload documents to share with the team</p>
                              </div>
                            ) : (
                              enquiry.documents.map((doc, index) => (
                                <motion.div
                                  key={doc.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div className="mr-3 text-2xl">{getFileIcon(doc.type)}</div>
                                    <div>
                                      <p className="font-medium text-slate-900 dark:text-slate-100">{doc.name}</p>
                                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                        <span>{doc.size}</span>
                                        <span className="mx-2">•</span>
                                        <span>Uploaded on {format(parseISO(doc.uploadedAt), "MMM d, yyyy")}</span>
                                        {doc.isReport && (
                                          <>
                                            <span className="mx-2">•</span>
                                            <Badge variant="outline" className="text-xs h-5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
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

                        <TabsContent value="activity" className="space-y-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Activity History</h3>

                          <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-6">
                              {enquiry.activities.map((activity, index) => (
                                <motion.div
                                  key={activity.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05, duration: 0.2 }}
                                  className="relative pl-8 pb-6"
                                >
                                  {/* Timeline connector */}
                                  {index < enquiry.activities.length - 1 && (
                                    <div className="absolute left-3 top-4 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-200 dark:from-blue-400 dark:to-blue-800" />
                                  )}

                                  {/* Activity dot */}
                                  <motion.div
                                    className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-sm"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.05 + 0.1, duration: 0.2 }}
                                  />

                                  <div className="flex flex-col">
                                    <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100">
                                      <span>{activity.action}</span>
                                      <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                                        {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                      {activity.details}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                      By: {activity.user}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="comments" className="space-y-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Discussion</h3>

                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                              {enquiry.comments.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                  <p className="text-lg font-medium">No comments yet</p>
                                  <p className="text-sm">Be the first to add a comment</p>
                                </div>
                              ) : (
                                enquiry.comments.map((comment, index) => (
                                  <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                  >
                                    <Avatar className="h-10 w-10">
                                      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                        {comment.user.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center mb-2">
                                        <div>
                                          <span className="font-medium text-slate-900 dark:text-slate-100">{comment.user}</span>
                                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{comment.userRole}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          {format(parseISO(comment.timestamp), 'MMM d, h:mm a')}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">{comment.content}</p>
                                    </div>
                                  </motion.div>
                                ))
                              )}
                            </div>
                          </ScrollArea>

                          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <Textarea
                              placeholder="Add a comment..."
                              className="min-h-[100px] resize-none"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end mt-3">
                              <Button
                                onClick={() => {
                                  // Create a new comment object
                                  const comment = {
                                    id: `c${enquiry.comments.length + 1}`,
                                    user: "Current User", // This should be replaced with actual logged-in user
                                    userRole: "Staff",
                                    content: newComment,
                                    timestamp: new Date().toISOString()
                                  };

                                  // Add comment to the list
                                  enquiry.comments.push(comment);

                                  // Clear the input
                                  setNewComment("");
                                }}
                                disabled={!newComment.trim()}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Upload Report Modal */}
        <UploadReportDialog
          open={showUploadReport}
          onOpenChange={setShowUploadReport}
          enquiryId={enquiry.id}
          onSuccess={() => {
            toast({
              title: "Report uploaded successfully",
              description: "The report has been uploaded and added to the enquiry.",
            });
            // Optionally refresh the enquiry data or update the documents list
          }}
        />
      </div>
    </DashboardLayout>
  );
}
