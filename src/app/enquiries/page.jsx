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
import EditEnquiryDialog from "@/components/enquiries/EditEnquiryDialog"
import { getEnquiries, enquiryService } from "@/services/enquiryService"

function EnquiriesPage() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState([])
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingEnquiry, setEditingEnquiry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNewEnquiry, setShowNewEnquiry] = useState(false)

  // Fetch enquiries from API
  const fetchEnquiries = async () => {
    try {
      setIsLoading(true)
      const enquiriesData = await getEnquiries()
      setEnquiries(Array.isArray(enquiriesData) ? enquiriesData : [])
    } catch (error) {
      console.error('Failed to fetch enquiries:', error)
      setEnquiries([])
      toast({
        title: "Error",
        description: "Failed to load enquiries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  // Handle enquiry actions
  const handleEnquiryAction = (action, enquiry) => {
    switch (action) {
      case "view":
        setSelectedEnquiry(enquiry)
        setShowQuickView(true)
        break
      case "edit":
        setEditingEnquiry(enquiry)
        setShowEditDialog(true)
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
        if (confirm(`Are you sure you want to delete enquiry for ${enquiry.customerName}?`)) {
          handleDeleteEnquiry(enquiry._id || enquiry.id)
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

  // Handle edit enquiry
  const handleEditEnquiry = (enquiry) => {
    setEditingEnquiry(enquiry)
    setShowEditDialog(true)
  }

  // Handle edit enquiry success
  const handleEditEnquirySuccess = (updatedEnquiry) => {
    if (updatedEnquiry) {
      setEnquiries(prev => prev.map(e =>
        (e._id || e.id) === (updatedEnquiry._id || updatedEnquiry.id) ? updatedEnquiry : e
      ))
    }
    fetchEnquiries() // Refresh the list to get the latest data
    setShowEditDialog(false)
    setEditingEnquiry(null)
  }

  // Handle delete enquiry
  const handleDeleteEnquiry = async (id) => {
    try {
      const success = await enquiryService.delete(id)
      if (success) {
        setEnquiries(prev => prev.filter(e => (e._id || e.id) !== id))
        toast({
          title: "Enquiry deleted",
          description: "Enquiry has been deleted successfully",
        })
      } else {
        throw new Error('Delete operation failed')
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      toast({
        title: "Error",
        description: "Failed to delete enquiry. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle new enquiry success
  const handleNewEnquirySuccess = (newEnquiry) => {
    if (newEnquiry) {
      setEnquiries(prev => [newEnquiry, ...prev])
    }
    fetchEnquiries() // Refresh the list to get the latest data
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
      onNewEnquirySuccess={handleNewEnquirySuccess}
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
              onEdit={handleEditEnquiry}
            />
          )}
        </AnimatePresence>

        {/* Edit Enquiry Dialog */}
        <EditEnquiryDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          enquiry={editingEnquiry}
          onSuccess={handleEditEnquirySuccess}
        />
      </div>
    </DashboardLayout>
  )
}

export default EnquiriesPage
