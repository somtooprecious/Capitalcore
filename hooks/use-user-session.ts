"use client";

import { useUser } from "@clerk/nextjs";

type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  kycStatus: string;
};

export function useUserSession() {
  const { user, isLoaded, isSignedIn } = useUser();

  const metadata = (user?.publicMetadata ?? {}) as {
    role?: string;
    prismaUserId?: string;
    kycStatus?: string;
  };

  const appUser: AppUser | null =
    isSignedIn && user
      ? {
          id: metadata.prismaUserId ?? user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          name: user.fullName ?? user.firstName ?? null,
          role: metadata.role ?? "USER",
          kycStatus: metadata.kycStatus ?? "PENDING",
        }
      : null;

  return {
    user: appUser,
    status: !isLoaded ? "loading" : isSignedIn ? "authenticated" : "unauthenticated",
    isAuthenticated: Boolean(isSignedIn),
  };
}
