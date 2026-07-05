import { Suspense } from "react";
import { ClerkSignUp } from "@/components/auth/clerk-sign-up";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
      <ClerkSignUp />
    </Suspense>
  );
}
