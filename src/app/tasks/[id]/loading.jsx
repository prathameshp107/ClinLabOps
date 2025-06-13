import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function TaskLoading() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 w-full">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <div className="space-y-2">
                    <div className="flex gap-2 items-start">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="flex gap-2 items-start">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}