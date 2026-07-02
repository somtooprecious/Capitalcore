import { NextResponse } from "next/server";
import { getPlatformConfig } from "@/lib/platform-config";

export async function GET() {
  const config = await getPlatformConfig();
  return NextResponse.json({
    platformName: config.platformName,
    announcementBanner: config.announcementBanner,
    maintenanceMode: config.maintenanceMode,
    depositMin: config.depositMin,
    depositMax: config.depositMax,
    withdrawalMin: config.withdrawalMin,
    withdrawalMax: config.withdrawalMax,
  });
}
