import { auth, currentUser } from "@clerk/nextjs/server";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";
import type { User } from "@prisma/client";

export async function getAuthUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const { prisma } = await import("@/lib/prisma");
  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    return await syncClerkUserToDatabase({
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
    });
  } catch (error) {
    console.error("[auth] Failed to sync Clerk user:", error);
    return null;
  }
}

export async function requireAuthUser(): Promise<User | null> {
  return getAuthUser();
}
