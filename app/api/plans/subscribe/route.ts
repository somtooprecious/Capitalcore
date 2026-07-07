import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { subscribeToPlan } from "@/lib/investments";

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let planId: string | undefined;
  try {
    const body = (await req.json()) as { planId?: string };
    planId = body.planId;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!planId) {
    return NextResponse.json({ error: "Please choose a plan." }, { status: 400 });
  }

  try {
    const result = await subscribeToPlan(user.id, planId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not activate plan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
