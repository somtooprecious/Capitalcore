import { Suspense } from "react";
import { ClerkSignIn } from "@/components/auth/clerk-sign-in";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted">Loading…</div>}>
      <ClerkSignIn />
    </Suspense>
  );
}
