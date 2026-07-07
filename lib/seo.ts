import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const PUBLIC_PAGE_SLUGS = new Set([
  "about",
  "markets",
  "services",
  "how-it-works",
  "ai-technology",
  "features",
  "blog",
  "risk-disclosure",
  "cookie-policy",
  "investment-plans",
  "terms-and-conditions",
  "privacy-policy",
  "contact",
  "faq",
]);

export const PRIVATE_SLUGS = new Set([
  "user-profile",
  "deposits",
  "account-settings",
  "kyc-verification",
  "wallet",
  "withdrawals",
  "transfers",
  "trading",
  "my-investments",
  "my-plans",
  "transaction-history",
  "notifications",
  "referrals",
  "support-center",
  "support",
  "admin-panel",
  "virtual-cards",
  "irs-refund-tracking",
  "international-transfers",
  "local-transfers",
  "user-to-user-transfers",
]);

export function isPublicPage(slug: string): boolean {
  return PUBLIC_PAGE_SLUGS.has(slug);
}

export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "CapitalCore AI | Modern AI Trading Platform",
      template: "%s | CapitalCore AI",
    },
    description:
      "Trade crypto, forex, stocks, and commodities on CapitalCore AI — a professional trading platform with live charts, daily tasks, crypto treasury, referrals, and secure account management.",
    keywords: [
      "CapitalCore AI",
      "AI trading platform",
      "crypto trading",
      "forex trading",
      "stock trading",
      "bitcoin trading",
      "investment platform",
      "trading dashboard",
      "crypto wallet",
      "daily trading tasks",
    ],
    authors: [{ name: "CapitalCore AI" }],
    creator: "CapitalCore AI",
    publisher: "CapitalCore AI",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: "CapitalCore AI",
      title: "CapitalCore AI | Modern AI Trading Platform",
      description:
        "Professional trading dashboards, live market charts, crypto treasury, and configurable rewards across mobile and desktop.",
    },
    twitter: {
      card: "summary_large_image",
      title: "CapitalCore AI | Modern AI Trading Platform",
      description:
        "Professional trading dashboards, live market charts, crypto treasury, and configurable rewards.",
    },
    category: "finance",
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
    },
  };
}
