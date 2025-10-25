import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfileLoading() {
    return (
        <DashboardLayout>
            <div className="container px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-6 sm:p-8 border border-border/40 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <Skeleton className="h-24 w-24 rounded-full" />

                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>

                                <Skeleton className="h-5 w-32" />

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-1 w-1 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-1 w-1 rounded-full" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>

                            <div className="sm:ml-auto">
                                <Skeleton className="h-10 w-24 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Tabs */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 w-full">
                        <Skeleton className="h-12 rounded-lg" />
                    </div>

                    {/* Personal Info Tab Content */}
                    <div className="mt-0">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full rounded-md" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-20 w-full rounded-md" />
                                </div>

                                <div className="flex justify-end">
                                    <Skeleton className="h-10 w-24 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}