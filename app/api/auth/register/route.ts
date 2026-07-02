import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/platform-config";
import { ensureWallet } from "@/lib/wallet";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const referralCode = generateReferralCode(email);

    let referredById: string | undefined;
    if (parsed.data.referralCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode: parsed.data.referralCode.trim().toUpperCase() },
        select: { id: true },
      });
      if (referrer) referredById = referrer.id;
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email,
        passwordHash,
        referralCode,
        referredById,
      },
    });
    await ensureWallet(user.id);

    if (referredById) {
      await prisma.referral.create({
        data: {
          referrerId: referredById,
          referredId: user.id,
          code: parsed.data.referralCode!.trim().toUpperCase(),
        },
      });
    }

    await sendWelcomeEmail(email, user.name);

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("[register]", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message.includes("DATABASE_URL") || error.message.includes("SQLite")
          ? "Add your Supabase DATABASE_URL to .env.local, run npm run db:push, then restart the dev server."
          : error.message.includes("Can't reach database") ||
              error.message.includes("connect") ||
              error.message.includes("P1001")
            ? "Cannot reach Supabase. Check DATABASE_URL in .env.local and that your project is not paused."
            : error.message
        : "Could not create account. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
