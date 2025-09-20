"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
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
    CheckCircle,
    ArrowLeft,
    Loader2
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getProtocolById, getProtocolAuditTrail, getProtocolComments } from "@/services/protocolService"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export default function ProtocolDetailPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()

    const [protocol, setProtocol] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [auditTrail, setAuditTrail] = useState([])
    const [comments, setComments] = useState([])
    const [isLoadingAudit, setIsLoadingAudit] = useState(false)
    const [isLoadingComments, setIsLoadingComments] = useState(false)

    // Fetch protocol data
    useEffect(() => {
        const fetchProtocol = async () => {
            try {
                setIsLoading(true)
                const protocolData = await getProtocolById(params.id)
                setProtocol(protocolData)
            } catch (error) {
                console.error('Error fetching protocol:', error)
                toast({
                    title: "Error",
                    description: "Failed to load protocol. Please try again.",
                    variant: "destructive"
                })
                router.push('/protocols')
            } finally {
                setIsLoading(false)
            }
        }

        if (params.id) {
            fetchProtocol()
        }
    }, [params.id, router, toast])

    // Fetch audit trail and comments when protocol is loaded
    useEffect(() => {
        if (protocol?._id) {
            const fetchData = async () => {
                try {
                    setIsLoadingAudit(true)
                    const auditData = await getProtocolAuditTrail(protocol._id)
                    setAuditTrail(auditData || [])
                } catch (error) {
                    console.error('Failed to fetch audit trail:', error)
                    setAuditTrail([])
                } finally {
                    setIsLoadingAudit(false)
                }

                try {
                    setIsLoadingComments(true)
                    const commentsData = await getProtocolComments(protocol._id)
                    setComments(commentsData || [])
                } catch (error) {
                    console.error('Failed to fetch comments:', error)
                    setComments([])
                } finally {
                    setIsLoadingComments(false)
                }
            }

            fetchData()
        }
    }, [protocol?._id])

    // Status badge variants
    const getStatusVariant = (status) => {
        switch (status) {
            case "Draft":
                return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300"
            case "In Review":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
            case "Active":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300"
            case "Archived":
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300"
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

    const handleEdit = () => {
        router.push(`/protocols?edit=${protocol._id}`)
    }

    const handleGoBack = () => {
        router.back()
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-lg text-muted-foreground">Loading protocol...</span>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!protocol) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Protocol not found</h2>
                        <p className="text-muted-foreground mb-4">The protocol you're looking for doesn't exist.</p>
                        <Button onClick={() => router.push('/protocols')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Protocols
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
                <div className="px-4 py-8 max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                variant="outline"
                                onClick={handleGoBack}
                                className="h-10 w-10 p-0"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
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
                                            onClick={handleEdit}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold mt-2 mb-3">{protocol.name}</h1>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="h-4 w-4 mr-2" />
                                        <span>{protocol._id}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Tag className="h-4 w-4 mr-2" />
                                        <span>{protocol.category}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <User className="h-4 w-4 mr-2" />
                                        <span>{protocol.createdBy?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>Version {protocol.version}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Updated {formatDate(protocol.lastModified || protocol.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm p-6"
                    >
                        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-4 mb-6 w-full">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="procedure">Procedure</TabsTrigger>
                                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                                <TabsTrigger value="history">History</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Description</h3>
                                    <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-line">
                                        {protocol.description || "No description provided."}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3">Materials</h3>
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
                                    <h3 className="text-lg font-medium mb-3">Safety Notes</h3>
                                    <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-line">
                                        {protocol.safetyNotes || "No safety notes provided."}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="procedure" className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Step-by-Step Procedure</h3>
                                    <div className="bg-muted/30 rounded-lg p-4 text-sm">
                                        {Array.isArray(protocol.steps) ? (
                                            <ol className="list-decimal list-inside space-y-3">
                                                {protocol.steps.map((step, index) => (
                                                    <li key={index} className="mb-3">
                                                        <strong>{step.title || `Step ${step.number || index + 1}`}:</strong>
                                                        <div className="ml-4 mt-2">
                                                            <div className="whitespace-pre-line">{step.instructions || step.description}</div>
                                                            {step.duration && (
                                                                <div className="text-muted-foreground text-xs mt-2">Duration: {step.duration}</div>
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
                                    <h3 className="text-lg font-medium mb-3">References</h3>
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
                                    <div className="space-y-3">
                                        {protocol.files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-muted/50 rounded-lg p-4 text-sm"
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
                                    <div className="text-center py-12 text-muted-foreground">
                                        <FileUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p>No attachments available for this protocol.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="history" className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Audit Trail</h3>
                                    <div className="space-y-3">
                                        {isLoadingAudit ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                <span className="ml-2 text-muted-foreground">Loading audit trail...</span>
                                            </div>
                                        ) : auditTrail.length > 0 ? (
                                            auditTrail.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start border-l-2 border-primary/30 pl-4 py-2"
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
                                                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>No audit trail available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3">Comments</h3>
                                    <div className="space-y-3">
                                        {isLoadingComments ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                <span className="ml-2 text-muted-foreground">Loading comments...</span>
                                            </div>
                                        ) : comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="bg-muted/30 rounded-lg p-4 text-sm"
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
                                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>No comments available.</p>
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
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    )
}