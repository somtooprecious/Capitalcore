import { requireDashboardSession } from "@/features/dashboard/require-dashboard-session";
import { SettingsWorkspace } from "@/features/dashboard/workspace-pages";

export default async function SettingsPage() {
  return requireDashboardSession(<SettingsWorkspace />);
}
