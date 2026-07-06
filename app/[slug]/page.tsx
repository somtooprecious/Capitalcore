import { notFound } from "next/navigation";
import { ServiceWorkspaceLayout } from "@/components/service-workspace-layout";

const pages: Record<string, { title: string; description: string }> = {
  about: {
    title: "About CapitalCore AI",
    description:
      "Learn how CapitalCore AI combines live trading, crypto treasury, daily tasks, and admin-configured rewards in one professional workspace.",
  },
  markets: {
    title: "Markets",
    description:
      "Trade crypto, forex, equities, and commodities with live charts, transparent order history, and integrated treasury controls.",
  },
  services: {
    title: "Services",
    description:
      "Explore CapitalCore AI: live trading, daily tasks, crypto treasury, referrals, security, and support—each described below.",
  },
  "how-it-works": {
    title: "How It Works",
    description: "A transparent path from sign-up to funding, daily tasks, earnings, and withdrawals on CapitalCore AI.",
  },
  "ai-technology": {
    title: "AI Technology",
    description: "Configurable automation, analytics, and treasury workflows—explained clearly without overstated claims.",
  },
  features: {
    title: "Platform Features",
    description: "Dashboards, crypto treasury, daily tasks, referrals, notifications, and admin-managed business rules.",
  },
  blog: { title: "Blog & News", description: "Platform updates, education, and market commentary." },
  "risk-disclosure": {
    title: "Risk Disclosure",
    description: "Important information about trading risk and how configured rewards differ from live AI trading profits.",
  },
  "cookie-policy": { title: "Cookie Policy", description: "How cookies and similar technologies are used on CapitalCore." },
  "user-profile": { title: "User Profile", description: "Manage personal profile, avatar upload, and account identity details." },
  deposits: { title: "Deposits", description: "Create crypto deposits to fund your wallet." },
  "account-settings": { title: "Account Settings", description: "Configure security preferences, password updates, notifications, and email preferences." },
  "kyc-verification": { title: "KYC Verification", description: "Upload identity documents and complete compliance verification for full account access." },
  wallet: { title: "Wallet / Deposits", description: "Fund your account using cryptocurrency." },
  withdrawals: { title: "Withdrawals", description: "Create and track withdrawal requests with status and approval flow." },
  transfers: { title: "Transfers", description: "Process local, international, and user-to-user transfers with OTP verification." },
  trading: { title: "Trading Page", description: "Monitor live candlestick charts and execute trades across supported markets." },
  "investment-plans": { title: "Investment Plans", description: "Browse premium plans, compare ROI, and subscribe based on your risk profile." },
  "my-investments": { title: "My Investments", description: "Track active plans, maturities, profit accrual, and cancellation eligibility." },
  "my-plans": { title: "My Plans", description: "View subscribed plans, digital shares, and lifecycle status by portfolio." },
  "transaction-history": { title: "Transaction History", description: "Review deposits, withdrawals, swaps, transfers, and exports." },
  notifications: { title: "Notifications", description: "View, mark as read, and delete account notifications." },
  referrals: { title: "Referrals", description: "Manage referral links, invites, commission earnings, and payout history." },
  "support-center": { title: "Support Center", description: "Submit and manage support tickets with response tracking." },
  support: { title: "Support", description: "Contact expert support and manage ticket conversations." },
  "admin-panel": { title: "Admin Panel", description: "Admin controls for plans, users, payments, and platform operations." },
  "terms-and-conditions": { title: "Terms & Conditions", description: "Platform terms governing service usage and legal obligations." },
  "privacy-policy": { title: "Privacy Policy", description: "How your data is processed, secured, and retained across platform services." },
  contact: { title: "Contact", description: "Reach support and account specialists through official channels." },
  faq: { title: "FAQ", description: "Frequently asked questions about trading, payments, security, and verification." },
  "virtual-cards": { title: "Virtual Cards", description: "Apply, activate, freeze, and manage virtual cards with full transaction history." },
  "irs-refund-tracking": { title: "IRS Refund Tracking", description: "Submit refund details, filing IDs, and track refund status in one place." },
  "international-transfers": { title: "International Transfers", description: "Send funds globally with transparent fees and OTP verification." },
  "local-transfers": { title: "Local Transfers", description: "Move money locally with instant settlement where supported." },
  "user-to-user-transfers": { title: "User-to-User Transfers", description: "Transfer funds securely between CapitalCore accounts." },
};

export default async function StaticFeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) return notFound();
  return <ServiceWorkspaceLayout slug={slug} title={page.title} description={page.description} />;
}
