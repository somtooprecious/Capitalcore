import { NextResponse } from "next/server";
import { fetchAllQuotes } from "@/lib/crypto-quotes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchAllQuotes();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load quotes" }, { status: 500 });
  }
}
