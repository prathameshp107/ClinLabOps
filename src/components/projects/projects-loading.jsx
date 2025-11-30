import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

export function ProjectsLoading() {
    return (
        <div className="w-full min-h-screen bg-background/50">
            {/* Sticky Responsive Header for Mobile */}
            <div className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-border/50">
                <div className="space-y-1">
                    <div className="h-6 w-24 bg-muted/50 rounded-lg animate-pulse" />
                    <div className="h-3 w-32 bg-muted/30 rounded-lg animate-pulse" />
                </div>
                <div className="h-9 w-20 bg-muted/50 rounded-xl animate-pulse" />
            </div>

            <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
                {/* Header */}
                <div className="hidden md:flex flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-muted/50 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-5 w-96 bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-card/50 p-1.5 rounded-full border border-border/50">
                        <div className="h-9 w-32 bg-muted/50 rounded-full animate-pulse" />
                        <div className="h-9 w-36 bg-muted/50 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Categories Skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-7 w-32 bg-muted/50 rounded-lg animate-pulse" />
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted/50 animate-pulse" />
                            <div className="h-8 w-8 rounded-full bg-muted/50 animate-pulse" />
                        </div>
                    </div>
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[330px] h-[140px] rounded-2xl bg-card/50 border border-border/50 p-6 animate-pulse">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-muted/50" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-6 w-3/4 bg-muted/50 rounded-lg" />
                                        <div className="h-4 w-full bg-muted/30 rounded-lg" />
                                        <div className="h-4 w-2/3 bg-muted/30 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Board/List Skeleton */}
                <div className="space-y-6">
                    {/* Controls Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
                            <div className="h-6 w-20 bg-muted/30 rounded-lg animate-pulse" />
                        </div>
                        <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="flex gap-8 border-b border-border/50 pb-0">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 w-24 bg-muted/30 rounded-t-lg animate-pulse" />
                        ))}
                    </div>

                    {/* Filter Bar Skeleton */}
                    <div className="h-20 w-full bg-card/50 rounded-xl border border-border/50 animate-pulse" />

                    {/* Project Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden h-[300px] animate-pulse">
                                <div className="h-1 w-full bg-muted/30" />
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3 w-full">
                                            <div className="h-10 w-10 rounded-xl bg-muted/50 flex-shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-5 w-3/4 bg-muted/50 rounded-lg" />
                                                <div className="h-3 w-1/2 bg-muted/30 rounded-lg" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-5 w-16 bg-muted/30 rounded-md" />
                                        <div className="h-5 w-16 bg-muted/30 rounded-md" />
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="h-3 w-full bg-muted/30 rounded-lg" />
                                        <div className="h-3 w-5/6 bg-muted/30 rounded-lg" />
                                    </div>
                                    <div className="pt-4 mt-auto flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            <div className="h-7 w-7 rounded-full bg-muted/50 border-2 border-card" />
                                            <div className="h-7 w-7 rounded-full bg-muted/50 border-2 border-card" />
                                            <div className="h-7 w-7 rounded-full bg-muted/50 border-2 border-card" />
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-muted/30" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}