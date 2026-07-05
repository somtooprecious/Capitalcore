import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/session";
import { getAdminData } from "@/lib/admin-data";
import { isOwner } from "@/lib/roles";
import { AdminConsole } from "@/features/admin/admin-console";
import { AdminLayout } from "@/features/admin/admin-layout";

export default async function AdminPage() {
  const user = await getAuthUser();
  if (!user || !isOwner(user.role)) {
    redirect("/dashboard");
  }

  const data = await getAdminData();

  return (
    <AdminLayout user={{ email: user.email }}>
      <AdminConsole data={data} />
    </AdminLayout>
  );
}
