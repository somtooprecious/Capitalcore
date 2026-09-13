import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";
import { getAuthUser } from "@/lib/session";

async function resolveApiUser() {
  let user = await getAuthUser();
  if (user) return user;

  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    user = await syncClerkUserToDatabase({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
    });
  } catch (error) {
    console.error("[api-auth] Clerk sync retry failed:", error);
  }

  return user ?? (await getAuthUser());
}

export async function requireApiUser() {
  const user = await resolveApiUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) as NextResponse };
  }
  return { user };
}
