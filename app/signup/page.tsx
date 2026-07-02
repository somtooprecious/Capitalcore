import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/features/auth/auth-form";
import { AuthHeroPanel } from "@/features/auth/auth-hero-panel";
import { ClearAuthQuery } from "@/features/auth/clear-auth-query";
import { Card } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <ClearAuthQuery />
      <AuthHeroPanel variant="signup" />
      <section className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md space-y-5">
          <h1 className="text-2xl font-bold">Create your CapitalCore AI account</h1>
          <Suspense fallback={<p className="text-sm text-muted">Loading form…</p>}>
            <AuthForm mode="signup" />
          </Suspense>
          <p className="text-sm text-muted">Already registered? <Link href="/signin">Sign in</Link></p>
        </Card>
      </section>
    </main>
  );
}
