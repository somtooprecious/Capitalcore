"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserSession } from "@/hooks/use-user-session";
import type { WalletBalanceSummary } from "@/lib/wallet-balance";

async function fetchWalletBalance(): Promise<WalletBalanceSummary> {
  const response = await fetch("/api/wallet/balance");
  if (!response.ok) {
    throw new Error("Failed to load wallet balance");
  }
  return response.json() as Promise<WalletBalanceSummary>;
}

export function useWalletBalance() {
  const { isAuthenticated, status } = useUserSession();

  const query = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: fetchWalletBalance,
    enabled: status !== "loading" && isAuthenticated,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });

  return {
    ...query,
    balance: query.data?.balance ?? 0,
    availableBalance: query.data?.availableBalance ?? 0,
    lockedBalance: query.data?.lockedBalance ?? 0,
    currency: query.data?.currency ?? "USD",
  };
}
