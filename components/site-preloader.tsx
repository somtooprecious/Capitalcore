"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "capitalcore-preloader-done";

const SKIP_PREFIXES = [
  "/admin",
  "/dashboard",
  "/deposits",
  "/withdrawals",
  "/transfers",
  "/trading",
  "/plans",
  "/my-plans",
  "/settings",
  "/daily-tasks",
  "/earnings",
  "/referrals",
  "/notifications",
  "/support-center",
  "/signin",
  "/signup",
  "/verify-email",
  "/forgot-password",
];

function shouldSkipPath(pathname: string) {
  return SKIP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SitePreloader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (shouldSkipPath(pathname)) return;
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // ignore storage errors
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setVisible(true);
    document.documentElement.classList.add("site-preloading");

    let cancelled = false;
    let current = 0;
    let finished = false;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      current = 100;
      setProgress(100);

      window.setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setVisible(false);
          document.documentElement.classList.remove("site-preloading");
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // ignore
          }
        }, reducedMotion ? 0 : 420);
      }, reducedMotion ? 80 : 280);
    };

    if (reducedMotion) {
      finish();
      return () => {
        cancelled = true;
        document.documentElement.classList.remove("site-preloading");
      };
    }

    const tick = window.setInterval(() => {
      if (cancelled || finished) return;
      const target =
        document.readyState === "complete" ? 100 : document.readyState === "interactive" ? 85 : 70;
      const step = target >= 100 ? 8 : current < 40 ? 3.2 : current < 70 ? 1.8 : 0.9;
      current = Math.min(target, current + step);
      setProgress(Math.round(current));
      if (current >= 100) {
        window.clearInterval(tick);
        finish();
      }
    }, 40);

    const onLoad = () => {
      if (cancelled || finished) return;
      current = Math.max(current, 92);
      setProgress(Math.round(current));
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    // Safety: never leave visitors stuck on the overlay
    const safety = window.setTimeout(finish, 4500);

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.clearTimeout(safety);
      window.removeEventListener("load", onLoad);
      document.documentElement.classList.remove("site-preloading");
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`site-preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#060b1b] px-6 transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      aria-busy={!leaving}
      role="status"
    >
      <div className="mb-8 text-center">
        <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          CapitalCore <span className="text-amber-400">AI</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">Preparing your experience…</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Loading</span>
          <span className="tabular-nums text-amber-400">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-amber-400 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
