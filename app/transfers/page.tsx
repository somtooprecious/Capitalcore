import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { TransfersWorkspace } from "@/features/dashboard/workspace-pages";

export default async function TransfersPage() {
  return requireDashboardSession(<TransfersWorkspace />);
}
