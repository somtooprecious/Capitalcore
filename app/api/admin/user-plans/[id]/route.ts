import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as { status?: string };

  if (!body.status || !["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid subscription status." }, { status: 400 });
  }

  const userPlan = await prisma.userPlan.update({
    where: { id },
    data: { status: body.status },
    select: { id: true, status: true, amount: true },
  });

  return NextResponse.json({
    userPlan: { ...userPlan, amount: Number(userPlan.amount) },
  });
}
