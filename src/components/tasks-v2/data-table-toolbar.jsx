"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { statuses, priorities } from "@/app/tasks/data/schema"

// Example static project list (replace with dynamic if available)
const projectOptions = [
  { value: "Cell Culture", label: "Cell Culture" },
  { value: "DNA Sequencing", label: "DNA Sequencing" },
  { value: "Chemical Analysis", label: "Chemical Analysis" },
]

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showFilters, setShowFilters] = useState(false)
  const [projectSearch, setProjectSearch] = useState("")

  // Filtered project options for search
  const filteredProjects = projectOptions.filter(opt =>
    opt.label.toLowerCase().includes(projectSearch.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 mb-2 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-1 gap-2 sm:gap-3 sm:items-center">
          <Input
            placeholder="Search tasks..."
            value={(table.getColumn("title")?.getFilterValue() ?? "")}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-9 sm:h-10 w-full sm:w-[180px] lg:w-[300px] text-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={
                "h-9 sm:h-10 px-3 text-xs sm:text-sm border-dashed transition-colors flex-1 sm:flex-none" +
                (showFilters ? " bg-primary/10 text-primary border-primary" : "")
              }
            >
              <SlidersHorizontal className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Filters
            </Button>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters()
                  setShowFilters(false)
                }}
                className="h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
              >
                Reset
                <Cross2Icon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-lg sm:rounded-xl border bg-background/70 p-3 sm:p-4 shadow-lg">
          {/* Status Filter */}
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {/* Priority Filter */}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
          {/* Project Filter - same structure as others, with checkboxes */}
          {table.getColumn("project") && (
            <DataTableFacetedFilter
              column={table.getColumn("project")}
              title="Project"
              options={projectOptions}
            />
          )}
        </div>
      )}
    </div>
  )
}
