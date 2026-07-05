import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { placeBrokerOrder } from "@/lib/broker";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const orders = await prisma.tradeOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      symbol: o.symbol,
      side: o.side,
      amount: Number(o.amount),
      price: o.price ? Number(o.price) : null,
      status: o.status,
      mode: o.mode,
      brokerRef: o.brokerRef,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await request.json()) as {
    symbol?: string;
    side?: "BUY" | "SELL";
    amount?: number;
  };

  if (!body.symbol || !body.side || !body.amount || body.amount <= 0) {
    return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
  }

  try {
    const order = await placeBrokerOrder({
      userId: user.id,
      symbol: body.symbol,
      side: body.side,
      amount: body.amount,
      mode: "MANUAL",
    });

    return NextResponse.json({
      order: {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        amount: Number(order.amount),
        price: order.price ? Number(order.price) : null,
        status: order.status,
        brokerRef: order.brokerRef,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
