import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { ensureWallet } from "@/lib/wallet";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  try {
    await ensureWallet(user.id);
    const data = await getDashboardData(user.id);
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        kycStatus: user.kycStatus ?? "PENDING",
      },
      data,
    });
  } catch (error) {
    console.error("[api/dashboard] Failed to load dashboard:", error);
    return NextResponse.json(
      { error: "Unable to load your dashboard right now. Please try again." },
      { status: 500 },
    );
  }
}
