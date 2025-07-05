"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { DataTable } from "@/components/tasks-v2/data-table"
import { enquiryColumns } from "@/components/enquiries/enquiry-columns"
import { EnquiryToolbar } from "@/components/enquiries/enquiry-toolbar"
import { EnquiryQuickView } from "@/components/enquiries/enquiry-quick-view"
import { toast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import NewEnquiryDialog from "@/components/enquiries/NewEnquiryDialog"

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
    customerName: "David Wilson",
    email: "david.wilson@agritech.com",
    phone: "+1 (555) 321-6540",
    companyName: "AgriTech Solutions",
    subject: "Soil Analysis Services",
    details: "Looking for comprehensive soil analysis for agricultural research project.",
    priority: "Low",
    assignedTo: "Dr. Sarah Johnson",
    status: "On Hold",
    createdAt: "2025-03-19T16:20:00Z",
    updatedAt: "2025-03-22T14:30:00Z",
    documents: [
      { id: "d8", name: "Soil_Samples_List.xlsx", type: "xlsx", size: "0.9 MB", uploadedAt: "2025-03-19T16:20:00Z" }
    ],
    activities: [
      { id: "a14", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-19T16:20:00Z" },
      { id: "a15", action: "Assigned to Dr. Sarah Johnson", user: "Lab Manager", timestamp: "2025-03-20T10:15:00Z" },
      { id: "a16", action: "Status updated to On Hold", user: "Dr. Sarah Johnson", timestamp: "2025-03-22T14:30:00Z" }
    ]
  },
  {
    id: "e6",
    customerName: "Lisa Anderson",
    email: "lisa.anderson@environsci.com",
    phone: "+1 (555) 654-3210",
    companyName: "Environmental Sciences Corp",
    subject: "Water Quality Testing",
    details: "Need water quality analysis for environmental impact assessment.",
    priority: "High",
    assignedTo: "Dr. Michael Rodriguez",
    status: "Cancelled",
    createdAt: "2025-03-16T09:45:00Z",
    updatedAt: "2025-03-21T11:20:00Z",
    documents: [
      { id: "d9", name: "Water_Samples_Data.csv", type: "csv", size: "1.5 MB", uploadedAt: "2025-03-16T09:45:00Z" }
    ],
    activities: [
      { id: "a17", action: "Enquiry created", user: "Reception Staff", timestamp: "2025-03-16T09:45:00Z" },
      { id: "a18", action: "Assigned to Dr. Michael Rodriguez", user: "Lab Manager", timestamp: "2025-03-16T14:30:00Z" },
      { id: "a19", action: "Status updated to Cancelled", user: "Lisa Anderson", timestamp: "2025-03-21T11:20:00Z" }
    ]
  }
]

function EnquiriesPage() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState(mockEnquiries)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewEnquiry, setShowNewEnquiry] = useState(false)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle enquiry actions
  const handleEnquiryAction = (action, enquiry) => {
    switch (action) {
      case "view":
        setSelectedEnquiry(enquiry)
        setShowQuickView(true)
        break
      case "edit":
        router.push(`/enquiries/${enquiry.id}/edit`)
        break
      case "message":
        toast({
          title: "Message sent",
          description: `Message sent to ${enquiry.customerName}`,
        })
        break
      case "download":
        toast({
          title: "Download started",
          description: `Downloading documents for ${enquiry.customerName}`,
        })
        break
      case "delete":
        if (confirm(`Are you sure you want to delete enquiry ${enquiry.id}?`)) {
          setEnquiries(prev => prev.filter(e => e.id !== enquiry.id))
          toast({
            title: "Enquiry deleted",
            description: `Enquiry ${enquiry.id} has been deleted`,
          })
        }
        break
      default:
        break
    }
  }

  // Handle row click
  const handleRowClick = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setShowQuickView(true)
  }

  // Handle add new enquiry (open modal)
  const handleAddEnquiry = () => {
    setShowNewEnquiry(true)
  }

  // Handle export
  const handleExport = (format = "xlsx") => {
    const exportData = enquiries.map(e => ({
      "Enquiry ID": e.id,
      "Customer Name": e.customerName,
      "Company": e.companyName,
      "Email": e.email,
      "Phone": e.phone || "N/A",
      "Subject": e.subject,
      "Priority": e.priority,
      "Status": e.status,
      "Assigned To": e.assignedTo,
      "Created": e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "N/A",
      "Documents": e.documents?.length || 0,
    }))

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `enquiries_${timestamp}.${format}`

    if (format === "csv") {
      const headers = Object.keys(exportData[0])
      const csvContent = [
        headers.join(","),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(","))
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      saveAs(blob, filename)
    } else {
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Enquiries")
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename)
    }

    toast({
      title: "Export successful",
      description: `${exportData.length} enquiries exported to ${filename}`,
    })
  }

  // Create columns with action handler
  const columns = useMemo(() => enquiryColumns(handleEnquiryAction), [])

  // Custom toolbar component
  const CustomToolbar = ({ table }) => (
    <EnquiryToolbar
      table={table}
      onExport={handleExport}
    />
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="w-full flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading enquiries...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Enquiry Management</h2>
              <p className="text-muted-foreground">
                Manage customer enquiries, track progress, and handle communications
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={enquiries}
            onRowClick={handleRowClick}
            Toolbar={CustomToolbar}
          />
              </motion.div>

        <AnimatePresence>
          {showQuickView && selectedEnquiry && (
            <EnquiryQuickView
              enquiry={selectedEnquiry}
              onClose={() => {
                setShowQuickView(false)
                setSelectedEnquiry(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

export default EnquiriesPage
