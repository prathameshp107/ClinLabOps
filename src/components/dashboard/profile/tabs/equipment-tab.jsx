"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function EquipmentTab({ assignedEquipment }) {
  // Get status badge variant
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

  return (
    <Card className="border border-border/40">
      <CardHeader>
        <CardTitle>Assigned Equipment</CardTitle>
        <CardDescription>
          Equipment and resources currently assigned to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assignedEquipment.length > 0 ? (
          <div className="space-y-4">
            {assignedEquipment.map((equipment, index) => (
              <div 
                key={index} 
                className="border border-border/40 rounded-lg overflow-hidden"
              >
                <div className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{equipment.name}</h3>
                    <p className="text-sm text-muted-foreground">{equipment.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn("font-medium", getStatusVariant(equipment.status))}>
                      {equipment.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-medium">{equipment.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="text-sm font-medium">{equipment.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{equipment.location}</p>
                    </div>
                  </div>
                  
                  {equipment.status === "Under Maintenance" && (
                    <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm mt-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>This equipment is currently under maintenance and will be available on {new Date(equipment.maintenanceEndDate).toLocaleDateString()}.</p>
                    </div>
                  )}
                  
                  {equipment.status === "Out of Order" && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm mt-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>This equipment is currently out of order. Please contact the lab manager for more information.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-lg font-medium">No equipment assigned</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                You currently don't have any equipment assigned to you. Equipment will appear here once assigned.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}