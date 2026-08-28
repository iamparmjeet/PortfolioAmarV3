"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What kind of videos does Amar make?",
  "How much does a brand film cost?",
  "How do I start a project?",
  "Tell me about the editing courses",
];

function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(false);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantId = crypto.randomUUID();
    const nextMessages = [...messages, userMsg];

    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
        );
      }
    } catch {
      setError(true);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, error, sendMessage };
}

export function AmarChat() {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, input, setInput, isLoading, error, sendMessage } = useChat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message array change, not reference equality
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex h-[520px] w-[340px] flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-md sm:w-[380px]"
          role="dialog"
          aria-label="Chat with Amar AI"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline bg-surface-elevated px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-ink">
                AI
              </span>
              <div>
                <p className="text-[13px] font-medium text-bone">Amar AI</p>
                <p className="font-mono text-[9px] tracking-[0.12em] text-mute">
                  <span className="mr-1 text-green-400">●</span>ONLINE · REPLIES IN SECONDS
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="font-mono text-[11px] tracking-[0.1em] text-mute transition-colors hover:text-accent"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-surface-elevated p-3.5">
                  <p className="text-[13px] leading-relaxed text-bone-dim">
                    Hey! I'm Amar AI. Ask me anything about{" "}
                    <span className="text-accent">Amarjeet's work</span>, services, or how to start
                    a project together.
                  </p>
                </div>
                <div className="space-y-1.5">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="block w-full rounded-md border border-hairline-strong px-3 py-2 text-left font-mono text-[11px] tracking-[0.06em] text-bone-dim transition-colors hover:border-accent-line hover:text-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed",
                    m.role === "user" ? "bg-accent text-ink" : "bg-surface-elevated text-bone-dim",
                  )}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-bone-dim"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <p className="text-center font-mono text-[10px] tracking-[0.08em] text-red-400">
                Failed to send — try again
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-hairline p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-md bg-surface-elevated px-3.5 py-2.5 text-[13px] text-bone placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-ink transition-colors hover:bg-accent-dim disabled:opacity-40"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Amar AI"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-accent-line bg-surface-elevated shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 hover:border-accent hover:shadow-[0_8px_32px_rgba(201,148,58,0.3)]"
      >
        {open ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

      </button>
    </div>
  );
}
