import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { getAdminData } from "@/lib/admin-data";
import { ROLES, isOwner, isOwnerEmail } from "@/lib/roles";
import { AdminConsole } from "@/features/admin/admin-console";
import { AdminLayout } from "@/features/admin/admin-layout";

export default async function AdminPage() {
  const { userId } = await auth();

  let user = await getAuthUser();

  if (!user) {
    // A signed-in session that failed to load usually means a transient
    // database/network error — show the retry screen instead of bouncing to
    // sign-in (which would look like a broken login loop).
    if (userId) {
      throw new Error(
        "Your account is signed in but could not be loaded. This is usually a temporary connection issue — please try again."
      );
    }
    redirect("/signin");
  }

  // Self-heal: if this account's email is configured as an owner but the stored
  // role is stale (e.g. it was created before OWNER_EMAIL was set), promote it.
  if (!isOwner(user.role) && isOwnerEmail(user.email)) {
    const { prisma } = await import("@/lib/prisma");
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: ROLES.OWNER },
    });
  }

  if (!isOwner(user.role)) {
    redirect("/dashboard");
  }

  let data;
  try {
    data = await getAdminData();
  } catch (error) {
    console.error("[admin] Failed to load admin data:", error);
    throw new Error("Unable to load admin data right now. Please try again in a moment.");
  }

  return (
    <AdminLayout user={{ email: user.email }}>
      <AdminConsole data={data} />
    </AdminLayout>
  );
}
