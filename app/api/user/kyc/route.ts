import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireApiUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

async function syncClerkKycStatus(userId: string, kycStatus: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { clerkId: true, role: true },
  });
  if (!dbUser?.clerkId) return;
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(dbUser.clerkId, {
      publicMetadata: { kycStatus, role: dbUser.role, prismaUserId: userId },
    });
  } catch (error) {
    console.error("[kyc] Failed to sync Clerk metadata:", error);
  }
}

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, kycStatus: true },
  });

  return NextResponse.json({
    name: dbUser?.name ?? "",
    email: dbUser?.email ?? "",
    kycStatus: dbUser?.kycStatus ?? "PENDING",
  });
}

export async function PATCH(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = (await request.json()) as { firstName?: string; lastName?: string };
  const firstName = (body.firstName ?? "").trim();
  const lastName = (body.lastName ?? "").trim();

  if (firstName.length < 2) {
    return NextResponse.json({ error: "Enter your first name (at least 2 characters)." }, { status: 400 });
  }
  if (lastName.length < 2) {
    return NextResponse.json({ error: "Enter your last name (at least 2 characters)." }, { status: 400 });
  }

  const name = `${firstName} ${lastName}`;
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name },
    select: { name: true, email: true, kycStatus: true },
  });

  return NextResponse.json({
    name: updated.name,
    email: updated.email,
    kycStatus: updated.kycStatus,
    message: "Profile saved.",
  });
}

export async function POST() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, kycStatus: true },
  });

  if (!dbUser?.email) {
    return NextResponse.json({ error: "Your account has no email on file." }, { status: 400 });
  }
  if (!dbUser.name || dbUser.name.trim().split(/\s+/).length < 2) {
    return NextResponse.json(
      { error: "Save your first and last name in Settings before completing KYC." },
      { status: 400 },
    );
  }

  if (dbUser.kycStatus === "APPROVED") {
    return NextResponse.json({ kycStatus: "APPROVED", message: "KYC is already verified." });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { kycStatus: "APPROVED" },
  });

  await syncClerkKycStatus(user.id, "APPROVED");

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "KYC verified",
      body: "Your identity details were confirmed. Your account now has full access.",
      type: "SYSTEM",
    },
  });

  return NextResponse.json({ kycStatus: "APPROVED", message: "KYC verification completed." });
}
