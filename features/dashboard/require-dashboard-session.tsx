import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";

export async function requireDashboardSession(children: React.ReactNode) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  return (
    <DashboardLayout user={{ email: session.user.email, role: session.user.role }}>
      {children}
    </DashboardLayout>
  );
}
