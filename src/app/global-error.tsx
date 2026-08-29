"use client";

import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
  preload: false,
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global root error caught:", error);
  }, [error]);

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0b0908] px-8 py-20 text-[#ede8df] antialiased">
        <div className="mx-auto flex max-w-295 flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-[rgba(237,232,223,0.08)] bg-[#121110] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#c9943a]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c0392b] animate-pulse" />
            CRITICAL — GLOBAL SYSTEM INTERRUPT
          </div>

          <h1 className="display mb-4 text-[clamp(48px,10vw,120px)] font-light leading-none tracking-tight">
            System <em>overload.</em>
          </h1>

          <p className="mb-8 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-[#b8b0a0]">
            A critical error occurred at the layout level. You can attempt to reload the application
            shell below.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-sm bg-[#c9943a] px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b0908] transition-colors hover:bg-[#e5b25c]"
            >
              ↻ Reload Application
            </button>
            <a
              href="/"
              className="rounded-sm border border-[rgba(237,232,223,0.16)] bg-[#121110] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ede8df] transition-colors hover:border-[#c9943a] hover:text-[#c9943a]"
            >
              Hard Reset to Home
            </a>
          </div>

          {error.digest && (
            <p className="mt-8 font-mono text-[10px] tracking-[0.08em] text-[#7a7060]">
              Digest: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
