import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rowsToCsv, rowsToPdf } from "@/lib/exports";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function GET(request: Request) {
  const owner = await requireOwnerApi();
  if ("error" in owner) return owner.error;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { user: { select: { email: true } } },
  });

  const rows = transactions.map((t) => ({
    date: t.createdAt.toISOString(),
    email: t.user.email,
    type: t.type,
    amount: Number(t.amount),
    status: t.status,
    reference: t.reference,
  }));

  const columns = ["date", "email", "type", "amount", "status", "reference"];

  if (format === "pdf") {
    const buffer = rowsToPdf("CapitalCore Transactions", rows, columns);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="transactions.pdf"',
      },
    });
  }

  const csv = rowsToCsv(rows, columns);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="transactions.csv"',
    },
  });
}
