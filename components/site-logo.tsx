"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const SITE_LOGO_SRC = "/images/logo.png";

type SiteLogoProps = {
  size?: number;
  className?: string;
  nameClassName?: string;
  /** Set to null to render without a link (e.g. preloader). Default: home page. */
  href?: string | null;
  priority?: boolean;
  /** Show "CapitalCore AI" beside the logo. Default: true. */
  showName?: boolean;
};

export function SiteLogo({
  size = 44,
  className,
  nameClassName,
  href = "/",
  priority = false,
  showName = true,
}: SiteLogoProps) {
  const brand = (
    <>
      <Image
        src={SITE_LOGO_SRC}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-md object-contain"
        priority={priority}
        aria-hidden
      />
      {showName ? (
        <span className={cn("whitespace-nowrap font-bold leading-none text-foreground", nameClassName)}>
          CapitalCore <span className="text-amber-400">AI</span>
        </span>
      ) : null}
    </>
  );

  const wrapperClass = cn("inline-flex items-center gap-2.5", className);

  if (href) {
    return (
      <Link
        href={href}
        className={cn(wrapperClass, "transition-opacity hover:opacity-90")}
        aria-label="CapitalCore AI — go to homepage"
      >
        {brand}
      </Link>
    );
  }

  return <span className={wrapperClass}>{brand}</span>;
}
