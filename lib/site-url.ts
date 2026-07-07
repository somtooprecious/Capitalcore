const FALLBACK_URL = "https://capitalcore-sand.vercel.app";

function normalize(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK_URL;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit && !explicit.includes("localhost")) {
    return normalize(explicit);
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) {
    return normalize(vercel);
  }

  if (explicit) {
    return normalize(explicit);
  }

  return FALLBACK_URL;
}
