import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function TaskNotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="rounded-full bg-muted/30 p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Task Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The task you're looking for doesn't exist or may have been deleted.
        </p>
        <Button asChild size="lg">
          <Link href="/tasks">
            Return to Task List
          </Link>
        </Button>
      </div>
    </DashboardLayout>
  )
}