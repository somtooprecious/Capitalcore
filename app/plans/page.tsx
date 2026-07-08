import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { InvestmentPlansWorkspace } from "@/features/dashboard/investment-plans-workspace";

export default async function PlansPage() {
  return requireDashboardSession(<InvestmentPlansWorkspace />);
}
