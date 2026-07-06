"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function ClerkSignIn() {
  return (
    <AuthPageShell variant="signin">
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthPageShell>
  );
}
