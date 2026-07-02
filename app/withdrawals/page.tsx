import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { WithdrawalsWorkspace } from "@/features/dashboard/workspace-pages";

export default async function WithdrawalsPage() {
  return requireDashboardSession(<WithdrawalsWorkspace />);
}
