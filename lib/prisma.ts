import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Add your Supabase connection string to .env.local (Supabase → Project Settings → Database).",
    );
  }
  if (url.startsWith("file:")) {
    throw new Error(
      "DATABASE_URL still points to a local SQLite file. Replace it with your Supabase PostgreSQL URI in .env.local, then restart the dev server.",
    );
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
