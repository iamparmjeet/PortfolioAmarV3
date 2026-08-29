"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client error to monitoring / console
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-[85vh] flex-col items-center justify-center px-8 py-28 text-center">
      {/* Subtle amber/red ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] rounded-full bg-destructive/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex max-w-295 flex-col items-center">
        {/* Status header */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-destructive/30 bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
          ALERT — RENDER INTERRUPTED
        </div>

        <h1 className="display mb-4 text-[clamp(56px,12vw,140px)] font-light leading-none tracking-tight">
          Playback <em>glitch.</em>
        </h1>

        <p className="mb-4 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-bone-dim">
          Something unexpected happened while rendering this frame. We logged the incident and can
          retry immediately.
        </p>

        {error.digest && (
          <p className="mb-8 font-mono text-[11px] tracking-[0.08em] text-mute">
            Error ID: <span className="text-bone">{error.digest}</span>
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-sm bg-accent px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-dim"
          >
            ↻ Retry Take
          </button>
          <Link
            href="/"
            className="rounded-sm border border-hairline-strong bg-surface/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Back to Safety
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-hairline px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors hover:border-hairline-strong hover:text-bone"
          >
            Contact Amar
          </Link>
        </div>

        {/* Slate footer */}
        <div className="mt-16 border-t border-hairline pt-6 font-mono text-[10px] tracking-[0.14em] text-mute">
          <span>FRAME: CORRUPTED</span>
          <span className="mx-3 text-hairline">|</span>
          <span>ACTION: RETRY AVAILABLE</span>
          <span className="mx-3 text-hairline">|</span>
          <span>REEL: EMERGENCY_RESET</span>
        </div>
      </div>
    </main>
  );
}
