import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const preferences = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      preferredLanguage: true,
      preferredCurrency: true,
      emailNotifications: true,
    },
  });

  return NextResponse.json({ preferences });
}

export async function PATCH(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await request.json()) as {
    preferredLanguage?: string;
    preferredCurrency?: string;
    emailNotifications?: boolean;
  };

  const preferences = await prisma.user.update({
    where: { id: user.id },
    data: {
      preferredLanguage: body.preferredLanguage,
      preferredCurrency: body.preferredCurrency,
      emailNotifications: body.emailNotifications,
    },
    select: {
      preferredLanguage: true,
      preferredCurrency: true,
      emailNotifications: true,
    },
  });

  return NextResponse.json({ preferences });
}
