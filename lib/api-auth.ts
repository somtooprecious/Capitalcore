import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";

export async function requireApiUser() {
  const user = await getAuthUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse };
  }
  return { user };
}
