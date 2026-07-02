"use client";

import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function FaqAccordion() {
  const { messages } = useTranslations();
  const faqItems = messages.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <Card key={item.question} className="overflow-hidden p-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown
                className={cn("size-5 shrink-0 text-muted transition-transform duration-300", isOpen && "rotate-180")}
                aria-hidden
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
