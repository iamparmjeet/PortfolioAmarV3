import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Scene Not Found",
  description:
    "This scene didn't make the final cut. The page you're looking for was moved, renamed, or never shot.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] flex-col items-center justify-center px-8 py-28 text-center">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-[420px] w-[420px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-295 flex-col items-center">
        {/* Screenplay slate header */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          EXT. CUTTING ROOM FLOOR — SCENE NOT FOUND
        </div>

        <h1 className="display mb-4 text-[clamp(72px,16vw,200px)] font-light leading-none tracking-tight">
          404<em>.</em>
        </h1>

        <p className="mb-8 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] leading-relaxed text-bone-dim">
          This scene didn&apos;t make the final cut. The sequence you&apos;re looking for was moved,
          renamed, or left in pre-production.
        </p>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/"
            className="rounded-sm bg-accent px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-dim"
          >
            ← Return to Home
          </Link>
          <Link
            href="/work"
            className="rounded-sm border border-hairline-strong bg-surface/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Explore Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-sm border border-hairline px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors hover:border-hairline-strong hover:text-bone"
          >
            Report Issue
          </Link>
        </div>

        {/* Film metadata tag */}
        <div className="mt-16 border-t border-hairline pt-6 font-mono text-[10px] tracking-[0.14em] text-mute">
          <span>TAKE: 404</span>
          <span className="mx-3 text-hairline">|</span>
          <span>STATUS: MISSING ASSET</span>
          <span className="mx-3 text-hairline">|</span>
          <span>ROLL: REEL_00</span>
        </div>
      </div>
    </main>
  );
}
