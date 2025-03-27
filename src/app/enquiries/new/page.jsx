"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Send, User, Building, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { EnquiriesSidebar } from "@/components/enquiries/enquiries-sidebar"

// Mock data for team members
const teamMembers = [
  { id: "tm1", name: "Dr. Sarah Johnson", role: "Lab Director" },
  { id: "tm2", name: "Dr. Michael Chen", role: "Senior Researcher" },
  { id: "tm3", name: "Jessica Williams", role: "Lab Technician" },
  { id: "tm4", name: "Robert Garcia", role: "Quality Control" },
  { id: "tm5", name: "Emily Davis", role: "Customer Relations" }
];

export default function NewEnquiryPage() {
  const router = useRouter();
  
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
    
    // Validate form
    if (!customerName || !email || !subject || !details || !priority || !assignedTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Set loading state
    setSubmitStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      // Create new enquiry object
      const newEnquiry = {
        id: `e${Math.floor(Math.random() * 1000)}`,
        customerName,
        companyName,
        email,
        phone,
        subject,
        details,
        priority,
        assignedTo,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: 0,
        documents: [],
        activities: [
          {
            id: `a${Math.floor(Math.random() * 1000)}`,
            action: "Enquiry Created",
            details: "New customer enquiry has been created",
            user: "Current User",
            timestamp: new Date().toISOString()
          }
        ],
        comments: []
      };
      
      // Success state
      setSubmitStatus("success");
      
      // Show success toast
      toast({
        title: "Enquiry Created",
        description: "New enquiry has been created successfully.",
      });
      
      // Redirect to enquiries list after a delay
      setTimeout(() => {
        router.push("/enquiries");
      }, 1500);
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
      <EnquiriesSidebar className="hidden md:block w-64 shrink-0" />
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Enquiries
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Enquiry</CardTitle>
            <CardDescription>
              Add a new customer enquiry to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="customerName" 
                        placeholder="Enter customer name"
                        className="pl-8"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="companyName" 
                        placeholder="Enter company name (optional)"
                        className="pl-8"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="Enter email address"
                        className="pl-8"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        placeholder="Enter phone number (optional)"
                        className="pl-8"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Enquiry Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                  <Input 
                    id="subject" 
                    placeholder="Enter enquiry subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details">Details <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="details" 
                    placeholder="Enter detailed description of the enquiry"
                    className="min-h-[150px]"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                    <Select 
                      value={priority} 
                      onValueChange={setPriority}
                      required
                    >
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
                    <Select 
                      value={assignedTo} 
                      onValueChange={setAssignedTo}
                      required
                    >
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
                <Switch 
                  id="sendConfirmation" 
                  checked={sendConfirmation}
                  onCheckedChange={setSendConfirmation}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => router.push("/enquiries")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
          </CardContent>
        </Card>
        
        {/* Success Message */}
        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Enquiry Created Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Your new enquiry has been created. Redirecting to enquiries list...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
