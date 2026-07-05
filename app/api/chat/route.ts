import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId") ?? "general";
  const since = searchParams.get("since");

  const messages = await prisma.chatMessage.findMany({
    where: {
      roomId,
      ...(since ? { createdAt: { gt: new Date(since) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      message: m.message,
      name: m.user?.name ?? (m.guestId ? "Guest" : "Support"),
      createdAt: m.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  const body = (await request.json()) as { message?: string; guestId?: string; roomId?: string };

  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const roomId = body.roomId ?? "general";

  const created = await prisma.chatMessage.create({
    data: {
      userId: user?.id,
      guestId: user?.id ? null : body.guestId ?? `guest-${Date.now()}`,
      sender: user?.id ? "USER" : "GUEST",
      message: body.message.trim(),
      roomId,
    },
  });

  const autoReply =
    body.message.toLowerCase().includes("withdraw") || body.message.toLowerCase().includes("deposit")
      ? await prisma.chatMessage.create({
          data: {
            sender: "SUPPORT",
            message:
              "Thanks for reaching out. For deposits and withdrawals, visit your dashboard or open a support ticket for priority handling.",
            roomId,
          },
        })
      : await prisma.chatMessage.create({
          data: {
            sender: "SUPPORT",
            message: "A CapitalCore support agent will follow up shortly. Average response time is under 2 hours.",
            roomId,
          },
        });

  return NextResponse.json({
    message: {
      id: created.id,
      sender: created.sender,
      message: created.message,
      createdAt: created.createdAt.toISOString(),
      guestId: created.guestId,
    },
    reply: {
      id: autoReply.id,
      sender: autoReply.sender,
      message: autoReply.message,
      createdAt: autoReply.createdAt.toISOString(),
    },
  });
}
