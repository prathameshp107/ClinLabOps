import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

export function TaskLoading() {
    return (
        <DashboardLayout>
            <div className="h-full flex flex-col">
                {/* Header skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b gap-4 bg-background/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                        <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
                    </div>
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
                        {/* Left column skeleton */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* AI Insights skeleton */}
                            <div className="rounded-lg border bg-card/50 p-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tabs skeleton */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-10 w-64 bg-muted rounded animate-pulse" />
                                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="rounded-lg border bg-card/50 p-6">
                                    <div className="space-y-4">
                                        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                        <div className="h-32 w-full bg-muted rounded animate-pulse" />
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-12 w-full bg-muted rounded animate-pulse" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column skeleton */}
                        <div className="space-y-6">
                            {/* Assignee card skeleton */}
                            <div className="rounded-lg border bg-card/50 p-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Due date card skeleton */}
                            <div className="rounded-lg border bg-card/50 p-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                                    <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
                                </div>
                            </div>

                            {/* Tags card skeleton */}
                            <div className="rounded-lg border bg-card/50 p-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Related tasks card skeleton */}
                            <div className="rounded-lg border bg-card/50 p-6">
                                <div className="space-y-4">
                                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-16 w-full bg-muted rounded animate-pulse" />
                                        ))}
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