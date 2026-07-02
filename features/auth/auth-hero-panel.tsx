import Link from "next/link";
import { ChartSpline, Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const heroCopy = {
  signin: {
    eyebrow: "CapitalCore AI",
    title: "Welcome back to your trading workspace",
    body: "Sign in to manage balances, daily tasks, earnings, crypto deposits, and withdrawals from one professional dashboard.",
  },
  signup: {
    eyebrow: "Join CapitalCore AI",
    title: "Start your AI trading journey",
    body: "Create an account for crypto funding, configurable daily rewards, live charts, and transparent admin-managed platform rules.",
  },
} as const;

const highlights = [
  {
    icon: ShieldCheck,
    title: "Secure treasury",
    description: "Crypto deposits, withdrawal approvals, and encrypted authentication.",
  },
  {
    icon: Landmark,
    title: "Daily task engine",
    description: "Configurable rewards and streak tracking—set by administration.",
  },
  {
    icon: ChartSpline,
    title: "Multi-asset charts",
    description: "TradingView-powered market views on mobile, tablet, and desktop.",
  },
] as const;

export function AuthHeroPanel({
  className,
  variant = "signin",
}: {
  className?: string;
  variant?: keyof typeof heroCopy;
}) {
  const { eyebrow, title, body } = heroCopy[variant];

  return (
    <section
      className={cn(
        "relative hidden min-h-[50vh] flex-col justify-between overflow-hidden border-r border-white/10 bg-[#070d1f] md:flex md:min-h-0",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-0 h-[min(80%,560px)] w-[min(120%,720px)] rounded-full bg-primary/25 blur-[100px]" />
        <div className="absolute -bottom-1/4 right-0 h-[min(70%,480px)] w-[min(100%,560px)] rounded-full bg-accent/10 blur-[90px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#030712]/80" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-12 lg:px-14">
        <Link
          href="/"
          className="mb-10 text-xl font-bold tracking-tight text-slate-50 transition-opacity hover:opacity-90"
        >
          CapitalCore
        </Link>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#93c5fd]">{eyebrow}</p>
        <h2 className="mt-4 max-w-md text-balance text-3xl font-bold tracking-tight text-slate-50 lg:text-4xl">{title}</h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400">{body}</p>
        <ul className="mt-12 space-y-6">
          {highlights.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#93c5fd]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-slate-50">{title}</p>
                <p className="mt-1 text-sm leading-snug text-slate-400">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 border-t border-white/10 px-10 py-5 text-xs text-slate-500 lg:px-14">
        © {new Date().getFullYear()} CapitalCore · Secure session ·{" "}
        <Link href="/" className="text-slate-300 underline-offset-4 hover:underline">
          Return to site
        </Link>
      </p>
    </section>
  );
}
