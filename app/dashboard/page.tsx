import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { DashboardPageClient } from "@/features/dashboard/dashboard-page-client";

export default async function DashboardPage() {
  return requireDashboardSession(<DashboardPageClient />);
}
