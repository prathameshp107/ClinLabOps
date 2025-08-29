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
import { Edit, MoreHorizontal, Plus, Trash2, Phone, Mail, MapPin, User, Building2, Star, Clock } from "lucide-react"

export function SuppliersList({ suppliers, onUpdateSupplier, onDeleteSupplier }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    categories: [],
    rating: 5,
    status: "Active",
    notes: ""
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
      address: "",
      website: "",
      categories: [],
      rating: 5,
      status: "Active",
      notes: ""
    })
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 md:p-6 border border-purple-100 dark:border-purple-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 md:h-6 md:w-6" />
              Supplier Management
            </h2>
            <p className="text-purple-600 dark:text-purple-300 mt-1 text-sm md:text-base">
              Manage your laboratory suppliers and vendor relationships
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 h-10 md:h-12">
                <Plus className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Add New Supplier</span>
                <span className="sm:hidden">Add Supplier</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Supplier</DialogTitle>
                <DialogDescription>
                  Register a new supplier with complete contact and business information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Company Name *</label>
                      <Input
                        id="name"
                        value={newSupplier.name}
                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                        placeholder="Enter company name"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                      <Input
                        id="contactPerson"
                        value={newSupplier.contactPerson}
                        onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                        placeholder="Primary contact name"
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        value={newSupplier.email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                        placeholder="contact@supplier.com"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                      <Input
                        id="phone"
                        value={newSupplier.phone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="border-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">Website</label>
                      <Input
                        id="website"
                        value={newSupplier.website}
                        onChange={(e) => setNewSupplier({ ...newSupplier, website: e.target.value })}
                        placeholder="https://www.supplier.com"
                        className="border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="rating" className="text-sm font-medium">Rating</label>
                      <Select
                        value={newSupplier.rating.toString()}
                        onValueChange={(value) => setNewSupplier({ ...newSupplier, rating: parseInt(value) })}
                      >
                        <SelectTrigger className="border-2">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                          <SelectItem value="4">4 Stars - Good</SelectItem>
                          <SelectItem value="3">3 Stars - Average</SelectItem>
                          <SelectItem value="2">2 Stars - Poor</SelectItem>
                          <SelectItem value="1">1 Star - Very Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Textarea
                      id="address"
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                      placeholder="Full business address"
                      className="border-2"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                    <Textarea
                      id="notes"
                      value={newSupplier.notes}
                      onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                      placeholder="Additional notes about this supplier..."
                      className="border-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSupplier} className="bg-purple-600 hover:bg-purple-700">Add Supplier</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-600">Total Suppliers</div>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100">
            <div className="text-sm font-medium text-green-600">Active</div>
            <div className="text-2xl font-bold">{suppliers.filter(s => s.status === 'Active').length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100">
            <div className="text-sm font-medium text-gray-600">Inactive</div>
            <div className="text-2xl font-bold">{suppliers.filter(s => s.status !== 'Active').length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-100">
            <div className="text-sm font-medium text-yellow-600">Avg Rating</div>
            <div className="text-2xl font-bold">
              {suppliers.length > 0 ? (suppliers.reduce((sum, s) => sum + (s.rating || 5), 0) / suppliers.length).toFixed(1) : '5.0'}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Suppliers Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
                <TableHead className="w-[120px] py-4">
                  <span className="font-semibold">Supplier ID</span>
                </TableHead>
                <TableHead className="min-w-[250px] py-4">
                  <span className="font-semibold">Company Details</span>
                </TableHead>
                <TableHead className="min-w-[200px] py-4">
                  <span className="font-semibold">Contact Information</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Categories</span>
                </TableHead>
                <TableHead className="py-4">
                  <span className="font-semibold">Rating</span>
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
              {suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                  <TableRow key={supplier.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-25 dark:bg-gray-850'}`}>
                    <TableCell className="font-mono text-sm py-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md inline-block">
                        {supplier.id}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{supplier.name}</span>
                        </div>
                        {supplier.contactPerson && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{supplier.contactPerson}</span>
                          </div>
                        )}
                        {supplier.website && (
                          <div className="text-xs">
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-2">
                        {supplier.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-blue-500" />
                            <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:text-blue-800">
                              {supplier.email}
                            </a>
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-green-500" />
                            <a href={`tel:${supplier.phone}`} className="text-green-600 hover:text-green-800">
                              {supplier.phone}
                            </a>
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mt-0.5" />
                            <span className="line-clamp-2">{supplier.address}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories && supplier.categories.length > 0 ? (
                          supplier.categories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs bg-gray-100 px-2 py-1 rounded">No categories</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < (supplier.rating || 5)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{supplier.rating || 5}/5</span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        variant={supplier.status === "Active" ? "default" : "secondary"}
                        className={`${supplier.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                          } font-medium`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${supplier.status === "Active" ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                        {supplier.status}
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
                          <DropdownMenuItem onClick={() => openEditDialog(supplier)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Supplier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Send Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Phone className="mr-2 h-4 w-4" />
                            <span>Call Supplier</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => onDeleteSupplier(supplier.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Supplier</span>
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
                      <Building2 className="h-12 w-12 text-gray-300" />
                      <div>
                        <p className="text-lg font-medium">No suppliers found</p>
                        <p className="text-sm">Add your first supplier to get started</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Supplier Information</DialogTitle>
            <DialogDescription>
              {currentSupplier && `Update information for ${currentSupplier.name}`}
            </DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-6 py-6 max-h-[60vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">Company Name *</label>
                    <Input
                      id="edit-name"
                      value={currentSupplier.name}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                      placeholder="Company name"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-contactPerson" className="text-sm font-medium">Contact Person</label>
                    <Input
                      id="edit-contactPerson"
                      value={currentSupplier.contactPerson || ""}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, contactPerson: e.target.value })}
                      placeholder="Contact person name"
                      className="border-2"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-email" className="text-sm font-medium">Email Address</label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={currentSupplier.email || ""}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })}
                      placeholder="contact@supplier.com"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-phone" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="edit-phone"
                      value={currentSupplier.phone || ""}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="border-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-website" className="text-sm font-medium">Website</label>
                    <Input
                      id="edit-website"
                      value={currentSupplier.website || ""}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, website: e.target.value })}
                      placeholder="https://www.supplier.com"
                      className="border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-rating" className="text-sm font-medium">Rating</label>
                    <Select
                      value={(currentSupplier.rating || 5).toString()}
                      onValueChange={(value) => setCurrentSupplier({ ...currentSupplier, rating: parseInt(value) })}
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        <SelectItem value="4">4 Stars - Good</SelectItem>
                        <SelectItem value="3">3 Stars - Average</SelectItem>
                        <SelectItem value="2">2 Stars - Poor</SelectItem>
                        <SelectItem value="1">1 Star - Very Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-address" className="text-sm font-medium">Address</label>
                  <Textarea
                    id="edit-address"
                    value={currentSupplier.address || ""}
                    onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })}
                    placeholder="Full business address"
                    className="border-2"
                    rows={2}
                  />
                </div>
              </div>

              {/* Status and Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Status & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                    <Select
                      value={currentSupplier.status || "Active"}
                      onValueChange={(value) => setCurrentSupplier({ ...currentSupplier, status: value })}
                    >
                      <SelectTrigger className="border-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="edit-notes"
                    value={currentSupplier.notes || ""}
                    onChange={(e) => setCurrentSupplier({ ...currentSupplier, notes: e.target.value })}
                    placeholder="Additional notes about this supplier..."
                    className="border-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSupplier} className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}