import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTwoFactorToken } from "@/lib/two-factor";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { secret?: string; token?: string };
  if (!body.secret || !body.token) {
    return NextResponse.json({ error: "Secret and token are required." }, { status: 400 });
  }

  if (!verifyTwoFactorToken(body.secret, body.token)) {
    return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true, twoFactorSecret: body.secret },
  });

  return NextResponse.json({ success: true });
}
