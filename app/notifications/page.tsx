import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { NotificationsWorkspace } from "@/features/dashboard/notifications-workspace";

export default async function NotificationsPage() {
  return requireDashboardSession(<NotificationsWorkspace />);
}
