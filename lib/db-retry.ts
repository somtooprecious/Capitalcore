/**
 * Retry a database operation when it fails due to transient connection issues
 * (pool timeout, connection reset, unreachable host). Common on slow networks
 * or when the Supabase pooler is under load.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: { attempts?: number; delayMs?: number } = {},
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 800;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";

      const message = error instanceof Error ? error.message : String(error);
      const retryable =
        code === "P1001" ||
        code === "P2024" ||
        message.includes("Can't reach database") ||
        message.includes("connection pool") ||
        message.includes("ConnectionReset") ||
        message.includes("forcibly closed");

      if (!retryable || attempt === attempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}
