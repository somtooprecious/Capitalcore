"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthHeroPanel } from "@/features/auth/auth-hero-panel";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function ClerkSignUp() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim().toUpperCase();

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <AuthHeroPanel variant="signup" />
      <section className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">
          <SignUp
            appearance={clerkAppearance}
            routing="path"
            path="/signup"
            signInUrl="/signin"
            fallbackRedirectUrl="/dashboard"
            unsafeMetadata={referralCode ? { referralCode } : undefined}
          />
        </div>
      </section>
    </main>
  );
}
