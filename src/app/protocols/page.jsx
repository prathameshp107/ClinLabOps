"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProtocolList } from "@/components/dashboard/protocol-management/protocol-list"
import { ProtocolFormDialog } from "@/components/dashboard/protocol-management/protocol-form-dialog"
import { ProtocolDetailDialog } from "@/components/dashboard/protocol-management/protocol-detail-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { protocolsData } from "@/data/protocols-data"

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState(protocolsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [formMode, setFormMode] = useState("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Set sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  // Filter protocols based on search query
  const filteredProtocols = protocols.filter(protocol => 
    protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
    >
      <div className="transition-all duration-300 ease-in-out w-full bg-gradient-to-b from-background to-background/80 min-h-screen">
        <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 backdrop-blur-sm bg-card/40 p-6 rounded-2xl border border-border/30 shadow-sm">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Laboratory Protocols
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                Manage standardized procedures, methods, and experimental protocols
              </p>
            </div>
            <Button 
              onClick={handleCreateProtocol}
              className="bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md"
              size="lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              New Protocol
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search protocols by name, category, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card/40 backdrop-blur-sm border-border/30 rounded-xl shadow-sm focus-visible:ring-primary/30 text-base"
              />
            </div>
          </div>

          {/* Empty State */}
          {filteredProtocols.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4 mb-5">
                <Search className="h-8 w-8 text-primary/80" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No protocols found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any protocols matching your search criteria. Try adjusting your search or create a new protocol.
              </p>
              <Button onClick={handleCreateProtocol} variant="outline" className="bg-background/50 hover:bg-primary/5">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Protocol
              </Button>
            </div>
          )}

          {/* Protocol List */}
          {filteredProtocols.length > 0 && (
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm overflow-hidden">
              <ProtocolList
                protocols={filteredProtocols}
                onView={handleViewProtocol}
                onEdit={handleEditProtocol}
                onDuplicate={handleDuplicateProtocol}
                onArchive={handleArchiveProtocol}
                onDelete={handleDeleteProtocol}
              />
            </div>
          )}

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