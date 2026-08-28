"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, budget, timeline, message, website }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-accent-line bg-accent-soft px-10 py-14 text-center">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent">
          SCENE 01 · TAKE 001 ✓
        </p>
        <h2 className="display mb-3 text-4xl">
          That's a wrap{name ? `, ${name.split(" ")[0]}` : ""}
          <em>.</em>
        </h2>
        <p className="text-bone-dim">
          Your message is in the can. Expect a real reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Honeypot */}
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
          />
        </label>
      </div>

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
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <p className="font-mono text-[10px] tracking-[0.1em] text-mute">
          REPLIES WITHIN 24 HOURS · NO NEWSLETTERS
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-sm bg-accent px-8 py-4 text-[13px] font-medium text-ink transition-colors hover:bg-accent-dim disabled:opacity-60"
        >
          {status === "sending" ? "Rolling…" : "Roll camera — send →"}
        </button>
      </div>

      {status === "error" && (
        <p className="font-mono text-[11px] tracking-[0.08em] text-red-400">
          Something broke in the cut — please try again or email directly.
        </p>
      )}
    </form>
  );
}
