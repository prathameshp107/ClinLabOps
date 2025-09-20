import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save, User, Building, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { getUsers } from "@/services/userService"
import { enquiryService } from "@/services/enquiryService"

export default function EditEnquiryDialog({ open, onOpenChange, enquiry, onSuccess }) {
    // Form state
    const [customerName, setCustomerName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [details, setDetails] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [sendNotification, setSendNotification] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);

    // Populate form when enquiry prop changes
    useEffect(() => {
        if (enquiry) {
            setCustomerName(enquiry.customerName || "");
            setCompanyName(enquiry.companyName || "");
            setEmail(enquiry.email || "");
            setPhone(enquiry.phone || "");
            setSubject(enquiry.subject || "");
            setDetails(enquiry.details || "");
            setPriority(enquiry.priority || "");
            setStatus(enquiry.status || "");
            setAssignedTo(enquiry.assignedTo || "");
            setSendNotification(false);
        }
    }, [enquiry]);

    // Fetch team members when component mounts
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const users = await getUsers();
                // Remove duplicates based on user ID and name
                const uniqueUsers = users.filter((user, index, self) =>
                    index === self.findIndex(u => u._id === user._id)
                );
                setTeamMembers(uniqueUsers.map((user, index) => ({
                    id: user._id || `user-${index}`, // Fallback to index if no ID
                    name: user.name,
                    role: user.role
                })));
            } catch (error) {
                console.error('Failed to fetch team members:', error);
            }
        };
        fetchTeamMembers();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customerName || !email || !subject || !details || !priority || !status || !assignedTo) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setUpdateStatus("loading");

        try {
            const updatedData = {
                customerName,
                companyName,
                email,
                phone,
                subject,
                details,
                priority,
                status,
                assignedTo,
                updatedAt: new Date().toISOString()
            };

            const updatedEnquiry = await enquiryService.update(enquiry._id || enquiry.id, updatedData);

            setUpdateStatus("success");
            toast({
                title: "Enquiry Updated",
                description: "Enquiry has been updated successfully.",
            });

            if (onSuccess) onSuccess(updatedEnquiry);

            setTimeout(() => {
                onOpenChange(false);
                setUpdateStatus(null);
            }, 1000);
        } catch (error) {
            console.error('Error updating enquiry:', error);
            setUpdateStatus(null);
            toast({
                title: "Error",
                description: "Failed to update enquiry. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (!enquiry) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <DialogHeader>
                        <DialogTitle>Edit Enquiry - {enquiry.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="customerName" placeholder="Enter customer name" className="pl-8" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <div className="relative">
                                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="companyName" placeholder="Enter company name (optional)" className="pl-8" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="Enter email address" className="pl-8" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" placeholder="Enter phone number (optional)" className="pl-8" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Enquiry Details</h3>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                            <Input id="subject" placeholder="Enter enquiry subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="details">Details <span className="text-red-500">*</span></Label>
                            <Textarea id="details" placeholder="Enter detailed description of the enquiry" className="min-h-[100px]" value={details} onChange={(e) => setDetails(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                                <Select value={priority} onValueChange={setPriority} required>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Select priority level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                <Select value={status} onValueChange={setStatus} required>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        <SelectItem value="On Hold">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assignedTo">Assign To <span className="text-red-500">*</span></Label>
                                <Select value={assignedTo} onValueChange={setAssignedTo} required>
                                    <SelectTrigger id="assignedTo">
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamMembers.map((member, index) => (
                                            <SelectItem key={`${member.id}-${index}`} value={member.name}>
                                                {member.name} - {member.role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="sendNotification">Send Update Notification</Label>
                            <p className="text-sm text-muted-foreground">
                                Notify the customer about the changes made to their enquiry
                            </p>
                        </div>
                        <Switch id="sendNotification" checked={sendNotification} onCheckedChange={setSendNotification} />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateStatus === "loading"} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            {updateStatus === "loading" ? (
                                <>
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 