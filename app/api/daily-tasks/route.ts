import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getDailyTaskStatus } from "@/lib/daily-tasks";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const status = await getDailyTaskStatus(user.id);
  return NextResponse.json(status);
}
