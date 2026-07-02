"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  AiTechnologyContent,
  BlogPageContent,
  ContactPageContent,
  CookiePolicyContent,
  FaqPageContent,
  FeaturesPageContent,
  HowItWorksContent,
  RiskDisclosureContent,
} from "@/components/landing/ai-public-pages";
import { AboutPageContent } from "@/components/landing/about-page-content";
import { MarketsPageContent } from "@/components/landing/markets-page-content";
import { ServicesPageContent } from "@/components/landing/services-page-content";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

const localizedSlugs = new Set([
  "how-it-works",
  "ai-technology",
  "features",
  "markets",
  "faq",
  "contact",
]);

export function PublicPageLayout({ slug }: { slug: string }) {
  const { page, messages } = useTranslations();
  const content = page(slug);
  const title = content?.title ?? slug;
  const description = content?.description ?? "";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
          {description ? (
            <p className="max-w-3xl text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </header>

        {slug === "how-it-works" ? <HowItWorksContent /> : null}
        {slug === "ai-technology" ? <AiTechnologyContent /> : null}
        {slug === "features" ? <FeaturesPageContent /> : null}
        {slug === "faq" ? <FaqPageContent /> : null}
        {slug === "contact" ? <ContactPageContent /> : null}
        {slug === "about" ? <AboutPageContent /> : null}
        {slug === "services" ? <ServicesPageContent /> : null}
        {slug === "markets" ? <MarketsPageContent /> : null}
        {slug === "risk-disclosure" ? <RiskDisclosureContent /> : null}
        {slug === "cookie-policy" ? <CookiePolicyContent /> : null}
        {slug === "blog" ? <BlogPageContent /> : null}

        <p className="pb-8 text-center text-sm text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">
            {content?.backHome ?? messages.pages.howItWorks.backHome}
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

export { localizedSlugs };
