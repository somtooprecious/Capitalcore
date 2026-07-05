import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/signin"
      signUpUrl="/signup"
      afterSignOutUrl="/"
      appearance={{
        cssLayerName: "clerk",
      }}
    >
      <Providers>{children}</Providers>
    </ClerkProvider>
  );
}
