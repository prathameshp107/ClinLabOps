"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/dashboard/inventory-management/inventory-list"
import { SuppliersList } from "@/components/dashboard/inventory-management/suppliers-list"
import { LocationsList } from "@/components/dashboard/inventory-management/locations-list"
import { ReportsList } from "@/components/dashboard/inventory-management/reports-list"
import { inventoryData } from "@/data/inventory-data"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

import { Package, Users, MapPin, BarChart } from "lucide-react";


export default function InventoryPage() {
  const [inventory, setInventory] = useState(inventoryData.items)
  const [suppliers, setSuppliers] = useState(inventoryData.suppliers)
  const [locations, setLocations] = useState(inventoryData.locations)

  // Handle updating an inventory item
  const handleUpdateItem = (updatedItem) => {
    setInventory(prev => {
      const index = prev.findIndex(item => item.id === updatedItem.id)
      if (index !== -1) {
        const newInventory = [...prev]
        newInventory[index] = updatedItem
        return newInventory
      } else {
        return [...prev, updatedItem]
      }
    })
  }

  // Handle deleting an inventory item
  const handleDeleteItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId))
  }

  // Handle updating a supplier
  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(prev => {
      const index = prev.findIndex(supplier => supplier.id === updatedSupplier.id)
      if (index !== -1) {
        const newSuppliers = [...prev]
        newSuppliers[index] = updatedSupplier
        return newSuppliers
      } else {
        return [...prev, updatedSupplier]
      }
    })
  }

  // Handle deleting a supplier
  const handleDeleteSupplier = (supplierId) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId))
  }

  // Handle updating a location
  const handleUpdateLocation = (updatedLocation) => {
    setLocations(prev => {
      const index = prev.findIndex(location => location.id === updatedLocation.id)
      if (index !== -1) {
        const newLocations = [...prev]
        newLocations[index] = updatedLocation
        return newLocations
      } else {
        return [...prev, updatedLocation]
      }
    })
  }

  // Handle deleting a location
  const handleDeleteLocation = (locationId) => {
    setLocations(prev => prev.filter(location => location.id !== locationId))
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            <Package className="inline-block mr-2 h-8 w-8" /> Inventory ManagementInventory Management
          </h1>
          <p className="text-lg text-muted-foreground">Manage laboratory inventory, suppliers, and storage locations</p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="mb-6 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="inventory" className="text-base px-6">
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="text-base px-6">
                <Users className="mr-2 h-4 w-4" />
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="locations" className="text-base px-6">
                <MapPin className="mr-2 h-4 w-4" />
                Storage Locations
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-base px-6">
                <BarChart className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-background rounded-lg p-4">
              <TabsContent value="inventory" className="mt-0">
                <InventoryList 
                  inventoryItems={inventory} 
                  onUpdateItem={handleUpdateItem} 
                  onDeleteItem={handleDeleteItem} 
                />
              </TabsContent>
              <TabsContent value="suppliers" className="mt-0">
                <SuppliersList 
                  suppliers={suppliers} 
                  onUpdateSupplier={handleUpdateSupplier} 
                  onDeleteSupplier={handleDeleteSupplier} 
                />
              </TabsContent>
              <TabsContent value="locations" className="mt-0">
                <LocationsList 
                  locations={locations} 
                  onUpdateLocation={handleUpdateLocation} 
                  onDeleteLocation={handleDeleteLocation} 
                />
              </TabsContent>
              <TabsContent value="reports" className="mt-0">
                <ReportsList inventory={inventory} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}