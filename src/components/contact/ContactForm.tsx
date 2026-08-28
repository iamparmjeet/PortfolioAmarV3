"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TurnstileWidget } from "./TurnstileWidget";

type FormStatus = "idle" | "sending" | "success" | "error";

const PROJECT_TYPES = [
  "Instagram Reels",
  "Brand Film",
  "Podcast Edit",
  "Real Estate Video",
  "Fashion / Lifestyle",
  "Corporate / Event",
  "YouTube Content",
  "Other",
];

const BUDGET_RANGES = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Let's discuss",
];

const TIMELINES = ["ASAP (within a week)", "2–4 weeks", "1–2 months", "Flexible"];

// Client-side email check mirrors server zod .email() — cheap early feedback.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Turnstile + timing gate
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const emailValid = email === "" || EMAIL_RE.test(email.trim());
  const needsTurnstile = siteKey.length > 0;
  const canSubmit = !needsTurnstile || !!turnstileToken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side email format guard
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 10) {
      setStatus("error");
      setErrorMsg("Message is too short — please add a bit more detail (min 10 chars).");
      return;
    }
    if (needsTurnstile && !turnstileToken) {
      setStatus("error");
      setErrorMsg("Please complete the spam check.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          projectType,
          budget,
          timeline,
          message: message.trim(),
          website,
          turnstileToken: turnstileToken ?? undefined,
          startedAt: startedAtRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something broke in the cut — please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again or email directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-accent-line bg-accent-soft px-10 py-14 text-center">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent">
          SCENE 01 · TAKE 001 ✓
        </p>
        <h2 className="display mb-3 text-4xl">
          That&apos;s a wrap{name ? `, ${name.split(" ")[0]}` : ""}
          <em>.</em>
        </h2>
        <p className="text-bone-dim">
          Your message is in the can. Expect a real reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot — bots fill, humans never see */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="field">
          <span>Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Firstname Lastname"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            aria-invalid={!emailValid}
            className={!emailValid ? "text-red-400" : undefined}
          />
        </label>
      </div>
      {!emailValid && (
        <p className=" -mt-4 font-mono text-[11px] text-red-400">
          Enter a valid email (e.g. you@example.com)
        </p>
      )}

      {/* Lead qualification row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] text-mute">PROJECT TYPE</p>
          <div className="flex flex-wrap gap-1.5">
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setProjectType(type === projectType ? "" : type)}
                className={cn(
                  "rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                  projectType === type
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-hairline-strong text-bone-dim hover:border-accent-line hover:text-bone",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] text-mute">BUDGET RANGE</p>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setBudget(range === budget ? "" : range)}
                className={cn(
                  "rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                  budget === range
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-hairline-strong text-bone-dim hover:border-accent-line hover:text-bone",
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] text-mute">TIMELINE</p>
          <div className="flex flex-wrap gap-1.5">
            {TIMELINES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeline(t === timeline ? "" : t)}
                className={cn(
                  "rounded-sm border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
                  timeline === t
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-hairline-strong text-bone-dim hover:border-accent-line hover:text-bone",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="field">
        <span>Tell me about the project</span>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you making? Any specific references or goals?"
          required
          minLength={10}
          maxLength={5000}
        />
      </label>
      <p className="-mt-4 text-right font-mono text-[10px] text-mute">{message.length} / 5000</p>

      {/* Turnstile — Cloudflare spam protection (FREE, unlimited) */}
      {siteKey ? (
        <div className="pt-2">
          <TurnstileWidget
            siteKey={siteKey}
            onVerify={(token) => {
              setTurnstileToken(token);
              setErrorMsg(null);
            }}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
          <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-mute">
            Protected by Cloudflare Turnstile · privacy-friendly, no tracking
          </p>
        </div>
      ) : (
        <p className="rounded-sm border border-dashed border-hairline-strong bg-paper px-3 py-2 font-mono text-[10px] leading-relaxed text-mute">
          Dev mode: Turnstile not configured. Set{" "}
          <code className="text-bone">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> +{" "}
          <code className="text-bone">TURNSTILE_SECRET_KEY</code> to enable.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="font-mono text-[10px] tracking-[0.1em] text-mute">
          REPLIES WITHIN 24 HOURS · NO NEWSLETTERS
        </p>
        <button
          type="submit"
          disabled={status === "sending" || !canSubmit}
          className="rounded-sm bg-accent px-8 py-4 text-[13px] font-medium text-ink transition-colors hover:bg-accent-dim disabled:opacity-60"
          title={!canSubmit ? "Complete the spam check first" : undefined}
        >
          {status === "sending" ? "Rolling…" : "Roll camera — send →"}
        </button>
      </div>

      {status === "error" && errorMsg && (
        <p className="font-mono text-[11px] tracking-[0.08em] text-red-400">{errorMsg}</p>
      )}
      {status === "error" && !errorMsg && (
        <p className="font-mono text-[11px] tracking-[0.08em] text-red-400">
          Something broke in the cut — please try again or email directly.
        </p>
      )}
    </form>
  );
}
