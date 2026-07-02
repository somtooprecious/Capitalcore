import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function logAudit({
  userId,
  action,
  entity,
  entityId,
  metadata,
}: {
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
