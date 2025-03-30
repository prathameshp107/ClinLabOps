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
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: 0,
    minStockLevel: 0,
    unitPrice: 0,
    location: "",
    supplier: ""
  })
  
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
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || 
                          (selectedStatus === "low" && item.isLowStock) ||
                          (selectedStatus === "in-stock" && !item.isLowStock)
    
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
      supplier: ""
    })
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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Button variant="outline" size="sm">
            <Scan className="h-4 w-4 mr-2" />
            Scan
          </Button>
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
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
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
                      onChange={(e) => setNewItem({...newItem, currentStock: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="minStockLevel" className="text-sm font-medium">Min Stock Level</label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={newItem.minStockLevel}
                      onChange={(e) => setNewItem({...newItem, minStockLevel: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="unitPrice" className="text-sm font-medium">Unit Price ($)</label>
                    <Input
                      id="unitPrice"
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({...newItem, unitPrice: parseFloat(e.target.value)})}
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
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      placeholder="Storage location"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="supplier" className="text-sm font-medium">Supplier</label>
                    <Input
                      id="supplier"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
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
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.currentStock} {item.unit}</span>
                      {item.isLowStock && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.location}</TableCell>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Update Stock
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}