"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WITHDRAWAL_INSTRUCTIONS } from "@/lib/withdrawal-fees";

const SESSION_KEY = "capitalcore-withdrawal-tips-seen";

type WithdrawalInstructionsDialogProps = {
  /** When true, auto-open once per browser session on the withdrawals page. */
  autoOpen?: boolean;
};

export function WithdrawalInstructionsDialog({ autoOpen = true }: WithdrawalInstructionsDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, [autoOpen]);

  const close = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 gap-2 px-3 text-sm border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
        onClick={() => setOpen(true)}
      >
        <Info className="size-4" />
        Kind tips
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdrawal-instructions-title"
        >
          <Card className="relative w-full max-w-md border-amber-500/20 bg-card p-6 shadow-2xl">
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted transition-colors hover:bg-background hover:text-foreground"
              aria-label="Close withdrawal instructions"
            >
              <X className="size-5" />
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Kind tips</p>
            <h2 id="withdrawal-instructions-title" className="mt-2 text-xl font-bold text-foreground">
              Withdrawal Instructions
            </h2>

            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
              {WITHDRAWAL_INSTRUCTIONS.map((tip, index) => (
                <li key={tip} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">
                    {index + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ol>

            <Button type="button" className="mt-6 w-full" onClick={close}>
              Got it
            </Button>
          </Card>
        </div>
      ) : null}
    </>
  );
}
