"use client";

import { UserProfile } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { ClerkPasswordEyeEnhancer } from "@/components/auth/clerk-password-eye-enhancer";
import { clerkProfileAppearance } from "@/lib/clerk-profile-appearance";

export function ClerkSecurityPanel() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold">Account security</h3>
        <p className="mt-1 text-sm text-muted">
          Manage your password, email verification, and sign-in methods. Tap the eye icon inside each
          password field to show or hide what you type.
        </p>
      </div>
      <div className="clerk-profile-shell px-2 pb-2 sm:px-4">
        <ClerkPasswordEyeEnhancer />
        <UserProfile appearance={clerkProfileAppearance} routing="path" path="/settings" />
      </div>
    </Card>
  );
}
