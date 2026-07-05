import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import { isOwner } from "@/lib/roles";

export async function requireOwnerApi() {
  const user = await getAuthUser();
  if (!user || !isOwner(user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, session: { user: { id: user.id, email: user.email, role: user.role } } };
}
