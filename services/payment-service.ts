export type PaymentMethod = "crypto";

export async function initializePayment({
  method,
  amount,
  asset = "BTC",
}: {
  method: PaymentMethod;
  amount: number;
  asset?: string;
}) {
  if (method === "crypto") {
    const res = await fetch("/api/payments/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, asset }),
    });
    return res.json();
  }
  return { status: "pending", provider: method };
}
