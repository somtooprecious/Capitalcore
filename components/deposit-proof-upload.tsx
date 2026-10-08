"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DepositProofUploadProps = {
  reference: string;
  paymentId?: string;
  className?: string;
  onUploaded?: () => void;
};

export function DepositProofUpload({ reference, paymentId, className, onUploaded }: DepositProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) {
      setError("Choose a screenshot of your payment first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("reference", reference);
      if (paymentId) form.append("paymentId", paymentId);
      form.append("file", file);

      const res = await fetch("/api/payments/proof", { method: "POST", body: form });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not upload proof.");
        return;
      }
      setDone(true);
      onUploaded?.();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-background/60 p-4", className)}>
      <div>
        <p className="text-sm font-medium text-foreground">Upload proof of payment</p>
        <p className="mt-1 text-xs text-muted">
          After sending USDT, upload a screenshot (PNG, JPG, or WebP). Admin will review and approve your deposit.
        </p>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-6 text-center transition-colors hover:bg-card/80">
        <Upload className="size-5 text-muted" />
        <span className="text-xs text-muted">{file ? file.name : "Tap to choose screenshot"}</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          disabled={loading || done}
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setError(null);
          }}
        />
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {done ? (
        <p className="text-xs text-green-400">Proof uploaded. Waiting for admin approval.</p>
      ) : (
        <Button type="button" className="w-full" disabled={loading || !file} onClick={() => void upload()}>
          {loading ? "Uploading…" : "Submit proof"}
        </Button>
      )}
    </div>
  );
}
