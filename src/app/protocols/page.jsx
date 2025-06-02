"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProtocolList } from "@/components/dashboard/protocol-management/protocol-list"
import { ProtocolFormDialog } from "@/components/dashboard/protocol-management/protocol-form-dialog"
import { ProtocolDetailDialog } from "@/components/dashboard/protocol-management/protocol-detail-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Filter, SlidersHorizontal, BookOpen } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { protocolsData } from "@/data/protocols-data"
import { motion, AnimatePresence } from "framer-motion" // Add framer-motion for animations
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState(protocolsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [formMode, setFormMode] = useState("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Set sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  // Get unique categories for filter
  const categories = ["all", ...new Set(protocols.map(protocol => protocol.category))]
  
  // Get unique statuses for filter
  const statuses = ["all", ...new Set(protocols.map(protocol => protocol.status))]

  // Filter protocols based on search query and filters
  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = 
      protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || protocol.category === categoryFilter
    const matchesStatus = statusFilter === "all" || protocol.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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
  const handleDuplicateProtocol = (protocol) => {
    const newProtocol = {
      ...protocol,
      id: `PROT-${Date.now()}`,
      title: `${protocol.title} (Copy)`,
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProtocols([...protocols, newProtocol])
  }

  // Handle archiving a protocol
  const handleArchiveProtocol = (protocolId) => {
    setProtocols(protocols.map(protocol => 
      protocol.id === protocolId 
        ? { ...protocol, status: protocol.status === "Archived" ? "Draft" : "Archived" } 
        : protocol
    ))
  }

  // Handle deleting a protocol
  const handleDeleteProtocol = (protocolId) => {
    setProtocols(protocols.filter(protocol => protocol.id !== protocolId))
  }

  // Handle submitting the protocol form
  const handleSubmitProtocol = (protocolData) => {
    if (formMode === "create") {
      const newProtocol = {
        ...protocolData,
        id: `PROT-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProtocols([...protocols, newProtocol])
    } else {
      setProtocols(protocols.map(protocol => 
        protocol.id === protocolData.id 
          ? { ...protocol, ...protocolData, updatedAt: new Date().toISOString() } 
          : protocol
      ))
    }
    setFormDialogOpen(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
    >
      <div className="transition-all duration-300 ease-in-out w-full bg-gradient-to-b from-background via-background/95 to-background/90 min-h-screen">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Header Section */}
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
                Manage standardized procedures, methods, and experimental protocols
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {protocols.length} Total Protocols
                </Badge>
                <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20">
                  {protocols.filter(p => p.status === "Active").length} Active
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/5 text-yellow-500 border-yellow-500/20">
                  {protocols.filter(p => p.status === "Draft").length} Drafts
                </Badge>
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

          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search protocols by name, category, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card/40 backdrop-blur-sm border-border/30 rounded-xl shadow-sm focus-visible:ring-primary/30 text-base transition-all duration-200 hover:border-border/50 focus:border-primary/50"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full hover:bg-primary/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-3xl mx-auto bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/20 shadow-sm">
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
          </motion.div>

          {/* Empty State */}
          <AnimatePresence>
            {filteredProtocols.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-center bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm"
              >
                <div className="rounded-full bg-primary/10 p-4 mb-5">
                  <Search className="h-8 w-8 text-primary/80" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No protocols found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  We couldn't find any protocols matching your search criteria. Try adjusting your search or create a new protocol.
                </p>
                <Button 
                  onClick={handleCreateProtocol} 
                  variant="outline" 
                  className="bg-background/50 hover:bg-primary/5 transition-all duration-200 hover:border-primary/30"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Protocol
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Protocol List */}
          <AnimatePresence>
            {filteredProtocols.length > 0 && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border/40"
              >
                <div className="p-4 border-b border-border/20 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground/80 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-primary/70" />
                      {filteredProtocols.length} {filteredProtocols.length === 1 ? 'Protocol' : 'Protocols'} Found
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {categoryFilter !== "all" && (
                        <Badge variant="outline" className="mr-2 bg-background/50">
                          Category: {categoryFilter}
                        </Badge>
                      )}
                      {statusFilter !== "all" && (
                        <Badge variant="outline" className="bg-background/50">
                          Status: {statusFilter}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <ProtocolList
                  protocols={filteredProtocols}
                  onView={handleViewProtocol}
                  onEdit={handleEditProtocol}
                  onDuplicate={handleDuplicateProtocol}
                  onArchive={handleArchiveProtocol}
                  onDelete={handleDeleteProtocol}
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
        </div>
      </div>
    </DashboardLayout>
  )
}