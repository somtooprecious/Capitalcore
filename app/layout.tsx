import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CapitalCore AI | Modern AI Trading Platform",
    template: "%s | CapitalCore AI",
  },
  description:
    "Trade crypto, forex, stocks, and commodities on a premium AI trading platform with daily tasks, crypto treasury, referrals, and admin-configured rewards.",
  openGraph: {
    title: "CapitalCore AI | Modern AI Trading Platform",
    description:
      "Professional trading dashboards, configurable rewards, and secure crypto funding across mobile and desktop.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
