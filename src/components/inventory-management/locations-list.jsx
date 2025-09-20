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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, MoreHorizontal, Plus, Trash2, MapPin, Archive, Thermometer, Package, Home, FileBox, Refrigerator } from "lucide-react"

export function LocationsList({ locations, onUpdateLocation, onDeleteLocation }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [newLocation, setNewLocation] = useState({
    name: "",
    location: "",
    capacity: "",
    type: "room",
    manager: "",
    contact: "",
    temperature: "",
    humidity: "",
    securityLevel: "Medium",
    notes: "",
    status: "Active"
  })

  // Handle opening edit dialog
  const openEditDialog = (location) => {
    setCurrentLocation({ ...location })
    setIsEditDialogOpen(true)
  }

  // Handle editing a location
  const handleEditLocation = () => {
    if (!currentLocation) return

    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Warehouse name' },
      { field: 'location', label: 'Physical location' },
      { field: 'capacity', label: 'Capacity' }
    ]

    for (const { field, label } of requiredFields) {
      if (!currentLocation[field]?.toString().trim()) {
        alert(`${label} is required`)
        return
      }
    }

    const locationToUpdate = {
      ...currentLocation,
      capacity: parseInt(currentLocation.capacity) || 0
    }

    onUpdateLocation(locationToUpdate)
    setIsEditDialogOpen(false)
    setCurrentLocation(null)
  }

  // Handle adding new location
  const handleAddLocation = () => {
    // Validate required fields
    const requiredFields = [
      { field: 'name', label: 'Warehouse name' },
      { field: 'location', label: 'Physical location' },
      { field: 'capacity', label: 'Capacity' }
    ]

    for (const { field, label } of requiredFields) {
      if (!newLocation[field]?.toString().trim()) {
        alert(`${label} is required`)
        return
      }
    }

    const locationToAdd = {
      ...newLocation,
      capacity: parseInt(newLocation.capacity) || 0,
      status: "Active"
    }

    onUpdateLocation(locationToAdd)
    setIsAddDialogOpen(false)
    setNewLocation({
      name: "",
      location: "",
      capacity: "",
      type: "room",
      manager: "",
      contact: "",
      temperature: "",
      humidity: "",
      securityLevel: "Medium",
      notes: "",
      status: "Active"
    })
  }

  // Helper function to get location type icon
  const getLocationIcon = (type) => {
    switch (type) {
      case 'room': return <Home className="h-4 w-4" />;
      case 'cabinet': return <FileBox className="h-4 w-4" />;
      case 'shelf': return <Archive className="h-4 w-4" />;
      case 'refrigerator': return <Refrigerator className="h-4 w-4" />;
      case 'freezer': return <Thermometer className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  // Helper function to get location type color
  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'room': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cabinet': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'shelf': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'refrigerator': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'freezer': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 md:p-6 border border-green-100 dark:border-green-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
              <MapPin className="h-5 w-5 md:h-6 md:w-6" />
              Storage Location Management
            </h2>
            <p className="text-green-600 dark:text-green-300 mt-1 text-sm md:text-base">
              Organize and manage your laboratory storage spaces efficiently
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 h-10 md:h-12">
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add New Location</span>
                <span className="sm:hidden">Add Location</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Storage Location</DialogTitle>
                <DialogDescription>
                  Create a new storage location with detailed specifications.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Warehouse Name *</label>
                      <Input
                        id="name"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                        placeholder="e.g., Chemical Storage, Main Warehouse"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">Physical Location *</label>
                      <Input
                        id="location"
                        value={newLocation.location}
                        onChange={(e) => setNewLocation({ ...newLocation, location: e.target.value })}
                        placeholder="e.g., Building A, Floor 2"
                        className="border-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="capacity" className="text-sm font-medium">Capacity *</label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={newLocation.capacity}
                        onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                        placeholder="e.g., 1000"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="type" className="text-sm font-medium">Storage Type</label>
                      <Select
                        value={newLocation.type}
                        onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
                      >
                        <SelectTrigger id="type" className="border-2">
                          <SelectValue placeholder="Select storage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room">
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              <span>Room</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="cabinet">
                            <div className="flex items-center gap-2">
                              <FileBox className="h-4 w-4" />
                              <span>Cabinet</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="shelf">
                            <div className="flex items-center gap-2">
                              <Archive className="h-4 w-4" />
                              <span>Shelf</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="refrigerator">
                            <div className="flex items-center gap-2">
                              <Refrigerator className="h-4 w-4" />
                              <span>Refrigerator</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="freezer">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4" />
                              <span>Freezer</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="securityLevel" className="text-sm font-medium">Security Level</label>
                      <Select
                        value={newLocation.securityLevel}
                        onValueChange={(value) => setNewLocation({ ...newLocation, securityLevel: value })}
                      >
                        <SelectTrigger id="securityLevel" className="border-2">
                          <SelectValue placeholder="Select security level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low Security</SelectItem>
                          <SelectItem value="Medium">Medium Security</SelectItem>
                          <SelectItem value="High">High Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="manager" className="text-sm font-medium">Manager</label>
                      <Input
                        id="manager"
                        value={newLocation.manager}
                        onChange={(e) => setNewLocation({ ...newLocation, manager: e.target.value })}
                        placeholder="e.g., Storage Manager"
                        className="border-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="contact" className="text-sm font-medium">Contact</label>
                      <Input
                        id="contact"
                        value={newLocation.contact}
                        onChange={(e) => setNewLocation({ ...newLocation, contact: e.target.value })}
                        placeholder="e.g., storage@lab.com"
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Environmental Conditions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Environmental Conditions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="temperature" className="text-sm font-medium">Temperature</label>
                      <Input
                        id="temperature"
                        value={newLocation.temperature}
                        onChange={(e) => setNewLocation({ ...newLocation, temperature: e.target.value })}
                        placeholder="e.g., 18-22°C"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="humidity" className="text-sm font-medium">Humidity</label>
                      <Input
                        id="humidity"
                        value={newLocation.humidity}
                        onChange={(e) => setNewLocation({ ...newLocation, humidity: e.target.value })}
                        placeholder="e.g., 30-50%"
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <Textarea
                      id="description"
                      value={newLocation.description}
                      onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                      placeholder="Detailed description of the storage location"
                      className="border-2"
                      rows={2}
                    />
                  </div>
                </div>


              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddLocation} className="bg-green-600 hover:bg-green-700">Add Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100">
            <div className="text-sm font-medium text-green-600">Total Locations</div>
            <div className="text-2xl font-bold">{locations.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-blue-600">Rooms</div>
            <div className="text-2xl font-bold">{locations.filter(l => l.type === 'room').length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-600">Cabinets</div>
            <div className="text-2xl font-bold">{locations.filter(l => l.type === 'cabinet').length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-cyan-100">
            <div className="text-sm font-medium text-cyan-600">Cold Storage</div>
            <div className="text-2xl font-bold">{locations.filter(l => ['refrigerator', 'freezer'].includes(l.type)).length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100">
            <div className="text-sm font-medium text-gray-600">Other</div>
            <div className="text-2xl font-bold">{locations.filter(l => l.type === 'shelf').length}</div>
          </div>
        </div>
      </div>

      {/* Enhanced Storage Locations Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
                <TableHead className="w-[120px] py-4">
                  <span className="font-semibold">Location ID</span>
                </TableHead>
                <TableHead className="min-w-[200px] py-4">
                  <span className="font-semibold">Location Details</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Type</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Specifications</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Capacity</span>
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
              {locations.length > 0 ? (
                locations.map((location, index) => (
                  <TableRow key={location._id || location.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-25 dark:bg-gray-850'}`}>
                    <TableCell className="font-mono text-sm py-4">
                      <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md inline-block">
                        {location?._id?.slice(-8) || location?.id || 'N/A'}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getLocationIcon(location?.type)}
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{location?.name || 'Unknown Location'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {location?.description || 'No description available'}
                        </div>
                        {location?.notes && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Has notes
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge variant="outline" className={`${getLocationTypeColor(location?.type)} font-medium`}>
                        <div className="flex items-center gap-1">
                          {getLocationIcon(location?.type)}
                          <span>{(location?.type || 'unknown').charAt(0).toUpperCase() + (location?.type || 'unknown').slice(1)}</span>
                        </div>
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
                        {location?.temperature && (
                          <div className="flex items-center gap-1 text-sm">
                            <Thermometer className="h-3 w-3 text-blue-500" />
                            <span className="font-medium">{location.temperature}</span>
                          </div>
                        )}
                        {location?.humidity && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className="text-xs">💧</span>
                            <span>{location.humidity}</span>
                          </div>
                        )}
                        {location?.accessLevel && (
                          <Badge variant="secondary" className="text-xs">
                            {location.accessLevel} access
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="text-lg font-semibold">
                          {location?.capacity || 'N/A'}
                        </div>
                        {location?.capacity && (
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-green-500 transition-all"
                              style={{ width: '75%' }} // This would be calculated based on actual usage
                            ></div>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Available space
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        variant={(location?.status || 'Inactive') === "Active" ? "default" : "secondary"}
                        className={`${(location?.status || 'Inactive') === "Active"
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                          } font-medium`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${(location?.status || 'Inactive') === "Active" ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                        {location?.status || 'Inactive'}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => openEditDialog(location)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Location</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Package className="mr-2 h-4 w-4" />
                            <span>View Contents</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>Show on Map</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => onDeleteLocation(location._id || location.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Location</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                      <MapPin className="h-12 w-12 text-gray-300" />
                      <div>
                        <p className="text-lg font-medium">No storage locations found</p>
                        <p className="text-sm">Add your first storage location to get started</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Storage Location</DialogTitle>
            <DialogDescription>
              {currentLocation && `Update information for ${currentLocation.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentLocation && (
            <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">Warehouse Name *</label>
                    <Input
                      id="edit-name"
                      value={currentLocation.name || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                      placeholder="Warehouse name"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-location" className="text-sm font-medium">Physical Location *</label>
                    <Input
                      id="edit-location"
                      value={currentLocation.location || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, location: e.target.value })}
                      placeholder="e.g., Building A, Floor 2"
                      className="border-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-capacity" className="text-sm font-medium">Capacity *</label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      min="1"
                      value={currentLocation.capacity || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, capacity: e.target.value })}
                      placeholder="e.g., 1000"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-securityLevel" className="text-sm font-medium">Security Level</label>
                    <Select
                      value={currentLocation.securityLevel || "Medium"}
                      onValueChange={(value) => setCurrentLocation({ ...currentLocation, securityLevel: value })}
                    >
                      <SelectTrigger id="edit-securityLevel" className="border-2">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low Security</SelectItem>
                        <SelectItem value="Medium">Medium Security</SelectItem>
                        <SelectItem value="High">High Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-manager" className="text-sm font-medium">Manager</label>
                    <Input
                      id="edit-manager"
                      value={currentLocation.manager || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, manager: e.target.value })}
                      placeholder="e.g., Storage Manager"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-contact" className="text-sm font-medium">Contact</label>
                    <Input
                      id="edit-contact"
                      value={currentLocation.contact || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, contact: e.target.value })}
                      placeholder="e.g., storage@lab.com"
                      className="border-2"
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Environmental Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-temperature" className="text-sm font-medium">Temperature</label>
                    <Input
                      id="edit-temperature"
                      value={currentLocation.temperature || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, temperature: e.target.value })}
                      placeholder="e.g., 18-22°C"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-humidity" className="text-sm font-medium">Humidity</label>
                    <Input
                      id="edit-humidity"
                      value={currentLocation.humidity || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, humidity: e.target.value })}
                      placeholder="e.g., 30-50%"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-humidity" className="text-sm font-medium">Humidity (%)</label>
                    <Input
                      id="edit-humidity"
                      value={currentLocation.humidity || ""}
                      onChange={(e) => setCurrentLocation({ ...currentLocation, humidity: e.target.value })}
                      placeholder="e.g., 45-65%"
                      className="border-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-accessLevel" className="text-sm font-medium">Access Level</label>
                    <Select
                      value={currentLocation.accessLevel || "standard"}
                      onValueChange={(value) => setCurrentLocation({ ...currentLocation, accessLevel: value })}
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public Access</SelectItem>
                        <SelectItem value="standard">Standard Access</SelectItem>
                        <SelectItem value="restricted">Restricted Access</SelectItem>
                        <SelectItem value="secure">Secure Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                    <Select
                      value={currentLocation.status || "Active"}
                      onValueChange={(value) => setCurrentLocation({ ...currentLocation, status: value })}
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                  <label htmlFor="edit-notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="edit-notes"
                    value={currentLocation.notes || ""}
                    onChange={(e) => setCurrentLocation({ ...currentLocation, notes: e.target.value })}
                    placeholder="Special instructions, restrictions, or additional notes..."
                    className="border-2"
                    rows={3}
                  />
                </div>
              </div>
            </div >
          )
          }
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditLocation} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent >
      </Dialog >
    </div >
  )
}