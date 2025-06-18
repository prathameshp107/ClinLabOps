import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ExperimentsLoading() {
    return (
        <DashboardLayout>
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-background/80">
                <BackgroundBeams className="opacity-10" />

                <div className="container max-w-full mx-auto p-4 md:p-6 relative z-10">
                    <div className="space-y-8">
                        {/* Header Section with Icon */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <div className="bg-muted p-3 rounded-xl animate-pulse">
                                    <div className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="h-9 w-48 bg-muted rounded-lg animate-pulse" />
                                    <div className="h-5 w-72 bg-muted rounded-lg animate-pulse mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex flex-wrap md:flex-nowrap items-center gap-3 mt-2 md:mt-0">
                                    {/* Stats Cards Skeleton */}
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="bg-card/50 backdrop-blur-sm border border-border/30 shadow-md">
                                            <CardContent className="p-4 flex items-center gap-3">
                                                <div className="bg-muted p-2.5 rounded-full animate-pulse">
                                                    <div className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
                                                    <div className="flex items-baseline gap-1">
                                                        <div className="h-7 w-8 bg-muted rounded-lg animate-pulse" />
                                                        <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="mb-6 bg-muted/50 p-1 rounded-lg">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-9 w-32 bg-muted rounded-md animate-pulse" />
                                ))}
                            </TabsList>

                            {/* Experiment List Skeleton */}
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-2">
                                                <div className="h-6 w-64 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-4 w-48 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                            <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((j) => (
                                                    <div key={j} className="h-8 w-8 rounded-full bg-muted animate-pulse border-2 border-background" />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
                                                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 