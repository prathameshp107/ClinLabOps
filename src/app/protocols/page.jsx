"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProtocolFormDialog } from "@/components/protocol-management/protocol-form-dialog"
import { ProtocolDetailDialog } from "@/components/protocol-management/protocol-detail-dialog"
import { ProtocolSuccessModal } from "@/components/protocol-management/protocol-success-modal"
import { DataTable } from "@/components/tasks-v2/data-table"
import { createProtocolColumns } from "@/components/protocol-management/protocol-columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, SlidersHorizontal, BookOpen, LayoutGrid, Table as TableIcon, Loader2, User, Globe } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ProtocolCard } from "@/components/protocol-management/protocol-card"
import { useToast } from "@/components/ui/use-toast"
import {
  getProtocols,
  getMyProtocols,
  createProtocol as createProtocolApi,
  updateProtocol as updateProtocolApi,
  deleteProtocol as deleteProtocolApi,
  duplicateProtocol as duplicateProtocolApi,
  archiveProtocol as archiveProtocolApi,
  restoreProtocol as restoreProtocolApi
} from "@/services/protocolService"

export default function ProtocolsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [protocols, setProtocols] = useState([])
  const [myProtocols, setMyProtocols] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [createdProtocol, setCreatedProtocol] = useState(null)
  const [formMode, setFormMode] = useState("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // "grid" or "table"
  const [activeTab, setActiveTab] = useState("all") // "all" or "my"
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  })
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Fetch protocols on component mount and when filters change
  useEffect(() => {
    setSidebarOpen(isDesktop)
    if (activeTab === "all") {
      fetchProtocols()
    } else {
      fetchMyProtocols()
    }
  }, [isDesktop, pagination.page, pagination.limit, categoryFilter, statusFilter, activeTab])

  // Initial fetch of both protocol lists
  useEffect(() => {
    fetchProtocols()
    fetchMyProtocols()
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery || categoryFilter !== "all" || statusFilter !== "all") {
        if (activeTab === "all") {
          fetchProtocols()
        } else {
          fetchMyProtocols()
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, categoryFilter, statusFilter, activeTab])

  const fetchProtocols = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        // For All protocols section, show all public protocols (isPublic=true)
        isPublic: true, // Only show public protocols
        status: statusFilter !== "all" ? statusFilter : undefined,
        excludeInReview: statusFilter === "all" // Exclude "In Review" when no specific status filter is applied
      }

      const response = await getProtocols(params)
      setProtocols(response.data)
      setPagination(prev => ({
        ...prev,
        total: response?.pagination?.total,
        totalPages: response?.pagination?.totalPages
      }))
    } catch (error) {
      console.error('Error fetching protocols:', error)
      toast({
        title: "Error",
        description: "Failed to fetch protocols. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyProtocols = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        // For Protocols on Review section, show all non-public protocols (isPublic=false)
        isPublic: false, // Only show non-public protocols
        status: statusFilter !== "all" ? statusFilter : undefined
      }

      const response = await getProtocols(params)
      setMyProtocols(response.data)
      setPagination(prev => ({
        ...prev,
        total: response?.pagination?.total,
        totalPages: response?.pagination?.totalPages
      }))
    } catch (error) {
      console.error('Error fetching my protocols:', error)
      toast({
        title: "Error",
        description: "Failed to fetch your protocols. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique categories and statuses for filter
  const currentProtocols = activeTab === "all" ? protocols : myProtocols
  const categories = ["all", ...new Set(currentProtocols.map(protocol => protocol.category).filter(Boolean))]
  const statuses = ["all", "Draft", "In Review", "Approved", "Archived"] // Predefined statuses for consistency

  // Handle creating a new protocol
  const handleCreateProtocol = () => {
    setSelectedProtocol(null)
    setFormMode("create")
    setFormDialogOpen(true)
  }

  // Handle editing a protocol
  const handleEditProtocol = (protocol) => {
    setSelectedProtocol(protocol)
    setFormMode("edit")
    setFormDialogOpen(true)
  }

  // Handle viewing a protocol
  const handleViewProtocol = (protocol) => {
    setSelectedProtocol(protocol)
    setDetailDialogOpen(true)
  }

  // Handle duplicating a protocol
  const handleDuplicateProtocol = async (protocol) => {
    try {
      setIsLoading(true)
      const duplicated = await duplicateProtocolApi(protocol._id)
      // Add to both lists since it's created by current user
      setProtocols([duplicated, ...protocols])
      setMyProtocols([duplicated, ...myProtocols])
      toast({
        title: "Success",
        description: "Protocol duplicated successfully",
      })
    } catch (error) {
      console.error('Error duplicating protocol:', error)
      toast({
        title: "Error",
        description: "Failed to duplicate protocol. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle archiving a protocol
  const handleArchiveProtocol = async (protocol) => {
    try {
      setIsLoading(true)
      const isArchiving = protocol.status !== "Archived"
      const updatedProtocol = isArchiving
        ? await archiveProtocolApi(protocol._id)
        : await restoreProtocolApi(protocol._id)

      // Update in both lists
      setProtocols(protocols.map(p =>
        p._id === updatedProtocol._id ? updatedProtocol : p
      ))
      setMyProtocols(myProtocols.map(p =>
        p._id === updatedProtocol._id ? updatedProtocol : p
      ))

      toast({
        title: isArchiving ? "Archived" : "Restored",
        description: `Protocol has been ${isArchiving ? 'archived' : 'restored'} successfully`,
      })
    } catch (error) {
      console.error('Error updating protocol status:', error)
      toast({
        title: "Error",
        description: `Failed to ${protocol.status === 'Archived' ? 'restore' : 'archive'} protocol. Please try again.`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle deleting a protocol
  const handleDeleteProtocol = async (protocolId) => {
    if (!confirm('Are you sure you want to delete this protocol? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      await deleteProtocolApi(protocolId)
      // Remove from both lists
      setProtocols(protocols.filter(protocol => protocol._id !== protocolId))
      setMyProtocols(myProtocols.filter(protocol => protocol._id !== protocolId))
      toast({
        title: "Success",
        description: "Protocol deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting protocol:', error)
      toast({
        title: "Error",
        description: "Failed to delete protocol. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submitting the protocol form
  const handleSubmitProtocol = async (protocolData) => {
    try {
      setIsLoading(true)
      let updatedProtocol

      if (formMode === "create") {
        // Ensure new protocols are created with isPublic: false (private) by default
        const protocolWithPrivateStatus = {
          ...protocolData,
          isPublic: false
        }

        updatedProtocol = await createProtocolApi(protocolWithPrivateStatus)

        // Add to myProtocols list since it's created by current user and is private
        setMyProtocols([updatedProtocol, ...myProtocols])

        // Store the created protocol for the success modal
        setCreatedProtocol(updatedProtocol)
        setFormDialogOpen(false)
        setSuccessModalOpen(true)

        // Don't show toast here as the modal will handle the success message
      } else {
        updatedProtocol = await updateProtocolApi(selectedProtocol._id, protocolData)
        // Update in both lists
        setProtocols(protocols.map(protocol =>
          protocol._id === updatedProtocol._id ? updatedProtocol : protocol
        ))
        setMyProtocols(myProtocols.map(protocol =>
          protocol._id === updatedProtocol._id ? updatedProtocol : protocol
        ))
        toast({
          title: "Success",
          description: "Protocol updated successfully",
        })
        setFormDialogOpen(false)
      }

      return updatedProtocol
    } catch (error) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} protocol:`, error)
      toast({
        title: "Error",
        description: `Failed to ${formMode === 'create' ? 'create' : 'update'} protocol. Please try again.`,
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Handle success modal actions
  const handleViewCreatedProtocol = (protocol) => {
    setSelectedProtocol(protocol)
    setDetailDialogOpen(true)
  }

  const handleGoToMyProtocols = () => {
    setActiveTab("my")
  }

  // Create columns with action handlers
  const columns = createProtocolColumns({
    onView: handleViewProtocol,
    onEdit: handleEditProtocol,
    onDuplicate: handleDuplicateProtocol,
    onArchive: handleArchiveProtocol,
    onDelete: handleDeleteProtocol,
  })

  return (
    <DashboardLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="px-2 sm:px-4 lg:px-6 py-8 max-w-full overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 backdrop-blur-sm bg-card/40 p-6 rounded-2xl border border-border/30 shadow-sm hover:shadow-md hover:border-border/40 transition-all duration-300"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Laboratory Protocols
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {activeTab === "all"
                  ? "Browse all public protocols from all users"
                  : "View all protocols under review (private protocols)"
                }
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {currentProtocols.length} {activeTab === "all" ? "Public" : "Private"} Protocols
                </Badge>
                {activeTab === "my" ? (
                  <>
                    <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {myProtocols.length} Private
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {protocols.filter(p => p.status === "Approved").length} Approved
                    </Badge>
                    <Badge className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {protocols.filter(p => p.status === "Draft").length} Drafts
                    </Badge>
                    <Badge className="bg-gray-500/10 text-gray-500 border border-gray-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {protocols.filter(p => p.status === "Archived").length} Archived
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <Button
              onClick={handleCreateProtocol}
              className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md group"
              size="lg"
            >
              <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              New Protocol
            </Button>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center gap-2 mb-6 bg-muted/30 rounded-lg p-1 w-fit"
          >
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className={cn(
                "transition-all duration-200",
                activeTab === "all" ? "shadow-sm" : "hover:bg-muted/50"
              )}
            >
              <Globe className="h-4 w-4 mr-2" />
              Public Protocols
              <Badge className="ml-2 bg-background/50 text-foreground/70">
                {protocols.length}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "my" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("my")}
              className={cn(
                "transition-all duration-200",
                activeTab === "my" ? "shadow-sm" : "hover:bg-muted/50"
              )}
            >
              <User className="h-4 w-4 mr-2" />
              Private Protocols
              <Badge className="ml-2 bg-background/50 text-foreground/70">
                {myProtocols.length}
              </Badge>
            </Button>
          </motion.div>

          {/* Search, Filters, and View Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-full lg:max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search protocols by name, category, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card/40 backdrop-blur-sm border-border/30 rounded-xl shadow-sm focus-visible:ring-primary/30 text-base transition-all duration-200 hover:border-border/50 focus:border-primary/50"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full hover:bg-primary/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 shadow-sm border border-border/30">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-r-none transition-all duration-200",
                  viewMode === "grid" ? "shadow-sm" : "hover:bg-muted/80"
                )}
              >
                <LayoutGrid className="h-4 w-4 mr-1.5" />
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn(
                  "rounded-l-none transition-all duration-200",
                  viewMode === "table" ? "shadow-sm" : "hover:bg-muted/80"
                )}
              >
                <TableIcon className="h-4 w-4 mr-1.5" />
                Table
              </Button>
            </div>
          </div>

          {/* Filters (if any) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  "grid gap-4 mt-4 max-w-3xl mx-auto bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/20 shadow-sm",
                  activeTab === "all" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="bg-background/50 border-border/30 focus:ring-primary/30">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-background/50 border-border/30 focus:ring-primary/30">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {status === "all" ? "All Statuses" : status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading {activeTab === "all" ? "protocols" : "your protocols"}...
                </span>
              </div>
            ) : currentProtocols.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-center bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm"
              >
                <div className="rounded-full bg-primary/10 p-5 mb-6">
                  <BookOpen className="h-10 w-10 text-primary/80" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No protocols found</h3>
                <p className="text-muted-foreground max-w-md mb-8 text-base">
                  {activeTab === "all"
                    ? "We couldn't find any public protocols matching your search criteria. Try adjusting your search or create a new protocol."
                    : "We couldn't find any private protocols matching your search criteria. Try adjusting your search."}
                </p>
                <Button
                  onClick={handleCreateProtocol}
                  variant="outline"
                  className="bg-background/50 hover:bg-primary/5 transition-all duration-200 hover:border-primary/30 py-6 px-8 text-base"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Protocol
                </Button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
              >
                {currentProtocols.map(protocol => (
                  <ProtocolCard
                    key={protocol._id}
                    protocol={protocol}
                    onView={() => handleViewProtocol(protocol)}
                    onEdit={() => handleEditProtocol(protocol)}
                    onDuplicate={() => handleDuplicateProtocol(protocol)}
                    onArchive={() => handleArchiveProtocol(protocol)}
                    onDelete={() => handleDeleteProtocol(protocol._id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full overflow-hidden"
              >
                <DataTable
                  columns={columns}
                  data={currentProtocols}
                  onRowClick={handleViewProtocol}
                  pagination={{
                    currentPage: pagination.page,
                    totalPages: pagination.totalPages,
                    onPageChange: (page) => setPagination(prev => ({ ...prev, page }))
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Protocol Form Dialog */}
          <ProtocolFormDialog
            open={formDialogOpen}
            onOpenChange={setFormDialogOpen}
            protocol={selectedProtocol}
            mode={formMode}
            onSubmit={handleSubmitProtocol}
          />

          {/* Protocol Detail Dialog */}
          <ProtocolDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            protocol={selectedProtocol}
            onEdit={handleEditProtocol}
          />

          {/* Protocol Success Modal */}
          <ProtocolSuccessModal
            open={successModalOpen}
            onOpenChange={setSuccessModalOpen}
            protocol={createdProtocol}
            onViewProtocol={handleViewCreatedProtocol}
            onViewMyProtocols={handleGoToMyProtocols}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}