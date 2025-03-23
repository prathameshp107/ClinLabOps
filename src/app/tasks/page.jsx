"use client"

import { TaskManagement } from "@/components/dashboard/task-management"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function TasksPage() {
  return (
    <DashboardLayout>
      <TaskManagement />
    </DashboardLayout>
  )
}
