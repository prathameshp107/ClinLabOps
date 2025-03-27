"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, User, Building, Mail, Phone, Calendar, CheckCircle, AlertTriangle } from "lucide-react"
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

// Mock data for a single enquiry
const mockEnquiries = [
  {
    id: "e1",
    customerName: "John Smith",
    companyName: "Acme Pharmaceuticals",
    email: "john.smith@acmepharma.com",
    phone: "+1 (555) 123-4567",
    subject: "Request for chemical analysis of new compound",
    details: "We've developed a new compound that needs comprehensive analysis for regulatory approval. We need detailed reports on composition, purity, and potential contaminants.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Dr. Michael Chen",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-16T14:20:00Z",
    progress: 45,
    documents: [
      {
        id: "d1",
        name: "Initial Specifications.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "John Smith",
        uploadedAt: "2023-06-15T10:35:00Z",
        isReport: false
      }
    ],
    activities: [
      {
        id: "a1",
        action: "Enquiry Created",
        details: "New customer enquiry has been created",
        user: "John Smith",
        timestamp: "2023-06-15T10:30:00Z"
      },
      {
        id: "a2",
        action: "Document Uploaded",
        details: "Initial Specifications.pdf has been uploaded",
        user: "John Smith",
        timestamp: "2023-06-15T10:35:00Z"
      },
      {
        id: "a3",
        action: "Status Updated",
        details: "Status changed from 'Pending' to 'In Progress'",
        user: "Dr. Michael Chen",
        timestamp: "2023-06-16T14:20:00Z"
      }
    ],
    comments: [
      {
        id: "c1",
        user: "Dr. Michael Chen",
        userRole: "Senior Researcher",
        content: "I've reviewed the initial specifications. We'll need additional information about the synthesis process to complete the analysis properly.",
        timestamp: "2023-06-16T14:25:00Z"
      }
    ]
  },
  {
    id: "e2",
    customerName: "Emily Chen",
    companyName: "BioTech Innovations",
    email: "emily.chen@biotechinnovations.com",
    phone: "+1 (555) 987-6543",
    subject: "Protein sequencing for new antibody",
    details: "We need comprehensive protein sequencing for a novel antibody we've developed. The antibody shows promising results in preliminary tests, but we need detailed sequencing for patent application.",
    priority: "Medium",
    status: "Pending",
    assignedTo: "Dr. Sarah Johnson",
    createdAt: "2023-06-18T09:15:00Z",
    updatedAt: "2023-06-18T09:15:00Z",
    progress: 10,
    documents: [],
    activities: [
      {
        id: "a4",
        action: "Enquiry Created",
        details: "New customer enquiry has been created",
        user: "Emily Chen",
        timestamp: "2023-06-18T09:15:00Z"
      }
    ],
    comments: []
  }
];

export default function EditEnquiryPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  // Find the enquiry by ID
  const enquiry = mockEnquiries.find(e => e.id === id);
  
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
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  
  // Load enquiry data when component mounts
  useEffect(() => {
    if (enquiry) {
      setCustomerName(enquiry.customerName);
      setCompanyName(enquiry.companyName || "");
      setEmail(enquiry.email);
      setPhone(enquiry.phone || "");
      setSubject(enquiry.subject);
      setDetails(enquiry.details);
      setPriority(enquiry.priority);
      setStatus(enquiry.status);
      setAssignedTo(enquiry.assignedTo);
    }
  }, [enquiry]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!customerName || !email || !subject || !details || !priority || !status || !assignedTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Set loading state
    setUpdateStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      // Update enquiry object
      const updatedEnquiry = {
        ...enquiry,
        customerName,
        companyName,
        email,
        phone,
        subject,
        details,
        priority,
        status,
        assignedTo,
        updatedAt: new Date().toISOString(),
        activities: [
          {
            id: `a${Math.floor(Math.random() * 1000)}`,
            action: "Enquiry Updated",
            details: "Enquiry details have been updated",
            user: "Current User",
            timestamp: new Date().toISOString()
          },
          ...enquiry.activities
        ]
      };
      
      // Success state
      setUpdateStatus("success");
      
      // Show success toast
      toast({
        title: "Enquiry Updated",
        description: "Enquiry has been updated successfully.",
      });
      
      // Redirect to enquiry details after a delay
      setTimeout(() => {
        router.push(`/enquiries/${id}`);
      }, 1500);
    }, 1000);
  };
  
  if (!enquiry) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Enquiries
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Enquiry Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The enquiry you're trying to edit doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push("/enquiries")}>
                Return to Enquiries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 flex flex-col md:flex-row gap-6">
      <EnquiriesSidebar className="hidden md:block w-64 shrink-0" />
      
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Enquiry
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit Enquiry</CardTitle>
            <CardDescription>
              Update the details of this customer enquiry
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select 
                      value={status} 
                      onValueChange={setStatus}
                      required
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                  <Label htmlFor="notifyCustomer">Notify Customer of Changes</Label>
                  <p className="text-sm text-muted-foreground">
                    Send an email notification to the customer about these updates
                  </p>
                </div>
                <Switch 
                  id="notifyCustomer" 
                  checked={notifyCustomer}
                  onCheckedChange={setNotifyCustomer}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => router.push(`/enquiries/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateStatus === "loading"}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
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
          </CardContent>
        </Card>
        
        {/* Success Message */}
        {updateStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Enquiry Updated Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Your changes have been saved. Redirecting to enquiry details...
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
