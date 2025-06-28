"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Search, Filter, Download, FileSpreadsheet, FileText, PlusCircle,
    AlertTriangle, CheckCircle, Clock, X, Pause, Star, StarHalf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export function EnquiryToolbar({ table, onAddEnquiry, onExport }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilters, setActiveFilters] = useState({
        status: { Pending: true, "In Progress": true, Completed: true, Cancelled: true, "On Hold": true },
        priority: { High: true, Medium: true, Low: true },
        assignedTo: { "Dr. Sarah Johnson": true, "Dr. Michael Rodriguez": true, "Dr. Lisa Wong": true, "Dr. James Peterson": true }
    })

    // Count active filters
    const filterCounts = {
        status: Object.values(activeFilters.status).filter(Boolean).length,
        priority: Object.values(activeFilters.priority).filter(Boolean).length,
        assignedTo: Object.values(activeFilters.assignedTo).filter(Boolean).length
    }

    // Update filter function
    const updateFilter = (category, option, value) => {
        setActiveFilters({
            ...activeFilters,
            [category]: {
                ...activeFilters[category],
                [option]: value
            }
        })
    }

    // Reset all filters
    const resetFilters = () => {
        setActiveFilters({
            status: { Pending: true, "In Progress": true, Completed: true, Cancelled: true, "On Hold": true },
            priority: { High: true, Medium: true, Low: true },
            assignedTo: { "Dr. Sarah Johnson": true, "Dr. Michael Rodriguez": true, "Dr. Lisa Wong": true, "Dr. James Peterson": true }
        })
        setSearchQuery("")
    }

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query)
        table.setGlobalFilter(query)
    }

    // Handle export
    const handleExport = (format = "xlsx") => {
        if (onExport) {
            onExport(format)
        } else {
            // Default export functionality
            const exportData = table.getFilteredRowModel().rows.map(row => ({
                "Enquiry ID": row.original.id,
                "Customer Name": row.original.customerName,
                "Company": row.original.companyName,
                "Email": row.original.email,
                "Phone": row.original.phone || "N/A",
                "Subject": row.original.subject,
                "Priority": row.original.priority,
                "Status": row.original.status,
                "Assigned To": row.original.assignedTo,
                "Created": row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "N/A",
                "Documents": row.original.documents?.length || 0,
            }))

            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
            const filename = `enquiries_${timestamp}.${format}`

            if (format === "csv") {
                const headers = Object.keys(exportData[0])
                const csvContent = [
                    headers.join(","),
                    ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(","))
                ].join("\n")

                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                saveAs(blob, filename)
            } else {
                const ws = XLSX.utils.json_to_sheet(exportData)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, ws, "Enquiries")
                const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
                saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename)
            }

            toast({
                title: "Export successful",
                description: `${exportData.length} enquiries exported to ${filename}`,
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search enquiries..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                                {Object.values(filterCounts).some(count => count < Object.keys(activeFilters[Object.keys(activeFilters)[Object.values(filterCounts).indexOf(count)]]).length) && (
                                    <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal">
                                        {Object.values(filterCounts).reduce((acc, count, index) => {
                                            const key = Object.keys(activeFilters)[index]
                                            const total = Object.keys(activeFilters[key]).length
                                            return acc + (total - count)
                                        }, 0)}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter Enquiries</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    Status {filterCounts.status < Object.keys(activeFilters.status).length && `(${filterCounts.status}/${Object.keys(activeFilters.status).length})`}
                                </DropdownMenuLabel>
                                {Object.keys(activeFilters.status).map(status => (
                                    <DropdownMenuItem key={status} onSelect={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`status-${status}`}
                                                checked={activeFilters.status[status]}
                                                onChange={(e) => updateFilter("status", status, e.target.checked)}
                                                className="rounded border-input"
                                            />
                                            <label htmlFor={`status-${status}`} className="flex-1 cursor-pointer">
                                                {status}
                                            </label>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    Priority {filterCounts.priority < Object.keys(activeFilters.priority).length && `(${filterCounts.priority}/${Object.keys(activeFilters.priority).length})`}
                                </DropdownMenuLabel>
                                {Object.keys(activeFilters.priority).map(priority => (
                                    <DropdownMenuItem key={priority} onSelect={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`priority-${priority}`}
                                                checked={activeFilters.priority[priority]}
                                                onChange={(e) => updateFilter("priority", priority, e.target.checked)}
                                                className="rounded border-input"
                                            />
                                            <label htmlFor={`priority-${priority}`} className="flex-1 cursor-pointer">
                                                {priority}
                                            </label>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    Assigned To {filterCounts.assignedTo < Object.keys(activeFilters.assignedTo).length && `(${filterCounts.assignedTo}/${Object.keys(activeFilters.assignedTo).length})`}
                                </DropdownMenuLabel>
                                {Object.keys(activeFilters.assignedTo).map(assignee => (
                                    <DropdownMenuItem key={assignee} onSelect={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`assignee-${assignee}`}
                                                checked={activeFilters.assignedTo[assignee]}
                                                onChange={(e) => updateFilter("assignedTo", assignee, e.target.checked)}
                                                className="rounded border-input"
                                            />
                                            <label htmlFor={`assignee-${assignee}`} className="flex-1 cursor-pointer">
                                                {assignee}
                                            </label>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center"
                                onClick={resetFilters}
                            >
                                Reset all filters
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport("xlsx")} className="gap-2">
                                <FileSpreadsheet className="h-4 w-4" />
                                Export as Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
                                <FileText className="h-4 w-4" />
                                Export as CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={onAddEnquiry} className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Enquiry
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                    {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} enquiries
                </span>
            </div>
        </div>
    )
} 