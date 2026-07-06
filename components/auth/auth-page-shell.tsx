import Link from "next/link";
import { AuthHeroPanel } from "@/features/auth/auth-hero-panel";
import { cn } from "@/lib/utils";

const mobileCopy = {
  signin: {
    title: "Sign in",
    subtitle: "Access your CapitalCore trading dashboard.",
  },
  signup: {
    title: "Create account",
    subtitle: "Register with your name, email, and password.",
  },
} as const;

export function AuthPageShell({
  variant,
  children,
}: {
  variant: "signin" | "signup";
  children: React.ReactNode;
}) {
  const { title, subtitle } = mobileCopy[variant];

  return (
    <main className="grid min-h-screen bg-[#060b1b] md:grid-cols-2">
      <AuthHeroPanel variant={variant} />

      <section className="flex min-h-screen flex-col bg-[#060b1b] md:min-h-0 md:justify-center">
        <header className="border-b border-white/10 px-6 py-5 md:hidden">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-50 transition-opacity hover:opacity-90"
          >
            CapitalCore
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-50">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 sm:py-10">
          <div className={cn("auth-clerk-shell w-full max-w-md")}>{children}</div>
        </div>

        <p className="border-t border-white/10 px-6 py-4 text-center text-xs text-slate-500 md:hidden">
          © {new Date().getFullYear()} CapitalCore ·{" "}
          <Link href="/" className="text-slate-300 underline-offset-4 hover:underline">
            Return to site
          </Link>
        </p>
      </section>
    </main>
  );
}
