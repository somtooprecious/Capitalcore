/** Percent fee applied to every withdrawal (of requested amount). */
export const WITHDRAWAL_PERCENT_FEE = 0.1;
/** Flat fee charged on every withdrawal (USD). Kept at 0 — percent fee only. */
export const WITHDRAWAL_FLAT_FEE_USD = 0;

export const WITHDRAWAL_ASSETS = [
  { code: "BTC", label: "Bitcoin (BTC)", network: null },
  { code: "ETH", label: "Ethereum (ETH)", network: null },
  { code: "USDT", label: "USDT BEP 20", network: "BEP20" },
] as const;

export type WithdrawalAssetCode = (typeof WITHDRAWAL_ASSETS)[number]["code"];

export function calculateWithdrawalFees(amount: number) {
  const percentFee = Math.round(amount * WITHDRAWAL_PERCENT_FEE * 100) / 100;
  const flatFee = WITHDRAWAL_FLAT_FEE_USD;
  const totalFee = Math.round((percentFee + flatFee) * 100) / 100;
  const netPayout = Math.round((amount - totalFee) * 100) / 100;
  return { percentFee, flatFee, totalFee, netPayout };
}

export function formatWithdrawalDestination(asset: WithdrawalAssetCode, address: string) {
  const meta = WITHDRAWAL_ASSETS.find((row) => row.code === asset);
  const label = meta?.label ?? asset;
  return `${label} · ${address.trim()}`;
}
