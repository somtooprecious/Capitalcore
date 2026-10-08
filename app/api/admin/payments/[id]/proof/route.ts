import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentProofFromMetadata } from "@/lib/payment-proof";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    select: { metadata: true, reference: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  const proof = getPaymentProofFromMetadata(payment.metadata);
  if (!proof) {
    return NextResponse.json({ error: "No proof uploaded for this payment." }, { status: 404 });
  }

  return NextResponse.json({
    reference: payment.reference,
    proof,
  });
}
