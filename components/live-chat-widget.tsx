"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  name?: string;
  createdAt: string;
};

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    const res = await fetch("/api/chat?roomId=general");
    const data = (await res.json()) as { messages: ChatMessage[] };
    setMessages(data.messages ?? []);
  };

  useEffect(() => {
    if (open) void loadMessages();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, guestId, roomId: "general" }),
      });
      const data = (await res.json()) as {
        message: ChatMessage & { guestId?: string };
        reply: ChatMessage;
      };
      if (data.message.guestId && !guestId) setGuestId(data.message.guestId);
      setMessages((prev) => [...prev, data.message, data.reply]);
      setInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="flex h-[420px] w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-border bg-primary/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Live support</p>
              <p className="text-xs text-muted">CapitalCore AI help desk</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-muted">Ask about deposits, withdrawals, trading, or account security.</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                    m.sender === "USER" || m.sender === "GUEST"
                      ? "ml-auto bg-primary text-white"
                      : "bg-background/80 text-foreground",
                  )}
                >
                  {m.message}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={loading}
            />
            <Button type="submit" className="h-10 w-10 shrink-0 px-0" disabled={loading} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button
          type="button"
          className="h-12 rounded-full px-4 shadow-lg"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Live chat
        </Button>
      )}
    </div>
  );
}
