"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  AlertTriangle,
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
  Upload,
  MapPin,
  Users,
  ChevronDown
} from "lucide-react"
import { format, parseISO } from "date-fns"

export function InventoryList({ inventoryItems, locations, onUpdateItem, onDeleteItem }) {
  // Predefined categories and types
  const predefinedCategories = [
    "Chemicals",
    "Biological Materials",
    "Equipment",
    "Reagents",
    "Consumables",
    "Glassware",
    "Plastics",
    "Instruments",
    "Antibodies",
    "Buffers"
  ];

  const predefinedTypes = [
    "Reagent",
    "Instrument",
    "Consumable",
    "Chemical",
    "Biological",
    "Glassware",
    "Plasticware",
    "Antibody",
    "Buffer",
    "Media"
  ];

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
  const [stockUpdateAmount, setStockUpdateAmount] = useState("")
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
    type: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "pcs",
    location: "",
    supplier: "",
    cost: "",
    expiryDate: "",
    batchNumber: "",
    notes: "",
    barcode: "",
    hazardous: false,
    storageConditions: ""
  })

  // State for combobox open states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isEditTypeOpen, setIsEditTypeOpen] = useState(false)
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false)

  // State for custom entry modals
  const [isCustomCategoryOpen, setIsCustomCategoryOpen] = useState(false)
  const [isCustomTypeOpen, setIsCustomTypeOpen] = useState(false)
  const [isCustomLocationOpen, setIsCustomLocationOpen] = useState(false)
  const [isEditCustomCategoryOpen, setIsEditCustomCategoryOpen] = useState(false)
  const [isEditCustomTypeOpen, setIsEditCustomTypeOpen] = useState(false)
  const [isEditCustomLocationOpen, setIsEditCustomLocationOpen] = useState(false)

  // State for custom entry values
  const [customCategoryValue, setCustomCategoryValue] = useState("")
  const [customTypeValue, setCustomTypeValue] = useState("")
  const [customLocationValue, setCustomLocationValue] = useState("")

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
      (item?.barcode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?._id || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || item?.category === selectedCategory
    const matchesStatus = selectedStatus === "all" ||
      (selectedStatus === "low" && item?.currentStock <= item?.minStock) ||
      (selectedStatus === "in-stock" && item?.currentStock > item?.minStock)

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
      setSelectedItems(sortedItems.map(item => item._id))
    }
  }

  // Handle adding new item
  const handleAddItem = () => {
    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Item name' },
      { field: 'category', label: 'Category' },
      { field: 'type', label: 'Type' },
      { field: 'unit', label: 'Unit' },
      { field: 'location', label: 'Storage location' }
    ]

    for (const { field, label } of requiredFields) {
      if (!newItem[field]?.trim()) {
        alert(`${label} is required`)
        return
      }
    }

    const itemToAdd = {
      ...newItem,
      currentStock: newItem.currentStock !== "" ? parseInt(newItem.currentStock) : 0,
      minStock: newItem.minStock !== "" ? parseInt(newItem.minStock) : 0,
      maxStock: newItem.maxStock !== "" ? parseInt(newItem.maxStock) : 100,
      cost: newItem.cost !== "" ? parseFloat(newItem.cost) : 0,
      expiryDate: newItem.expiryDate ? new Date(newItem.expiryDate) : null
    }

    onUpdateItem(itemToAdd)
    setIsAddDialogOpen(false)
    setNewItem({
      name: "",
      category: "",
      type: "",
      currentStock: "",
      minStock: "",
      maxStock: "",
      unit: "pcs",
      location: "",
      supplier: "",
      cost: "",
      expiryDate: "",
      batchNumber: "",
      notes: "",
      barcode: "",
      hazardous: false,
      storageConditions: ""
    })
  }

  // Handle editing an item
  const handleEditItem = () => {
    if (!currentEditItem) return

    const updatedItem = {
      ...currentEditItem,
      currentStock: currentEditItem.currentStock !== "" ? parseInt(currentEditItem.currentStock) : 0,
      minStock: currentEditItem.minStock !== "" ? parseInt(currentEditItem.minStock) : 0,
      maxStock: currentEditItem.maxStock !== "" ? parseInt(currentEditItem.maxStock) : 100,
      cost: currentEditItem.cost !== "" ? parseFloat(currentEditItem.cost) : 0,
      expiryDate: currentEditItem.expiryDate ? new Date(currentEditItem.expiryDate) : null
    }

    onUpdateItem(updatedItem)
    setIsEditDialogOpen(false)
    setCurrentEditItem(null)
  }

  // Handle opening edit dialog
  const openEditDialog = (item) => {
    // Convert numeric values to strings for editing
    const editItem = {
      ...item,
      currentStock: item.currentStock !== undefined && item.currentStock !== null ? item.currentStock.toString() : "",
      minStock: item.minStock !== undefined && item.minStock !== null ? item.minStock.toString() : "",
      cost: item.cost !== undefined && item.cost !== null ? item.cost.toString() : ""
    };
    setCurrentEditItem(editItem);
    setIsEditDialogOpen(true);
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
    const selectedItemsData = inventoryItems.filter(item => selectedItems.includes(item._id))

    selectedItemsData.forEach(item => {
      const updatedItem = {
        ...item,
        currentStock: item.currentStock + 5, // Add 5 to current stock as an example
        lastRestocked: new Date().toISOString()
      }

      onUpdateItem(updatedItem)
    })

    setSelectedItems([])
  }

  // Handle stock update
  const handleStockUpdate = () => {
    if (!stockUpdateItem) return

    // Check if amount is provided
    if (stockUpdateAmount === "" || stockUpdateAmount === undefined) {
      alert("Please enter an amount");
      return;
    }

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
      lastRestocked: new Date().toISOString()
    }

    onUpdateItem(updatedItem)
    setIsUpdateStockOpen(false)
    setStockUpdateItem(null)
    setStockUpdateAmount("") // Changed from 0 to empty string
  }

  // Open stock update dialog
  const openStockUpdateDialog = (item) => {
    setStockUpdateItem({ ...item });
    setStockUpdateAmount(""); // Changed from 0 to empty string
    setStockUpdateType("add");
    setIsUpdateStockOpen(true);
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
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 md:p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex flex-col lg:flex-row justify-between gap-4 md:gap-6">
          {/* Search and Basic Filters */}
          <div className="flex flex-col sm:flex-row flex-1 gap-4">
            <div className="relative flex-1 min-w-[250px] md:min-w-[300px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, SKU, ID, or supplier..."
                className="pl-10 h-10 md:h-12 text-sm md:text-base border-2 border-blue-200 focus:border-blue-400 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 md:gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px] md:w-[200px] h-10 md:h-12 border-2 border-blue-200 bg-white text-xs md:text-sm">
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
                <SelectTrigger className="w-[120px] md:w-[180px] h-10 md:h-12 border-2 border-blue-200 bg-white text-xs md:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Dialog open={isMoreFiltersOpen} onOpenChange={setIsMoreFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="default" className="h-10 md:h-12 border-2 border-blue-200 hover:bg-blue-50 px-3 md:px-4">
                  <Filter className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Advanced Filters</span>
                  <span className="sm:hidden">Filters</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Advanced Inventory Filters</DialogTitle>
                  <DialogDescription>
                    Apply detailed filters to find specific inventory items.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Min Price ($)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={advancedFilters.minPrice}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, minPrice: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Max Price ($)</label>
                      <Input
                        type="number"
                        placeholder="1000.00"
                        value={advancedFilters.maxPrice}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAdvancedFilters({
                    supplier: "all",
                    minPrice: "",
                    maxPrice: "",
                    lastRestocked: "all"
                  })}>Reset All</Button>
                  <Button onClick={() => setIsMoreFiltersOpen(false)}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>



            <Button variant="outline" size="default" className="h-10 md:h-12 border-2 border-orange-200 hover:bg-orange-50 text-orange-700 px-3 md:px-4">
              <Download className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="default" className="h-10 md:h-12 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6">
                  <Plus className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Add New Item</span>
                  <span className="sm:hidden">Add Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Create a new inventory item with complete details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Item Name *</label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Enter item name"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">Category *</label>
                      <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isCategoryOpen}
                            className="w-full justify-between border-2 hover:border-blue-400 transition-colors"
                          >
                            {newItem.category || "Select category..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-2 shadow-lg">
                          <Command className="border-none">
                            <CommandInput placeholder="Search category..." className="h-10" />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {predefinedCategories.map((category) => (
                                <CommandItem
                                  key={category}
                                  onSelect={(currentValue) => {
                                    setNewItem({ ...newItem, category: currentValue })
                                    setIsCategoryOpen(false)
                                  }}
                                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newItem.category === category ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {category}
                                </CommandItem>
                              ))}
                              <CommandItem
                                onSelect={(currentValue) => {
                                  setIsCustomCategoryOpen(true)
                                  setIsCategoryOpen(false)
                                }}
                                className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add custom category...
                              </CommandItem>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">Type *</label>
                      <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isTypeOpen}
                            className="w-full justify-between border-2 hover:border-blue-400 transition-colors"
                          >
                            {newItem.type || "Select type..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-2 shadow-lg">
                          <Command className="border-none">
                            <CommandInput placeholder="Search type..." className="h-10" />
                            <CommandEmpty>No type found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {predefinedTypes.map((type) => (
                                <CommandItem
                                  key={type}
                                  onSelect={(currentValue) => {
                                    setNewItem({ ...newItem, type: currentValue })
                                    setIsTypeOpen(false)
                                  }}
                                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newItem.type === type ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {type}
                                </CommandItem>
                              ))}
                              <CommandItem
                                onSelect={(currentValue) => {
                                  setIsCustomTypeOpen(true)
                                  setIsTypeOpen(false)
                                }}
                                className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add custom type...
                              </CommandItem>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="currentStock" className="text-sm font-medium">Current Stock *</label>
                      <Input
                        id="currentStock"
                        type="number"
                        min="0"
                        value={newItem.currentStock}
                        onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })}
                        placeholder="Enter current stock"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="minStock" className="text-sm font-medium">Min Stock Level *</label>
                      <Input
                        id="minStock"
                        type="number"
                        min="0"
                        value={newItem.minStock}
                        onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                        placeholder="Enter minimum stock level"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cost" className="text-sm font-medium">Unit Price ($) *</label>
                      <Input
                        id="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.cost}
                        onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                        placeholder="Enter unit price"
                        className="border-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">Storage Location *</label>
                      <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isLocationOpen}
                            className="w-full justify-between border-2 hover:border-blue-400 transition-colors"
                          >
                            {newItem.location || "Select location..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-2 shadow-lg">
                          <Command className="border-none">
                            <CommandInput placeholder="Search location..." className="h-10" />
                            <CommandEmpty>No location found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {locations && locations.map((location) => (
                                <CommandItem
                                  key={location._id}
                                  onSelect={(currentValue) => {
                                    setNewItem({ ...newItem, location: location.name })
                                    setIsLocationOpen(false)
                                  }}
                                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newItem.location === location.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {location.name}
                                </CommandItem>
                              ))}
                              <CommandItem
                                onSelect={(currentValue) => {
                                  setIsCustomLocationOpen(true)
                                  setIsLocationOpen(false)
                                }}
                                className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add custom location...
                              </CommandItem>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                      <Input
                        id="supplier"
                        value={newItem.supplier}
                        onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                        placeholder="Supplier name"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="unit" className="text-sm font-medium">Unit *</label>
                      <Input
                        id="unit"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        placeholder="pcs, kg, L, etc."
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-blue-600">Total Items</div>
            <div className="text-2xl font-bold">{sortedItems.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-100">
            <div className="text-sm font-medium text-amber-600">Low Stock</div>
            <div className="text-2xl font-bold">{sortedItems.filter(item => item.currentStock <= item.minStock).length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100">
            <div className="text-sm font-medium text-green-600">In Stock</div>
            <div className="text-2xl font-bold">{sortedItems.filter(item => item.currentStock > item.minStock).length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-600">Value</div>
            <div className="text-2xl font-bold">${sortedItems.reduce((total, item) => total + (item.currentStock * (item.cost || 0)), 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Inventory Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
                <TableHead className="w-[50px] py-4">
                  <Checkbox
                    checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className="border-2"
                  />
                </TableHead>
                <TableHead className="w-[120px] py-4">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent font-semibold" onClick={() => requestSort("_id")}>
                      <span>Item ID</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="min-w-[200px] py-4">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent font-semibold" onClick={() => requestSort("name")}>
                      <span>Item Details</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Category</span>
                </TableHead>
                <TableHead className="py-4">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent font-semibold" onClick={() => requestSort("currentStock")}>
                      <span>Stock Level</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="py-4">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent font-semibold" onClick={() => requestSort("cost")}>
                      <span>Unit Price</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Location & Supplier</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Status</span>
                </TableHead>
                <TableHead className="text-right py-4">
                  <span className="font-semibold">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.length > 0 ? (
                sortedItems.map((item, index) => (
                  <TableRow key={item._id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-25 dark:bg-gray-850'}`}>
                    <TableCell className="py-4">
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={() => toggleItemSelection(item._id)}
                        aria-label={`Select ${item.name}`}
                        className="border-2"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm py-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md inline-block">
                        {item?._id?.slice(-8) || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item?.name || 'Unknown Item'}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Type: {item?.type || 'N/A'}</span>
                          {item?.barcode && (
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                              <Scan className="h-3 w-3" />
                              {item.barcode.slice(-6)}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {item?.category || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{item?.currentStock || 0}</span>
                          <span className="text-sm text-muted-foreground">{item?.unit || 'units'}</span>
                          {(item?.currentStock <= item?.minStock) && (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${(item?.currentStock <= item?.minStock) ? 'bg-red-500' :
                              (item?.currentStock || 0) > (item?.minStock || 0) * 2 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                            style={{
                              width: `${Math.min(100, ((item?.currentStock || 0) / Math.max((item?.minStock || 0) * 3, 1)) * 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Min: {item?.minStock || 0} {item?.unit || 'units'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-right">
                        <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                          ${(item?.cost || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: ${((item?.currentStock || 0) * (item?.cost || 0)).toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span className="font-medium">{item?.location || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{item?.supplier || 'No supplier'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <Badge
                          variant={(item?.currentStock <= item?.minStock) ? "destructive" : "default"}
                          className={`${(item?.currentStock <= item?.minStock)
                            ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                            : "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                            } font-medium`}
                        >
                          {(item?.currentStock <= item?.minStock) ? (
                            <><AlertTriangle className="h-3 w-3 mr-1" />Low Stock</>
                          ) : (
                            <><Check className="h-3 w-3 mr-1" />In Stock</>
                          )}
                        </Badge>
                        {item?.lastRestocked && (
                          <div className="text-xs text-muted-foreground">
                            Last: {format(new Date(item.lastRestocked), 'MMM dd')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(item)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Item</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStockUpdateDialog(item)} className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Update Stock</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => onDeleteItem(item._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Item</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                      <Package className="h-12 w-12 text-gray-300" />
                      <div>
                        <p className="text-lg font-medium">No inventory items found</p>
                        <p className="text-sm">Add some items to get started or adjust your filters</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
                {selectedItems.length}
              </div>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  {selectedItems.map(id => {
                    const item = inventoryItems.find(item => item._id === id);
                    return item?.name;
                  }).filter(Boolean).slice(0, 3).join(', ')}
                  {selectedItems.length > 3 && ` and ${selectedItems.length - 3} more`}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkUpdateStock}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Bulk Update Stock
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems([])}
                className="text-gray-600 hover:bg-gray-100"
              >
                Clear Selection
              </Button>
            </div>
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
                  <Popover open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isEditCategoryOpen}
                        className="w-full justify-between hover:border-blue-400 transition-colors"
                      >
                        {currentEditItem.category || "Select category..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 border-2 shadow-lg">
                      <Command className="border-none">
                        <CommandInput placeholder="Search category..." className="h-10" />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {predefinedCategories.map((category) => (
                            <CommandItem
                              key={category}
                              onSelect={(currentValue) => {
                                setCurrentEditItem({ ...currentEditItem, category: currentValue })
                                setIsEditCategoryOpen(false)
                              }}
                              className="cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  currentEditItem.category === category ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {category}
                            </CommandItem>
                          ))}
                          <CommandItem
                            onSelect={(currentValue) => {
                              setIsEditCustomCategoryOpen(true)
                              setIsEditCategoryOpen(false)
                            }}
                            className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add custom category...
                          </CommandItem>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-currentStock" className="text-sm font-medium">Current Stock</label>
                  <Input
                    id="edit-currentStock"
                    type="number"
                    value={currentEditItem.currentStock}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, currentStock: e.target.value })}
                    placeholder="Enter current stock"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-minStock" className="text-sm font-medium">Min Stock Level</label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={currentEditItem.minStock}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, minStock: e.target.value })}
                    placeholder="Enter minimum stock level"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-cost" className="text-sm font-medium">Unit Price ($)</label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={currentEditItem.cost}
                    onChange={(e) => setCurrentEditItem({ ...currentEditItem, cost: e.target.value })}
                    placeholder="Enter unit price"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-location" className="text-sm font-medium">Location</label>
                  <Popover open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isEditLocationOpen}
                        className="w-full justify-between hover:border-blue-400 transition-colors"
                      >
                        {currentEditItem.location || "Select location..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 border-2 shadow-lg">
                      <Command className="border-none">
                        <CommandInput placeholder="Search location..." className="h-10" />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {locations && locations.map((location) => (
                            <CommandItem
                              key={location._id}
                              onSelect={(currentValue) => {
                                setCurrentEditItem({ ...currentEditItem, location: location.name })
                                setIsEditLocationOpen(false)
                              }}
                              className="cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  currentEditItem.location === location.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {location.name}
                            </CommandItem>
                          ))}
                          <CommandItem
                            onSelect={(currentValue) => {
                              setIsEditCustomLocationOpen(true)
                              setIsEditLocationOpen(false)
                            }}
                            className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add custom location...
                          </CommandItem>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
              <div className="space-y-2">
                <label htmlFor="edit-type" className="text-sm font-medium">Type</label>
                <Popover open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isEditTypeOpen}
                      className="w-full justify-between hover:border-blue-400 transition-colors"
                    >
                      {currentEditItem.type || "Select type..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-2 shadow-lg">
                    <Command className="border-none">
                      <CommandInput placeholder="Search type..." className="h-10" />
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {predefinedTypes.map((type) => (
                          <CommandItem
                            key={type}
                            onSelect={(currentValue) => {
                              setCurrentEditItem({ ...currentEditItem, type: currentValue })
                              setIsEditTypeOpen(false)
                            }}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentEditItem.type === type ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {type}
                          </CommandItem>
                        ))}
                        <CommandItem
                          onSelect={(currentValue) => {
                            setIsEditCustomTypeOpen(true)
                            setIsEditTypeOpen(false)
                          }}
                          className="cursor-pointer hover:bg-blue-50 transition-colors text-blue-600"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add custom type...
                        </CommandItem>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Stock Level:</span>
                <span>
                  {stockUpdateType === "add"
                    ? stockUpdateItem.currentStock + (stockUpdateAmount ? parseInt(stockUpdateAmount) : 0)
                    : stockUpdateType === "subtract"
                      ? Math.max(0, stockUpdateItem.currentStock - (stockUpdateAmount ? parseInt(stockUpdateAmount) : 0))
                      : (stockUpdateAmount ? parseInt(stockUpdateAmount) : 0)
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

      {/* Custom Category Modal for Add Item */}
      <Dialog open={isCustomCategoryOpen} onOpenChange={setIsCustomCategoryOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Category</DialogTitle>
            <DialogDescription>
              Enter a custom category name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="custom-category" className="text-sm font-medium">Category Name</label>
              <Input
                id="custom-category"
                value={customCategoryValue}
                onChange={(e) => setCustomCategoryValue(e.target.value)}
                placeholder="Enter category name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsCustomCategoryOpen(false)
              setCustomCategoryValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customCategoryValue.trim()) {
                alert("Please enter a category name")
                return
              }
              setNewItem({ ...newItem, category: customCategoryValue.trim() })
              setIsCategoryOpen(false)
              setIsCustomCategoryOpen(false)
              setCustomCategoryValue("")
            }}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Type Modal for Add Item */}
      <Dialog open={isCustomTypeOpen} onOpenChange={setIsCustomTypeOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Type</DialogTitle>
            <DialogDescription>
              Enter a custom type name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="custom-type" className="text-sm font-medium">Type Name</label>
              <Input
                id="custom-type"
                value={customTypeValue}
                onChange={(e) => setCustomTypeValue(e.target.value)}
                placeholder="Enter type name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsCustomTypeOpen(false)
              setCustomTypeValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customTypeValue.trim()) {
                alert("Please enter a type name")
                return
              }
              setNewItem({ ...newItem, type: customTypeValue.trim() })
              setIsTypeOpen(false)
              setIsCustomTypeOpen(false)
              setCustomTypeValue("")
            }}>Add Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Location Modal for Add Item */}
      <Dialog open={isCustomLocationOpen} onOpenChange={setIsCustomLocationOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Location</DialogTitle>
            <DialogDescription>
              Enter a custom location name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="custom-location" className="text-sm font-medium">Location Name</label>
              <Input
                id="custom-location"
                value={customLocationValue}
                onChange={(e) => setCustomLocationValue(e.target.value)}
                placeholder="Enter location name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsCustomLocationOpen(false)
              setCustomLocationValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customLocationValue.trim()) {
                alert("Please enter a location name")
                return
              }
              setNewItem({ ...newItem, location: customLocationValue.trim() })
              setIsLocationOpen(false)
              setIsCustomLocationOpen(false)
              setCustomLocationValue("")
            }}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Category Modal for Edit Item */}
      <Dialog open={isEditCustomCategoryOpen} onOpenChange={setIsEditCustomCategoryOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Category</DialogTitle>
            <DialogDescription>
              Enter a custom category name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-custom-category" className="text-sm font-medium">Category Name</label>
              <Input
                id="edit-custom-category"
                value={customCategoryValue}
                onChange={(e) => setCustomCategoryValue(e.target.value)}
                placeholder="Enter category name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsEditCustomCategoryOpen(false)
              setCustomCategoryValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customCategoryValue.trim()) {
                alert("Please enter a category name")
                return
              }
              setCurrentEditItem({ ...currentEditItem, category: customCategoryValue.trim() })
              setIsEditCategoryOpen(false)
              setIsEditCustomCategoryOpen(false)
              setCustomCategoryValue("")
            }}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Type Modal for Edit Item */}
      <Dialog open={isEditCustomTypeOpen} onOpenChange={setIsEditCustomTypeOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Type</DialogTitle>
            <DialogDescription>
              Enter a custom type name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-custom-type" className="text-sm font-medium">Type Name</label>
              <Input
                id="edit-custom-type"
                value={customTypeValue}
                onChange={(e) => setCustomTypeValue(e.target.value)}
                placeholder="Enter type name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsEditCustomTypeOpen(false)
              setCustomTypeValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customTypeValue.trim()) {
                alert("Please enter a type name")
                return
              }
              setCurrentEditItem({ ...currentEditItem, type: customTypeValue.trim() })
              setIsEditTypeOpen(false)
              setIsEditCustomTypeOpen(false)
              setCustomTypeValue("")
            }}>Add Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Location Modal for Edit Item */}
      <Dialog open={isEditCustomLocationOpen} onOpenChange={setIsEditCustomLocationOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">Add Custom Location</DialogTitle>
            <DialogDescription>
              Enter a custom location name for your inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-custom-location" className="text-sm font-medium">Location Name</label>
              <Input
                id="edit-custom-location"
                value={customLocationValue}
                onChange={(e) => setCustomLocationValue(e.target.value)}
                placeholder="Enter location name"
                className="border-2 focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setIsEditCustomLocationOpen(false)
              setCustomLocationValue("")
            }}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
              if (!customLocationValue.trim()) {
                alert("Please enter a location name")
                return
              }
              setCurrentEditItem({ ...currentEditItem, location: customLocationValue.trim() })
              setIsEditLocationOpen(false)
              setIsEditCustomLocationOpen(false)
              setCustomLocationValue("")
            }}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
