import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getPlansOverview } from "@/lib/investments";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  try {
    const overview = await getPlansOverview(user.id);
    return NextResponse.json(overview);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load plans.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
