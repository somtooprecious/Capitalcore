import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";
import { getDashboardData } from "@/lib/dashboard-data";
import { ensureWallet } from "@/lib/wallet";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/dashboard-home";

async function resolveAuthUser() {
  let user = await getAuthUser();
  if (user) return user;

  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    user = await syncClerkUserToDatabase({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
    });
  } catch (error) {
    console.error("[dashboard] Clerk sync retry failed:", error);
  }

  return user ?? (await getAuthUser());
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/signin");
  }

  const user = await resolveAuthUser();
  if (!user) {
    redirect("/signin?reason=account-sync");
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
