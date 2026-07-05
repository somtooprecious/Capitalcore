import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/platform-config";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCode: true },
  });

  if (!dbUser?.referralCode) {
    const code = generateReferralCode(user.email ?? user.id);
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code },
      select: { referralCode: true },
    });
  }

  const [referrals, earnings] = await Promise.all([
    prisma.referral.findMany({
      where: { referrerId: user.id },
      include: { referred: { select: { name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.earning.findMany({
      where: { userId: user.id, source: "REFERRAL" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return NextResponse.json({
    code: dbUser.referralCode,
    link: `${baseUrl}/signup?ref=${dbUser.referralCode}`,
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
