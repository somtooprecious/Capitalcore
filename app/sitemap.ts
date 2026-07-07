import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const PUBLIC_PATHS: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-technology", priority: 0.8, changeFrequency: "monthly" },
  { path: "/markets", priority: 0.8, changeFrequency: "daily" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/features", priority: 0.7, changeFrequency: "monthly" },
  { path: "/investment-plans", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/risk-disclosure", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms-and-conditions", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.4, changeFrequency: "monthly" },
  { path: "/cookie-policy", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
