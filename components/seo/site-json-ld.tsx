import { getSiteUrl } from "@/lib/site-url";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CapitalCore AI",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description:
      "Modern AI trading platform for crypto, forex, stocks, and commodities with professional dashboards and secure treasury tools.",
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
    </>
  );
}
