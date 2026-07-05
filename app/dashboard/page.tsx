import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/dashboard-home";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/signin");
  }

  const data = await getDashboardData(user.id);

  return (
    <DashboardLayout user={{ email: user.email, role: user.role }}>
      <DashboardHome
        user={{
          name: user.name,
          email: user.email,
          kycStatus: user.kycStatus ?? "PENDING",
        }}
        data={data}
      />
    </DashboardLayout>
  );
}
