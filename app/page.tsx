import { AnnouncementBanner } from "@/components/landing/announcement-banner";
import { HomeHeroSlider } from "@/components/landing/home-hero-slider";
import { HomeMainContent } from "@/components/landing/home-main-content";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <AnnouncementBanner />
      <HomeHeroSlider />
      <HomeMainContent />
      <SiteFooter />
    </main>
  );
}
