import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";
import { getAuthUser } from "@/lib/session";
import { DashboardLayout } from "@/features/dashboard/dashboard-layout";

async function resolveDashboardUser() {
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
    console.error("[dashboard-session] Clerk sync retry failed:", error);
  }

  return user ?? (await getAuthUser());
}

export async function requireDashboardSession(children: React.ReactNode) {
  const user = await resolveDashboardUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <DashboardLayout user={{ email: user.email, role: user.role }}>
      {children}
    </DashboardLayout>
  );
}
