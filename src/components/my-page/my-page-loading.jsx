import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MyPageLoading() {
    return (
        <DashboardLayout>
            <div className="container mx-auto p-4 space-y-6">
                {/* Header with user info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6 w-full max-w-md">
                    <Skeleton className="h-10 rounded-md" />
                    <Skeleton className="h-10 rounded-md" />
                    <Skeleton className="h-10 rounded-md" />
                </div>

                {/* Overview Tab Content */}
                <div className="space-y-8">
                    {/* Hero section with summary */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-background to-background p-6 border shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-5 w-96" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column - Tasks */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                </div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                </div>
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-1">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-3/4" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Projects and Notifications */}
                        <div className="space-y-6">
                            {/* Projects */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                </div>
                                <div className="space-y-3">
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                </div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex gap-3 p-3 rounded-lg border">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-1">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}