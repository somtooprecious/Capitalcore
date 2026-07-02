"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Next.js client navigations do not always scroll to the URL hash target.
 * This runs after route changes and scrolls the matching element into view.
 */
export function HashScrollIntoView() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    run();
    const t = window.setTimeout(run, 100);
    window.addEventListener("hashchange", run);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", run);
    };
  }, [pathname]);

  return null;
}
