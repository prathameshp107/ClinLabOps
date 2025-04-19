"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
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
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"
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

  return (
    <DashboardLayout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen}
    >
      <div className="transition-all duration-300 ease-in-out w-full">
        <div className="container px-4 sm:px-6 lg:px-6 py-6 max-w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Equipment Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Manage laboratory equipment, maintenance schedules, and status
              </p>
            </div>
            <Button 
              onClick={handleCreateEquipment}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Equipment
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment by name, ID, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "h-10 w-10",
                    showFilters && "bg-muted"
                  )}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle filters</span>
                </Button>
                <Select
                  value={sortOption}
                  onValueChange={setSortOption}
                >
                  <SelectTrigger className="w-[180px]">
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
            </div>

            {showFilters && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/40 flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
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
              </div>
            )}
          </div>

          {/* Equipment List */}
          <EquipmentList
            equipment={sortedEquipment}
            onView={handleViewEquipment}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteEquipment}
            onUpdateStatus={handleUpdateStatus}
          />

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
    </DashboardLayout>
  )
}