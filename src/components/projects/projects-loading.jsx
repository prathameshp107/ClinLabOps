import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

export function ProjectsLoading() {
    return (
        <div className="w-full px-0 py-8">
            {/* Sticky Responsive Header for Mobile */}
            <div className="md:hidden sticky top-0 z-20 bg-[#f4f5f7] px-4 py-3 flex items-center justify-between border-b border-[#e5e7eb]">
                <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
                <div className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
            </div>

            {/* Header */}
            <div className="hidden md:flex flex-row items-center justify-between gap-4 mb-6 px-8">
                <div>
                    <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-96 bg-muted rounded-lg animate-pulse mt-2" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-7 w-28 bg-muted rounded-full animate-pulse" />
                    <div className="h-7 w-32 bg-muted rounded-full animate-pulse" />
                </div>
            </div>

            {/* Project Board/List Skeleton */}
            <div className="w-full px-4 md:px-8">
                {/* View Toggle and Status Filter Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                        <div className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-9 w-24 bg-muted rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Project Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl rounded-2xl overflow-hidden">
                            <div className="p-6">
                                {/* Project Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-2">
                                        <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
                                        <div className="h-4 w-32 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                    <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                                </div>

                                {/* Project Description */}
                                <div className="space-y-2 mb-6">
                                    <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
                                    <div className="h-4 w-3/4 bg-muted rounded-lg animate-pulse" />
                                </div>

                                {/* Project Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-2">
                                        <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                        <div className="h-6 w-12 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                        <div className="h-6 w-12 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                </div>

                                {/* Project Progress */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                        <div className="h-4 w-12 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                    <div className="h-2 bg-muted rounded-full animate-pulse" />
                                </div>

                                {/* Project Team */}
                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((j) => (
                                            <div key={j} className="h-8 w-8 rounded-full bg-muted animate-pulse border-2 border-background" />
                                        ))}
                                    </div>
                                    <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 