import { TELEGRAM_COMMUNITY_URL } from "@/lib/social";
import { cn } from "@/lib/utils";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

type TelegramCommunityLinkProps = {
  className?: string;
  variant?: "button" | "card" | "inline";
  label?: string;
  hint?: string;
};

export function TelegramCommunityLink({
  className,
  variant = "button",
  label = "Join Telegram community",
  hint = "News, updates, and support from CapitalCore",
}: TelegramCommunityLinkProps) {
  if (variant === "inline") {
    return (
      <a
        href={TELEGRAM_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 font-medium text-[#2AABEE] transition hover:text-[#5bc1f5]",
          className,
        )}
      >
        <TelegramIcon className="h-4 w-4" />
        {label}
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href={TELEGRAM_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex items-center gap-4 rounded-2xl border border-[#2AABEE]/30 bg-[#2AABEE]/10 p-5 transition hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/15",
          className,
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2AABEE] text-white shadow-lg shadow-[#2AABEE]/25">
          <TelegramIcon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-foreground group-hover:text-[#5bc1f5]">{label}</span>
          <span className="mt-0.5 block text-sm text-muted">{hint}</span>
        </span>
        <span className="shrink-0 text-sm font-medium text-[#2AABEE]">Open →</span>
      </a>
    );
  }

  return (
    <a
      href={TELEGRAM_COMMUNITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl bg-[#2AABEE] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2AABEE]/25 transition hover:bg-[#1f96d4]",
        className,
      )}
    >
      <TelegramIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
