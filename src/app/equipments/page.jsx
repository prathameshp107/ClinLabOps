"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { EquipmentList } from "@/components/equipment-management/equipment-list"
import { EquipmentFormDialog } from "@/components/equipment-management/equipment-form-dialog"
import { EquipmentDetailDialog } from "@/components/equipment-management/equipment-detail-dialog"
import { DataTable } from "@/components/tasks-v2/data-table"
import { createEquipmentColumns } from "@/components/equipment-management/equipment-columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Zap,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { equipmentData } from "@/data/equipment-data"
import { motion, AnimatePresence } from "framer-motion"

export default function EquipmentsPage() {
  const [equipment, setEquipment] = useState(equipmentData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOption, setSortOption] = useState("name-asc")
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [formMode, setFormMode] = useState("create")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("table") // "grid" or "table"
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate statistics for the dashboard cards
  const stats = {
    total: equipment.length,
    available: equipment.filter(item => item.status === "Available").length,
    inUse: equipment.filter(item => item.status === "In Use").length,
    maintenance: equipment.filter(item => item.status === "Under Maintenance").length,
    outOfOrder: equipment.filter(item => item.status === "Out of Order").length,
  }

  // Filter equipment based on search query and status filter
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort equipment based on sort option
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-asc":
        return new Date(a.purchaseDate) - new Date(b.purchaseDate);
      case "date-desc":
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      case "status":
        return a.status.localeCompare(b.status);
      case "location":
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  // Handle creating a new equipment
  const handleCreateEquipment = () => {
    setSelectedEquipment(null);
    setFormMode("create");
    setFormDialogOpen(true);
  };

  // Handle editing an equipment
  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setFormMode("edit");
    setFormDialogOpen(true);
  };

  // Handle viewing an equipment
  const handleViewEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setDetailDialogOpen(true);
  };

  // Handle deleting an equipment
  const handleDeleteEquipment = (equipmentId) => {
    setEquipment(equipment.filter(item => item.id !== equipmentId));
  };

  // Handle submitting the equipment form
  const handleSubmitEquipment = (equipmentData) => {
    if (formMode === "create") {
      const newEquipment = {
        ...equipmentData,
        id: `EQ-${Date.now().toString().slice(-6)}`,
        dateAdded: new Date().toISOString(),
      };
      setEquipment([...equipment, newEquipment]);
    } else {
      setEquipment(equipment.map(item =>
        item.id === equipmentData.id ? { ...item, ...equipmentData } : item
      ));
    }
    setFormDialogOpen(false);
  };

  // Handle updating equipment status
  const handleUpdateStatus = (equipmentId, newStatus) => {
    setEquipment(equipment.map(item =>
      item.id === equipmentId ? { ...item, status: newStatus } : item
    ));
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Create columns with action handlers
  const columns = createEquipmentColumns({
    onView: handleViewEquipment,
    onEdit: handleEditEquipment,
    onDelete: handleDeleteEquipment,
    onUpdateStatus: handleUpdateStatus,
  })

  // Status card configurations
  const statusCards = [
    {
      title: "Total Equipment",
      value: stats.total,
      icon: Settings,
      gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200/50"
    },
    {
      title: "Available",
      value: stats.available,
      icon: CheckCircle2,
      gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200/50"
    },
    {
      title: "In Use",
      value: stats.inUse,
      icon: Zap,
      gradient: "from-amber-500/20 via-amber-600/10 to-transparent",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200/50"
    },
    {
      title: "Under Maintenance",
      value: stats.maintenance,
      icon: Clock,
      gradient: "from-purple-500/20 via-purple-600/10 to-transparent",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200/50"
    },
    {
      title: "Out of Order",
      value: stats.outOfOrder,
      icon: XCircle,
      gradient: "from-red-500/20 via-red-600/10 to-transparent",
      iconColor: "text-red-600",
      borderColor: "border-red-200/50"
    }
  ];

  return (
    <DashboardLayout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      <div className="flex flex-col min-h-screen w-full bg-background">
        {/* Header with Stats */}
        <div className="w-full border-b">
          <div className="w-full px-6 py-6">
            <div className="max-w-[2000px] mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipment Management</h1>
                    <p className="text-muted-foreground">
                      Manage laboratory equipment, maintenance schedules, and status tracking
                    </p>
                  </div>
                  <Button
                    onClick={handleCreateEquipment}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    size="lg"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Equipment
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {statusCards.map((card, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-lg border bg-gradient-to-br ${card.gradient} ${card.borderColor}`}
                    >
                      <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                        <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                        <p className="text-2xl font-bold">{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full px-6 py-6">
          <div className="max-w-[2000px] mx-auto">
            {/* Toolbar */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-2xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment by name, ID, type, or serial number..."
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
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {/* View Mode Toggle */}
                  <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 shadow-sm overflow-hidden">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-10 shadow-sm border border-gray-200 dark:border-gray-800"
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-3xl mx-auto bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/20 shadow-sm">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Status Filter</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="bg-background/50 border-border/30 focus:ring-primary/30">
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="In Use">In Use</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                            <SelectItem value="Out of Order">Out of Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Sort By</label>
                        <Select value={sortOption} onValueChange={setSortOption}>
                          <SelectTrigger className="bg-background/50 border-border/30 focus:ring-primary/30">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                            <SelectItem value="date-desc">Date (Newest)</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="location">Location</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStatusFilter("all");
                            setSearchQuery("");
                            setSortOption("name-asc");
                          }}
                          className="bg-background/50 hover:bg-primary/5 transition-all duration-200 hover:border-primary/30"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="w-full overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">
                  {sortedEquipment.length} {sortedEquipment.length === 1 ? "equipment" : "equipment"} found
                </div>
              </div>

              <AnimatePresence>
                {sortedEquipment.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center py-20 text-center bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-sm"
                  >
                    <div className="rounded-full bg-primary/10 p-5 mb-6">
                      <Settings className="h-10 w-10 text-primary/80" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No equipment found</h3>
                    <p className="text-muted-foreground max-w-md mb-8 text-base">
                      We couldn't find any equipment matching your search criteria. Try adjusting your search or add new equipment.
                    </p>
                    <Button
                      onClick={handleCreateEquipment}
                      variant="outline"
                      className="bg-background/50 hover:bg-primary/5 transition-all duration-200 hover:border-primary/30 py-6 px-8 text-base"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add New Equipment
                    </Button>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden"
                  >
                    <EquipmentList
                      equipment={sortedEquipment}
                      onView={handleViewEquipment}
                      onEdit={handleEditEquipment}
                      onDelete={handleDeleteEquipment}
                      onUpdateStatus={handleUpdateStatus}
                      view={viewMode}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DataTable
                      columns={columns}
                      data={sortedEquipment}
                      onRowClick={handleViewEquipment}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Form Dialog */}
      <EquipmentFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        equipment={selectedEquipment}
        mode={formMode}
        onSubmit={handleSubmitEquipment}
      />

      {/* Equipment Detail Dialog */}
      <EquipmentDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        equipment={selectedEquipment}
        onEdit={handleEditEquipment}
        onUpdateStatus={handleUpdateStatus}
      />
    </DashboardLayout>
  )
}