export const ROLES = {
  OWNER: "OWNER",
  USER: "USER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function isOwner(role?: string | null): boolean {
  return role === ROLES.OWNER;
}

/**
 * Built-in owner email(s). These act as a safety net so admin access works even
 * if the OWNER_EMAIL environment variable is missing or misconfigured on the
 * host (e.g. Vercel). This is safe because owner access still requires
 * authenticating through Clerk as this exact email — the address alone grants
 * nothing without a valid login.
 */
const BUILT_IN_OWNER_EMAILS = ["somtooprecious1@gmail.com"];

/**
 * Owner emails come from the OWNER_EMAIL env var (comma-separated for multiple,
 * e.g. "me@site.com, partner@site.com") combined with the built-in fallback.
 */
export function getOwnerEmails(): string[] {
  const fromEnv = (process.env.OWNER_EMAIL ?? "")
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);

  const combined = new Set([
    ...fromEnv,
    ...BUILT_IN_OWNER_EMAILS.map((email) => email.toLowerCase().trim()),
  ]);

  return [...combined];
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return getOwnerEmails().includes(email.toLowerCase().trim());
}
