import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { ReferralsWorkspace } from "@/features/dashboard/referrals-workspace";

export default async function ReferralsPage() {
  return requireDashboardSession(<ReferralsWorkspace />);
}
