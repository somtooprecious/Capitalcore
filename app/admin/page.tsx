import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminData } from "@/lib/admin-data";
import { isOwner } from "@/lib/roles";
import { AdminConsole } from "@/features/admin/admin-console";
import { AdminLayout } from "@/features/admin/admin-layout";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isOwner(session.user.role)) {
    redirect("/dashboard");
  }

  const data = await getAdminData();

  return (
    <AdminLayout user={{ email: session.user.email }}>
      <AdminConsole data={data} />
    </AdminLayout>
  );
}
