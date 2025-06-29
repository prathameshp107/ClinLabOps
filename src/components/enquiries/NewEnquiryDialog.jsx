import { useState } from "react"
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
import { teamMembers } from "@/data/enquiries-data"

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

    // Handle form submission
    const handleSubmit = (e) => {
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
        setTimeout(() => {
            setSubmitStatus("success");
            toast({
                title: "Enquiry Created",
                description: "New enquiry has been created successfully.",
            });
            if (onSuccess) onSuccess();
            setTimeout(() => {
                onOpenChange(false);
                // Reset form
                setCustomerName(""); setCompanyName(""); setEmail(""); setPhone(""); setSubject(""); setDetails(""); setPriority(""); setAssignedTo(""); setSendConfirmation(true); setSubmitStatus(null);
            }, 1000);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
                    <DialogHeader>
                        <DialogTitle>Create New Enquiry</DialogTitle>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <Label htmlFor="assignedTo">Assign To <span className="text-red-500">*</span></Label>
                                <Select value={assignedTo} onValueChange={setAssignedTo} required>
                                    <SelectTrigger id="assignedTo">
                                        <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teamMembers.map(member => (
                                            <SelectItem key={member.id} value={member.name}>
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
                            <Label htmlFor="sendConfirmation">Send Confirmation Email</Label>
                            <p className="text-sm text-muted-foreground">
                                Notify the customer that their enquiry has been received
                            </p>
                        </div>
                        <Switch id="sendConfirmation" checked={sendConfirmation} onCheckedChange={setSendConfirmation} />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitStatus === "loading"} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
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
            </DialogContent>
        </Dialog>
    );
} 