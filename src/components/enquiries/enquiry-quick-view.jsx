import { useState } from "react"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  FileText,
  History,
  MessageSquare,
  AlertCircle,
  User,
  Mail,
  Eye,
  Pencil,
  Phone,
  Building,
  Calendar,
  Clock,
  X
} from "lucide-react"

export function EnquiryQuickView({ enquiry, onClose }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  if (!enquiry) return null;
  
  // Status badge color
  const statusBadge =
    enquiry.status === "Pending" ? { color: "warning", label: "Pending" } :
      enquiry.status === "In Progress" ? { color: "info", label: "In Progress" } :
        enquiry.status === "Completed" ? { color: "success", label: "Completed" } :
          enquiry.status === "Cancelled" ? { color: "destructive", label: "Cancelled" } :
            enquiry.status === "On Hold" ? { color: "secondary", label: "On Hold" } :
              { color: "secondary", label: enquiry.status };

  // Priority badge color
  const priorityBadge =
    enquiry.priority === "High" ? { color: "destructive", label: "High" } :
      enquiry.priority === "Medium" ? { color: "warning", label: "Medium" } :
        { color: "outline", label: enquiry.priority };
  
  return (
    <Dialog open={!!enquiry} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 bg-background overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-background border-b px-6 py-3 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                title="Close"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
            <div className="h-5 w-px bg-border" />
            <Badge variant={statusBadge.color} className="capitalize px-3 py-1 text-xs font-medium">
              {statusBadge.label}
            </Badge>
            <span className="font-semibold text-lg truncate max-w-[200px] md:max-w-[350px]">{enquiry.subject}</span>
            <span className="text-xs text-muted-foreground font-mono ml-2">#{enquiry.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              onClose();
              router.push(`/enquiries/${enquiry.id}`);
            }}>
              <Eye className="h-4 w-4 mr-1" /> View Full
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              onClose();
              router.push(`/enquiries/${enquiry.id}/edit`);
            }}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 px-6 pt-4 bg-background z-10">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" /> Activity
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Left: Main details */}
              <div className="flex-1 min-w-0 space-y-6">
                <div className="bg-muted/40 rounded-xl p-6 shadow-sm border border-border/30">
                  <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary/80" /> Enquiry Details
                  </h3>
                  <p className="text-[15px] whitespace-pre-line leading-relaxed text-foreground/90">{enquiry.details}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4 bg-background rounded-xl p-4 border border-border/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-[15px]">{enquiry.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[15px]">{enquiry.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[15px]">{enquiry.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[15px]">{enquiry.companyName || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 bg-background rounded-xl p-4 border border-border/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant={priorityBadge.color} className="px-3 py-1 text-xs font-medium">
                        {priorityBadge.label} Priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[15px]">Created: {format(parseISO(enquiry.createdAt), "MMM d, yyyy")}</span>
                    </div>
                    {enquiry.updatedAt && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[15px]">Updated: {format(parseISO(enquiry.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    )}
              <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 border border-primary/10">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {enquiry.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[15px] font-medium">{enquiry.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-6">
              <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                <History className="h-4 w-4 text-primary/80" /> Activity Timeline
              </h3>
              <div className="space-y-6">
                        {[...enquiry.activities || []].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((activity, index) => (
                  <div key={index} className="flex gap-4 relative pb-6 last:pb-0 last:before:hidden before:absolute before:left-3.5 before:top-8 before:h-full before:w-[1px] before:bg-border/60">
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm z-10",
                              activity.action === "comment" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              activity.action === "status" ? "bg-amber-50 text-amber-600 border-amber-200" :
                              "bg-green-50 text-green-600 border-green-200"
                    )}>
                              {activity.action === "comment" ? (
                                <MessageSquare className="h-4 w-4" />
                              ) : activity.action === "status" ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                    </div>
                    <div className="flex-1 pt-0.5">
                              <div className="flex justify-between items-start">
                                <p className="font-medium capitalize">{activity.action}</p>
                                <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                                  {format(parseISO(activity.timestamp), "MMM d, yyyy")}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{activity.user}</p>
                              {activity.details && (
                                <p className="text-sm mt-2 bg-muted/30 p-3 rounded-md">{activity.details}</p>
                              )}
                        </div>
                      </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}