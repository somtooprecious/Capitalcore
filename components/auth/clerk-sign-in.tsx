"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthHeroPanel } from "@/features/auth/auth-hero-panel";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function ClerkSignIn() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <AuthHeroPanel variant="signin" />
      <section className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">
          <SignIn
            appearance={clerkAppearance}
            routing="path"
            path="/signin"
            signUpUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}
