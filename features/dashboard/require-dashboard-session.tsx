import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";

export async function requireDashboardSession(children: React.ReactNode) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <DashboardLayout user={{ email: user.email, role: user.role }}>
      {children}
    </DashboardLayout>
  );
}
