import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserManagement } from "@/components/dashboard/user-management"

export default function UserManagementPage() {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  )
}
