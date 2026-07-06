"use client";

import { UserProfile } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { ProfilePasswordRow } from "@/components/auth/profile-password-row";
import { clerkProfileAppearance } from "@/lib/clerk-profile-appearance";

export function ClerkSecurityPanel() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold">Account security</h3>
        <p className="mt-1 text-sm text-muted">
          Manage your password, email verification, and sign-in methods. Use the eye icon on password
          fields to show or hide what you type when updating your password.
        </p>
      </div>
      <ProfilePasswordRow />
      <div className="clerk-profile-shell px-2 pb-2 sm:px-4">
        <UserProfile appearance={clerkProfileAppearance} routing="hash" />
      </div>
    </Card>
  );
}
