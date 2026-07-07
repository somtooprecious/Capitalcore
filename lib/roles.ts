export const ROLES = {
  OWNER: "OWNER",
  USER: "USER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function isOwner(role?: string | null): boolean {
  return role === ROLES.OWNER;
}

/**
 * Owner emails come from the OWNER_EMAIL env var. Multiple emails can be
 * provided separated by commas, e.g. "me@site.com, partner@site.com".
 */
export function getOwnerEmails(): string[] {
  return (process.env.OWNER_EMAIL ?? "")
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return getOwnerEmails().includes(email.toLowerCase().trim());
}
