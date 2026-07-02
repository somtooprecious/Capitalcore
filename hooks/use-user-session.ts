"use client";

import { useSession } from "next-auth/react";

export function useUserSession() {
  const { data, status } = useSession();
  return { user: data?.user, status, isAuthenticated: status === "authenticated" };
}
