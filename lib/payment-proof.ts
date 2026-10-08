export const MAX_PAYMENT_PROOF_BYTES = 1_500_000;
export const ALLOWED_PAYMENT_PROOF_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

export type PaymentProofMeta = {
  dataUrl: string;
  mimeType: string;
  fileName?: string;
  uploadedAt: string;
};

export function getPaymentProofFromMetadata(metadata: unknown): PaymentProofMeta | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const proof = (metadata as { proofOfPayment?: unknown }).proofOfPayment;
  if (!proof || typeof proof !== "object" || Array.isArray(proof)) return null;
  const row = proof as Partial<PaymentProofMeta>;
  if (typeof row.dataUrl !== "string" || !row.dataUrl.startsWith("data:image/")) return null;
  if (typeof row.mimeType !== "string") return null;
  return {
    dataUrl: row.dataUrl,
    mimeType: row.mimeType,
    fileName: typeof row.fileName === "string" ? row.fileName : undefined,
    uploadedAt: typeof row.uploadedAt === "string" ? row.uploadedAt : new Date().toISOString(),
  };
}

export function mergePaymentMetadata(
  metadata: unknown,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const base =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? { ...(metadata as Record<string, unknown>) }
      : {};
  return { ...base, ...patch };
}
