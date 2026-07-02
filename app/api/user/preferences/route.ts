import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      preferredLanguage: true,
      preferredCurrency: true,
      emailNotifications: true,
      twoFactorEnabled: true,
    },
  });

  return NextResponse.json({ preferences: user });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    preferredLanguage?: string;
    preferredCurrency?: string;
    emailNotifications?: boolean;
  };

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      preferredLanguage: body.preferredLanguage,
      preferredCurrency: body.preferredCurrency,
      emailNotifications: body.emailNotifications,
    },
    select: {
      preferredLanguage: true,
      preferredCurrency: true,
      emailNotifications: true,
      twoFactorEnabled: true,
    },
  });

  return NextResponse.json({ preferences: user });
}
