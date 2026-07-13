"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ClerkSignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = useMemo(
    () => searchParams.get("ref")?.trim().toUpperCase() || "",
    [searchParams],
  );
  const { isLoaded, signUp, setActive } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    const first = firstName.trim();
    const last = lastName.trim();
    if (first.length < 1) {
      setError("Enter your first name.");
      return;
    }
    if (last.length < 1) {
      setError("Enter your last name.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const metadata = {
        ...(referralCode ? { referralCode } : {}),
        firstName: first,
        lastName: last,
      };

      try {
        await signUp.create({
          emailAddress: email.trim().toLowerCase(),
          password,
          firstName: first,
          lastName: last,
          unsafeMetadata: metadata,
        });
      } catch (nameErr) {
        const msg =
          nameErr && typeof nameErr === "object" && "errors" in nameErr
            ? String((nameErr as { errors?: { message?: string; code?: string }[] }).errors?.[0]?.message ?? "")
            : nameErr instanceof Error
              ? nameErr.message
              : "";
        const lower = msg.toLowerCase();
        if (lower.includes("already") || lower.includes("exist") || lower.includes("taken")) {
          throw nameErr;
        }
        await signUp.create({
          emailAddress: email.trim().toLowerCase(),
          password,
          unsafeMetadata: metadata,
        });
      }

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      const message =
        err && typeof err === "object" && "errors" in err
          ? String((err as { errors?: { message?: string }[] }).errors?.[0]?.message ?? "")
          : err instanceof Error
            ? err.message
            : "";
      setError(message || "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setError("Verification incomplete. Please try again.");
    } catch (err) {
      const message =
        err && typeof err === "object" && "errors" in err
          ? String((err as { errors?: { message?: string }[] }).errors?.[0]?.message ?? "")
          : err instanceof Error
            ? err.message
            : "";
      setError(message || "Invalid verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell variant="signup">
      <div className="w-full rounded-2xl border border-white/15 bg-[#0f172a] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Create your account</h1>
          <p className="text-sm text-slate-400">
            {pendingVerification
              ? "Enter the verification code we sent to your email."
              : "Add your name and details to get started."}
          </p>
        </div>

        {pendingVerification ? (
          <form onSubmit={onVerify} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Verification code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="bg-slate-100 text-slate-900"
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={submitting || !isLoaded}>
              {submitting ? "Verifying…" : "Verify email"}
            </Button>
          </form>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">First name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                  className="bg-slate-100 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">Last name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="bg-slate-100 text-slate-900"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                className="bg-slate-100 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="bg-slate-100 text-slate-900"
                required
                minLength={8}
              />
            </div>
            {referralCode ? (
              <p className="text-xs text-slate-400">
                Referral code applied: <span className="font-mono text-amber-400">{referralCode}</span>
              </p>
            ) : null}
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={submitting || !isLoaded}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-sky-300 hover:text-sky-200">
            Sign in
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
