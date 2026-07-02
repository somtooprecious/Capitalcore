import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/require-owner-api";
import { processWithdrawal } from "@/lib/withdrawals";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as { status?: string };

  if (!body.status || !["APPROVED", "REJECTED", "COMPLETED"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  try {
    await processWithdrawal(id, body.status as "APPROVED" | "REJECTED" | "COMPLETED", auth.session.user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not process withdrawal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
