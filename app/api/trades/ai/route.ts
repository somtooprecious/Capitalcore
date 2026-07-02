import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runAiAutoTrade } from "@/lib/broker";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await runAiAutoTrade(session.user.id);
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
