"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/inventory-management/inventory-list"
import { SuppliersList } from "@/components/inventory-management/suppliers-list"
import { LocationsList } from "@/components/inventory-management/locations-list"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { getInventoryItems, getSuppliers, getWarehouses } from "@/services/inventoryService"

import { Package, Users, MapPin, Loader2, TrendingUp, AlertTriangle, DollarSign, Archive, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [inventoryData, suppliersData, locationsData] = await Promise.all([
          getInventoryItems().catch(() => []),
          getSuppliers().catch(() => []),
          getWarehouses().catch(() => [])
        ])

        setInventory(inventoryData)
        setSuppliers(suppliersData)
        setLocations(locationsData)
      } catch (error) {
        console.error('Failed to fetch inventory data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="w-full px-8 py-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              <Package className="inline-block mr-2 h-8 w-8" /> Inventory Management
            </h1>
            <p className="text-lg text-muted-foreground">Manage laboratory inventory, suppliers, and storage locations</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading inventory data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="w-full px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              <Package className="inline-block mr-3 h-10 w-10" /> Inventory Management
            </h1>
            <p className="text-lg text-muted-foreground">Comprehensive laboratory inventory, suppliers, and storage locations management</p>
          </div>

          {/* Statistics Cards */}

        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8">
          <Tabs defaultValue="inventory" className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border inline-flex min-w-full md:grid md:grid-cols-3 gap-1">
                <TabsTrigger value="inventory" className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap">
                  <Package className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Inventory Items</span>
                  <span className="sm:hidden">Items</span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">{inventory.length}</span>
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap">
                  <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Suppliers</span>
                  <span className="sm:hidden">Suppliers</span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">{suppliers.length}</span>
                </TabsTrigger>
                <TabsTrigger value="locations" className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all whitespace-nowrap">
                  <MapPin className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Storage Locations</span>
                  <span className="sm:hidden">Locations</span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">{locations.length}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-3 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <TabsContent value="inventory" className="mt-0 overflow-hidden">
                <InventoryList
                  inventoryItems={inventory}
                  onUpdateItem={handleUpdateItem}
                  onDeleteItem={handleDeleteItem}
                />
              </TabsContent>
              <TabsContent value="suppliers" className="mt-0 overflow-hidden">
                <SuppliersList
                  suppliers={suppliers}
                  onUpdateSupplier={handleUpdateSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                />
              </TabsContent>
              <TabsContent value="locations" className="mt-0 overflow-hidden">
                <LocationsList
                  locations={locations}
                  onUpdateLocation={handleUpdateLocation}
                  onDeleteLocation={handleDeleteLocation}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}