import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { List, Grid, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function TasksLoading() {
    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen w-full bg-background">
                {/* Header with Stats */}
                <div className="w-full border-b">
                    <div className="w-full px-6 py-6">
                        <div className="max-w-[2000px] mx-auto">
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <Skeleton className="h-9 w-32 mb-2" />
                                        <Skeleton className="h-5 w-80" />
                                    </div>
                                    <Skeleton className="h-10 w-32" />
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {/* Total */}
                                    <div className="flex items-center p-4 rounded-lg border bg-background">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                                            <List className="h-4 w-4" />
                                        </div>
                                        <div className="ml-4">
                                            <Skeleton className="h-4 w-12 mb-1" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>

                                    {/* Pending */}
                                    <div className="flex items-center p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div className="ml-4">
                                            <Skeleton className="h-4 w-16 mb-1" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>

                                    {/* In Progress */}
                                    <div className="flex items-center p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                        </div>
                                        <div className="ml-4">
                                            <Skeleton className="h-4 w-20 mb-1" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>

                                    {/* Completed */}
                                    <div className="flex items-center p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="ml-4">
                                            <Skeleton className="h-4 w-20 mb-1" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>

                                    {/* Overdue */}
                                    <div className="flex items-center p-4 rounded-lg border bg-red-50 dark:bg-red-900/20">
                                        <div className="flex-shrink-0 p-3 rounded-full bg-background shadow-sm">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                        </div>
                                        <div className="ml-4">
                                            <Skeleton className="h-4 w-16 mb-1" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full px-6 py-6">
                    <div className="max-w-[2000px] mx-auto">
                        {/* Toolbar */}
                        <div className="flex flex-col space-y-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="flex-1"></div>
                                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                    {/* View Mode Toggle */}
                                    <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 shadow-sm overflow-hidden">
                                        <div className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold bg-primary text-white shadow-md border-r border-gray-200 dark:border-gray-800">
                                            <List className="mr-2 h-4 w-4" />
                                            Table
                                        </div>
                                        <div className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold text-muted-foreground bg-transparent">
                                            <Grid className="mr-2 h-4 w-4" />
                                            Grid
                                        </div>
                                    </div>
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full overflow-x-auto">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-5 w-32" />
                            </div>

                            {/* Table Skeleton */}
                            <div className="border rounded-lg">
                                <div className="p-6">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-6 gap-4 mb-4 pb-4 border-b">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>

                                    {/* Table Rows */}
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="grid grid-cols-6 gap-4 items-center py-3 border-b border-border/50 last:border-b-0">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-48" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-6 w-6 rounded-full" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pagination Skeleton */}
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
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 