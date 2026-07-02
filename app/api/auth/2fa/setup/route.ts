import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTwoFactorQrDataUrl, generateTwoFactorSecret } from "@/lib/two-factor";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  if (user?.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA is already enabled." }, { status: 400 });
  }

  const { secret, otpauth } = generateTwoFactorSecret(session.user.email);
  const qrDataUrl = await generateTwoFactorQrDataUrl(otpauth);

  return NextResponse.json({ secret, qrDataUrl });
}
