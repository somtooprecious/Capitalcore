import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { TradingWorkspace } from "@/features/dashboard/workspace-pages";

export default async function TradingPage() {
  return requireDashboardSession(<TradingWorkspace />);
}
