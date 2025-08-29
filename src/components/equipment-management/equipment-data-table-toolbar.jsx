"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/tasks-v2/data-table-view-options"

import { DataTableFacetedFilter } from "@/components/tasks-v2/data-table-faceted-filter"

const statuses = [
    {
        value: "Available",
        label: "Available",
    },
    {
        value: "In Use",
        label: "In Use",
    },
    {
        value: "Under Maintenance",
        label: "Under Maintenance",
    },
    {
        value: "Out of Order",
        label: "Out of Order",
    },
]

const types = [
    {
        value: "Analytical",
        label: "Analytical",
    },
    {
        value: "Laboratory",
        label: "Laboratory",
    },
    {
        value: "Storage",
        label: "Storage",
    },
    {
        value: "Imaging",
        label: "Imaging",
    },
]

export function EquipmentDataTableToolbar({ table }) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search equipment..."
                    value={(table.getColumn("name")?.getFilterValue() ?? "")}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-10 w-[200px] lg:w-[300px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                {table.getColumn("type") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("type")}
                        title="Type"
                        options={types}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}