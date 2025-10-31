import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Bell, Shield, Palette, Folder } from "lucide-react"

export function SettingsLoading() {
    return (
        <DashboardLayout>
            <div className="w-full px-4 py-6">
                {/* Page Header */}
                <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>

                {/* Main Section Toggle */}
                <div className="flex gap-2 mb-6">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 flex-1 rounded-md" />
                </div>

                {/* Settings Content */}
                <div className="space-y-6">
                    {/* Navigation Card */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-6 pb-4">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="p-6 pt-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 h-auto bg-muted/50 p-1 rounded-lg">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 p-3 h-auto rounded-md">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <div className="text-center">
                                            <Skeleton className="h-4 w-16 mb-1" />
                                            <Skeleton className="h-3 w-12 mt-1 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Settings Content Card */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-6 w-40 mb-1" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                                <Skeleton className="h-8 w-20 rounded-md" />
                            </div>
                        </div>
                        <div className="p-6">
                            {/* Form fields skeleton */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-20 w-full rounded-md" />
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-8 w-24 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}