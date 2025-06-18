"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { format, addDays, isBefore, parseISO } from "date-fns"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCaption,
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

// Icons
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    FileText,
    Download,
    Upload,
    Calendar as CalendarIcon,
    Clock,
    Search,
    Filter,
    ChevronRight,
    Users,
    Microscope,
    ClipboardList,
    FlaskConical,
    Shield,
    BookOpen,
    FileCheck,
    AlertCircle,
    BarChart,
    Beaker,
    Clipboard,
    Landmark,
    PawPrint,
    Database,
    UserCheck,
    Thermometer,
    Droplet,
    Pill,
    Stethoscope,
    Trash2,
    Eye,
    EyeOff,
    MoreHorizontal,
    Plus,
    RefreshCw,
    ExternalLink,
    Info,
    HelpCircle,
    FileSymlink,
    FilePlus,
    Calendar as CalendarIconOutline,
    Bell,
} from "lucide-react"

// Aceternity UI components
import { HoverEffect } from "@/components/ui/hover-effect"
import { SparklesCore } from "@/components/ui/sparkles"
import { TracingBeam } from "@/components/ui/tracing-beam"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout";


// Mock data for compliance overview
const complianceOverview = {
    glpStatus: "Compliant",
    animalWelfareChecks: {
        completed: 24,
        total: 30,
        nextDue: "2023-12-15"
    },
    protocolApprovals: {
        approved: 18,
        pending: 3,
        rejected: 1
    },
    inventoryCompliance: {
        compliant: 85,
        pending: 10,
        nonCompliant: 5
    },
    lastAudit: "2023-09-28",
    upcomingDeadlines: [
        { title: "Annual GLP Certification", date: "2023-12-30", type: "certification" },
        { title: "IACUC Protocol Renewal", date: "2023-12-10", type: "protocol" },
        { title: "Equipment Calibration", date: "2023-11-25", type: "equipment" }
    ]
};

// Mock data for GLP compliance
const glpComplianceData = {
    overview: "Good Laboratory Practice (GLP) is a set of principles intended to assure the quality and integrity of non-clinical laboratory studies that are intended to support research or marketing permits for products regulated by government agencies.",
    checklists: [
        { id: 1, title: "Study Plans Documentation", status: "Compliant", lastUpdated: "2023-10-15", responsible: "Dr. Sarah Chen" },
        { id: 2, title: "Standard Operating Procedures", status: "Compliant", lastUpdated: "2023-10-10", responsible: "Dr. Michael Rodriguez" },
        { id: 3, title: "Quality Assurance Unit", status: "Compliant", lastUpdated: "2023-09-28", responsible: "Jennifer Williams" },
        { id: 4, title: "Facility Requirements", status: "Pending", lastUpdated: "2023-10-05", responsible: "Robert Johnson" },
        { id: 5, title: "Equipment Validation", status: "Compliant", lastUpdated: "2023-09-20", responsible: "Dr. Emily Parker" },
        { id: 6, title: "Test & Control Articles", status: "Flagged", lastUpdated: "2023-10-18", responsible: "Dr. David Kim" },
        { id: 7, title: "Records & Reports", status: "Compliant", lastUpdated: "2023-10-12", responsible: "Amanda Lewis" }
    ],
    documents: [
        { id: 1, title: "GLP Master Manual", type: "PDF", size: "4.2 MB", lastUpdated: "2023-08-15" },
        { id: 2, title: "SOP - Study Director Responsibilities", type: "PDF", size: "1.8 MB", lastUpdated: "2023-09-10" },
        { id: 3, title: "SOP - Test Article Handling", type: "PDF", size: "2.1 MB", lastUpdated: "2023-07-22" },
        { id: 4, title: "SOP - Data Recording & Handling", type: "PDF", size: "3.5 MB", lastUpdated: "2023-09-05" },
        { id: 5, title: "GLP Compliance Checklist", type: "XLSX", size: "1.2 MB", lastUpdated: "2023-10-01" }
    ]
};

// Mock data for animal welfare
const animalWelfareData = {
    protocols: [
        { id: "IACUC-2023-045", title: "Toxicity Study in Rodent Models", status: "Approved", expiration: "2024-06-15", species: "Mice", count: 120 },
        { id: "IACUC-2023-052", title: "Pharmacokinetic Analysis", status: "Approved", expiration: "2024-05-22", species: "Rats", count: 80 },
        { id: "IACUC-2023-061", title: "Efficacy Testing - Compound XR-27", status: "Pending Review", expiration: "N/A", species: "Mice", count: 150 },
        { id: "IACUC-2023-039", title: "Bioavailability Study", status: "Approved", expiration: "2024-03-10", species: "Rabbits", count: 24 },
        { id: "IACUC-2023-047", title: "Chronic Toxicity Assessment", status: "Amendments Requested", expiration: "N/A", species: "Rats", count: 100 }
    ],
    inspections: [
        { id: 1, date: "2023-10-05", type: "Housing Inspection", status: "Passed", inspector: "Dr. Melissa Grant", notes: "All housing conditions meet requirements" },
        { id: 2, date: "2023-09-15", type: "Veterinary Check", status: "Passed", inspector: "Dr. James Wilson", notes: "All animals in good health" },
        { id: 3, date: "2023-08-22", type: "IACUC Site Visit", status: "Minor Findings", inspector: "IACUC Committee", notes: "Temperature logs incomplete for Room B" },
        { id: 4, date: "2023-07-10", type: "Housing Inspection", status: "Passed", inspector: "Dr. Melissa Grant", notes: "No issues found" }
    ],
    upcomingChecks: [
        { id: 1, date: "2023-11-15", type: "Veterinary Check", responsible: "Dr. James Wilson" },
        { id: 2, date: "2023-12-05", type: "Housing Inspection", responsible: "Dr. Melissa Grant" },
        { id: 3, date: "2023-12-20", type: "IACUC Site Visit", responsible: "IACUC Committee" }
    ]
};

// Mock data for audit logs
const auditLogData = [
    { id: 1, timestamp: "2023-10-20 14:32:45", user: "Sarah Chen", action: "Modified protocol IACUC-2023-045", module: "Animal Welfare", severity: "Medium" },
    { id: 2, timestamp: "2023-10-20 11:15:22", user: "Michael Rodriguez", action: "Uploaded new SOP document", module: "GLP", severity: "Low" },
    { id: 3, timestamp: "2023-10-19 16:48:33", user: "Jennifer Williams", action: "Approved equipment calibration report", module: "Equipment", severity: "Low" },
    { id: 4, timestamp: "2023-10-19 10:22:17", user: "David Kim", action: "Modified test article storage conditions", module: "Inventory", severity: "High" },
    { id: 5, timestamp: "2023-10-18 15:36:59", user: "Emily Parker", action: "Deleted draft protocol", module: "Animal Welfare", severity: "Medium" },
    { id: 6, timestamp: "2023-10-18 09:05:41", user: "Robert Johnson", action: "Changed user permissions for Lab Technician group", module: "Users", severity: "High" },
    { id: 7, timestamp: "2023-10-17 14:12:08", user: "Amanda Lewis", action: "Generated compliance report", module: "Reports", severity: "Low" },
    { id: 8, timestamp: "2023-10-17 11:30:25", user: "Sarah Chen", action: "Updated animal count in protocol IACUC-2023-052", module: "Animal Welfare", severity: "Medium" }
];

// Mock data for training & certifications
const trainingData = {
    requiredTrainings: [
        { id: 1, title: "GLP Fundamentals", category: "Regulatory", frequency: "Annual", nextDue: "2023-12-15" },
        { id: 2, title: "Animal Handling & Ethics", category: "Animal Welfare", frequency: "Biennial", nextDue: "2024-03-22" },
        { id: 3, title: "Biosafety Level 2 Training", category: "Safety", frequency: "Biennial", nextDue: "2024-05-10" },
        { id: 4, title: "Data Integrity & Documentation", category: "Regulatory", frequency: "Annual", nextDue: "2023-11-30" },
        { id: 5, title: "Chemical Safety", category: "Safety", frequency: "Annual", nextDue: "2023-12-05" }
    ],
    userCertifications: [
        { id: 1, user: "Sarah Chen", title: "GLP Fundamentals", completionDate: "2022-12-10", expirationDate: "2023-12-10", status: "Valid" },
        { id: 2, user: "Sarah Chen", title: "Animal Handling & Ethics", completionDate: "2022-03-15", expirationDate: "2024-03-15", status: "Valid" },
        { id: 3, user: "Michael Rodriguez", title: "GLP Fundamentals", completionDate: "2022-11-22", expirationDate: "2023-11-22", status: "Expiring Soon" },
        { id: 4, user: "Jennifer Williams", title: "Biosafety Level 2 Training", completionDate: "2022-05-05", expirationDate: "2024-05-05", status: "Valid" },
        { id: 5, user: "David Kim", title: "Chemical Safety", completionDate: "2022-11-30", expirationDate: "2023-11-30", status: "Expiring Soon" },
        { id: 6, user: "Emily Parker", title: "Data Integrity & Documentation", completionDate: "2022-10-15", expirationDate: "2023-10-15", status: "Expired" }
    ]
};

// Mock data for inventory & equipment
const inventoryData = {
    equipment: [
        { id: 1, name: "HPLC System #1", lastCalibrated: "2023-09-15", nextCalibration: "2023-12-15", status: "Compliant", location: "Lab 101" },
        { id: 2, name: "Mass Spectrometer", lastCalibrated: "2023-08-22", nextCalibration: "2023-11-22", status: "Due Soon", location: "Lab 102" },
        { id: 3, name: "Centrifuge #3", lastCalibrated: "2023-07-10", nextCalibration: "2023-10-10", status: "Overdue", location: "Lab 101" },
        { id: 4, name: "Microscope SX-500", lastCalibrated: "2023-09-30", nextCalibration: "2024-03-30", status: "Compliant", location: "Lab 103" },
        { id: 5, name: "Incubator #2", lastCalibrated: "2023-09-05", nextCalibration: "2023-12-05", status: "Compliant", location: "Lab 102" }
    ],
    chemicals: [
        { id: 1, name: "Methanol", expirationDate: "2024-05-15", status: "Valid", storage: "Flammables Cabinet", quantity: "15L" },
        { id: 2, name: "Acetic Acid", expirationDate: "2024-02-22", status: "Valid", storage: "Acids Cabinet", quantity: "5L" },
        { id: 3, name: "Ethidium Bromide", expirationDate: "2023-11-10", status: "Expiring Soon", storage: "Toxics Cabinet", quantity: "100mL" },
        { id: 4, name: "Formaldehyde 37%", expirationDate: "2024-08-30", status: "Valid", storage: "Toxics Cabinet", quantity: "2L" },
        { id: 5, name: "Sodium Hydroxide", expirationDate: "2025-01-15", status: "Valid", storage: "Bases Cabinet", quantity: "1kg" }
    ],
    maintenanceLogs: [
        { id: 1, equipment: "HPLC System #1", date: "2023-09-15", type: "Preventive Maintenance", technician: "External - LabEquip Inc.", notes: "Replaced pump seals, calibrated detector" },
        { id: 2, equipment: "Centrifuge #3", date: "2023-10-05", type: "Repair", technician: "Robert Johnson", notes: "Fixed imbalance sensor, tested operation" },
        { id: 3, equipment: "Mass Spectrometer", date: "2023-08-22", type: "Calibration", technician: "External - MS Solutions", notes: "Full calibration performed, all tests passed" },
        { id: 4, equipment: "Incubator #2", date: "2023-09-05", type: "Preventive Maintenance", technician: "Jennifer Williams", notes: "Cleaned interior, verified temperature accuracy" }
    ]
};

// Mock data for policy library
const policyLibraryData = [
    { id: 1, title: "GLP Compliance Manual", category: "Regulatory", version: "3.2", lastUpdated: "2023-08-15", size: "4.8 MB" },
    { id: 2, title: "Animal Welfare Policy", category: "Animal Welfare", version: "2.1", lastUpdated: "2023-07-22", size: "3.2 MB" },
    { id: 3, title: "Data Management & Integrity SOP", category: "Data", version: "4.0", lastUpdated: "2023-09-10", size: "2.5 MB" },
    { id: 4, title: "Equipment Calibration Procedures", category: "Equipment", version: "2.5", lastUpdated: "2023-06-30", size: "3.7 MB" },
    { id: 5, title: "Chemical Handling & Storage", category: "Safety", version: "3.3", lastUpdated: "2023-08-05", size: "2.9 MB" },
    { id: 6, title: "Quality Assurance Program", category: "Quality", version: "2.8", lastUpdated: "2023-09-25", size: "5.1 MB" },
    { id: 7, title: "Emergency Response Plan", category: "Safety", version: "1.9", lastUpdated: "2023-05-12", size: "4.3 MB" },
    { id: 8, title: "Personnel Training Requirements", category: "Training", version: "2.2", lastUpdated: "2023-07-18", size: "1.8 MB" }
];

// Mock data for audit calendar
const auditCalendarData = [
    { id: 1, title: "Internal GLP Audit", date: "2023-12-15", type: "Internal", department: "Quality Assurance", status: "Scheduled" },
    { id: 2, title: "IACUC Inspection", date: "2023-12-20", type: "External", department: "Animal Facility", status: "Scheduled" },
    { id: 3, title: "Data Integrity Review", date: "2023-11-28", type: "Internal", department: "IT & Data Management", status: "Scheduled" },
    { id: 4, title: "Equipment Calibration Verification", date: "2023-11-25", type: "Internal", department: "Lab Operations", status: "Scheduled" },
    { id: 5, title: "Annual Regulatory Inspection", date: "2024-02-10", type: "External", department: "All Departments", status: "Planned" },
    { id: 6, title: "Chemical Inventory Audit", date: "2024-01-15", type: "Internal", department: "Lab Operations", status: "Planned" },
    { id: 7, title: "Training Records Review", date: "2023-12-05", type: "Internal", department: "Human Resources", status: "Scheduled" }
];

export default function CompliancePage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("glp");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [filterCategory, setFilterCategory] = useState("all");

    // Function to determine status color
    const getStatusColor = (status) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes("compliant") || statusLower.includes("valid") || statusLower.includes("passed") || statusLower.includes("approved")) {
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        } else if (statusLower.includes("pending") || statusLower.includes("soon") || statusLower.includes("due") || statusLower.includes("review") || statusLower.includes("minor")) {
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
        } else {
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        }
    };

    // Function to get status icon
    const getStatusIcon = (status) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes("compliant") || statusLower.includes("valid") || statusLower.includes("passed") || statusLower.includes("approved")) {
            return <CheckCircle className="h-4 w-4" />;
        } else if (statusLower.includes("pending") || statusLower.includes("soon") || statusLower.includes("due") || statusLower.includes("review") || statusLower.includes("minor")) {
            return <AlertTriangle className="h-4 w-4" />;
        } else {
            return <XCircle className="h-4 w-4" />;
        }
    };

    // Function to handle document download
    const handleDownload = (documentTitle) => {
        toast({
            title: "Download Started",
            description: `Downloading ${documentTitle}...`,
            duration: 3000,
        });
    };

    // Function to handle report generation
    const handleGenerateReport = (reportType) => {
        toast({
            title: "Report Generated",
            description: `${reportType} report has been generated and is ready for download.`,
            duration: 3000,
        });
    };

    // Function to check if a date is approaching (within 14 days)
    const isDateApproaching = (dateString) => {
        const date = parseISO(dateString);
        const today = new Date();
        const twoWeeksFromNow = addDays(today, 14);
        return isBefore(date, twoWeeksFromNow) && isBefore(today, date);
    };

    // Function to check if a date is overdue
    const isDateOverdue = (dateString) => {
        const date = parseISO(dateString);
        const today = new Date();
        return isBefore(date, today);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-background/50 via-background to-background/80">
                <div className="container mx-auto px-4 py-8">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                    Compliance Management
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    Track, manage, and ensure adherence to regulatory, ethical, and internal compliance requirements
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs md:text-sm shadow-sm hover:shadow transition-all"
                                    onClick={() => handleGenerateReport("Compliance Summary")}
                                >
                                    <BarChart className="h-4 w-4 mr-2" />
                                    Generate Report
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="text-xs md:text-sm shadow-sm hover:shadow-md transition-all"
                                >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Compliance Alerts
                                </Button>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search compliance items, protocols, or documents..."
                                    className="pl-10 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="glp">GLP</SelectItem>
                                        <SelectItem value="animal">Animal Welfare</SelectItem>
                                        <SelectItem value="data">Data Integrity</SelectItem>
                                        <SelectItem value="equipment">Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                        <span className="hidden sm:inline">{format(selectedDate, "MMM dd, yyyy")}</span>
                                        <span className="sm:hidden">{format(selectedDate, "MM/dd")}</span>
                                    </Button>
                                    {isCalendarOpen && (
                                        <div className="absolute z-10 mt-2 right-0 bg-background border rounded-md shadow-lg">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => {
                                                    setSelectedDate(date || new Date());
                                                    setIsCalendarOpen(false);
                                                }}
                                                className="rounded-md border"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Compliance Overview Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-primary" />
                            Compliance Overview
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* GLP Status Card */}
                            <Card className="overflow-hidden border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2 bg-gradient-to-r from-green-500/10 to-green-500/5">
                                    <CardTitle className="text-base flex items-center">
                                        <Clipboard className="h-4 w-4 mr-2 text-green-500" />
                                        GLP Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className={`px-3 py-1 ${getStatusColor(complianceOverview.glpStatus)}`}
                                        >
                                            <div className="flex items-center">
                                                {getStatusIcon(complianceOverview.glpStatus)}
                                                <span className="ml-1">{complianceOverview.glpStatus}</span>
                                            </div>
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            Last audit: {complianceOverview.lastAudit}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span>Compliance Score</span>
                                            <span className="font-medium">92%</span>
                                        </div>
                                        <Progress value={92} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Animal Welfare Card */}
                            <Card className="overflow-hidden border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5">
                                    <CardTitle className="text-base flex items-center">
                                        <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
                                        Animal Welfare
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-semibold">
                                            {complianceOverview.animalWelfareChecks.completed}/{complianceOverview.animalWelfareChecks.total}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`px-2 py-0.5 ${isDateApproaching(complianceOverview.animalWelfareChecks.nextDue) ?
                                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"}`}
                                        >
                                            Next check: {format(parseISO(complianceOverview.animalWelfareChecks.nextDue), "MMM dd")}
                                        </Badge>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span>Checks Completed</span>
                                            <span className="font-medium">{Math.round((complianceOverview.animalWelfareChecks.completed / complianceOverview.animalWelfareChecks.total) * 100)}%</span>
                                        </div>
                                        <Progress value={(complianceOverview.animalWelfareChecks.completed / complianceOverview.animalWelfareChecks.total) * 100} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Protocol Approvals Card */}
                            <Card className="overflow-hidden border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-purple-500/5">
                                    <CardTitle className="text-base flex items-center">
                                        <FileCheck className="h-4 w-4 mr-2 text-purple-500" />
                                        Protocol Approvals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5">
                                                {complianceOverview.protocolApprovals.approved} Approved
                                            </Badge>
                                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5">
                                                {complianceOverview.protocolApprovals.pending} Pending
                                            </Badge>
                                        </div>
                                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5">
                                            {complianceOverview.protocolApprovals.rejected} Rejected
                                        </Badge>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span>Approval Rate</span>
                                            <span className="font-medium">
                                                {Math.round((complianceOverview.protocolApprovals.approved /
                                                    (complianceOverview.protocolApprovals.approved +
                                                        complianceOverview.protocolApprovals.pending +
                                                        complianceOverview.protocolApprovals.rejected)) * 100)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={(complianceOverview.protocolApprovals.approved /
                                                (complianceOverview.protocolApprovals.approved +
                                                    complianceOverview.protocolApprovals.pending +
                                                    complianceOverview.protocolApprovals.rejected)) * 100}
                                            className="h-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Inventory Compliance Card */}
                            <Card className="overflow-hidden border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5">
                                    <CardTitle className="text-base flex items-center">
                                        <Beaker className="h-4 w-4 mr-2 text-amber-500" />
                                        Inventory Compliance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Compliance Status</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-xs">{complianceOverview.inventoryCompliance.compliant}%</span>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 ml-2"></div>
                                                <span className="text-xs">{complianceOverview.inventoryCompliance.pending}%</span>
                                                <div className="w-2 h-2 rounded-full bg-red-500 ml-2"></div>
                                                <span className="text-xs">{complianceOverview.inventoryCompliance.nonCompliant}%</span>
                                            </div>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">Includes equipment calibration, chemical storage, and expiration compliance</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span>Overall Status</span>
                                            <span className="font-medium">
                                                {complianceOverview.inventoryCompliance.compliant}% Compliant
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="flex h-full">
                                                <div
                                                    className="bg-green-500 h-full"
                                                    style={{ width: `${complianceOverview.inventoryCompliance.compliant}%` }}
                                                ></div>
                                                <div
                                                    className="bg-yellow-500 h-full"
                                                    style={{ width: `${complianceOverview.inventoryCompliance.pending}%` }}
                                                ></div>
                                                <div
                                                    className="bg-red-500 h-full"
                                                    style={{ width: `${complianceOverview.inventoryCompliance.nonCompliant}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Upcoming Deadlines */}
                        <Card className="mt-4 overflow-hidden border-muted/40 hover:shadow-md transition-all">
                            <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
                                <CardTitle className="text-base flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    Upcoming Compliance Deadlines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {complianceOverview.upcomingDeadlines.map((deadline, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center p-3 rounded-lg border ${isDateApproaching(deadline.date)
                                                ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20"
                                                : "border-muted/40 bg-muted/5"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full mr-3 ${deadline.type === "certification"
                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                : deadline.type === "protocol"
                                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                                    : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}>
                                                {deadline.type === "certification" ? (
                                                    <FileCheck className="h-4 w-4" />
                                                ) : deadline.type === "protocol" ? (
                                                    <ClipboardList className="h-4 w-4" />
                                                ) : (
                                                    <Thermometer className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">{deadline.title}</h4>
                                                <div className="flex items-center mt-1">
                                                    <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                                                    <span className={`text-xs ${isDateApproaching(deadline.date) ? "text-yellow-800 dark:text-yellow-400" : "text-muted-foreground"
                                                        }`}>
                                                        Due: {format(parseISO(deadline.date), "MMM dd, yyyy")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Main Compliance Modules */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <Tabs defaultValue="glp" onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto mb-6">
                                <TabsTrigger
                                    value="glp"
                                    className="flex items-center data-[state=active]:bg-primary/10 py-2"
                                >
                                    <Clipboard className="h-4 w-4 mr-2" />
                                    <span>GLP</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="animal"
                                    className="flex items-center data-[state=active]:bg-primary/10 py-2"
                                >
                                    <PawPrint className="h-4 w-4 mr-2" />
                                    <span>Animal Welfare</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="data"
                                    className="flex items-center data-[state=active]:bg-primary/10 py-2"
                                >
                                    <Database className="h-4 w-4 mr-2" />
                                    <span>Data Integrity</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="training"
                                    className="flex items-center data-[state=active]:bg-primary/10 py-2"
                                >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    <span>Training</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="inventory"
                                    className="flex items-center data-[state=active]:bg-primary/10 py-2"
                                >
                                    <Beaker className="h-4 w-4 mr-2" />
                                    <span>Inventory</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* GLP Tab Content */}
                            <TabsContent value="glp" className="space-y-4">
                                <Card className="border-muted/40">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <Clipboard className="h-5 w-5 mr-2 text-primary" />
                                            Good Laboratory Practice (GLP)
                                        </CardTitle>
                                        <CardDescription>
                                            {glpComplianceData.overview}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* GLP Checklist */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                                                    GLP Compliance Checklist
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead className="w-[300px]">Item</TableHead>
                                                                <TableHead className="w-[120px]">Status</TableHead>
                                                                <TableHead className="hidden md:table-cell">Responsible</TableHead>
                                                                <TableHead className="hidden md:table-cell w-[120px]">Last Updated</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {glpComplianceData.checklists.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell className="font-medium">{item.title}</TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(item.status)}`}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                {getStatusIcon(item.status)}
                                                                                <span className="ml-1">{item.status}</span>
                                                                            </div>
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell">{item.responsible}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{item.lastUpdated}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* GLP Documents */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                                    GLP Documentation
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Document</TableHead>
                                                                <TableHead className="hidden md:table-cell">Type</TableHead>
                                                                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                                                                <TableHead className="w-[100px]">Action</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {glpComplianceData.documents.map((doc) => (
                                                                <TableRow key={doc.id}>
                                                                    <TableCell className="font-medium">{doc.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">
                                                                        <Badge variant="outline" className="bg-muted/30">
                                                                            {doc.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{doc.lastUpdated}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0"
                                                                            onClick={() => handleDownload(doc.title)}
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                                                        Upload New Document
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Animal Welfare Tab Content */}
                            <TabsContent value="animal" className="space-y-4">
                                <Card className="border-muted/40">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <PawPrint className="h-5 w-5 mr-2 text-primary" />
                                            Animal Welfare & Ethics
                                        </CardTitle>
                                        <CardDescription>
                                            Manage IACUC protocols, animal housing logs, and welfare inspections
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* IACUC Protocols */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                                                    IACUC Protocols
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Protocol ID</TableHead>
                                                                <TableHead>Title</TableHead>
                                                                <TableHead>Species</TableHead>
                                                                <TableHead className="hidden md:table-cell">Count</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead className="hidden md:table-cell">Expiration</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {animalWelfareData.protocols.map((protocol) => (
                                                                <TableRow key={protocol.id}>
                                                                    <TableCell className="font-medium">{protocol.id}</TableCell>
                                                                    <TableCell>{protocol.title}</TableCell>
                                                                    <TableCell>{protocol.species}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">{protocol.count}</TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(protocol.status)}`}
                                                                        >
                                                                            {protocol.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell">
                                                                        {protocol.expiration !== "N/A" ? (
                                                                            <span className={`text-xs ${isDateApproaching(protocol.expiration)
                                                                                ? "text-yellow-800 dark:text-yellow-400"
                                                                                : "text-muted-foreground"
                                                                                }`}>
                                                                                {protocol.expiration}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-xs text-muted-foreground">N/A</span>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                        New Protocol
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Inspections & Upcoming Checks */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Inspections */}
                                                <div>
                                                    <h3 className="text-base font-medium mb-3 flex items-center">
                                                        <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                                                        Recent Inspections
                                                    </h3>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/30">
                                                                    <TableHead>Date</TableHead>
                                                                    <TableHead>Type</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {animalWelfareData.inspections.map((inspection) => (
                                                                    <TableRow key={inspection.id}>
                                                                        <TableCell className="text-xs">{inspection.date}</TableCell>
                                                                        <TableCell>{inspection.type}</TableCell>
                                                                        <TableCell>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={`px-2 py-0.5 ${getStatusColor(inspection.status)}`}
                                                                            >
                                                                                {inspection.status}
                                                                            </Badge>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>

                                                {/* Upcoming Checks */}
                                                <div>
                                                    <h3 className="text-base font-medium mb-3 flex items-center">
                                                        <CalendarIconOutline className="h-4 w-4 mr-2 text-primary" />
                                                        Upcoming Checks
                                                    </h3>
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/30">
                                                                    <TableHead>Date</TableHead>
                                                                    <TableHead>Type</TableHead>
                                                                    <TableHead>Responsible</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {animalWelfareData.upcomingChecks.map((check) => (
                                                                    <TableRow key={check.id}>
                                                                        <TableCell className="text-xs">{check.date}</TableCell>
                                                                        <TableCell>{check.type}</TableCell>
                                                                        <TableCell>{check.responsible}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Data Integrity Tab Content */}
                            <TabsContent value="data" className="space-y-4">
                                <Card className="border-muted/40">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <Database className="h-5 w-5 mr-2 text-primary" />
                                            Data Integrity & Audit Logs
                                        </CardTitle>
                                        <CardDescription>
                                            Track data modifications, access logs, and system changes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col gap-4">
                                            {/* Filters */}
                                            <div className="flex flex-wrap gap-3">
                                                <Select defaultValue="all">
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Module" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Modules</SelectItem>
                                                        <SelectItem value="animal">Animal Welfare</SelectItem>
                                                        <SelectItem value="glp">GLP</SelectItem>
                                                        <SelectItem value="inventory">Inventory</SelectItem>
                                                        <SelectItem value="users">Users</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select defaultValue="all">
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Action Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Actions</SelectItem>
                                                        <SelectItem value="create">Create</SelectItem>
                                                        <SelectItem value="modify">Modify</SelectItem>
                                                        <SelectItem value="delete">Delete</SelectItem>
                                                        <SelectItem value="approve">Approve</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Select defaultValue="all">
                                                    <SelectTrigger className="w-[150px]">
                                                        <SelectValue placeholder="Severity" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Severity</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="low">Low</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button variant="outline" size="sm" className="h-10">
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Refresh
                                                </Button>
                                            </div>

                                            {/* Audit Logs Table */}
                                            <div className="border rounded-lg overflow-hidden">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-muted/30">
                                                            <TableHead>Timestamp</TableHead>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Action</TableHead>
                                                            <TableHead className="hidden md:table-cell">Module</TableHead>
                                                            <TableHead>Severity</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {auditLogData.map((log) => (
                                                            <TableRow key={log.id}>
                                                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                                                <TableCell>{log.user}</TableCell>
                                                                <TableCell className="max-w-[200px] truncate">{log.action}</TableCell>
                                                                <TableCell className="hidden md:table-cell">{log.module}</TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`px-2 py-0.5 ${log.severity === "High"
                                                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                            : log.severity === "Medium"
                                                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                                            }`}
                                                                    >
                                                                        {log.severity}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {/* Export Options */}
                                            <div className="flex justify-end gap-3">
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    <Download className="h-3.5 w-3.5 mr-1.5" />
                                                    Export CSV
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs">
                                                    <FileText className="h-3.5 w-3.5 mr-1.5" />
                                                    Generate Report
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Training Tab Content */}
                            <TabsContent value="training" className="space-y-4">
                                <Card className="border-muted/40">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <UserCheck className="h-5 w-5 mr-2 text-primary" />
                                            Training & Certifications
                                        </CardTitle>
                                        <CardDescription>
                                            Manage required trainings, certifications, and compliance status
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Required Trainings */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <ClipboardList className="h-4 w-4 mr-2 text-primary" />
                                                    Required Trainings
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Training</TableHead>
                                                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                                                <TableHead className="hidden md:table-cell">Frequency</TableHead>
                                                                <TableHead>Next Due</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.requiredTrainings.map((training) => (
                                                                <TableRow key={training.id}>
                                                                    <TableCell className="font-medium">{training.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">
                                                                        <Badge variant="outline" className="bg-muted/30">
                                                                            {training.category}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell">{training.frequency}</TableCell>
                                                                    <TableCell>
                                                                        <span className={`text-xs ${isDateApproaching(training.nextDue)
                                                                            ? "text-yellow-800 dark:text-yellow-400"
                                                                            : isDateOverdue(training.nextDue)
                                                                                ? "text-red-800 dark:text-red-400"
                                                                                : "text-muted-foreground"
                                                                            }`}>
                                                                            {training.nextDue}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* User Certifications */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                                    User Certifications
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Certification</TableHead>
                                                                <TableHead className="hidden md:table-cell">Completion</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.userCertifications.map((certification) => (
                                                                <TableRow key={certification.id}>
                                                                    <TableCell className="font-medium">{certification.user}</TableCell>
                                                                    <TableCell>{certification.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {certification.completionDate}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(certification.status)}`}
                                                                        >
                                                                            {certification.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* User Certifications */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                                    User Certifications
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Certification</TableHead>
                                                                <TableHead className="hidden md:table-cell">Completion</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.userCertifications.map((cert) => (
                                                                <TableRow key={cert.id}>
                                                                    <TableCell className="font-medium">{cert.user}</TableCell>
                                                                    <TableCell>{cert.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {cert.completionDate}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(cert.status)}`}
                                                                        >
                                                                            {cert.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* User Certifications */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                                    User Certifications
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Certification</TableHead>
                                                                <TableHead className="hidden md:table-cell">Completion</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.userCertifications.map((cert) => (
                                                                <TableRow key={cert.id}>
                                                                    <TableCell className="font-medium">{cert.user}</TableCell>
                                                                    <TableCell>{cert.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {cert.completionDate}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(cert.status)}`}
                                                                        >
                                                                            {cert.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* User Certifications */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                                    User Certifications
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Certification</TableHead>
                                                                <TableHead className="hidden md:table-cell">Completion</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.userCertifications.map((cert) => (
                                                                <TableRow key={cert.id}>
                                                                    <TableCell className="font-medium">{cert.user}</TableCell>
                                                                    <TableCell>{cert.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {cert.completionDate}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(cert.status)}`}
                                                                        >
                                                                            {cert.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            {/* User Certifications */}
                                            <div>
                                                <h3 className="text-base font-medium mb-3 flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                                    User Certifications
                                                </h3>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>User</TableHead>
                                                                <TableHead>Certification</TableHead>
                                                                <TableHead className="hidden md:table-cell">Completion</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {trainingData.userCertifications.map((cert) => (
                                                                <TableRow key={cert.id}>
                                                                    <TableCell className="font-medium">{cert.user}</TableCell>
                                                                    <TableCell>{cert.title}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {cert.completionDate}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(cert.status)}`}
                                                                        >
                                                                            {cert.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                                                        Upload Certificate
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Inventory Tab Content */}
                            <TabsContent value="inventory" className="space-y-4">
                                <Card className="border-muted/40">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <Beaker className="h-5 w-5 mr-2 text-primary" />
                                            Inventory & Equipment Compliance
                                        </CardTitle>
                                        <CardDescription>
                                            Track equipment calibration, maintenance schedules, and chemical storage compliance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <Tabs defaultValue="equipment" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3 h-auto mb-4">
                                                <TabsTrigger value="equipment" className="text-xs md:text-sm py-2">
                                                    Equipment
                                                </TabsTrigger>
                                                <TabsTrigger value="chemicals" className="text-xs md:text-sm py-2">
                                                    Chemicals
                                                </TabsTrigger>
                                                <TabsTrigger value="maintenance" className="text-xs md:text-sm py-2">
                                                    Maintenance Logs
                                                </TabsTrigger>
                                            </TabsList>

                                            {/* Equipment Tab */}
                                            <TabsContent value="equipment">
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Equipment</TableHead>
                                                                <TableHead className="hidden md:table-cell">Location</TableHead>
                                                                <TableHead className="hidden md:table-cell">Last Calibrated</TableHead>
                                                                <TableHead>Next Calibration</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {inventoryData.equipment.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">{item.location}</TableCell>
                                                                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                                                        {item.lastCalibrated}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className={`text-xs ${isDateApproaching(item.nextCalibration)
                                                                            ? "text-yellow-800 dark:text-yellow-400"
                                                                            : isDateOverdue(item.nextCalibration)
                                                                                ? "text-red-800 dark:text-red-400"
                                                                                : "text-muted-foreground"
                                                                            }`}>
                                                                            {item.nextCalibration}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(item.status)}`}
                                                                        >
                                                                            {item.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TabsContent>

                                            {/* Chemicals Tab */}
                                            <TabsContent value="chemicals">
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Chemical</TableHead>
                                                                <TableHead className="hidden md:table-cell">Storage</TableHead>
                                                                <TableHead className="hidden md:table-cell">Quantity</TableHead>
                                                                <TableHead>Expiration</TableHead>
                                                                <TableHead>Status</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {inventoryData.chemicals.map((item) => (
                                                                <TableRow key={item.id}>
                                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">{item.storage}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                                                                    <TableCell>
                                                                        <span className={`text-xs ${isDateApproaching(item.expirationDate)
                                                                            ? "text-yellow-800 dark:text-yellow-400"
                                                                            : isDateOverdue(item.expirationDate)
                                                                                ? "text-red-800 dark:text-red-400"
                                                                                : "text-muted-foreground"
                                                                            }`}>
                                                                            {item.expirationDate}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`px-2 py-0.5 ${getStatusColor(item.status)}`}
                                                                        >
                                                                            {item.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TabsContent>

                                            {/* Maintenance Logs Tab */}
                                            <TabsContent value="maintenance">
                                                <div className="border rounded-lg overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30">
                                                                <TableHead>Equipment</TableHead>
                                                                <TableHead>Date</TableHead>
                                                                <TableHead className="hidden md:table-cell">Type</TableHead>
                                                                <TableHead className="hidden md:table-cell">Technician</TableHead>
                                                                <TableHead>Notes</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {inventoryData.maintenanceLogs.map((log) => (
                                                                <TableRow key={log.id}>
                                                                    <TableCell className="font-medium">{log.equipment}</TableCell>
                                                                    <TableCell className="text-xs">{log.date}</TableCell>
                                                                    <TableCell className="hidden md:table-cell">
                                                                        <Badge variant="outline" className="bg-muted/30">
                                                                            {log.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell">{log.technician}</TableCell>
                                                                    <TableCell className="max-w-[200px] truncate text-xs">
                                                                        {log.notes}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="mt-4 flex justify-end">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                        Add Maintenance Record
                                                    </Button>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.section>

                    {/* Downloadable Reports Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            Compliance Reports
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <Clipboard className="h-4 w-4 mr-2 text-primary" />
                                        GLP Compliance Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Comprehensive report of all GLP compliance metrics, checklists, and documentation status.
                                    </p>
                                    <div className="flex justify-between">
                                        <Select defaultValue="pdf">
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="csv">CSV</SelectItem>
                                                <SelectItem value="xlsx">Excel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGenerateReport("GLP Compliance")}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Generate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <PawPrint className="h-4 w-4 mr-2 text-primary" />
                                        Animal Welfare Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Summary of animal protocols, housing conditions, and welfare inspection results.
                                    </p>
                                    <div className="flex justify-between">
                                        <Select defaultValue="pdf">
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="csv">CSV</SelectItem>
                                                <SelectItem value="xlsx">Excel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGenerateReport("Animal Welfare")}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Generate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <UserCheck className="h-4 w-4 mr-2 text-primary" />
                                        Training Compliance Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Status of all required trainings and certifications for lab personnel.
                                    </p>
                                    <div className="flex justify-between">
                                        <Select defaultValue="pdf">
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pdf">PDF</SelectItem>
                                                <SelectItem value="csv">CSV</SelectItem>
                                                <SelectItem value="xlsx">Excel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGenerateReport("Training Compliance")}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Generate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.section>

                    {/* Policy Library Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-primary" />
                            Policy Library
                        </h2>

                        <Card className="border-muted/40">
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                        <div className="relative flex-grow">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="search"
                                                placeholder="Search policies and SOPs..."
                                                className="pl-10 w-full"
                                            />
                                        </div>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="regulatory">Regulatory</SelectItem>
                                                <SelectItem value="animal">Animal Welfare</SelectItem>
                                                <SelectItem value="safety">Safety</SelectItem>
                                                <SelectItem value="quality">Quality</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead>Document Title</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead className="hidden md:table-cell">Version</TableHead>
                                                    <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                                                    <TableHead className="w-[100px]">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {policyLibraryData.map((doc) => (
                                                    <TableRow key={doc.id}>
                                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="bg-muted/30">
                                                                {doc.category}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">v{doc.version}</TableCell>
                                                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{doc.lastUpdated}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() => handleDownload(doc.title)}
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="outline" size="sm" className="text-xs">
                                            <Upload className="h-3.5 w-3.5 mr-1.5" />
                                            Upload New Policy
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Audit Calendar Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                            Audit Calendar
                        </h2>

                        <Card className="border-muted/40">
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead>Audit Title</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead className="hidden md:table-cell">Department</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {auditCalendarData.map((audit) => (
                                                    <TableRow key={audit.id}>
                                                        <TableCell className="font-medium">{audit.title}</TableCell>
                                                        <TableCell>
                                                            <span className={`text-xs ${isDateApproaching(audit.date)
                                                                ? "text-yellow-800 dark:text-yellow-400"
                                                                : "text-muted-foreground"
                                                                }`}>
                                                                {audit.date}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`px-2 py-0.5 ${audit.type === "Internal"
                                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                                                    }`}
                                                            >
                                                                {audit.type}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{audit.department}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`px-2 py-0.5 ${audit.status === "Scheduled"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                                    }`}
                                                            >
                                                                {audit.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="outline" size="sm" className="text-xs">
                                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                                            Schedule New Audit
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>

                    {/* Help & Resources Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                            Compliance Resources
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <Landmark className="h-4 w-4 mr-2 text-primary" />
                                        Regulatory Guidelines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-sm">
                                            <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                FDA GLP Regulations (21 CFR Part 58)
                                            </Link>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                OECD Principles of GLP
                                            </Link>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <ExternalLink className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                Animal Welfare Act Requirements
                                            </Link>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <FileSymlink className="h-4 w-4 mr-2 text-primary" />
                                        Templates & Forms
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-sm">
                                            <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                GLP Compliance Checklist Template
                                            </Link>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                IACUC Protocol Submission Form
                                            </Link>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <Download className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <Link href="#" className="hover:text-primary transition-colors">
                                                Equipment Calibration Log Template
                                            </Link>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-muted/40 hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-primary" />
                                        Compliance Support
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-sm">
                                            <UserCheck className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <span>Quality Assurance: <span className="font-medium">Jennifer Williams</span></span>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <UserCheck className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <span>IACUC Chair: <span className="font-medium">Dr. Michael Rodriguez</span></span>
                                        </li>
                                        <li className="flex items-center text-sm">
                                            <UserCheck className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                            <span>Regulatory Affairs: <span className="font-medium">Sarah Chen</span></span>
                                        </li>
                                    </ul>
                                    <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
                                        Contact Compliance Team
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.section>
                </div>
            </div >
        </DashboardLayout>
    )
}