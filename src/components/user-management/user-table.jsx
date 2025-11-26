"use client"

import { useState, useMemo } from "react"
import { format, parseISO, isValid } from "date-fns"
import { motion } from "framer-motion"
import {
  ChevronUp, ChevronDown, MoreHorizontal, Pencil, Key, Trash, User, ShieldAlert, Shield, Clock,
  CheckCircle, AlertTriangle, UserX, HelpCircle,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArrowUpDown, SlidersHorizontal, CrossIcon, Search
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/tasks/user-avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "../tasks-v2/data-table"
import { userColumns } from "./user-columns"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "../tasks-v2/data-table-view-options"
import { DataTableFacetedFilter } from "../tasks-v2/data-table-faceted-filter"

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Scientist", label: "Scientist" },
  { value: "Technician", label: "Technician" },
  { value: "Reviewer", label: "Reviewer" },
]
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Pending", label: "Pending" },
]
const lastLoginOptions = [
  { value: "recent", label: "Last 7 days" },
  { value: "older", label: "More than 7 days" },
  { value: "never", label: "Never logged in" },
]

function UserTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-muted/30 to-muted/10 border border-border/30 rounded-xl px-4 py-3 shadow-sm">
        <div className="flex flex-1 items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={e => table.getColumn("name")?.setFilterValue(e.target.value)}
              className="h-10 pl-9 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={
              "h-10 border-dashed transition-all whitespace-nowrap" +
              (showFilters ? " bg-primary text-primary-foreground shadow-sm" : " border-border/50 hover:bg-muted/50")
            }
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
          </Button>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters()
                setShowFilters(false)
              }}
              className="h-10 px-3 whitespace-nowrap hover:bg-destructive/10 hover:text-destructive"
            >
              Reset
              <CrossIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-4 shadow-lg">
          {table.getColumn("role") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              title="Role"
              options={roleOptions}
            />
          )}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statusOptions}
            />
          )}
          {/* Last Login filter would require custom logic, so you may want to implement a custom filter UI here if needed */}
        </div>
      )}
    </div>
  )
}

export function UserTable({ users, onUserAction, className }) {
  return (
    <div className={className}>
      <DataTable columns={userColumns(onUserAction)} data={users} Toolbar={UserTableToolbar} hidePagination={true} />
    </div>
  )
}