"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type AuthFormProps = {
  mode: "signin" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [totp, setTotp] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!needs2FA) {
        const check = await fetch("/api/auth/check-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: parsed.data.email.toLowerCase().trim() }),
        });
        const checkData = (await check.json()) as { required?: boolean };
        if (checkData.required) {
          setNeeds2FA(true);
          setFormError("Enter your 6-digit authenticator code.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email: parsed.data.email.toLowerCase().trim(),
        password: parsed.data.password,
        totp: needs2FA ? totp : "",
        redirect: false,
      });
      if (result?.error) {
        setFormError(needs2FA ? "Invalid authenticator code or password." : "Invalid email or password.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = signUpSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name.trim(),
          email: parsed.data.email.toLowerCase().trim(),
          password: parsed.data.password,
          referralCode: referralCode.trim() || undefined,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setFormError(payload.error ?? "Could not create account.");
        return;
      }

      const result = await signIn("credentials", {
        email: parsed.data.email.toLowerCase().trim(),
        password: parsed.data.password,
        redirect: false,
      });
      if (result?.error) {
        setFormError("Account created. Please sign in with your email and password.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "signup") {
    return (
      <form method="post" onSubmit={onSignUp} className="space-y-4" noValidate>
        <Input
          placeholder="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
        <Input
          placeholder="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
        <Input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
        <Input
          placeholder="Referral code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
        />
        {formError && <p className="text-sm text-red-400">{formError}</p>}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>
    );
  }

  return (
    <form method="post" onSubmit={onSignIn} className="space-y-4" noValidate>
      <Input
        placeholder="Email address"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
      <Input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
      {needs2FA ? (
        <>
          <Input
            placeholder="6-digit authenticator code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
          />
          <p className="text-xs text-muted">Two-factor authentication is enabled on this account.</p>
        </>
      ) : null}
      {formError && <p className="text-sm text-red-400">{formError}</p>}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
