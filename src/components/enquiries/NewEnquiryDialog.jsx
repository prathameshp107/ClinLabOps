import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, Upload, Send, User, Building, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { getUsers } from "@/services/userService"
import { enquiryService } from "@/services/enquiryService"

export default function NewEnquiryDialog({ open, onOpenChange, onSuccess }) {
    // Form state
    const [customerName, setCustomerName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [details, setDetails] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [sendConfirmation, setSendConfirmation] = useState(true);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);

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
        if (!customerName || !email || !subject || !details || !priority || !assignedTo) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setSubmitStatus("loading");

        try {
            const enquiryData = {
                customerName,
                companyName,
                email,
                phone,
                subject,
                details,
                priority,
                assignedTo,
                status: 'Pending',
                progress: 0,
                documents: [],
                activities: [
                    {
                        id: `activity-${Date.now()}`,
                        action: 'Enquiry Created',
                        user: customerName,
                        timestamp: new Date().toISOString(),
                        details: `Initial enquiry submitted: ${subject}`
                    }
                ],
                comments: []
            };

            const newEnquiry = await enquiryService.create(enquiryData);

            setSubmitStatus("success");
            toast({
                title: "Enquiry Created",
                description: "New enquiry has been created successfully.",
            });

            if (onSuccess) onSuccess(newEnquiry);

            setTimeout(() => {
                onOpenChange(false);
                // Reset form
                setCustomerName("");
                setCompanyName("");
                setEmail("");
                setPhone("");
                setSubject("");
                setDetails("");
                setPriority("");
                setAssignedTo("");
                setSendConfirmation(true);
                setSubmitStatus(null);
            }, 1000);
        } catch (error) {
            console.error('Error creating enquiry:', error);
            setSubmitStatus(null);
            toast({
                title: "Error",
                description: "Failed to create enquiry. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] p-0 overflow-hidden">
                <div className="max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                        <DialogHeader className="sticky top-0 bg-background z-10 pb-2 sm:pb-4">
                            <DialogTitle className="text-lg sm:text-xl">Create New Enquiry</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-medium">Customer Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customerName" className="text-sm">Customer Name <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="customerName"
                                            placeholder="Enter customer name"
                                            className="pl-8 text-sm sm:text-base"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-sm">Company Name</Label>
                                    <div className="relative">
                                        <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="companyName"
                                            placeholder="Enter company name (optional)"
                                            className="pl-8 text-sm sm:text-base"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm">Email Address <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            className="pl-8 text-sm sm:text-base"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            placeholder="Enter phone number (optional)"
                                            className="pl-8 text-sm sm:text-base"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-medium">Enquiry Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-sm">Subject <span className="text-red-500">*</span></Label>
                                <Input
                                    id="subject"
                                    placeholder="Enter enquiry subject"
                                    className="text-sm sm:text-base"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="details" className="text-sm">Details <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="details"
                                    placeholder="Enter detailed description of the enquiry"
                                    className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority" className="text-sm">Priority <span className="text-red-500">*</span></Label>
                                    <Select value={priority} onValueChange={setPriority} required>
                                        <SelectTrigger id="priority" className="text-sm sm:text-base">
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
                                    <Label htmlFor="assignedTo" className="text-sm">Assign To <span className="text-red-500">*</span></Label>
                                    <Select value={assignedTo} onValueChange={setAssignedTo} required>
                                        <SelectTrigger id="assignedTo" className="text-sm sm:text-base">
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

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                            <div className="space-y-0.5">
                                <Label htmlFor="sendConfirmation" className="text-sm">Send Confirmation Email</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Notify the customer that their enquiry has been received
                                </p>
                            </div>
                            <Switch id="sendConfirmation" checked={sendConfirmation} onCheckedChange={setSendConfirmation} />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2 pt-4 sticky bottom-0 bg-background">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="w-full sm:w-auto text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitStatus === "loading"}
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm"
                            >
                                {submitStatus === "loading" ? (
                                    <>
                                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Create Enquiry
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
} 