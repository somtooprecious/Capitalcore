import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { completeDailyTask } from "@/lib/daily-tasks";

export async function POST() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  try {
    const result = await completeDailyTask(user.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not complete task.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
