import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { DailyTasksWorkspace } from "@/features/dashboard/daily-tasks-workspace";

export default async function DailyTasksPage() {
  return requireDashboardSession(<DailyTasksWorkspace />);
}
