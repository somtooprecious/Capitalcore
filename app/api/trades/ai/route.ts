import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { runAiAutoTrade } from "@/lib/broker";

export async function POST() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  try {
    const order = await runAiAutoTrade(user.id);
    return NextResponse.json({
      order: {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        amount: Number(order.amount),
        price: order.price ? Number(order.price) : null,
        status: order.status,
        mode: order.mode,
        brokerRef: order.brokerRef,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI trade failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
