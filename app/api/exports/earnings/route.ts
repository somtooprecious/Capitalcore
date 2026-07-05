import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { rowsToCsv, rowsToPdf } from "@/lib/exports";

export async function GET(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";

  const earnings = await prisma.earning.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows = earnings.map((e) => ({
    date: e.createdAt.toISOString(),
    amount: Number(e.amount),
    source: e.source,
    reference: e.reference ?? "",
  }));

  const columns = ["date", "amount", "source", "reference"];

  if (format === "pdf") {
    const buffer = rowsToPdf("CapitalCore Earnings", rows, columns);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="earnings.pdf"',
      },
    });
  }

  const csv = rowsToCsv(rows, columns);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="earnings.csv"',
    },
  });
}
