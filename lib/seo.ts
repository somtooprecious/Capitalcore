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

function defaultOgImage(siteUrl: string) {
  return [
    {
      url: `${siteUrl}/images/services/cryptocurrency.svg`,
      width: 1200,
      height: 630,
      alt: "CapitalCore AI trading platform",
    },
  ];
}

export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const title = "CapitalCore AI | Modern AI Trading Platform";
  const description =
    "Trade crypto, forex, stocks, and commodities on CapitalCore AI — a professional trading platform with live charts, investment plans, daily tasks, crypto deposits, referrals, and secure account management.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | CapitalCore AI",
    },
    description,
    applicationName: "CapitalCore AI",
    keywords: [
      "CapitalCore AI",
      "AI trading platform",
      "crypto trading",
      "forex trading",
      "stock trading",
      "bitcoin trading",
      "investment plans",
      "crypto deposit",
      "USDT payment",
      "daily trading tasks",
      "referral earnings",
    ],
    authors: [{ name: "CapitalCore AI", url: siteUrl }],
    creator: "CapitalCore AI",
    publisher: "CapitalCore AI",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
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
      title,
      description,
      images: defaultOgImage(siteUrl),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/services/cryptocurrency.svg`],
    },
    category: "finance",
    verification: {
      // Add your Google Search Console verification token in Vercel as GOOGLE_SITE_VERIFICATION
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    },
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
  const siteUrl = getSiteUrl();

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
      url: `${siteUrl}${path}`,
      type: "website",
      siteName: "CapitalCore AI",
      images: defaultOgImage(siteUrl),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/services/cryptocurrency.svg`],
    },
  };
}
