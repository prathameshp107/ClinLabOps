"use client"

import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  CheckCircle2,
  Zap,
  Wrench,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

export function EquipmentRowActions({
  row,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
}) {
  const equipment = row.original

  const statusOptions = [
    { value: "Available", label: "Available", icon: <CheckCircle2 className="h-4 w-4" /> },
    { value: "In Use", label: "In Use", icon: <Zap className="h-4 w-4" /> },
    { value: "Under Maintenance", label: "Under Maintenance", icon: <Wrench className="h-4 w-4" /> },
    { value: "Out of Order", label: "Out of Order", icon: <XCircle className="h-4 w-4" /> },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onView(equipment)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onEdit(equipment)
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Equipment
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Wrench className="mr-2 h-4 w-4" />
            Update Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdateStatus(equipment.id, status.value)
                }}
                className={equipment.status === status.value ? "bg-accent" : ""}
              >
                {status.icon}
                <span className="ml-2">{status.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            onDelete(equipment.id)
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Equipment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 