"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const SITE_LOGO_SRC = "/images/logo.png";

type SiteLogoProps = {
  size?: number;
  className?: string;
  /** Set to null to render without a link (e.g. preloader). Default: home page. */
  href?: string | null;
  priority?: boolean;
};

export function SiteLogo({ size = 44, className, href = "/", priority = false }: SiteLogoProps) {
  const image = (
    <Image
      src={SITE_LOGO_SRC}
      alt="CapitalCore home"
      width={size}
      height={size}
      className={cn("rounded-md object-contain", className)}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 transition-opacity hover:opacity-90"
        aria-label="Go to homepage"
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0">{image}</span>;
}
