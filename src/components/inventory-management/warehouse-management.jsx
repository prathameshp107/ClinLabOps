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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
    AlertCircle,
    Building,
    Edit,
    MapPin,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    Trash2,
    User
} from "lucide-react"
import { warehouses, warehouseItems } from "@/data/inventory-data"

export function WarehouseManagement() {
    const [warehouses, setWarehouses] = useState(warehouses)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedWarehouse, setSelectedWarehouse] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newWarehouse, setNewWarehouse] = useState({
        name: "",
        location: "",
        address: "",
        manager: "",
        capacity: 0,
        status: "active"
    })

    // Filter warehouses based on search query
    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.manager.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handle adding new warehouse
    const handleAddWarehouse = () => {
        const warehouseToAdd = {
            ...newWarehouse,
            id: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
            used: 0,
            itemCount: 0
        }

        setWarehouses([...warehouses, warehouseToAdd])
        setIsAddDialogOpen(false)
        setNewWarehouse({
            name: "",
            location: "",
            address: "",
            manager: "",
            capacity: 0,
            status: "active"
        })
    }

    // Handle deleting warehouse
    const handleDeleteWarehouse = (id) => {
        setWarehouses(warehouses.filter(warehouse => warehouse.id !== id))
    }

    // Handle viewing warehouse details
    const handleViewWarehouse = (warehouse) => {
        setSelectedWarehouse(warehouse)
    }

    return (
        <div className="space-y-6">
            {selectedWarehouse ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{selectedWarehouse.name}</h2>
                        <Button variant="outline" onClick={() => setSelectedWarehouse(null)}>
                            Back to Warehouses
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Warehouse Information</CardTitle>
                                <CardDescription>
                                    Location details and capacity
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Warehouse ID</p>
                                        <p>{selectedWarehouse.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Manager</p>
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <p>{selectedWarehouse.manager}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                                        <div className="flex items-center">
                                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <p>{selectedWarehouse.location}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge variant={selectedWarehouse.status === "active" ? "outline" : "secondary"} className={selectedWarehouse.status === "active" ? "text-green-500 border-green-200 bg-green-50" : ""}>
                                            {selectedWarehouse.status.charAt(0).toUpperCase() + selectedWarehouse.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <p>{selectedWarehouse.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-medium text-muted-foreground">Capacity Usage</p>
                                        <p className="text-sm">{selectedWarehouse.used} / {selectedWarehouse.capacity} units ({Math.round((selectedWarehouse.used / selectedWarehouse.capacity) * 100)}%)</p>
                                    </div>
                                    <Progress value={(selectedWarehouse.used / selectedWarehouse.capacity) * 100} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Storage Summary</CardTitle>
                                <CardDescription>
                                    Current storage statistics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Total Items</p>
                                        <p className="text-sm font-medium">{selectedWarehouse.itemCount}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Space Used</p>
                                        <p className="text-sm font-medium">{Math.round((selectedWarehouse.used / selectedWarehouse.capacity) * 100)}%</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm font-medium">Available Space</p>
                                        <p className="text-sm font-medium">{selectedWarehouse.capacity - selectedWarehouse.used} units</p>
                                    </div>
                                </div>

                                {(selectedWarehouse.used / selectedWarehouse.capacity) > 0.9 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-800">Storage Almost Full</p>
                                            <p className="text-xs text-amber-700">Consider transferring items to another location or expanding capacity.</p>
                                        </div>
                                    </div>
                                )}

                                <Button className="w-full">
                                    <Package className="h-4 w-4 mr-2" />
                                    Manage Items
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stored Items</CardTitle>
                            <CardDescription>
                                Items currently stored in this warehouse
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">All Items</TabsTrigger>
                                    <TabsTrigger value="chemicals">Chemicals</TabsTrigger>
                                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                                    <TabsTrigger value="consumables">Consumables</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="m-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {warehouseItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.id}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.category}</TableCell>
                                                    <TableCell>{item.quantity} {item.unit}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>

                                <TabsContent value="chemicals" className="m-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {warehouseItems
                                                .filter(item => item.category === "Chemicals")
                                                .map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">{item.id}</TableCell>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.category}</TableCell>
                                                        <TableCell>{item.quantity} {item.unit}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm">
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>

                                {/* Other tabs would be similar */}
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search warehouses..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Warehouse
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Warehouse</DialogTitle>
                                    <DialogDescription>
                                        Enter the details for the new storage location.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">Warehouse Name</label>
                                            <Input
                                                id="name"
                                                value={newWarehouse.name}
                                                onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                                                placeholder="Storage name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="location" className="text-sm font-medium">Location</label>
                                            <Input
                                                id="location"
                                                value={newWarehouse.location}
                                                onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                                                placeholder="Building, Floor, etc."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                                        <Input
                                            id="address"
                                            value={newWarehouse.address}
                                            onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                                            placeholder="Full address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="manager" className="text-sm font-medium">Manager</label>
                                            <Input
                                                id="manager"
                                                value={newWarehouse.manager}
                                                onChange={(e) => setNewWarehouse({ ...newWarehouse, manager: e.target.value })}
                                                placeholder="Person responsible"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="capacity" className="text-sm font-medium">Capacity (units)</label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                value={newWarehouse.capacity}
                                                onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: parseInt(e.target.value) })}
                                                placeholder="Total capacity"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddWarehouse}>Add Warehouse</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Manager</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWarehouses.length > 0 ? (
                                    filteredWarehouses.map((warehouse) => (
                                        <TableRow key={warehouse.id}>
                                            <TableCell className="font-medium">{warehouse.id}</TableCell>
                                            <TableCell>
                                                <Button variant="link" className="p-0 h-auto" onClick={() => handleViewWarehouse(warehouse)}>
                                                    {warehouse.name}
                                                </Button>
                                            </TableCell>
                                            <TableCell>{warehouse.location}</TableCell>
                                            <TableCell>{warehouse.manager}</TableCell>
                                            <TableCell>{warehouse.capacity} units</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Progress value={(warehouse.used / warehouse.capacity) * 100} className="h-2 w-24" />
                                                    <span className="text-sm">{Math.round((warehouse.used / warehouse.capacity) * 100)}%</span>
                                                </div>
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
                                                        <DropdownMenuItem onClick={() => handleViewWarehouse(warehouse)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteWarehouse(warehouse.id)}>
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
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No warehouses found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    )
}