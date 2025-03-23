import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TasksOverview } from "@/components/dashboard/tasks-overview";
import { PendingApprovals } from "@/components/dashboard/pending-approvals";
import { UserActivity } from "@/components/dashboard/user-activity";
import { ExperimentProgress } from "@/components/dashboard/experiment-progress";
import { ComplianceAlerts } from "@/components/dashboard/compliance-alerts";
import { SystemLogs } from "@/components/dashboard/system-logs";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* First row - Key metrics */}
          <TasksOverview />
          <PendingApprovals />
          <UserActivity />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Second row - Progress tracking and compliance */}
          <ExperimentProgress />
          <ComplianceAlerts />
        </div>
        
        <div className="w-full">
          {/* Third row - System logs */}
          <SystemLogs />
        </div>
      </div>
    </DashboardLayout>
  );
}
