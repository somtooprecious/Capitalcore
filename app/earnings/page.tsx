import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { EarningsWorkspace } from "@/features/dashboard/earnings-workspace";

export default async function EarningsPage() {
  return requireDashboardSession(<EarningsWorkspace />);
}
