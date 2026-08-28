import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden border-t border-hairline px-(--pad-x) py-(--section-pad) text-center">
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <Reveal>
          <p className="eyebrow mb-6 justify-center">
            <span className="eyebrow-dot" />
            Ready when you are
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="display mb-9 text-[clamp(44px,8vw,132px)]">
            Let's make
            <br />
            <em>something cinematic.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mx-auto mb-10 max-w-[44ch] text-bone-dim">
            Brand films, reels, podcasts, and editorial shoots — from Mumbai to anywhere.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-accent-dim"
          >
            Start a project <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
