"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertCircle,
  ArrowUpDown,
  Scan, // Changed from BarcodeScan to Scan
  Check,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
  Upload
} from "lucide-react"
import { format, parseISO } from "date-fns"

export function InventoryList({ inventoryItems, onUpdateItem, onDeleteItem }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [selectedItems, setSelectedItems] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false)
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState(null)
  const [stockUpdateItem, setStockUpdateItem] = useState(null)
  const [stockUpdateAmount, setStockUpdateAmount] = useState(0)
  const [stockUpdateType, setStockUpdateType] = useState("add")
  // Add these missing state variables
  const [isSupplierEditOpen, setIsSupplierEditOpen] = useState(false)
  const [isLocationEditOpen, setIsLocationEditOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [advancedFilters, setAdvancedFilters] = useState({
    supplier: "all",
    minPrice: "",
    maxPrice: "",
    lastRestocked: "all"
  })
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: 0,
    minStockLevel: 0,
    unitPrice: 0,
    location: "",
    supplier: "",
    unit: "pcs"
  })

  // Get unique suppliers for filter
  const suppliers = ["all", ...new Set(inventoryItems.map(item => item.supplier).filter(Boolean))]

  // Get unique categories for filter
  const categories = ["all", ...new Set(inventoryItems.map(item => item.category))]

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filter and sort items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = (item?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?.id || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || item?.category === selectedCategory
    const matchesStatus = selectedStatus === "all" ||
      (selectedStatus === "low" && item?.isLowStock) ||
      (selectedStatus === "in-stock" && !item?.isLowStock)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(sortedItems.map(item => item.id))
    }
  }

  // Handle adding new item
  const handleAddItem = () => {
    // Generate a new ID
    const newId = `INV-${String(inventoryItems.length + 1).padStart(4, '0')}`

    const itemToAdd = {
      ...newItem,
      id: newId,
      sku: `SKU-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      barcode: `${Math.floor(Math.random() * 10000000000000)}`,
      isLowStock: newItem.currentStock <= newItem.minStockLevel,
      lastRestocked: new Date().toISOString(),
      status: newItem.currentStock <= newItem.minStockLevel ? "Low Stock" : "In Stock"
    }

    onUpdateItem(itemToAdd)
    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      minStockLevel: 0,
      unitPrice: 0,
      location: "",
      supplier: "",
      unit: "pcs"
    })
  }

  // Handle editing an item
  const handleEditItem = () => {
    if (!currentEditItem) return

    const updatedItem = {
      ...currentEditItem,
      isLowStock: currentEditItem.currentStock <= currentEditItem.minStockLevel,
      status: currentEditItem.currentStock <= currentEditItem.minStockLevel ? "Low Stock" : "In Stock"
    }

    onUpdateItem(updatedItem)
    setIsEditDialogOpen(false)
    setCurrentEditItem(null)
  }

  // Handle opening edit dialog
  const openEditDialog = (item) => {
    setCurrentEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Handle deleting selected items
  const handleDeleteSelected = () => {
    selectedItems.forEach(itemId => {
      onDeleteItem(itemId)
    })
    setSelectedItems([])
  }

  // Handle scanning barcode
  const handleScan = () => {
    // Simulate finding an item by barcode
    const randomItem = inventoryItems[Math.floor(Math.random() * inventoryItems.length)]
    if (randomItem) {
      setSearchQuery(randomItem.id)
    }
    setIsScanDialogOpen(false)
  }

  // Handle updating stock for selected items
  const handleBulkUpdateStock = () => {
    const selectedItemsData = inventoryItems.filter(item => selectedItems.includes(item.id))

    selectedItemsData.forEach(item => {
      const updatedItem = {
        ...item,
        currentStock: item.currentStock + 5, // Add 5 to current stock as an example
        lastRestocked: new Date().toISOString(),
        isLowStock: (item.currentStock + 5) <= item.minStockLevel,
        status: (item.currentStock + 5) <= item.minStockLevel ? "Low Stock" : "In Stock"
      }

      onUpdateItem(updatedItem)
    })

    setSelectedItems([])
  }

  // Handle stock update
  const handleStockUpdate = () => {
    if (!stockUpdateItem) return

    let newStock = stockUpdateItem.currentStock
    if (stockUpdateType === "add") {
      newStock += parseInt(stockUpdateAmount || 0)
    } else if (stockUpdateType === "subtract") {
      newStock = Math.max(0, newStock - parseInt(stockUpdateAmount || 0))
    } else if (stockUpdateType === "set") {
      newStock = parseInt(stockUpdateAmount || 0)
    }

    const updatedItem = {
      ...stockUpdateItem,
      currentStock: newStock,
      lastRestocked: new Date().toISOString(),
      isLowStock: newStock <= stockUpdateItem.minStockLevel,
      status: newStock <= stockUpdateItem.minStockLevel ? "Low Stock" : "In Stock"
    }

    onUpdateItem(updatedItem)
    setIsUpdateStockOpen(false)
    setStockUpdateItem(null)
    setStockUpdateAmount(0)
  }

  // Open stock update dialog
  const openStockUpdateDialog = (item) => {
    setStockUpdateItem({ ...item })
    setStockUpdateAmount(0)
    setStockUpdateType("add")
    setIsUpdateStockOpen(true)
  }

  // After your other handler functions like handleStockUpdate, openStockUpdateDialog, etc.

  // Handle opening supplier edit dialog
  const openSupplierEditDialog = (supplier) => {
    setCurrentSupplier(supplier)
    setIsSupplierEditOpen(true)
  }

  // Handle opening location edit dialog
  const openLocationEditDialog = (location) => {
    setCurrentLocation(location)
    setIsLocationEditOpen(true)
  }

  // Handle saving edited supplier
  const handleSupplierEdit = () => {
    if (!currentSupplier) return

    // Here you would update the supplier in your data store
    // For now, we'll just close the dialog
    setIsSupplierEditOpen(false)
    setCurrentSupplier(null)
  }

  // Handle saving edited location
  const handleLocationEdit = () => {
    if (!currentLocation) return

    // Here you would update the location in your data store
    // For now, we'll just close the dialog
    setIsLocationEditOpen(false)
    setCurrentLocation(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, SKU, or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Dialog open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
                <DialogDescription>
                  Apply additional filters to narrow down your inventory items.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier</label>
                  <Select
                    value={advancedFilters.supplier}
                    onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, supplier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier === "all" ? "All Suppliers" : supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min Price ($)</label>
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={advancedFilters.minPrice}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, minPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Price ($)</label>
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={advancedFilters.maxPrice}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Restocked</label>
                  <Select
                    value={advancedFilters.lastRestocked}
                    onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, lastRestocked: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAdvancedFilters({
                  supplier: "all",
                  minPrice: "",
                  maxPrice: "",
                  lastRestocked: "all"
                })}>Reset</Button>
                <Button onClick={() => setIsMoreFiltersOpen(false)}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Scan className="h-4 w-4 mr-2" />
                Scan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Scan Barcode</DialogTitle>
                <DialogDescription>
                  Scan a barcode to find an item in inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <Scan className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Position the barcode in front of your camera
                  </p>
                </div>
                <Input placeholder="Or enter barcode manually..." />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScanDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleScan}>Scan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Enter the details for the new inventory item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="Category"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="currentStock" className="text-sm font-medium">Current Stock</label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="minStockLevel" className="text-sm font-medium">Min Stock Level</label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={newItem.minStockLevel}
                      onChange={(e) => setNewItem({ ...newItem, minStockLevel: parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="unitPrice" className="text-sm font-medium">Unit Price ($)</label>
                    <Input
                      id="unitPrice"
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">Location</label>
                    <Input
                      id="location"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="Storage location"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                    <Input
                      id="supplier"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                      placeholder="Supplier name"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => requestSort("id")}>
                    <span>ID</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => requestSort("name")}>
                    <span>Name</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => requestSort("currentStock")}>
                    <span>Stock</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent" onClick={() => requestSort("unitPrice")}>
                    <span>Price</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      aria-label={`Select ${item.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item?.id || 'N/A'}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item?.name || 'Unknown Item'}</div>
                      <div className="text-xs text-muted-foreground">SKU: {item?.sku || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item?.category || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item?.currentStock || 0} {item?.unit || 'units'}</span>
                      {item?.isLowStock && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${(item?.unitPrice || 0).toFixed(2)}</TableCell>
                  <TableCell>{item?.location || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge variant={item.isLowStock ? "outline" : "secondary"} className={item.isLowStock ? "text-amber-500 border-amber-200 bg-amber-50" : ""}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStockUpdateDialog(item)}>
                          <Package className="mr-2 h-4 w-4" />
                          <span>Update Stock</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteItem(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="text-sm">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleBulkUpdateStock}>
              <Package className="h-4 w-4 mr-2" />
              Update Stock
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Add Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the details for this inventory item.
            </DialogDescription>
          </DialogHeader>
          {currentEditItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input
                    id="edit-name"
                    value={currentEditItem.name}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, name: e.target.value })}
                    placeholder="Item name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
                  <Input
                    id="edit-category"
                    value={currentEditItem.category}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, category: e.target.value })}
                    placeholder="Category"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-currentStock" className="text-sm font-medium">Current Stock</label>
                  <Input
                    id="edit-currentStock"
                    type="number"
                    value={currentEditItem.currentStock}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, currentStock: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-minStockLevel" className="text-sm font-medium">Min Stock Level</label>
                  <Input
                    id="edit-minStockLevel"
                    type="number"
                    value={currentEditItem.minStockLevel}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, minStockLevel: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-unitPrice" className="text-sm font-medium">Unit Price ($)</label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    value={currentEditItem.unitPrice}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, unitPrice: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-location" className="text-sm font-medium">Location</label>
                  <Input
                    id="edit-location"
                    value={currentEditItem.location}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, location: e.target.value })}
                    placeholder="Storage location"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-supplier" className="text-sm font-medium">Supplier</label>
                  <Input
                    id="edit-supplier"
                    value={currentEditItem.supplier}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, supplier: e.target.value })}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-unit" className="text-sm font-medium">Unit</label>
                  <Input
                    id="edit-unit"
                    value={currentEditItem.unit || "pcs"}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, unit: e.target.value })}
                    placeholder="Unit (e.g., pcs, boxes)"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Update Stock Dialog */}
      <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              {stockUpdateItem && `Update stock for ${stockUpdateItem.name}`}
            </DialogDescription>
          </DialogHeader>
          {stockUpdateItem && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Stock:</span>
                <span>{stockUpdateItem.currentStock} {stockUpdateItem.unit || "pcs"}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Type</label>
                <Select value={stockUpdateType} onValueChange={setStockUpdateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select update type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add to Stock</SelectItem>
                    <SelectItem value="subtract">Remove from Stock</SelectItem>
                    <SelectItem value="set">Set Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {stockUpdateType === "add" ? "Amount to Add" :
                    stockUpdateType === "subtract" ? "Amount to Remove" :
                      "New Stock Level"}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={stockUpdateAmount}
                  onChange={(e) => setStockUpdateAmount(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Stock Level:</span>
                <span>
                  {stockUpdateType === "add"
                    ? stockUpdateItem.currentStock + parseInt(stockUpdateAmount || 0)
                    : stockUpdateType === "subtract"
                      ? Math.max(0, stockUpdateItem.currentStock - parseInt(stockUpdateAmount || 0))
                      : parseInt(stockUpdateAmount || 0)
                  } {stockUpdateItem.unit || "pcs"}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStockOpen(false)}>Cancel</Button>
            <Button onClick={handleStockUpdate}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Supplier Edit Dialog */}
      <Dialog open={isSupplierEditOpen} onOpenChange={setIsSupplierEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              {currentSupplier && `Update supplier information for ${currentSupplier.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier Name</label>
                <Input
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupplierEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSupplierEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Location Edit Dialog */}
      <Dialog open={isLocationEditOpen} onOpenChange={setIsLocationEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              {currentLocation && `Update location information for ${currentLocation.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentLocation && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Name</label>
                <Input
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLocationEditOpen(false)}>Cancel</Button>
            <Button onClick={handleLocationEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
