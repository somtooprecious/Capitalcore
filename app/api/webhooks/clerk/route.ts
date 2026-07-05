import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data;
      await syncClerkUserToDatabase({
        id: data.id,
        emailAddresses: (data.email_addresses ?? []).map((e) => ({
          emailAddress: e.email_address,
        })),
        firstName: data.first_name,
        lastName: data.last_name,
        unsafeMetadata: (data.unsafe_metadata ?? {}) as Record<string, unknown>,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[clerk webhook]", error);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
}
