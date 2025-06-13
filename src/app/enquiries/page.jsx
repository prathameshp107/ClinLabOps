"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { EnquiryQuickView } from "@/components/enquiries/enquiry-quick-view"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Icons
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  BarChart,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  Inbox,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  Settings,
  Star,
  Trash2,
  Upload,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Hash,
  Users,
  CircleCheck,
  LayoutGrid,
  CalendarDays,
  SlidersHorizontal,
  Plus,
  User,
  Mail,
  Info,
  MessageSquare,
  History
} from "lucide-react"

// Mock data for enquiries
const mockEnquiries = [
  {
    id: "e1",
    customerName: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    companyName: "Acme Laboratories",
    subject: "PCR Testing Requirements",
    details: "Need information about your PCR testing capabilities for our upcoming clinical trial.",
    priority: "High",
    assignedTo: "Dr. Sarah Johnson",
    status: "Pending",
    createdAt: "2025-03-20T10:30:00Z",
    updatedAt: "2025-03-20T10:30:00Z",
    documents: [
      { id: "d1", name: "Requirements.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2025-03-20T10:30:00Z" }
    ],
    activities: [
      { id: "a1", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-20T10:30:00Z" }
    ]
  },
  {
    id: "e2",
    customerName: "Emily Chen",
    email: "emily.chen@biotech.com",
    phone: "+1 (555) 987-6543",
    companyName: "BioTech Innovations",
    subject: "Protein Analysis Services",
    details: "Interested in your mass spectrometry services for protein characterization.",
    priority: "Medium",
    assignedTo: "Dr. Michael Rodriguez",
    status: "In Progress",
    createdAt: "2025-03-18T14:15:00Z",
    updatedAt: "2025-03-21T09:45:00Z",
    documents: [
      { id: "d2", name: "Sample_Data.xlsx", type: "xlsx", size: "3.4 MB", uploadedAt: "2025-03-18T14:15:00Z" },
      { id: "d3", name: "Protocol_Requirements.docx", type: "docx", size: "0.8 MB", uploadedAt: "2025-03-19T11:20:00Z" }
    ],
    activities: [
      { id: "a2", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-18T14:15:00Z" },
      { id: "a3", action: "Assigned to Dr. Michael Rodriguez", user: "Lab Manager", timestamp: "2025-03-19T09:30:00Z" },
      { id: "a4", action: "Status updated to In Progress", user: "Dr. Michael Rodriguez", timestamp: "2025-03-21T09:45:00Z" }
    ]
  },
  {
    id: "e3",
    customerName: "Robert Johnson",
    email: "robert.johnson@medresearch.org",
    phone: "+1 (555) 456-7890",
    companyName: "Medical Research Institute",
    subject: "Genomic Sequencing Project",
    details: "Need a quote for whole genome sequencing of 50 samples.",
    priority: "High",
    assignedTo: "Dr. Lisa Wong",
    status: "Completed",
    createdAt: "2025-03-15T11:00:00Z",
    updatedAt: "2025-03-22T16:30:00Z",
    documents: [
      { id: "d4", name: "Sample_List.csv", type: "csv", size: "0.5 MB", uploadedAt: "2025-03-15T11:00:00Z" },
      { id: "d5", name: "Final_Report.pdf", type: "pdf", size: "4.2 MB", uploadedAt: "2025-03-22T16:30:00Z" }
    ],
    activities: [
      { id: "a5", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-15T11:00:00Z" },
      { id: "a6", action: "Assigned to Dr. Lisa Wong", user: "Lab Manager", timestamp: "2025-03-15T14:20:00Z" },
      { id: "a7", action: "Status updated to In Progress", user: "Dr. Lisa Wong", timestamp: "2025-03-16T09:15:00Z" },
      { id: "a8", action: "Final report uploaded", user: "Dr. Lisa Wong", timestamp: "2025-03-22T16:30:00Z" },
      { id: "a9", action: "Status updated to Completed", user: "Dr. Lisa Wong", timestamp: "2025-03-22T16:35:00Z" }
    ]
  },
  {
    id: "e4",
    customerName: "Sarah Williams",
    email: "sarah.williams@pharmaco.com",
    phone: "+1 (555) 789-0123",
    companyName: "PharmaCo",
    subject: "Stability Testing for New Drug",
    details: "Need comprehensive stability testing for our new drug formulation.",
    priority: "Medium",
    assignedTo: "Dr. James Peterson",
    status: "In Progress",
    createdAt: "2025-03-17T13:45:00Z",
    updatedAt: "2025-03-23T10:15:00Z",
    documents: [
      { id: "d6", name: "Drug_Specifications.pdf", type: "pdf", size: "2.1 MB", uploadedAt: "2025-03-17T13:45:00Z" },
      { id: "d7", name: "Testing_Parameters.xlsx", type: "xlsx", size: "1.7 MB", uploadedAt: "2025-03-17T13:45:00Z" }
    ],
    activities: [
      { id: "a10", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-17T13:45:00Z" },
      { id: "a11", action: "Assigned to Dr. James Peterson", user: "Lab Manager", timestamp: "2025-03-18T09:00:00Z" },
      { id: "a12", action: "Status updated to In Progress", user: "Dr. James Peterson", timestamp: "2025-03-19T11:30:00Z" },
      { id: "a13", action: "Preliminary results added", user: "Dr. James Peterson", timestamp: "2025-03-23T10:15:00Z" }
    ]
  },
  {
    id: "e5",
    customerName: "David Brown",
    email: "david.brown@researchlab.edu",
    phone: "+1 (555) 234-5678",
    companyName: "University Research Lab",
    subject: "Antibody Characterization",
    details: "Need characterization of custom antibodies for research project.",
    priority: "Low",
    assignedTo: "Dr. Emily Chen",
    status: "Pending",
    createdAt: "2025-03-22T09:20:00Z",
    updatedAt: "2025-03-22T09:20:00Z",
    documents: [],
    activities: [
      { id: "a14", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-22T09:20:00Z" }
    ]
  }
];

// Mock data for team members
const teamMembers = [
  { id: "tm1", name: "Dr. Sarah Johnson", role: "Lab Director" },
  { id: "tm2", name: "Dr. Michael Rodriguez", role: "Senior Scientist" },
  { id: "tm3", name: "Dr. Lisa Wong", role: "Research Scientist" },
  { id: "tm4", name: "Dr. James Peterson", role: "Analytical Chemist" },
  { id: "tm5", name: "Dr. Emily Chen", role: "Microbiologist" }
];

// EnquiriesSidebar component
const EnquiriesSidebar = () => {
  return (
    <div className="w-full md:w-64 md:mr-8 mb-6 md:mb-0 flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-muted/40 bg-background/60 backdrop-blur-lg sticky top-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Filters</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted/50">
                <Inbox className="mr-2 h-4 w-4" />
                All Enquiries
              </Button>
              <Button variant="ghost" className="w-full justify-start font-normal text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700">
                <Clock className="mr-2 h-4 w-4" />
                Pending
              </Button>
              <Button variant="ghost" className="w-full justify-start font-normal text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                <AlertCircle className="mr-2 h-4 w-4" />
                In Progress
              </Button>
              <Button variant="ghost" className="w-full justify-start font-normal text-green-600 hover:bg-green-50 hover:text-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed
              </Button>
              <Button variant="ghost" className="w-full justify-start font-normal text-red-600 hover:bg-red-50 hover:text-red-700">
                <AlertTriangle className="mr-2 h-4 w-4" />
                High Priority
              </Button>
              <Button variant="ghost" className="w-full justify-start font-normal text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                <Star className="mr-2 h-4 w-4" />
                Starred
              </Button>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-sm font-medium mb-2">Team Members</h3>
              <div className="space-y-1">
                {teamMembers.map((member) => (
                  <Button key={member.id} variant="ghost" className="w-full justify-start font-normal hover:bg-muted/50">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{member.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="text-sm font-medium mb-2">Quick Links</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted/50">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted/50">
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted/50">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [filteredEnquiries, setFilteredEnquiries] = useState(mockEnquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [quickViewEnquiry, setQuickViewEnquiry] = useState(null);

  // Handle toggling enquiry selection
  const toggleEnquiry = (id) => {
    setSelectedEnquiries(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Handle search and filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, statusFilter, priorityFilter, assigneeFilter);
  };

  const applyFilters = (search, status, priority, assignee) => {
    let filtered = [...enquiries];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.customerName.toLowerCase().includes(searchLower) ||
          enquiry.companyName.toLowerCase().includes(searchLower) ||
          enquiry.subject.toLowerCase().includes(searchLower) ||
          enquiry.details.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((enquiry) => enquiry.status === status);
    }

    // Apply priority filter
    if (priority !== "all") {
      filtered = filtered.filter((enquiry) => enquiry.priority === priority);
    }

    // Apply assignee filter
    if (assignee !== "all") {
      filtered = filtered.filter((enquiry) => enquiry.assignedTo === assignee);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEnquiries(filtered);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    applyFilters(searchQuery, status, priorityFilter, assigneeFilter);
  };

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
    applyFilters(searchQuery, statusFilter, priority, assigneeFilter);
  };

  const handleAssigneeFilter = (assignee) => {
    setAssigneeFilter(assignee);
    applyFilters(searchQuery, statusFilter, priorityFilter, assignee);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Re-apply filters with new sort config
    const newFiltered = [...filteredEnquiries];
    newFiltered.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredEnquiries(newFiltered);
  };

  // Status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3 text-yellow-500" />
            Pending
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
            <AlertCircle className="mr-1 h-3 w-3 text-blue-500" />
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Priority badge component
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const toggleSelectAll = () => {
    if (selectedEnquiries.length === filteredEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(filteredEnquiries.map(e => e.id));
    }
  };

  const toggleSelectEnquiry = (id, e) => {
    e.stopPropagation();
    if (selectedEnquiries.includes(id)) {
      setSelectedEnquiries(selectedEnquiries.filter(i => i !== id));
    } else {
      setSelectedEnquiries([...selectedEnquiries, id]);
    }
  };

  // Get counts for stats
  const pendingCount = enquiries.filter(e => e.status === "Pending").length;
  const inProgressCount = enquiries.filter(e => e.status === "In Progress").length;
  const completedCount = enquiries.filter(e => e.status === "Completed").length;

  const handleQuickView = (enquiry, e) => {
    e.stopPropagation();
    setQuickViewEnquiry(enquiry);
  };

  return (
    <DashboardLayout>

      <TooltipProvider>
        <div className="w-full max-w-[1800px] mx-auto px-4 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Customer Enquiries</h1>
              <p className="text-muted-foreground mt-1">Manage and respond to customer lab enquiries</p>
            </div>
            <Button onClick={() => router.push("/enquiries/new")} size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Enquiry
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Filters Panel - 2 columns on larger screens, full width on mobile */}
            

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-10 space-y-6">
              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <Card className="overflow-hidden border border-muted/40 bg-background/60 backdrop-blur-lg hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Enquiries</p>
                        <h3 className="text-3xl font-bold mt-1">{enquiries.length}</h3>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <Inbox className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={100} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border border-muted/40 bg-background/60 backdrop-blur-lg hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                        <h3 className="text-3xl font-bold mt-1">{pendingCount}</h3>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-100">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={(pendingCount / enquiries.length) * 100} className="h-1.5 bg-yellow-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border border-muted/40 bg-background/60 backdrop-blur-lg hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                        <h3 className="text-3xl font-bold mt-1">{inProgressCount}</h3>
                      </div>
                      <div className="p-3 rounded-full bg-blue-100">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={(inProgressCount / enquiries.length) * 100} className="h-1.5 bg-blue-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border border-muted/40 bg-background/60 backdrop-blur-lg hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                        <h3 className="text-3xl font-bold mt-1">{completedCount}</h3>
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={(completedCount / enquiries.length) * 100} className="h-1.5 bg-green-100" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enquiries Table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex-1"
              >
                <Card className="border border-muted/40 bg-background/60 backdrop-blur-lg overflow-hidden shadow-sm">
                  <CardHeader className="pb-0">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-2xl">Enquiries</CardTitle>
                          <CardDescription className="text-base">
                            {filteredEnquiries.length} enquiries found
                          </CardDescription>
                        </div>

                        {/* View Options */}
                        <div className="flex items-center gap-2">
                          {selectedEnquiries.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {selectedEnquiries.length} selected
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Bulk Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Export Selected
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ) : (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <LayoutGrid className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:inline-flex">Grid View</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Switch to Grid View</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:inline-flex">Calendar</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Calendar</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span className="sr-only md:not-sr-only md:inline-flex">Customize</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Customize View</TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Improved Search and Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="relative md:col-span-5">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search by customer, subject, or details..."
                            className="pl-10 py-2 text-sm bg-background/80 border-muted/60 focus:border-primary w-full"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2 flex-wrap md:col-span-7 justify-end">
                          <Select value={statusFilter} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-sm bg-background/80 border-muted/60">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={priorityFilter} onValueChange={handlePriorityFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-sm bg-background/80 border-muted/60">
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Priorities</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={assigneeFilter} onValueChange={handleAssigneeFilter}>
                            <SelectTrigger className="w-[140px] h-9 text-sm bg-background/80 border-muted/60">
                              <SelectValue placeholder="Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Assignees</SelectItem>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                disabled={!(searchQuery || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all")}
                                onClick={() => {
                                  setSearchQuery("");
                                  setStatusFilter("all");
                                  setPriorityFilter("all");
                                  setAssigneeFilter("all");
                                  applyFilters("", "all", "all", "all");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Clear Filters</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <ScrollArea className="h-[calc(100vh-22rem)]">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="w-[40px]">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={selectedEnquiries.length === filteredEnquiries.length && filteredEnquiries.length > 0}
                                onChange={toggleSelectAll}
                              />
                            </TableHead>
                            <TableHead className="w-[250px]">
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('customerName')}>
                                Customer / Company
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('subject')}>
                                Subject
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('priority')}>
                                Priority
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('status')}>
                                Status
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('assignedTo')}>
                                Assigned To
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => requestSort('createdAt')}>
                                Created
                                <ArrowUpDown className="ml-2 h-3 w-3" />
                              </Button>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-12">
                                <div className="flex flex-col items-center gap-2">
                                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                  <p className="text-base text-muted-foreground mt-2">Loading enquiries...</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : filteredEnquiries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                  <Inbox className="h-12 w-12 text-muted-foreground/50" />
                                  <p className="text-lg mt-2">No enquiries found matching your filters.</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => {
                                      setSearchQuery("");
                                      setStatusFilter("all");
                                      setPriorityFilter("all");
                                      setAssigneeFilter("all");
                                      applyFilters("", "all", "all", "all");
                                    }}
                                  >
                                    Clear Filters
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredEnquiries.map((enquiry, index) => (
                              <TableRow
                                key={enquiry.id}
                                onClick={(e) => handleQuickView(enquiry, e)}
                                className={cn(
                                  "cursor-pointer transition-colors hover:bg-muted/30",
                                  selectedEnquiries.includes(enquiry.id) && "bg-primary/5",
                                  enquiry.hasUnreadMessages && "bg-blue-50/50 dark:bg-blue-950/20",
                                  "border-l-4",
                                  enquiry.priority === "High" ? "border-l-red-500" :
                                    enquiry.priority === "Medium" ? "border-l-amber-500" : "border-l-green-500"
                                )}
                              >
                                <TableCell className="align-middle py-3">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedEnquiries.includes(enquiry.id)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleEnquiry(enquiry.id);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </TableCell>
                                <TableCell className="py-3">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="font-medium">{enquiry.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{enquiry.company || "Individual"}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <div className="flex flex-col gap-0.5 max-w-[280px]">
                                    <div className="font-medium truncate">{enquiry.subject}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {enquiry.details ? enquiry.details.substring(0, 80) + '...' : ''}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "font-normal",
                                      enquiry.priority === "High" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50" :
                                        enquiry.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50" :
                                          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50"
                                    )}
                                  >
                                    {enquiry.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "font-normal",
                                      enquiry.status === "Pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50" :
                                        enquiry.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50" :
                                          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50"
                                    )}
                                  >
                                    {enquiry.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {enquiry.assignedTo ? enquiry.assignedTo.split(' ').map(n => n[0]).join('') : 'NA'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{enquiry.assignedTo}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-muted-foreground">
                                  {format(parseISO(enquiry.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right py-3">
                                  <div className="flex justify-end gap-1.5">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              router.push(`/enquiries/${enquiry.id}/edit`);
                                            }}
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // Handle mark as completed
                                              // toast.success(`Marked ${enquiry.subject} as completed`);
                                            }}
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Mark as Completed</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          router.push(`/enquiries/${enquiry.id}/edit`);
                                        }}>
                                          <Pencil className="mr-2 h-4 w-4" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle mark as completed
                                          // toast.success(`Marked ${enquiry.subject} as completed`);
                                        }}>
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Mark as Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle delete
                                          }}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </ScrollArea>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{filteredEnquiries.length}</span> of{" "}
                      <span className="font-medium text-foreground">{enquiries.length}</span> enquiries
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
        {quickViewEnquiry && (
          <EnquiryQuickView
            enquiry={quickViewEnquiry}
            onClose={() => setQuickViewEnquiry(null)}
          />
        )}
      </TooltipProvider>
    </DashboardLayout>
  );
}

// Timeline components for Activity log
const Timeline = ({ className, children }) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};

const TimelineItem = ({ children }) => {
  return <div className="flex gap-4 relative pb-6 last:pb-0 last:before:hidden before:absolute before:left-3.5 before:top-8 before:h-full before:w-[1px] before:bg-border">{children}</div>;
};

const TimelineIcon = ({ children, className }) => {
  return (
    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border z-10", className)}>
      {children}
    </div>
  );
};

const TimelineContent = ({ children }) => {
  return <div className="flex-1 pt-0.5">{children}</div>;
};

export default EnquiriesPage;
