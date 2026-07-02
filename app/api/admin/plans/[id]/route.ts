import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as {
    name?: string;
    minDeposit?: number;
    roiPercent?: number;
    durationDay?: number;
    isActive?: boolean;
    features?: string[];
  };

  const data: {
    name?: string;
    minDeposit?: number;
    roiPercent?: number;
    durationDay?: number;
    isActive?: boolean;
    features?: string[];
  } = {};

  if (body.name !== undefined) data.name = body.name.trim();
  if (body.minDeposit !== undefined) {
    if (body.minDeposit < 0) return NextResponse.json({ error: "Minimum deposit must be positive." }, { status: 400 });
    data.minDeposit = body.minDeposit;
  }
  if (body.roiPercent !== undefined) {
    if (body.roiPercent < 0) return NextResponse.json({ error: "ROI must be positive." }, { status: 400 });
    data.roiPercent = body.roiPercent;
  }
  if (body.durationDay !== undefined) {
    if (body.durationDay < 1) return NextResponse.json({ error: "Duration must be at least 1 day." }, { status: 400 });
    data.durationDay = body.durationDay;
  }
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.features !== undefined) data.features = body.features.filter(Boolean);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const plan = await prisma.investmentPlan.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      minDeposit: true,
      roiPercent: true,
      durationDay: true,
      isActive: true,
      features: true,
    },
  });

  return NextResponse.json({
    plan: {
      ...plan,
      minDeposit: Number(plan.minDeposit),
      roiPercent: Number(plan.roiPercent),
    },
  });
}
