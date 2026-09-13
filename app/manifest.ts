import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: "CapitalCore AI",
    short_name: "CapitalCore",
    description:
      "AI trading platform for crypto, forex, stocks, and commodities with investment plans and crypto deposits.",
    start_url: "/",
    display: "standalone",
    background_color: "#060b1b",
    theme_color: "#060b1b",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    id: siteUrl,
  };
}
