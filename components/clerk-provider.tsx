import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { clerkLocalization } from "@/lib/clerk-localization";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/signin"
      signUpUrl="/signup"
      afterSignOutUrl="/"
      localization={clerkLocalization}
      appearance={clerkAppearance}
    >
      <Providers>{children}</Providers>
    </ClerkProvider>
  );
}
