"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DataTablePagination({ table }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl mt-4 shadow-sm">
      <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 lg:gap-6 w-full sm:w-auto">
        <div className="flex items-center space-x-2">
          <p className="text-xs sm:text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-7 sm:h-8 w-[60px] sm:w-[70px] rounded-md text-xs sm:text-sm">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs sm:text-sm">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between xs:justify-center w-full xs:w-auto gap-3">
          <div className="flex w-auto xs:w-[80px] sm:w-[100px] items-center justify-center text-xs sm:text-sm font-medium dark:text-white">
            <span className="hidden xs:inline">Page </span>
            <span className="mx-1 px-1.5 sm:px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold text-xs sm:text-sm">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span className="hidden xs:inline">of {table.getPageCount()}</span>
            <span className="xs:hidden">/ {table.getPageCount()}</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              className="hidden h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-md lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-md"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-md"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-md lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
