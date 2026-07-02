import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/require-owner-api";
import { getPlatformConfig, setPlatformConfig } from "@/lib/platform-config";

export async function GET() {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const config = await getPlatformConfig();
  return NextResponse.json(config);
}

export async function PATCH(req: Request) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  await setPlatformConfig(body);
  const config = await getPlatformConfig();
  return NextResponse.json(config);
}
