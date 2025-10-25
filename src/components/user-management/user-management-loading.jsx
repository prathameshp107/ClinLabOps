import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, PlusCircle, Filter, User, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserManagementLoading() {
    return (
        <DashboardLayout>
            <div className="relative min-h-screen w-full overflow-hidden transition-all duration-300 ease-in-out">
                <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-5 w-96" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Skeleton className="h-12 rounded-lg" />
                            <Skeleton className="h-12 rounded-lg" />
                            <Skeleton className="h-12 rounded-lg" />
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Skeleton className="h-10 w-full pl-10 rounded-lg" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50 dark:bg-gray-800">
                                            <th className="p-4 text-left">
                                                <Skeleton className="h-4 w-20" />
                                            </th>
                                            <th className="p-4 text-left">
                                                <Skeleton className="h-4 w-32" />
                                            </th>
                                            <th className="p-4 text-left">
                                                <Skeleton className="h-4 w-24" />
                                            </th>
                                            <th className="p-4 text-left">
                                                <Skeleton className="h-4 w-16" />
                                            </th>
                                            <th className="p-4 text-left">
                                                <Skeleton className="h-4 w-20" />
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
                                                        <Skeleton className="h-10 w-10 rounded-full" />
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-4 w-32" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
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
        </DashboardLayout>
    )
}