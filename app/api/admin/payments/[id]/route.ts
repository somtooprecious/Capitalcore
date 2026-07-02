import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { approvePayment, rejectPayment } from "@/lib/admin-actions";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as { status?: string };

  if (!body.status || !["COMPLETED", "REJECTED", "PENDING"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }

  try {
    if (body.status === "COMPLETED") {
      await approvePayment(id);
    } else if (body.status === "REJECTED") {
      await rejectPayment(id);
    } else {
      await prisma.payment.update({ where: { id }, data: { status: "PENDING" } });
      await prisma.transaction.updateMany({
        where: { reference: (await prisma.payment.findUnique({ where: { id } }))?.reference ?? "" },
        data: { status: "PENDING" },
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
      select: { id: true, status: true, amount: true, reference: true },
    });

    return NextResponse.json({
      payment: payment
        ? { ...payment, amount: Number(payment.amount) }
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update payment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
