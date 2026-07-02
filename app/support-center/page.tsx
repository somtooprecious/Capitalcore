import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { SupportWorkspace } from "@/features/dashboard/support-workspace";

export default async function SupportCenterPage() {
  return requireDashboardSession(<SupportWorkspace />);
}
