"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  Edit,
  Download,
  FileUp,
  History,
  MessageSquare,
  CheckCircle
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getProtocolAuditTrail, getProtocolComments } from "@/services/protocolService"
// Audit trail and comments will be fetched from API

export function ProtocolDetailDialog({
  open,
  onOpenChange,
  protocol,
  onEdit
}) {
  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState("overview")
  const [auditTrail, setAuditTrail] = useState([])
  const [comments, setComments] = useState([])
  const [isLoadingAudit, setIsLoadingAudit] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  // Status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Fetch audit trail and comments when dialog opens
  useEffect(() => {
    if (open && protocol?._id) {
      // For now, just set empty arrays since the backend endpoints may not be implemented yet
      // TODO: Enable when audit trail and comments endpoints are available
      setAuditTrail([])
      setComments([])
      setIsLoadingAudit(false)
      setIsLoadingComments(false)

      /* 
      // Uncomment this when the backend endpoints are ready
      const fetchData = async () => {
        // Try to fetch audit trail, but don't fail if endpoint doesn't exist
        try {
          setIsLoadingAudit(true)
          const auditData = await getProtocolAuditTrail(protocol._id)
          setAuditTrail(auditData || [])
        } catch (error) {
          // Silently handle 404 errors for audit trail (endpoint may not be implemented)
          const is404 = error?.response?.status === 404 || error?.status === 404 || error?.code === 404
          if (!is404) {
            console.error('Failed to fetch audit trail:', error)
          }
          setAuditTrail([])
        } finally {
          setIsLoadingAudit(false)
        }

        // Try to fetch comments, but don't fail if endpoint doesn't exist
        try {
          setIsLoadingComments(true)
          const commentsData = await getProtocolComments(protocol._id)
          setComments(commentsData || [])
        } catch (error) {
          // Silently handle 404 errors for comments (endpoint may not be implemented)
          const is404 = error?.response?.status === 404 || error?.status === 404 || error?.code === 404
          if (!is404) {
            console.error('Failed to fetch comments:', error)
          }
          setComments([])
        } finally {
          setIsLoadingComments(false)
        }
      }

      fetchData()
      */
    }
  }, [open, protocol?._id])

  // Early return after all hooks are defined
  if (!protocol) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-lg bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <Badge className={cn("font-medium", getStatusVariant(protocol.status))}>
              {protocol.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => {
                  // Handle download
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(protocol)
                }}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold mt-2">
            {protocol.name}
          </DialogTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              <span>{protocol._id}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              <span>{protocol.category}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>{protocol.createdBy?.name || 'Unknown'}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Version {protocol.version}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Updated {formatDate(protocol.lastModified || protocol.updatedAt)}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="procedure">Procedure</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-line">
                  {protocol.description || "No description provided."}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Materials</h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  {Array.isArray(protocol.materials) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {protocol.materials.map((material, index) => (
                        <li key={index}>
                          {typeof material === 'string' ? material : material.name}
                          {typeof material === 'object' && material.quantity && (
                            <span className="text-muted-foreground"> - {material.quantity}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="whitespace-pre-line">{protocol.materials || "No materials provided."}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Safety Notes</h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-line">
                  {protocol.safetyNotes || "No safety notes provided."}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="procedure" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step-by-Step Procedure</h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  {Array.isArray(protocol.steps) ? (
                    <ol className="list-decimal list-inside space-y-2">
                      {protocol.steps.map((step, index) => (
                        <li key={index} className="mb-2">
                          <strong>{step.title || `Step ${step.number || index + 1}`}:</strong>
                          <div className="ml-4 mt-1">
                            {step.instructions || step.description}
                            {step.duration && (
                              <div className="text-muted-foreground text-xs mt-1">Duration: {step.duration}</div>
                            )}
                            {step.notes && (
                              <div className="text-muted-foreground text-xs mt-1">Notes: {step.notes}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="whitespace-pre-line">{protocol.steps || "No procedure steps provided."}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">References</h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  {Array.isArray(protocol.references) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {protocol.references.map((reference, index) => (
                        <li key={index}>{reference}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="whitespace-pre-line">{protocol.references || "No references provided."}</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              {protocol.files && protocol.files.length > 0 ? (
                <div className="space-y-2">
                  {protocol.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 rounded-md p-3 text-sm"
                    >
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-md mr-3">
                          <FileUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB • Uploaded {formatDate(file.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No attachments available for this protocol.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Audit Trail</h3>
                <div className="space-y-3">
                  {isLoadingAudit ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      Loading audit trail...
                    </div>
                  ) : auditTrail.length > 0 ? (
                    auditTrail.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-start border-l-2 border-primary/30 pl-4 py-1"
                      >
                        <div className="bg-muted/50 p-1.5 rounded-full mr-3">
                          <History className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">
                            By {entry.user} on {formatDate(entry.date)}
                          </p>
                          {entry.details && (
                            <p className="text-xs mt-1">{entry.details}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No audit trail available for this protocol.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Comments</h3>
                <div className="space-y-3">
                  {isLoadingComments ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      Loading comments...
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-muted/30 rounded-lg p-3 text-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium mr-2">
                              {comment.user.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{comment.user}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(comment.date)}
                              </p>
                            </div>
                          </div>
                          {comment.resolved && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="ml-10">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No comments available for this protocol.</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}