"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    _smartsupp?: { key?: string; cookieDomain?: string; [key: string]: unknown };
    smartsupp?: ((...args: unknown[]) => void) & { _?: unknown[] };
  }
}

const SMARTSUPP_KEY = process.env.NEXT_PUBLIC_SMARTSUPP_KEY?.trim();

function getCookieDomain(): string | undefined {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return undefined;

  try {
    const hostname = new URL(appUrl).hostname;
    if (hostname.startsWith("www.")) {
      return `.${hostname.slice(4)}`;
    }
    if (hostname.includes(".") && !hostname.endsWith(".localhost")) {
      return `.${hostname}`;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function SmartsuppChat() {
  useEffect(() => {
    if (!SMARTSUPP_KEY || typeof window === "undefined" || window.smartsupp) {
      return;
    }

    window._smartsupp = window._smartsupp ?? {};
    window._smartsupp.key = SMARTSUPP_KEY;

    const cookieDomain = getCookieDomain();
    if (cookieDomain) {
      window._smartsupp.cookieDomain = cookieDomain;
    }

    window.smartsupp ||
      (function loadSmartsupp(d: Document) {
        const s = d.getElementsByTagName("script")[0];
        const c = d.createElement("script");
        const o = (window.smartsupp = function (...args: unknown[]) {
          o._?.push(args);
        }) as NonNullable<typeof window.smartsupp> & { _?: unknown[] };
        o._ = [];
        c.type = "text/javascript";
        c.charset = "utf-8";
        c.async = true;
        c.src = "https://www.smartsuppchat.com/loader.js?";
        s.parentNode?.insertBefore(c, s);
      })(document);
  }, []);

  return null;
}
