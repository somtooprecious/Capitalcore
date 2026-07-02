export const ROLES = {
  OWNER: "OWNER",
  USER: "USER",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export function isOwner(role?: string | null): boolean {
  return role === ROLES.OWNER;
}
