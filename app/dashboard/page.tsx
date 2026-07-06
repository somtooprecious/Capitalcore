import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { getDashboardData } from "@/lib/dashboard-data";
import { ensureWallet } from "@/lib/wallet";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/dashboard-home";

export default async function DashboardPage() {
  const { userId } = await auth();

  const user = await getAuthUser();
  if (!user) {
    if (userId) {
      throw new Error(
        "Your account is signed in but could not be loaded. Please refresh the page or contact support."
      );
    }
    redirect("/signin");
  }

  await ensureWallet(user.id);

  let data;
  try {
    data = await getDashboardData(user.id);
  } catch (error) {
    console.error("[dashboard] Failed to load dashboard data:", error);
    throw new Error("Unable to load your dashboard right now. Please try again in a moment.");
  }

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
