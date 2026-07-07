import type { Metadata } from "next";
import { AnnouncementBanner } from "@/components/landing/announcement-banner";
import { HomeHeroSlider } from "@/components/landing/home-hero-slider";
import { HomeMainContent } from "@/components/landing/home-main-content";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <SiteJsonLd />
      <SiteHeader />
      <AnnouncementBanner />
      <HomeHeroSlider />
      <HomeMainContent />
      <SiteFooter />
    </main>
  );
}
