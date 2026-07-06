import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { clerkAppearance } from "@/lib/clerk-appearance";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/signin"
      signUpUrl="/signup"
      afterSignOutUrl="/"
      appearance={{
        ...clerkAppearance,
        cssLayerName: "clerk",
      }}
    >
      <Providers>{children}</Providers>
    </ClerkProvider>
  );
}
