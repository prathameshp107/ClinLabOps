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
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"

export function SuppliersList({ suppliers, onUpdateSupplier, onDeleteSupplier }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    categories: [],
    status: "Active"
  })

  // Handle opening edit dialog
  const openEditDialog = (supplier) => {
    setCurrentSupplier({ ...supplier })
    setIsEditDialogOpen(true)
  }

  // Handle editing a supplier
  const handleEditSupplier = () => {
    if (!currentSupplier) return

    onUpdateSupplier(currentSupplier)
    setIsEditDialogOpen(false)
    setCurrentSupplier(null)
  }

  // Handle adding new supplier
  const handleAddSupplier = () => {
    // Generate a new ID
    const newId = `SUP-${String(suppliers.length + 1).padStart(4, '0')}`

    const supplierToAdd = {
      ...newSupplier,
      id: newId,
      status: "Active"
    }

    onUpdateSupplier(supplierToAdd)
    setIsAddDialogOpen(false)
    setNewSupplier({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      categories: [],
      status: "Active"
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Suppliers</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter the details for the new supplier.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Supplier Name</label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                  <Input
                    id="contactPerson"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    placeholder="Contact person"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
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
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.categories && supplier.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {(!supplier.categories || supplier.categories.length === 0) && (
                        <span className="text-muted-foreground text-xs">No categories</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "Active" ? "success" : "secondary"}>
                      {supplier.status}
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
                        <DropdownMenuItem onClick={() => openEditDialog(supplier)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => onDeleteSupplier(supplier.id)}>
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
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>
              {currentSupplier && `Update information for ${currentSupplier.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Supplier Name</label>
                <Input
                  id="edit-name"
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                  placeholder="Supplier name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-contactPerson" className="text-sm font-medium">Contact Person</label>
                  <Input
                    id="edit-contactPerson"
                    value={currentSupplier.contactPerson || ""}
                    onChange={(e) => setCurrentSupplier({...currentSupplier, contactPerson: e.target.value})}
                    placeholder="Contact person"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="edit-phone"
                    value={currentSupplier.phone || ""}
                    onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentSupplier.email || ""}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                  placeholder="Email address"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}