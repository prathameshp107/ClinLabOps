"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { EquipmentList } from "@/components/dashboard/equipment-management/equipment-list"
import { EquipmentFormDialog } from "@/components/dashboard/equipment-management/equipment-form-dialog"
import { EquipmentDetailDialog } from "@/components/dashboard/equipment-management/equipment-detail-dialog"
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
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { equipmentData } from "@/data/equipment-data"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        {/* Animated background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-blue-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 transition-all duration-300 ease-in-out w-full">
          <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-full mx-auto">
            {/* Modern Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      Equipment Management
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1 font-medium">
                      Manage laboratory equipment, maintenance schedules, and status tracking
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCreateEquipment}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 px-6 py-3"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Equipment
                <div className="absolute inset-0 bg-white/20 rounded-md blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            

            {/* Enhanced Search and Filters */}
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        placeholder="Search equipment by name, ID, type, or serial number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-white/80 border-0 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-base"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                          "h-12 px-4 bg-white/80 border-0 shadow-sm hover:shadow-md transition-all duration-300",
                          showFilters && "bg-blue-50 text-blue-600 shadow-md"
                        )}
                      >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        Filters
                        {showFilters && (
                          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-600">
                            ON
                          </Badge>
                        )}
                      </Button>
                      <Select
                        value={sortOption}
                        onValueChange={setSortOption}
                      >
                        <SelectTrigger className="w-[200px] h-12 bg-white/80 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                          <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                          <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                          <SelectItem value="date-desc">Date (Newest)</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {showFilters && (
                    <div className="p-6 bg-gradient-to-r from-slate-50/80 to-blue-50/30 rounded-xl border border-slate-200/50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Filter Options</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Status Filter</label>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="bg-white/80 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                              <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="Available">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  Available
                                </div>
                              </SelectItem>
                              <SelectItem value="In Use">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                  In Use
                                </div>
                              </SelectItem>
                              <SelectItem value="Under Maintenance">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  Under Maintenance
                                </div>
                              </SelectItem>
                              <SelectItem value="Out of Order">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  Out of Order
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setStatusFilter("all");
                              setSearchQuery("");
                            }}
                            className="bg-white/80 border-0 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 bg-blue-50/80 text-blue-700 border border-blue-200/50">
                  {sortedEquipment.length} {sortedEquipment.length === 1 ? 'result' : 'results'}
                </Badge>
                {(searchQuery || statusFilter !== "all") && (
                  <Badge variant="outline" className="px-3 py-1 bg-amber-50/80 text-amber-700 border border-amber-200/50">
                    Filtered
                  </Badge>
                )}
              </div>
            </div>

            {/* Equipment List with enhanced styling */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
              <EquipmentList
                equipment={sortedEquipment}
                onView={handleViewEquipment}
                onEdit={handleEditEquipment}
                onDelete={handleDeleteEquipment}
                onUpdateStatus={handleUpdateStatus}
              />
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}