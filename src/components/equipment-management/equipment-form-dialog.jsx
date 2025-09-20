"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Save, FileUp, X, Calendar } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define form schema with Zod
const equipmentFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  type: z.string({
    required_error: "Please select a type.",
  }),
  serialNumber: z.string().min(1, {
    message: "Serial number is required.",
  }),
  model: z.string().min(1, {
    message: "Model is required.",
  }),
  manufacturer: z.string().min(1, {
    message: "Manufacturer is required.",
  }),
  location: z.string().min(1, {
    message: "Location is required.",
  }),
  purchaseDate: z.date({
    required_error: "Purchase date is required.",
  }),
  lastMaintenanceDate: z.date().optional(),
  nextMaintenanceDate: z.date().optional(),
  status: z.string().default("Available"),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export function EquipmentFormDialog({
  open,
  onOpenChange,
  equipment,
  mode,
  onSubmit
}) {
  const [activeTab, setActiveTab] = useState("basic")
  const [files, setFiles] = useState([])

  // Initialize form with React Hook Form and Zod validation
  const form = useForm({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: "",
      type: "",
      serialNumber: "",
      model: "",
      manufacturer: "",
      location: "",
      purchaseDate: new Date(),
      lastMaintenanceDate: undefined,
      nextMaintenanceDate: undefined,
      status: "Available",
      assignedTo: "",
      notes: "",
    },
  });

  // Reset form when dialog opens/closes or when equipment changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && equipment) {
        form.reset({
          name: equipment.name || "",
          type: equipment.type || "",
          serialNumber: equipment.serialNumber || "",
          model: equipment.model || "",
          manufacturer: equipment.manufacturer || "",
          location: equipment.location || "",
          purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate) : new Date(),
          lastMaintenanceDate: equipment.lastMaintenanceDate ? new Date(equipment.lastMaintenanceDate) : undefined,
          nextMaintenanceDate: equipment.nextMaintenanceDate ? new Date(equipment.nextMaintenanceDate) : undefined,
          status: equipment.status || "Available",
          assignedTo: equipment.assignedTo || "",
          notes: equipment.notes || "",
        });
        setFiles(equipment.files || []);
      } else {
        form.reset({
          name: "",
          type: "",
          serialNumber: "",
          model: "",
          manufacturer: "",
          location: "",
          purchaseDate: new Date(),
          lastMaintenanceDate: undefined,
          nextMaintenanceDate: undefined,
          status: "Available",
          assignedTo: "",
          notes: "",
        });
        setFiles([]);
      }
    }
  }, [open, mode, equipment, form]);

  // Handle form submission
  const handleSubmit = (data) => {
    // Add files and ID (for edit mode) to the data
    const formattedEquipment = {
      ...data,
      files,
      // Include the equipment ID for edit mode
      ...(mode === "edit" && equipment ? { id: equipment.id || equipment._id } : {})
    };

    // Submit the equipment
    onSubmit(formattedEquipment);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  // Handle removing a file
  const handleRemoveFile = (fileToRemove) => {
    setFiles(files.filter(file => file.name !== fileToRemove.name));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <DialogTitle>
            {mode === "create" ? "Add New Equipment" : "Edit Equipment"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new piece of equipment to the laboratory inventory."
              : "Update the details of this equipment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-4">
              <Tabs
                defaultValue="basic"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter equipment name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Analytical">Analytical</SelectItem>
                              <SelectItem value="Clinical">Clinical</SelectItem>
                              <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                              <SelectItem value="Imaging">Imaging</SelectItem>
                              <SelectItem value="Laboratory">Laboratory</SelectItem>
                              <SelectItem value="Monitoring">Monitoring</SelectItem>
                              <SelectItem value="Research">Research</SelectItem>
                              <SelectItem value="Storage">Storage</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter serial number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter manufacturer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Lab A">Lab A</SelectItem>
                              <SelectItem value="Lab B">Lab B</SelectItem>
                              <SelectItem value="Lab C">Lab C</SelectItem>
                              <SelectItem value="Storage Room">Storage Room</SelectItem>
                              <SelectItem value="Main Office">Main Office</SelectItem>
                              <SelectItem value="Research Wing">Research Wing</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchaseDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Purchase Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastMaintenanceDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Last Maintenance Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextMaintenanceDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Next Maintenance Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="In Use">In Use</SelectItem>
                              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                              <SelectItem value="Out of Order">Out of Order</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned To</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter assignee name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Leave blank if not assigned to anyone
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter additional notes or details"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="attachments" className="space-y-4">
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileUp className="h-8 w-8 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Drag and drop files here or click to browse. Upload manuals, certificates, or other relevant documents.
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium mt-2">
                          Browse Files
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted/50 rounded-md p-2 text-sm"
                          >
                            <div className="flex items-center">
                              <div className="bg-primary/10 p-1.5 rounded-md mr-2">
                                <FileUp className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(file)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-border/30 gap-2">
              <div className="flex items-center mr-auto">
                <div className="text-sm text-muted-foreground">
                  {activeTab === "basic" ? "1" : activeTab === "details" ? "2" : "3"} of 3
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {activeTab !== "attachments" ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (activeTab === "basic") setActiveTab("details");
                    else if (activeTab === "details") setActiveTab("attachments");
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Add Equipment" : "Save Changes"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}