import { getSiteUrl } from "@/lib/site-url";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CapitalCore AI",
    url: siteUrl,
    logo: `${siteUrl}/images/services/cryptocurrency.svg`,
    description:
      "Modern AI trading platform for crypto, forex, stocks, and commodities with investment plans, daily tasks, and secure crypto deposits.",
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CapitalCore AI",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "CapitalCore AI",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "AI trading platform with crypto deposits, investment plans, live charts, and daily task rewards.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
    </>
  );
}
