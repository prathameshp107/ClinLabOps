"use client"

import { useState, useEffect } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Beaker,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  GitBranch,
  History,
  MessageSquare,
  Send,
  Trash2,
  Users,
  MoreHorizontal,
  X,
  FlaskConical,
  Microscope,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { ExperimentForm } from "./experiment-form"
import { ExperimentChart } from "./experiment-chart"
import {
  addCommentToExperiment,
  addReplyToComment,
  deleteCommentFromExperiment,
  deleteReplyFromComment
} from "@/services/experimentService"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export function ExperimentDetails({ experiment, onUpdate, onDelete, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [comments, setComments] = useState(experiment.comments || [])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const { toast } = useToast()

  // Update comments when experiment changes
  useEffect(() => {
    setComments(experiment.comments || [])
  }, [experiment])

  // Priority badge styling
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Status badge styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Get experiment icon based on type
  const getExperimentIcon = (type) => {
    switch (type) {
      case "chemical":
        return <Beaker className="h-5 w-5 text-blue-500" />
      case "biological":
        return <FlaskConical className="h-5 w-5 text-green-500" />
      case "analytical":
        return <Microscope className="h-5 w-5 text-purple-500" />
      default:
        return <Beaker className="h-5 w-5 text-blue-500" />
    }
  }

  const handleUpdate = (updatedData) => {
    onUpdate({
      ...experiment,
      ...updatedData,
    })
    setIsEditing(false)
  }

  const handleAddComment = async () => {
    if (newComment.trim() === "") return

    try {
      const updatedComments = await addCommentToExperiment(experiment._id, newComment)
      setComments(updatedComments)
      setNewComment("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddReply = async (commentId, replyToReplyId = null) => {
    if (replyText.trim() === "") return

    try {
      const updatedComments = await addReplyToComment(experiment._id, commentId, replyText, replyToReplyId)
      setComments(updatedComments)
      setReplyText("")
      setReplyingTo(null)
      toast({
        title: "Success",
        description: "Reply added successfully",
      })
    } catch (error) {
      console.error('Error adding reply:', error)
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const updatedComments = await deleteCommentFromExperiment(experiment._id, commentId)
      setComments(updatedComments)
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const updatedComments = await deleteReplyFromComment(experiment._id, commentId, replyId)
      setComments(updatedComments)
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting reply:', error)
      toast({
        title: "Error",
        description: "Failed to delete reply. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString) => {
    const date = parseISO(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  const renderReply = (reply, topLevelCommentId) => {
    return (
      <div key={reply._id || reply.id} className="comment">
        <a className="avatar">
          <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary">
            {reply.author ? reply.author.charAt(0).toUpperCase() : 'U'}
          </div>
        </a>
        <div className="content">
          <a className="author font-medium text-foreground text-sm">{reply.author}</a>
          <div className="metadata">
            <span className="date text-xs text-muted-foreground">{formatDate(reply.date)}</span>
          </div>
          <div className="text text-foreground text-sm mt-1">
            {reply.text}
          </div>
          <div className="actions flex items-center gap-2">
            <a
              className="reply text-muted-foreground hover:text-foreground cursor-pointer text-sm"
              onClick={() => setReplyingTo(replyingTo === `reply-${reply._id || reply.id}` ? null : `reply-${reply._id || reply.id}`)}
            >
              Reply
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDeleteReply(topLevelCommentId, reply._id || reply.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form for reply */}
          {replyingTo === `reply-${reply._id || reply.id}` && (
            <div className="mt-4 flex">
              <div className="flex-shrink-0 mr-3">
                <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary">
                  Me
                </div>
              </div>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="mb-2"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(topLevelCommentId, reply._id || reply.id)}
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Reply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {reply.replies && reply.replies.length > 0 && (
            <div className="comments space-y-6 mt-6 ml-4 pl-4 border-l-2 border-border/30">
              {reply.replies.map((nestedReply) => renderReply(nestedReply, topLevelCommentId))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full max-h-[85vh] overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl"
    >
      {isEditing ? (
        <div className="p-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Edit Experiment</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ExperimentForm
            experiment={experiment}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start p-6 border-b border-border/40 bg-muted/10">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-primary/10 p-3 rounded-xl ring-1 ring-primary/10">
                {getExperimentIcon(experiment.type || "chemical")}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold tracking-tight">{experiment.title}</h2>
                  <Badge variant="outline" className="ml-2 font-normal text-muted-foreground">
                    {experiment.type || "Experiment"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-sm", getStatusStyles(experiment.status))}>
                    {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                  </Badge>
                  <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-sm", getPriorityStyles(experiment.priority))}>
                    {experiment.priority.charAt(0).toUpperCase() + experiment.priority.slice(1)}
                  </Badge>
                  <div className="flex items-center text-muted-foreground border-l border-border/40 pl-3 ml-1">
                    <GitBranch className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                    <span className="font-medium">v{experiment.version}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="hover:bg-primary/5 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 transition-colors border-destructive/20">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border border-border/50 shadow-lg bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the experiment "{experiment.title}" and all associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border border-border/50">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(experiment.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 pt-4 border-b border-border/40 bg-muted/5">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-muted/50 p-1 rounded-lg mb-4">
                <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Overview</TabsTrigger>
                <TabsTrigger value="results" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Results</TabsTrigger>
                <TabsTrigger value="history" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">History</TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">Discussion</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 py-6 overflow-y-auto bg-muted/5" type="always" scrollHideDelay={0}>
              <div className="pb-10 max-w-5xl mx-auto">
                <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/40 w-fit">
                    <Clock className="h-4 w-4 mr-2 text-primary/70" />
                    {experiment.createdAt && typeof experiment.createdAt === 'string' && (
                      <span>Created {format(parseISO(experiment.createdAt), "MMMM d, yyyy")}</span>
                    )}
                    {experiment.createdAt && experiment.updatedAt && typeof experiment.createdAt === 'string' && typeof experiment.updatedAt === 'string' && (
                      <span className="mx-2">•</span>
                    )}
                    {experiment.updatedAt && typeof experiment.updatedAt === 'string' && (
                      <span>Updated {format(parseISO(experiment.updatedAt), "MMMM d, yyyy")}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-background/50 rounded-xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center">
                          <FileText className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-semibold">Description</h3>
                        </div>
                        <div className="p-4">
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {experiment.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center">
                          <Beaker className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-semibold">Protocol</h3>
                        </div>
                        <div className="p-4">
                          <p className="text-sm whitespace-pre-line leading-relaxed font-mono bg-muted/30 p-3 rounded-md border border-border/30">
                            {experiment.protocol || "No protocol defined."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-background/50 rounded-xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center">
                          <Calendar className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-semibold">Timeline</h3>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span className="font-medium text-sm">Duration</span>
                          </div>
                          {experiment.startDate && typeof experiment.startDate === 'string' ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/30">
                                <span className="text-muted-foreground text-sm">Start Date</span>
                                <span className="font-medium text-sm">{format(parseISO(experiment.startDate), "MMM d, yyyy")}</span>
                              </div>
                              {experiment.endDate && typeof experiment.endDate === 'string' && (
                                <div className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/30">
                                  <span className="text-muted-foreground text-sm">End Date</span>
                                  <span className="font-medium text-sm">{format(parseISO(experiment.endDate), "MMM d, yyyy")}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">No dates specified</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center">
                          <Users className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-semibold">Team Members</h3>
                        </div>
                        <div className="p-4">
                          {experiment.teamMembers && experiment.teamMembers.length > 0 ? (
                            <ul className="space-y-3">
                              {experiment.teamMembers.map((member, index) => (
                                <li key={index} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/30">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary mr-3 border border-primary/20">
                                    {member && typeof member === 'string' ? member.split(' ').map(n => n[0]).join('') : 'TM'}
                                  </div>
                                  <span className="text-sm font-medium">{member}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-sm text-muted-foreground italic">No team members assigned</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center">
                          <FileText className="h-4 w-4 text-primary mr-2" />
                          <h3 className="font-semibold">Documents</h3>
                        </div>
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground mb-4 italic text-center py-2">No documents attached</div>
                          <Button variant="outline" size="sm" className="w-full bg-background/50 hover:bg-primary/5 transition-colors border-dashed">
                            <Download className="h-3.5 w-3.5 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="mt-0 space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="bg-primary/10 p-2 rounded-lg mr-3">
                        <Beaker className="h-5 w-5 text-primary" />
                      </span>
                      Experiment Results
                    </h2>
                    {experiment.status === "completed" && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>

                  {experiment.status === "completed" ? (
                    <div className="space-y-6">
                      <div className="bg-background/50 p-6 rounded-xl border border-border/40 shadow-sm">
                        <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          This experiment was completed successfully with the following key findings...
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 ml-1">Data Visualization</h3>
                        <div className="h-[350px] bg-white/50 dark:bg-gray-900/50 rounded-xl border border-border/40 p-6 shadow-sm backdrop-blur-sm">
                          <ExperimentChart />
                        </div>
                      </div>

                      <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                        <h3 className="text-lg font-semibold mb-3 text-primary">Conclusions</h3>
                        <p className="text-foreground/80 leading-relaxed">
                          Based on the results, we can conclude that...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-xl border border-dashed border-border/60">
                      <div className="rounded-full bg-muted p-5 mb-5">
                        <Beaker className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No results available</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        This experiment is still in <span className="font-medium text-foreground">{experiment.status}</span> status. Results will be available once the experiment is completed.
                      </p>
                      <Button variant="outline" className="bg-background hover:bg-primary/5 transition-colors">
                        Add Preliminary Results
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center mb-6">
                      <span className="bg-primary/10 p-2 rounded-lg mr-3">
                        <History className="h-5 w-5 text-primary" />
                      </span>
                      Version History
                    </h2>

                    <div className="relative space-y-0 ml-3 border-l-2 border-border/40 pl-8 py-2">
                      {experiment.versionHistory && experiment.versionHistory.length > 0 ? (
                        experiment.versionHistory.map((version, index) => (
                          <div
                            key={index}
                            className="relative mb-8 last:mb-0"
                          >
                            <div className={cn(
                              "absolute -left-[41px] top-0 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center",
                              version.version === experiment.version ? "border-primary ring-4 ring-primary/10" : "border-muted-foreground/30"
                            )}>
                              <div className={cn("h-2 w-2 rounded-full", version.version === experiment.version ? "bg-primary" : "bg-muted-foreground/30")} />
                            </div>

                            <div className={cn(
                              "rounded-xl border p-5 transition-all",
                              version.version === experiment.version
                                ? "bg-background/80 border-primary/30 shadow-md"
                                : "bg-muted/10 border-border/30 hover:bg-muted/20"
                            )}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "text-sm font-bold px-2 py-0.5 rounded-md border",
                                    version.version === experiment.version ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border/50"
                                  )}>
                                    v{version.version}
                                  </span>
                                  {version.version === experiment.version && (
                                    <span className="text-xs font-medium text-primary">Current</span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {version.updatedAt && typeof version.updatedAt === 'string'
                                    ? format(parseISO(version.updatedAt), "MMM d, yyyy • h:mm a")
                                    : 'Date not available'
                                  }
                                </span>
                              </div>

                              <div className="text-sm font-medium mb-1">
                                Updated by {version.updatedBy}
                              </div>

                              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/20 mt-3">
                                {version.changes}
                              </div>

                              {version.version !== experiment.version && (
                                <Button variant="ghost" size="sm" className="mt-3 hover:bg-primary/5 text-xs h-8">
                                  <History className="h-3 w-3 mr-2" />
                                  Restore this version
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center -ml-8">
                          <div className="rounded-full bg-muted/30 p-4 mb-4">
                            <History className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="text-base font-semibold mb-1">No version history</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            This experiment doesn't have any recorded version history yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center mb-6">
                      <span className="bg-primary/10 p-2 rounded-lg mr-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </span>
                      Discussion
                    </h2>

                    <div className="bg-background/50 border border-border/50 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-border/40 bg-muted/10">
                        <h3 className="font-semibold flex items-center">
                          Comments
                          <Badge variant="secondary" className="ml-2 rounded-full px-2 h-5 text-xs">
                            {comments.length}
                          </Badge>
                        </h3>
                      </div>

                      <div className="p-6">
                        {comments.length > 0 ? (
                          <div className="space-y-8">
                            {comments.map((comment) => (
                              <div key={comment._id || comment.id} className="comment">
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-primary ring-4 ring-background">
                                      {comment.author ? comment.author.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{comment.author}</span>
                                        <span className="text-xs text-muted-foreground">• {formatDate(comment.date)}</span>
                                      </div>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-50 hover:opacity-100">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleDeleteComment(comment._id || comment.id)} className="text-destructive focus:text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    <div className="text-sm text-foreground/90 leading-relaxed">
                                      {comment.text}
                                    </div>

                                    <div className="flex items-center gap-4 pt-1">
                                      <button
                                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                        onClick={() => setReplyingTo(replyingTo === (comment._id || comment.id) ? null : (comment._id || comment.id))}
                                      >
                                        <MessageSquare className="h-3 w-3" /> Reply
                                      </button>
                                    </div>

                                    {/* Reply Form for comment */}
                                    {replyingTo === (comment._id || comment.id) && (
                                      <div className="mt-4 flex gap-3 animate-in fade-in-50 slide-in-from-top-1">
                                        <div className="flex-shrink-0">
                                          <div className="bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-primary">
                                            Me
                                          </div>
                                        </div>
                                        <div className="flex-1">
                                          <Textarea
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="mb-2 min-h-[80px]"
                                          />
                                          <div className="flex space-x-2 justify-end">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setReplyingTo(null)
                                                setReplyText("")
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="sm"
                                              onClick={() => handleAddReply(comment._id || comment.id)}
                                              disabled={!replyText.trim()}
                                            >
                                              <Send className="h-3.5 w-3.5 mr-2" />
                                              Reply
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="space-y-6 mt-6 ml-2 pl-6 border-l-2 border-border/40">
                                        {comment.replies.map((reply) => (
                                          renderReply(reply, comment._id || comment.id)
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border/40">
                            <MessageSquare className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-foreground mb-1">No comments yet</h3>
                            <p className="text-xs text-muted-foreground">Be the first to start a discussion on this experiment.</p>
                          </div>
                        )}

                        {/* Add Comment Form */}
                        <div className="mt-8 pt-6 border-t border-border/40">
                          <h4 className="text-sm font-semibold mb-4">Add a comment</h4>
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 hidden sm:block">
                              <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold text-primary">
                                Me
                              </div>
                            </div>
                            <div className="flex-1">
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleAddComment();
                                }}
                              >
                                <Textarea
                                  placeholder="Share your thoughts, findings, or questions..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="mb-3 min-h-[100px] resize-y"
                                />
                                <div className="flex justify-end">
                                  <Button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="shadow-sm"
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </>
      )}
    </motion.div>
  )
}
