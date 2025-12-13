"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

export function DataTable({
  columns,
  data,
  onRowClick,
  Toolbar,
  onRowSelectionChange,
  selectedRows,
  hidePagination = false,
}) {
  const [rowSelection, setRowSelection] = React.useState(selectedRows || {})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])

  // Update row selection when selectedRows prop changes
  React.useEffect(() => {
    if (selectedRows) {
      setRowSelection(selectedRows);
    }
  }, [selectedRows]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection = updater instanceof Function ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      if (onRowSelectionChange) {
        onRowSelectionChange(newSelection);
      }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const ToolbarComponent = Toolbar || DataTableToolbar

  return (
    <div className="space-y-4">
      <ToolbarComponent table={table} />
      <div className="w-full overflow-hidden rounded-lg border border-border/30 bg-card/40 backdrop-blur-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Table className="min-w-full" style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-950">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnMeta = header.column.columnDef.meta
                    const columnSize = header.column.columnDef.size
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: columnSize ? `${columnSize}px` : 'auto' }}
                        className={`font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900/60 whitespace-nowrap px-2 sm:px-4 py-3 ${columnMeta?.className || ''
                          }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={
                      (idx % 2 === 0
                        ? "bg-white dark:bg-gray-950"
                        : "bg-gray-50 dark:bg-gray-900/40") +
                      " transition-colors hover:bg-primary/5 dark:hover:bg-primary/10" +
                      (onRowClick ? " cursor-pointer" : "")
                    }
                  >
                    {row.getVisibleCells().map((cell, cidx) => {
                      const columnMeta = cell.column.columnDef.meta
                      const columnSize = cell.column.columnDef.size
                      return (
                        <TableCell
                          key={cell.id}
                          style={{ width: columnSize ? `${columnSize}px` : 'auto' }}
                          className={`${cidx === 1 ? "font-semibold text-sm sm:text-[15px]" : "text-xs sm:text-sm"
                            } whitespace-nowrap px-2 sm:px-4 py-3 ${columnMeta?.className || ''}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 sm:h-48 text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-muted-foreground">
                      <svg width="48" height="48" className="sm:w-16 sm:h-16 mb-3 sm:mb-4 opacity-60" fill="none" viewBox="0 0 24 24">
                        <path d="M7 7h10M7 11h6m-6 4h10M5 5v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-base sm:text-lg font-semibold">No tasks found</div>
                      <div className="text-xs sm:text-sm mt-1 px-4 text-center">No tasks match your current filters. Try adjusting your search or filters.</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {!hidePagination && <DataTablePagination table={table} />}
    </div>
  )
}