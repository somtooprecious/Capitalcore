import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { isOwner } from "@/lib/roles";

export async function requireOwnerApi() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !isOwner(session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}
