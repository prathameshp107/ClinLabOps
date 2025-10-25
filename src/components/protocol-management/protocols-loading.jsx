import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, SlidersHorizontal, LayoutGrid, Table as TableIcon, Globe, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ProtocolsLoading() {
    return (
        <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 pt-6">
            {/* Main Content - Grid View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="relative flex flex-col bg-gradient-to-br from-white/80 via-blue-50/60 to-slate-100/80 dark:from-card/90 dark:via-slate-900/80 dark:to-card/80 rounded-2xl shadow-2xl border-l-8 border-gray-300 border border-border/20 p-6 h-full backdrop-blur-md duration-200 overflow-hidden"
                        style={{ minHeight: 260 }}
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-1/3 mb-4" />

                        {/* Card Content */}
                        <div className="mb-5 space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border/20 my-2" />

                        {/* Card Actions */}
                        <div className="mt-auto flex gap-2 justify-end">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl mt-4 shadow-sm">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-[70px] rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}