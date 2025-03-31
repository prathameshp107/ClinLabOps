"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/dashboard/inventory-management/inventory-list"
import { SuppliersList } from "@/components/dashboard/inventory-management/suppliers-list"
import { LocationsList } from "@/components/dashboard/inventory-management/locations-list"
import { ReportsList } from "@/components/dashboard/inventory-management/reports-list"
import { inventoryData } from "@/data/inventory-data"

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
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Manage laboratory inventory, suppliers, and storage locations</p>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="locations">Storage Locations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <InventoryList 
            inventoryItems={inventory} 
            onUpdateItem={handleUpdateItem} 
            onDeleteItem={handleDeleteItem} 
          />
        </TabsContent>
        <TabsContent value="suppliers">
          <SuppliersList 
            suppliers={suppliers} 
            onUpdateSupplier={handleUpdateSupplier} 
            onDeleteSupplier={handleDeleteSupplier} 
          />
        </TabsContent>
        <TabsContent value="locations">
          <LocationsList 
            locations={locations} 
            onUpdateLocation={handleUpdateLocation} 
            onDeleteLocation={handleDeleteLocation} 
          />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsList inventory={inventory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}