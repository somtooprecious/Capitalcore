import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthHeroPanel } from "@/features/auth/auth-hero-panel";
import { ClearAuthQuery } from "@/features/auth/clear-auth-query";
import { Card } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <ClearAuthQuery />
      <AuthHeroPanel variant="signin" />
      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md space-y-5">
          <h1 className="text-2xl font-bold">Sign in to CapitalCore AI</h1>
          <Suspense fallback={<p className="text-sm text-muted">Loading form…</p>}>
            <AuthForm mode="signin" />
          </Suspense>
          <p className="text-sm text-muted">
            <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-sm text-muted">No account? <Link href="/signup">Create one</Link></p>
        </Card>
      </section>
    </main>
  );
}
