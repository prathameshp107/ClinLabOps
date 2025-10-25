import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Users, MapPin } from "lucide-react"

export function InventoryLoading() {
    return (
        <DashboardLayout>
            <div className="w-full px-4 md:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Skeleton className="h-10 w-10 mr-3 rounded-md" />
                            <Skeleton className="h-10 w-64" />
                        </div>
                        <Skeleton className="h-5 w-96" />
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8">
                        <div className="overflow-x-auto">
                            <div className="mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border inline-flex min-w-full md:grid md:grid-cols-3 gap-1">
                                <div className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg flex items-center">
                                    <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                                    <Skeleton className="h-4 w-20 mr-2" />
                                    <Skeleton className="h-5 w-8 rounded-full" />
                                </div>
                                <div className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg flex items-center">
                                    <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                                    <Skeleton className="h-4 w-20 mr-2" />
                                    <Skeleton className="h-5 w-8 rounded-full" />
                                </div>
                                <div className="flex-shrink-0 text-sm md:text-base px-3 md:px-6 py-3 rounded-lg flex items-center">
                                    <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                                    <Skeleton className="h-4 w-24 mr-2" />
                                    <Skeleton className="h-5 w-8 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl p-3 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <div className="relative flex-1 max-w-md">
                                    <Skeleton className="h-10 w-full pl-10 rounded-lg" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-24 rounded-lg" />
                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="border rounded-lg">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-24" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-20" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-16" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-20" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-16" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-24" />
                                                </th>
                                                <th className="p-4 text-left">
                                                    <Skeleton className="h-4 w-16" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(5)].map((_, i) => (
                                                <tr key={i} className="border-b">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <Skeleton className="h-4 w-4 rounded" />
                                                            <Skeleton className="h-4 w-32" />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Skeleton className="h-4 w-24" />
                                                    </td>
                                                    <td className="p-4">
                                                        <Skeleton className="h-6 w-16 rounded-full" />
                                                    </td>
                                                    <td className="p-4">
                                                        <Skeleton className="h-4 w-20" />
                                                    </td>
                                                    <td className="p-4">
                                                        <Skeleton className="h-4 w-16" />
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-8 w-8 rounded-full" />
                                                            <Skeleton className="h-4 w-24" />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-1">
                                                            <Skeleton className="h-8 w-8 rounded-md" />
                                                            <Skeleton className="h-8 w-8 rounded-md" />
                                                            <Skeleton className="h-8 w-8 rounded-md" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}