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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"

export function LocationsList({ locations, onUpdateLocation, onDeleteLocation }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
    type: "room",
    capacity: "",
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

    onUpdateLocation(currentLocation)
    setIsEditDialogOpen(false)
    setCurrentLocation(null)
  }

  // Handle adding new location
  const handleAddLocation = () => {
    // Generate a new ID
    const newId = `LOC-${String(locations.length + 1).padStart(4, '0')}`

    const locationToAdd = {
      ...newLocation,
      id: newId,
      status: "Active"
    }

    onUpdateLocation(locationToAdd)
    setIsAddDialogOpen(false)
    setNewLocation({
      name: "",
      description: "",
      type: "room",
      capacity: "",
      status: "Active"
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Storage Locations</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Storage Location</DialogTitle>
              <DialogDescription>
                Enter the details for the new storage location.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Location Name</label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="Location name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={newLocation.description}
                  onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                  placeholder="Location description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Location Type</label>
                  <Select
                    value={newLocation.type}
                    onValueChange={(value) => setNewLocation({ ...newLocation, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="cabinet">Cabinet</SelectItem>
                      <SelectItem value="shelf">Shelf</SelectItem>
                      <SelectItem value="refrigerator">Refrigerator</SelectItem>
                      <SelectItem value="freezer">Freezer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="capacity" className="text-sm font-medium">Capacity</label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newLocation.capacity}
                    onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                    placeholder="Storage capacity"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location?.id || 'N/A'}</TableCell>
                  <TableCell>{location?.name || 'Unknown Location'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(location?.type || 'unknown').charAt(0).toUpperCase() + (location?.type || 'unknown').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{location?.description || 'No description'}</TableCell>
                  <TableCell>{location?.capacity || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={(location?.status || 'Inactive') === "Active" ? "success" : "secondary"}>
                      {location?.status || 'Inactive'}
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
                        <DropdownMenuItem onClick={() => openEditDialog(location)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteLocation(location.id)}>
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
                  No storage locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Storage Location</DialogTitle>
            <DialogDescription>
              {currentLocation && `Update information for ${currentLocation.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentLocation && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Location Name</label>
                <Input
                  id="edit-name"
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                  placeholder="Location name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                <Input
                  id="edit-description"
                  value={currentLocation.description || ""}
                  onChange={(e) => setCurrentLocation({ ...currentLocation, description: e.target.value })}
                  placeholder="Location description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-type" className="text-sm font-medium">Location Type</label>
                  <Select
                    value={currentLocation.type || "room"}
                    onValueChange={(value) => setCurrentLocation({ ...currentLocation, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="cabinet">Cabinet</SelectItem>
                      <SelectItem value="shelf">Shelf</SelectItem>
                      <SelectItem value="refrigerator">Refrigerator</SelectItem>
                      <SelectItem value="freezer">Freezer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-capacity" className="text-sm font-medium">Capacity</label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={currentLocation.capacity || ""}
                    onChange={(e) => setCurrentLocation({ ...currentLocation, capacity: e.target.value })}
                    placeholder="Storage capacity"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditLocation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}