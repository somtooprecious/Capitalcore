import { Suspense } from "react";
import { ClerkSignIn } from "@/components/auth/clerk-sign-in";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#060b1b] text-slate-400">
          Loading…
        </div>
      }
    >
      <ClerkSignIn />
    </Suspense>
  );
}
