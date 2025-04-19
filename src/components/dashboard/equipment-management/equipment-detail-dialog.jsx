"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Edit, 
  Download, 
  FileUp,
  Printer,
  QrCode,
  Wrench,
  Tag,
  MapPin,
  User,
  Info,
  History,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function EquipmentDetailDialog({
  open,
  onOpenChange,
  equipment,
  onEdit,
  onUpdateStatus
}) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!equipment) return null

  // Status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Out of Order":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy")
    } catch (error) {
      return "Not specified"
    }
  }

  // Mock maintenance history data
  const maintenanceHistory = [
    { 
      date: new Date(new Date(equipment.lastMaintenanceDate).getTime() - 7776000000).toISOString(), // 90 days before last maintenance
      type: "Preventive",
      technician: "John Smith",
      notes: "Regular calibration and cleaning performed. All systems functioning normally."
    },
    { 
      date: equipment.lastMaintenanceDate,
      type: "Corrective",
      technician: "Sarah Johnson",
      notes: "Replaced faulty sensor. Performed full system diagnostic. Equipment now functioning properly."
    }
  ];

  // Calculate days until next maintenance
  const calculateDaysUntilMaintenance = () => {
    if (!equipment.nextMaintenanceDate) return null;
    
    const today = new Date();
    const nextMaintenance = new Date(equipment.nextMaintenanceDate);
    const diffTime = nextMaintenance - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilMaintenance = calculateDaysUntilMaintenance();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto p-0 gap-0 border border-border/40 shadow-lg rounded-lg bg-background/95 backdrop-blur-sm">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <Badge className={cn("font-medium", getStatusVariant(equipment.status))}>
              {equipment.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <QrCode className="h-3.5 w-3.5" />
                QR Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1"
                onClick={() => {
                  onOpenChange(false)
                  onEdit(equipment)
                }}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold mt-2">
            {equipment.name}
          </DialogTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5 mr-1.5" />
              <span>{equipment.id}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              <span>{equipment.type}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{equipment.location}</span>
            </div>
            {equipment.assignedTo && (
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Assigned to: {equipment.assignedTo}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Equipment Details</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Model:</span>
                        <span className="text-sm font-medium">{equipment.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Serial Number:</span>
                        <span className="text-sm font-medium">{equipment.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Manufacturer:</span>
                        <span className="text-sm font-medium">{equipment.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purchase Date:</span>
                        <span className="text-sm font-medium">{formatDate(equipment.purchaseDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Maintenance Schedule</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Next scheduled maintenance:</span>
                            <span className="text-sm font-medium ml-1">{formatDate(equipment.nextMaintenanceDate)}</span>
                          </div>
                          {daysUntilMaintenance !== null && (
                            <Badge className={cn(
                              daysUntilMaintenance <= 7 ? "bg-red-100 text-red-800 border-red-200" :
                              daysUntilMaintenance <= 30 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                              "bg-green-100 text-green-800 border-green-200"
                            )}>
                              {daysUntilMaintenance <= 0 
                                ? "Overdue" 
                                : `${daysUntilMaintenance} days remaining`}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Maintenance frequency:</span>
                            <span className="text-sm font-medium ml-1">Every 90 days</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">Maintenance provider:</span>
                            <span className="text-sm font-medium ml-1">{equipment.manufacturer} Technical Services</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Status Actions</h3>
                    <div className="bg-muted/30 rounded-lg p-4 grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => onUpdateStatus(equipment.id, "Available")}
                        disabled={equipment.status === "Available"}
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Available
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => onUpdateStatus(equipment.id, "In Use")}
                        disabled={equipment.status === "In Use"}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        In Use
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => onUpdateStatus(equipment.id, "Under Maintenance")}
                        disabled={equipment.status === "Under Maintenance"}
                      >
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Maintenance
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => onUpdateStatus(equipment.id, "Out of Order")}
                        disabled={equipment.status === "Out of Order"}
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        Out of Order
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <div className="bg-muted/30 rounded-lg p-4 min-h-[150px]">
                      <p className="text-sm whitespace-pre-line">
                        {equipment.notes || "No additional notes available for this equipment."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Maintenance History</h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Wrench className="h-3.5 w-3.5" />
                    Log Maintenance
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {maintenanceHistory.map((record, index) => (
                    <div 
                      key={index} 
                      className="border border-border/40 rounded-lg overflow-hidden"
                    >
                      <div className="bg-muted/50 px-4 py-3 flex justify-between items-center border-b border-border/30">
                        <div className="flex items-center">
                          <div className={cn(
                            "w-2 h-2 rounded-full mr-2",
                            record.type === "Preventive" ? "bg-blue-500" : "bg-yellow-500"
                          )}></div>
                          <span className="font-medium">{record.type} Maintenance</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {formatDate(record.date)}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start">
                          <User className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground" />
                          <div>
                            <span className="text-sm text-muted-foreground">Technician:</span>
                            <span className="text-sm font-medium ml-1">{record.technician}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{record.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">Next scheduled maintenance:</span>
                        <span className="text-sm font-medium ml-1">{formatDate(equipment.nextMaintenanceDate)}</span>
                      </div>
                      {daysUntilMaintenance !== null && (
                        <Badge className={cn(
                          daysUntilMaintenance <= 7 ? "bg-red-100 text-red-800 border-red-200" :
                          daysUntilMaintenance <= 30 ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                          "bg-green-100 text-green-800 border-green-200"
                        )}>
                          {daysUntilMaintenance <= 0 
                            ? "Overdue" 
                            : `${daysUntilMaintenance} days remaining`}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">Maintenance frequency:</span>
                        <span className="text-sm font-medium ml-1">Every 90 days</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">Maintenance provider:</span>
                        <span className="text-sm font-medium ml-1">{equipment.manufacturer} Technical Services</span>
                      </div>
                    </div>
                  </div>
                </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Documents & Files</h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileUp className="h-3.5 w-3.5" />
                    Upload File
                  </Button>
                </div>
                
                {equipment.files && equipment.files.length > 0 ? (
                  <div className="space-y-2">
                    {equipment.files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-muted/50 rounded-md p-3 border border-border/30"
                      >
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-md mr-3">
                            <FileUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <span>{(file.size / 1024).toFixed(2)} KB</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(file.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileUp className="h-8 w-8 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No documents available</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        There are no documents attached to this equipment. Upload manuals, certificates, or other relevant documents.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 gap-1">
                        <FileUp className="h-3.5 w-3.5" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}