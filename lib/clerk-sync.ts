import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { generateReferralCode } from "@/lib/platform-config";
import { ensureWallet } from "@/lib/wallet";
import { ROLES, isOwnerEmail } from "@/lib/roles";

type ClerkUserPayload = {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  unsafeMetadata?: Record<string, unknown>;
};

export async function syncClerkUserToDatabase(clerkUser: ClerkUserPayload) {
  const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase().trim();
  if (!email) {
    throw new Error("Clerk user is missing an email address.");
  }

  const nameFromClerk = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim();
  const metaFirst =
    typeof clerkUser.unsafeMetadata?.firstName === "string"
      ? clerkUser.unsafeMetadata.firstName.trim()
      : "";
  const metaLast =
    typeof clerkUser.unsafeMetadata?.lastName === "string"
      ? clerkUser.unsafeMetadata.lastName.trim()
      : "";
  const nameFromMeta = [metaFirst, metaLast].filter(Boolean).join(" ").trim();
  const name = nameFromClerk || nameFromMeta || null;
  const emailIsOwner = isOwnerEmail(email);
  const defaultRole = emailIsOwner ? ROLES.OWNER : ROLES.USER;

  let user = await prisma.user.findFirst({
    where: { OR: [{ clerkId: clerkUser.id }, { email }] },
  });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        clerkId: clerkUser.id,
        name: name ?? user.name,
        emailVerified: user.emailVerified ?? new Date(),
        role: user.role === ROLES.OWNER || emailIsOwner ? ROLES.OWNER : user.role,
      },
    });
    await ensureWallet(user.id);
  } else {
    const referralCode = generateReferralCode(email);
    let referredById: string | undefined;
    const ref = clerkUser.unsafeMetadata?.referralCode;
    if (typeof ref === "string" && ref.trim()) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode: ref.trim().toUpperCase() },
        select: { id: true },
      });
      if (referrer) referredById = referrer.id;
    }

    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name,
        referralCode,
        referredById,
        role: defaultRole,
        emailVerified: new Date(),
      },
    });

    await ensureWallet(user.id);

    if (referredById) {
      await prisma.referral.create({
        data: {
          referrerId: referredById,
          referredId: user.id,
          code: String(ref).trim().toUpperCase(),
        },
      });
    }

    await sendWelcomeEmail(email, name).catch((error) => {
      console.error("[clerk-sync] Welcome email failed:", error);
    });
  }

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        role: user.role,
        prismaUserId: user.id,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error("[clerk-sync] Failed to update Clerk metadata:", error);
  }

  return user;
}
