import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const earnings = await prisma.earning.findMany({
    where: { userId: user.id },
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
