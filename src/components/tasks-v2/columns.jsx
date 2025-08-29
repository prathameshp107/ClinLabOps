"use client"

import { CheckCircle2, Clock, AlertCircle, XCircle, ArrowUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { statuses, priorities } from "@/app/tasks/data/schema"

const statusIcons = {
  pending: { icon: Clock, color: "text-amber-500" },
  "in-progress": { icon: AlertCircle, color: "text-blue-500" },
  completed: { icon: CheckCircle2, color: "text-green-500" },
  cancelled: { icon: XCircle, color: "text-red-500" }
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-mono text-sm">{row.getValue("customId") || row.getValue("id")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
    size: 250,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm text-muted-foreground">
        {row.getValue("description")}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
    size: 200,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) return null

      const StatusIcon = statusIcons[status.value]?.icon || AlertCircle
      const statusColor = statusIcons[status.value]?.color || "text-muted-foreground"

      return (
        <div className="flex w-[130px] items-center">
          <StatusIcon className={`mr-2 h-3.5 w-3.5 ${statusColor}`} />
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    size: 130,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) return null

      return (
        <div className="flex items-center w-[100px]">
          {priority.icon && (
            <priority.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"))
      const formattedDate = date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      const today = new Date()
      const isOverdue = date < today && row.getValue("status") !== "completed"

      return (
        <div className="flex items-center w-[110px]">
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {formattedDate}
          </span>
        </div>
      )
    },
    enableSorting: true,
    size: 110,
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo")
      return (
        <div className="flex items-center w-[150px]">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
            <span className="text-xs font-medium">
              {assignedTo?.name?.charAt(0) || '?'}
            </span>
          </div>
          <span className="truncate">{assignedTo?.name || 'Unassigned'}</span>
        </div>
      )
    },
    enableSorting: true,
    size: 150,
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <span className="truncate">{row.getValue("project")?.name || '-'}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      return row.getValue(id)?.name === value
    },
    enableSorting: false,
    enableHiding: true,
    size: 120,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableHiding: false,
  },
]
