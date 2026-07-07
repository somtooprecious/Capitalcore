import { auth, currentUser } from "@clerk/nextjs/server";
import { syncClerkUserToDatabase } from "@/lib/clerk-sync";
import { ensureWallet } from "@/lib/wallet";
import { ROLES, isOwner, isOwnerEmail } from "@/lib/roles";
import type { User } from "@prisma/client";

async function promoteOwnerIfNeeded(user: User): Promise<User> {
  if (isOwner(user.role) || !isOwnerEmail(user.email)) {
    return user;
  }

  const { prisma } = await import("@/lib/prisma");
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: ROLES.OWNER },
  });

  const clerkUser = await currentUser();
  if (clerkUser) {
    try {
      await syncClerkUserToDatabase({
        id: clerkUser.id,
        emailAddresses: clerkUser.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
      });
    } catch (error) {
      console.error("[auth] Owner metadata sync failed:", error);
    }
  }

  return updated;
}

export async function getAuthUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const { prisma } = await import("@/lib/prisma");

  const existingByClerkId = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existingByClerkId) {
    await ensureWallet(existingByClerkId.id);
    return promoteOwnerIfNeeded(existingByClerkId);
  }

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase().trim();

  if (email) {
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      const linked = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          clerkId: userId,
          name:
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
            existingByEmail.name,
          emailVerified: existingByEmail.emailVerified ?? new Date(),
          role:
            existingByEmail.role === ROLES.OWNER || isOwnerEmail(email)
              ? ROLES.OWNER
              : existingByEmail.role,
        },
      });
      await ensureWallet(linked.id);

      try {
        await syncClerkUserToDatabase({
          id: clerkUser.id,
          emailAddresses: clerkUser.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          unsafeMetadata: clerkUser.unsafeMetadata as Record<string, unknown>,
        });
      } catch (error) {
        console.error("[auth] Clerk metadata sync failed for linked user:", error);
      }

      return linked;
    }
  }

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

    const fallback = await prisma.user.findFirst({
      where: {
        OR: [{ clerkId: userId }, ...(email ? [{ email }] : [])],
      },
    });

    if (!fallback) return null;
    return promoteOwnerIfNeeded(fallback);
  }
}

export async function requireAuthUser(): Promise<User | null> {
  return getAuthUser();
}
