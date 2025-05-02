import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  FileText,
  History,
  MessageSquare,
  AlertCircle,
  User,
  Mail,
  Info,
  Eye,
  Pencil,
  Phone,
  Building,
  Calendar,
  Clock,
} from "lucide-react"

// Timeline components for Activity log
const Timeline = ({ className, children }) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};

const TimelineItem = ({ children }) => {
  return <div className="flex gap-4 relative pb-6 last:pb-0 last:before:hidden before:absolute before:left-3.5 before:top-8 before:h-full before:w-[1px] before:bg-border/60">{children}</div>;
};

const TimelineIcon = ({ children, className }) => {
  return (
    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm z-10", className)}>
      {children}
    </div>
  );
};

const TimelineContent = ({ children }) => {
  return <div className="flex-1 pt-0.5">{children}</div>;
};

export function EnquiryQuickView({ enquiry, onClose }) {
  const router = useRouter();
  
  if (!enquiry) return null;
  
  return (
    <Dialog open={!!enquiry} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[85vh] p-0 overflow-hidden rounded-xl border-none shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary/15 to-primary/5 px-5 py-4 border-b sticky top-0 z-10">
            <DialogHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ring-2 ring-white/20 ${
                  enquiry.status === "Pending" ? "bg-yellow-500" :
                  enquiry.status === "In Progress" ? "bg-blue-500" : "bg-green-500"
                }`}></div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  {enquiry.subject}
                </DialogTitle>
              </div>
              <DialogDescription className="text-sm mt-1.5 flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="text-primary/70">#</span>{enquiry.id}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-primary/70" />
                  {format(parseISO(enquiry.createdAt), "MMM d, yyyy")}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {/* Scrollable content area with visible scrollbar */}
          <ScrollArea className="flex-1 h-[calc(85vh-80px)]" type="always">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Left column - Enquiry details */}
                <div className="md:col-span-3 space-y-4">
                  {/* Rest of the content remains the same */}
                  <Card className="shadow-sm border border-border/40 overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/20 border-b border-border/30">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary/80" />
                        Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm whitespace-pre-line leading-relaxed">{enquiry.details}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-border/40 overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/20 border-b border-border/30">
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4 text-primary/80" />
                        Activity Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Timeline className="px-4 py-4">
                        {[...enquiry.activities || []].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((activity, index) => (
                          <TimelineItem key={index}>
                            <TimelineIcon className={
                              activity.action === "comment" ? "bg-blue-50 text-blue-600 border-blue-200" :
                              activity.action === "status" ? "bg-amber-50 text-amber-600 border-amber-200" :
                              "bg-green-50 text-green-600 border-green-200"
                            }>
                              {activity.action === "comment" ? (
                                <MessageSquare className="h-4 w-4" />
                              ) : activity.action === "status" ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </TimelineIcon>
                            <TimelineContent>
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
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column - Customer info and metadata */}
                <div className="space-y-4">
                  <Card className="shadow-sm border border-border/40 overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/20 border-b border-border/30">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary/80" />
                        Customer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                          <AvatarImage src={`https://avatar.vercel.sh/${enquiry.customerName.replace(' ', '')}.png`} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {enquiry.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-base">{enquiry.customerName}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                            <Mail className="h-3.5 w-3.5" />
                            {enquiry.email}
                          </p>
                        </div>
                      </div>
                      <Separator className="my-1" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/30">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium">{enquiry.phone || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/30">
                            <Building className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Company</p>
                            <p className="font-medium">{enquiry.companyName || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-border/40 overflow-hidden">
                    <CardHeader className="pb-2 bg-muted/20 border-b border-border/30">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary/80" />
                        Enquiry Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant={
                            enquiry.status === "Pending" ? "warning" :
                            enquiry.status === "In Progress" ? "info" : "success"
                          } className="justify-center px-3">
                            {enquiry.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Priority</span>
                          <Badge variant={
                            enquiry.priority === "High" ? "destructive" :
                            enquiry.priority === "Medium" ? "warning" : "outline"
                          } className="justify-center px-3">
                            {enquiry.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Assignee</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-primary/10">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {enquiry.assignedTo.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{enquiry.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-1" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/30">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Created</p>
                            <p className="font-medium">{format(parseISO(enquiry.createdAt), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        {enquiry.updatedAt && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/30">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Updated</p>
                              <p className="font-medium">{format(parseISO(enquiry.updatedAt), "MMM d, yyyy")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-border/40 overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <Button className="w-full h-10 gap-2 shadow-sm" onClick={() => {
                        onClose();
                        router.push(`/enquiries/${enquiry.id}`);
                      }}>
                        <Eye className="h-4 w-4" />
                        View Full Details
                      </Button>
                      <Button variant="outline" className="w-full h-10 gap-2" onClick={() => {
                        onClose();
                        router.push(`/enquiries/${enquiry.id}/edit`);
                      }}>
                        <Pencil className="h-4 w-4" />
                        Edit Enquiry
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}