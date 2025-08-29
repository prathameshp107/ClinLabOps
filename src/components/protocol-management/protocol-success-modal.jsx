"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Eye, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function ProtocolSuccessModal({
    open,
    onOpenChange,
    protocol,
    onViewProtocol,
    onViewMyProtocols
}) {
    if (!protocol) return null

    const isInReview = !protocol.isPublic

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 border border-border/40 shadow-xl rounded-xl bg-background/95 backdrop-blur-sm">
                <DialogHeader className="px-6 pt-6 pb-4 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="mx-auto mb-4"
                    >
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </motion.div>

                    <DialogTitle className="text-xl font-semibold text-center">
                        Protocol Created Successfully!
                    </DialogTitle>

                    <DialogDescription className="text-center text-muted-foreground mt-2">
                        Your protocol "{protocol.name}" has been created and is now under review.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4">
                    {/* Protocol Info Card */}
                    <div className="bg-card/50 border border-border/30 rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base truncate">{protocol.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Version {protocol.version} • {protocol.category}
                                </p>
                            </div>
                            <Badge className="ml-3 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50">
                                {isInReview ? "In Review" : "Published"}
                            </Badge>
                        </div>

                        {protocol.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {protocol.description}
                            </p>
                        )}
                    </div>

                    {/* Status Information */}
                    <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Clock className="h-3 w-3 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                                    Protocol Under Review
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    Your protocol is currently being reviewed by an administrator. Once approved,
                                    it will be published and visible to all users. You can find it in the
                                    "My Protocols on Review" section.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-border/30 gap-3 bg-muted/20">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Close
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            onViewProtocol(protocol)
                            onOpenChange(false)
                        }}
                        className="flex-1"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Protocol
                    </Button>

                    <Button
                        onClick={() => {
                            onViewMyProtocols()
                            onOpenChange(false)
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90"
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Go to My Protocols
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}