import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";
import { ROLES } from "@/lib/roles";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireOwnerApi();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = (await req.json()) as {
    name?: string;
    role?: string;
    kycStatus?: string;
  };

  const data: { name?: string; role?: string; kycStatus?: string } = {};
  if (body.name !== undefined) data.name = body.name.trim() || undefined;
  if (body.role !== undefined) {
    if (![ROLES.USER, ROLES.OWNER].includes(body.role as typeof ROLES.USER)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (id === auth.session.user.id && body.role !== ROLES.OWNER) {
      return NextResponse.json({ error: "You cannot remove your own owner access." }, { status: 400 });
    }
    data.role = body.role;
  }
  if (body.kycStatus !== undefined) {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(body.kycStatus)) {
      return NextResponse.json({ error: "Invalid KYC status." }, { status: 400 });
    }
    data.kycStatus = body.kycStatus;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, kycStatus: true },
  });

  return NextResponse.json({ user });
}
