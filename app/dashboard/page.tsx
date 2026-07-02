import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/dashboard-home";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <DashboardLayout user={{ email: session.user.email }}>
      <DashboardHome
        user={{
          name: session.user.name,
          email: session.user.email,
          kycStatus: session.user.kycStatus ?? "PENDING",
        }}
        data={data}
      />
    </DashboardLayout>
  );
}
