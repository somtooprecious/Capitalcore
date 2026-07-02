import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/platform-config";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true },
  });

  if (!user?.referralCode) {
    const code = generateReferralCode(session.user.email ?? session.user.id);
    user = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
      select: { referralCode: true },
    });
  }

  const [referrals, earnings] = await Promise.all([
    prisma.referral.findMany({
      where: { referrerId: session.user.id },
      include: { referred: { select: { name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.earning.findMany({
      where: { userId: session.user.id, source: "REFERRAL" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return NextResponse.json({
    code: user.referralCode,
    link: `${baseUrl}/signup?ref=${user.referralCode}`,
    totalReferrals: referrals.length,
    totalEarnings: earnings.reduce((s, e) => s + Number(e.amount), 0),
    referrals: referrals.map((r) => ({
      id: r.id,
      name: r.referred.name ?? r.referred.email,
      email: r.referred.email,
      joinedAt: r.referred.createdAt.toISOString(),
    })),
    earnings: earnings.map((e) => ({
      id: e.id,
      amount: Number(e.amount),
      createdAt: e.createdAt.toISOString(),
    })),
  });
}
