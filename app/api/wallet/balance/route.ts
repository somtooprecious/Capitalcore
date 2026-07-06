import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getWalletBalanceSummary } from "@/lib/wallet-balance";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const summary = await getWalletBalanceSummary(auth.user.id);
  return NextResponse.json(summary);
}
