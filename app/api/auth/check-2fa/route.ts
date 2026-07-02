import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ required: false });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { twoFactorEnabled: true },
  });

  return NextResponse.json({ required: Boolean(user?.twoFactorEnabled) });
}
