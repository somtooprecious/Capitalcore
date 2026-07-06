"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function ClerkSignUp() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim().toUpperCase();

  return (
    <AuthPageShell variant="signup">
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/signup"
        signInUrl="/signin"
        fallbackRedirectUrl="/dashboard"
        unsafeMetadata={referralCode ? { referralCode } : undefined}
      />
    </AuthPageShell>
  );
}
