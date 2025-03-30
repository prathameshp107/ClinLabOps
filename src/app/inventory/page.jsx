"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/dashboard/inventory-management/inventory-list"
import { SupplierManagement } from "@/components/dashboard/inventory-management/supplier-management"
import { WarehouseManagement } from "@/components/dashboard/inventory-management/warehouse-management"
import { InventoryReports } from "@/components/dashboard/inventory-management/inventory-reports"

// Mock inventory data
const mockInventoryItems = [
  {
    id: "INV-0001",
    name: "Sodium Chloride",
    sku: "SC-1234",
    barcode: "9876543210123",
    category: "Chemicals",
    currentStock: 50,
    minStockLevel: 20,
    unit: "bottles",
    unitPrice: 15.99,
    location: "Main Laboratory",
    supplier: "LabSupply Co.",
    lastRestocked: "2023-09-15T10:30:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0002",
    name: "Beaker Set (100ml, 250ml, 500ml)",
    sku: "BS-5678",
    barcode: "9876543210456",
    category: "Glassware",
    currentStock: 15,
    minStockLevel: 10,
    unit: "sets",
    unitPrice: 45.50,
    location: "Storage Room A",
    supplier: "SciencePro Inc.",
    lastRestocked: "2023-08-22T14:15:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0003",
    name: "Digital Scale (0.01g precision)",
    sku: "DS-9012",
    barcode: "9876543210789",
    category: "Equipment",
    currentStock: 5,
    minStockLevel: 3,
    unit: "pcs",
    unitPrice: 299.99,
    location: "Main Laboratory",
    supplier: "Global Scientific",
    lastRestocked: "2023-07-10T09:45:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0004",
    name: "Nitrile Gloves (Medium)",
    sku: "NG-3456",
    barcode: "9876543211012",
    category: "Consumables",
    currentStock: 8,
    minStockLevel: 20,
    unit: "boxes",
    unitPrice: 12.99,
    location: "Storage Room B",
    supplier: "LabSupply Co.",
    lastRestocked: "2023-09-05T11:20:00Z",
    isLowStock: true,
    status: "Low Stock"
  },
  {
    id: "INV-0005",
    name: "Buffer Solution (pH 7)",
    sku: "BS-7890",
    barcode: "9876543211345",
    category: "Reagents",
    currentStock: 12,
    minStockLevel: 10,
    unit: "bottles",
    unitPrice: 22.50,
    location: "Main Laboratory",
    supplier: "ChemWorks",
    lastRestocked: "2023-08-30T13:10:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0006",
    name: "Microscope Slides",
    sku: "MS-1234",
    barcode: "9876543211678",
    category: "Consumables",
    currentStock: 150,
    minStockLevel: 50,
    unit: "boxes",
    unitPrice: 8.99,
    location: "Storage Room A",
    supplier: "SciencePro Inc.",
    lastRestocked: "2023-09-10T15:30:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0007",
    name: "Ethanol (99%)",
    sku: "ET-5678",
    barcode: "9876543212012",
    category: "Chemicals",
    currentStock: 5,
    minStockLevel: 10,
    unit: "bottles",
    unitPrice: 35.99,
    location: "Hazardous Materials Cabinet",
    supplier: "ChemWorks",
    lastRestocked: "2023-08-15T10:45:00Z",
    isLowStock: true,
    status: "Low Stock"
  },
  {
    id: "INV-0008",
    name: "Pipette Set",
    sku: "PS-9012",
    barcode: "9876543212345",
    category: "Equipment",
    currentStock: 8,
    minStockLevel: 5,
    unit: "sets",
    unitPrice: 189.99,
    location: "Main Laboratory",
    supplier: "BioTech Solutions",
    lastRestocked: "2023-07-20T09:15:00Z",
    isLowStock: false,
    status: "In Stock"
  },
  {
    id: "INV-0009",
    name: "Petri Dishes",
    sku: "PD-3456",
    barcode: "9876543212678",
    category: "Consumables",
    currentStock: 30,
    minStockLevel: 40,
    unit: "packs",
    unitPrice: 15.50,
    location: "Storage Room B",
    supplier: "SciencePro Inc.",
    lastRestocked: "2023-09-01T14:20:00Z",
    isLowStock: true,
    status: "Low Stock"
  },
  {
    id: "INV-0010",
    name: "Magnetic Stirrer",
    sku: "MS-7890",
    barcode: "9876543213012",
    category: "Equipment",
    currentStock: 4,
    minStockLevel: 2,
    unit: "pcs",
    unitPrice: 149.99,
    location: "Main Laboratory",
    supplier: "Global Scientific",
    lastRestocked: "2023-08-05T11:30:00Z",
    isLowStock: false,
    status: "In Stock"
  }
];

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState(mockInventoryItems)
  
  // Handle updating an inventory item
  const handleUpdateItem = (updatedItem) => {
    setInventoryItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === updatedItem.id)
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const newItems = [...prev]
        newItems[existingItemIndex] = updatedItem
        return newItems
      } else {
        // Add new item
        return [...prev, updatedItem]
      }
    })
  }
  
  // Handle deleting an inventory item
  const handleDeleteItem = (itemId) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId))
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">
          Manage laboratory inventory, suppliers, and storage locations
        </p>
      </div>
      
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="warehouses">Storage Locations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <InventoryList 
            inventoryItems={inventoryItems} 
            onUpdateItem={handleUpdateItem} 
            onDeleteItem={handleDeleteItem} 
          />
        </TabsContent>
        
        <TabsContent value="suppliers">
          <SupplierManagement />
        </TabsContent>
        
        <TabsContent value="warehouses">
          <WarehouseManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <InventoryReports inventoryItems={inventoryItems} />
        </TabsContent>
      </Tabs>
    </div>
  )
}