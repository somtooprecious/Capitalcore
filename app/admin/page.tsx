import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { getAdminData } from "@/lib/admin-data";
import { ROLES, isOwner, isOwnerEmail } from "@/lib/roles";
import { AdminConsole } from "@/features/admin/admin-console";
import { AdminLayout } from "@/features/admin/admin-layout";

export default async function AdminPage() {
  let user = await getAuthUser();

  if (!user) {
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

  const data = await getAdminData();

  return (
    <AdminLayout user={{ email: user.email }}>
      <AdminConsole data={data} />
    </AdminLayout>
  );
}
