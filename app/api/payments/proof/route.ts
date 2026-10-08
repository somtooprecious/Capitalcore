import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_PAYMENT_PROOF_TYPES,
  MAX_PAYMENT_PROOF_BYTES,
  mergePaymentMetadata,
} from "@/lib/payment-proof";

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const form = await req.formData();
  const reference = String(form.get("reference") ?? "").trim();
  const paymentId = String(form.get("paymentId") ?? "").trim();
  const file = form.get("file");

  if (!reference && !paymentId) {
    return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a payment screenshot (PNG, JPG, or WebP)." }, { status: 400 });
  }
  if (!ALLOWED_PAYMENT_PROOF_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only PNG, JPG, or WebP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_PAYMENT_PROOF_BYTES) {
    return NextResponse.json({ error: "Screenshot must be 1.5 MB or smaller." }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      userId: user.id,
      OR: [...(paymentId ? [{ id: paymentId }] : []), ...(reference ? [{ reference }] : [])],
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Deposit request not found." }, { status: 404 });
  }
  if (payment.status !== "PENDING") {
    return NextResponse.json({ error: "This deposit is no longer pending." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      metadata: mergePaymentMetadata(payment.metadata, {
        proofOfPayment: {
          dataUrl,
          mimeType: file.type,
          fileName: file.name.slice(0, 120),
          uploadedAt: new Date().toISOString(),
        },
      }) as Prisma.InputJsonValue,
    },
  });

  return NextResponse.json({
    ok: true,
    reference: payment.reference,
    message: "Payment proof uploaded. An admin will review and approve your deposit.",
  });
}
