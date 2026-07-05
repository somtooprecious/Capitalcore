import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const tickets = await prisma.supportTicket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    tickets: tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      message: t.message,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await req.json()) as { subject?: string; message?: string };
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!subject || !message) {
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.create({
    data: { userId: user.id, subject, message },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Support ticket received",
      body: `We received your ticket: ${subject}`,
      type: "SUPPORT",
    },
  });

  return NextResponse.json({ id: ticket.id, status: ticket.status });
}
