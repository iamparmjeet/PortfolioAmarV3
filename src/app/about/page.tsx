import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KineticText } from "@/components/motion/KineticText";
import { Reveal } from "@/components/motion/Reveal";
import { ReelCard } from "@/components/video/ReelCard";
import { actionReels, brand, HeroImg } from "@/lib/data";
import { clients, siteStats } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "About — Amarjeet Mishra",
  description: "Video editor, filmmaker, and teacher based in Mumbai.",
};

export default function AboutPage() {
  return (
    <main className="pb-(--section-pad) pt-36">
      <div className="mx-auto max-w-295 px-8">
        <p className="eyebrow mb-7">
          <span className="eyebrow-dot" />
          About
        </p>
        <KineticText
          lines={[{ text: "Amarjeet" }, { text: "Mishra.", accent: true }]}
          className="mb-16 text-[clamp(52px,8.5vw,130px)]"
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5 text-[15px] leading-[1.8] text-bone-dim">
            {/* TODO: confirm bio copy with Amar before launch */}
            <Reveal>
              <p>
                Video editor, filmmaker, and teacher based in {brand.location}. I make reels, brand
                films, podcasts and visual stories that people actually watch — each project a
                different problem, solved on its own terms.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Nobody handed me this craft. No film school, no mentor, no studio internship — just
                a borrowed laptop, free trials, and late nights reverse-engineering edits I admired,
                watching sequences frame by frame until I understood why a cut worked. The first
                hundred edits were bad. The next hundred were how I learned.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                The struggle was the curriculum. Years of unpaid work, clients who didn't show up,
                renders that died at 99% — every setback taught me something a classroom couldn't.
                When the first paying client finally came, I understood the work deeply because I
                had earned every frame of it the hard way.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                That's why I teach. If you're sitting where I sat — no connections, no equipment, no
                idea where to start — the path exists. I built it once without a map. The work on
                this site spans {siteStats[2].value} industries, all delivered from a pipeline I
                taught myself to build. You don't need permission to start. You need a timeline and
                the stubbornness to stay on it.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p>
                If you have something to say in motion — a brand film, a series of reels that needs
                to feel like one thing — I'd like to hear about it.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/work"
                  className="rounded-sm bg-accent px-6 py-3 font-mono text-[11px] tracking-[0.14em] text-ink transition-colors hover:bg-accent-dim"
                >
                  SEE THE WORK →
                </Link>
                <Link
                  href="/contact"
                  className="rounded-sm border border-hairline-strong px-6 py-3 font-mono text-[11px] tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent"
                >
                  START A PROJECT
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-hairline">
                <Image
                  src={HeroImg}
                  alt={brand.full}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="film-grade object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 border-x border-b border-hairline sm:grid-cols-4">
                {siteStats.map((stat) => (
                  <div key={stat.label} className="border-r border-hairline p-4 last:border-r-0">
                    <p className="font-display text-2xl font-semibold text-accent">{stat.value}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-mute">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Behind the scenes — the four amar-in-action reels */}
        <section className="mt-(--section-pad)">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            Behind the scenes
          </p>
          <h2 className="display mb-12 text-[clamp(32px,4.5vw,64px)]">
            Amar, <em>in action.</em>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {actionReels.map((reel, i) => (
              <Reveal key={reel.id} delay={i * 0.08}>
                <ReelCard reel={reel} label={`On set · ${String(i + 1).padStart(2, "0")}`} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Real client wall — derived from the portfolio data */}
        <section className="mt-(--section-pad)">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            Clients
          </p>
          <h2 className="display mb-12 text-[clamp(32px,4.5vw,64px)]">
            Worked with <em>good people.</em>
          </h2>
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-hairline sm:grid-cols-3 lg:grid-cols-5">
            {clients.map((client) => (
              <div
                key={client}
                className="border-b border-r border-hairline px-5 py-8 text-center font-display text-xl text-bone-dim transition-colors hover:bg-accent-soft hover:text-accent"
              >
                {client}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
