import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const earnings = await prisma.earning.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const total = earnings.reduce((s, e) => s + Number(e.amount), 0);
  const bySource = earnings.reduce<Record<string, number>>((acc, e) => {
    acc[e.source] = (acc[e.source] ?? 0) + Number(e.amount);
    return acc;
  }, {});

  return NextResponse.json({
    total,
    bySource,
    earnings: earnings.map((e) => ({
      id: e.id,
      amount: Number(e.amount),
      source: e.source,
      reference: e.reference,
      createdAt: e.createdAt.toISOString(),
    })),
  });
}
