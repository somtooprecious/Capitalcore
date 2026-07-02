import { prisma } from "@/lib/prisma";

export async function ensureWallet(userId: string) {
  await prisma.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}
