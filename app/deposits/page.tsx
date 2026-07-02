import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { DepositsWorkspace } from "@/features/dashboard/workspace-pages";

export default async function DepositsPage() {
  return requireDashboardSession(<DepositsWorkspace />);
}
