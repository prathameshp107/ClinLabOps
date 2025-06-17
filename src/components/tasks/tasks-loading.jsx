import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

export function TasksLoading() {
    return (
        <DashboardLayout>
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
                <div className="p-8 w-full relative z-10">
                    {/* Sticky header/toolbar skeleton */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-background/60 backdrop-blur-xl rounded-2xl p-6 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sticky top-0 z-30">
                        <div>
                            <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
                            <div className="h-5 w-96 bg-muted rounded-lg animate-pulse mt-2" />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72">
                                <div className="h-12 bg-muted rounded-xl animate-pulse" />
                            </div>
                            <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
                            <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
                        </div>
                    </div>

                    {/* Main content skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                        {/* Left column - Tasks Overview skeleton */}
                        <div className="lg:col-span-3">
                            <div className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-24 bg-muted rounded-xl animate-pulse" />
                                            <div className="h-9 w-24 bg-muted rounded-xl animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="h-5 w-72 bg-muted rounded-lg animate-pulse mt-2" />
                                </div>
                                <div className="p-6">
                                    {/* Task list skeleton */}
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 border border-border/50 rounded-xl">
                                                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-5 w-3/4 bg-muted rounded-lg animate-pulse" />
                                                    <div className="h-4 w-1/2 bg-muted rounded-lg animate-pulse" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                                                    <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Sidebar skeletons */}
                        <div className="space-y-8">
                            {/* Upcoming Deadlines skeleton */}
                            <div className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
                                        <div className="h-6 w-40 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-3 bg-muted rounded-lg animate-pulse w-2/3" />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="h-9 w-full bg-muted rounded-xl animate-pulse mt-4" />
                                </div>
                            </div>

                            {/* Team Workload skeleton */}
                            <div className="bg-background/80 backdrop-blur-xl border-border/50 shadow-xl rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
                                        <div className="h-6 w-40 bg-muted rounded-lg animate-pulse" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="h-5 w-32 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-5 w-16 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                            <div className="h-2.5 bg-muted rounded-full animate-pulse" />
                                        </div>
                                    ))}
                                    <div className="h-9 w-full bg-muted rounded-xl animate-pulse mt-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 