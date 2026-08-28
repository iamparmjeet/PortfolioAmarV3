import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="mx-auto flex max-w-295 flex-col items-center px-8">
        <p className="mb-3 font-mono text-[10px] tracking-[0.18em] text-accent">
          FADE TO BLACK — SCENE NOT FOUND
        </p>
        <h1 className="display mb-4 text-[clamp(64px,14vw,200px)] leading-none">
          404<em>.</em>
        </h1>
        <p className="mb-9 max-w-[40ch] text-bone-dim">
          This scene didn't make the final cut. The page you're looking for was moved, renamed, or
          never shot.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link
            href="/"
            className="rounded-sm bg-accent px-7 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-accent-dim"
          >
            Back to the top →
          </Link>
          <Link
            href="/work"
            className="rounded-sm border border-hairline-strong px-7 py-3.5 text-[13px] text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Browse the work
          </Link>
        </div>
      </div>
    </main>
  );
}
