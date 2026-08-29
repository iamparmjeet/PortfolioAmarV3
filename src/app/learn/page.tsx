import type { Metadata } from "next";
import Link from "next/link";
import { KineticText } from "@/components/motion/KineticText";
import { Reveal } from "@/components/motion/Reveal";
import { learn } from "@/lib/data";

export const metadata: Metadata = {
  title: "Learn — learnsimm by Amarjeet Mishra",
  description:
    "From learning to earning — video editing, cinematography, and the business of filmmaking at learnsimm, Punjab's premier media institute.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn Video Editing & Filmmaking — learnsimm",
    description:
      "Hands-on creative software, camera production, and filmmaking business education in Ludhiana.",
    url: "/learn",
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: `${learn.fullName} — Complete Media Program`,
  description: `${learn.promise} Creative software, camera & production, and business & AI over ${learn.program.duration}.`,
  provider: { "@type": "Organization", name: learn.fullName, sameAs: learn.url },
  offers: {
    "@type": "Offer",
    price: "70000",
    priceCurrency: "INR",
  },
};

export default function LearnPage() {
  return (
    <main className="pb-(--section-pad) pt-36">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <div className="mx-auto max-w-295 px-8">
        {/* Hero */}
        <p className="eyebrow mb-7">
          <span className="eyebrow-dot" />
          {learn.name} · {learn.positioning}
        </p>
        <KineticText
          lines={[{ text: "From learning" }, { text: "to earning.", accent: true }]}
          className="mb-10 text-[clamp(44px,7.5vw,110px)]"
        />

        <Reveal>
          <p className="mb-12 max-w-[52ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-bone-dim">
            {learn.promise} Master creative software, camera &amp; production, and business &amp; AI
            over a {learn.program.duration} program at{" "}
            <span className="text-accent">{learn.fullName}</span> — taught the way I learned it: on
            real client work, not classroom exercises.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-(--section-pad) grid grid-cols-2 gap-px overflow-hidden rounded-md border border-hairline bg-hairline sm:grid-cols-4">
            {learn.stats.map((stat) => (
              <div key={stat.label} className="bg-surface px-6 py-7">
                <p className="font-display text-[clamp(28px,3.5vw,48px)] font-semibold leading-none text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-mute">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Why SIMM */}
        <section className="mb-(--section-pad)">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            Why learn here
          </p>
          <h2 className="display mb-10 text-[clamp(30px,4.5vw,60px)]">
            Eight reasons <em>students stay.</em>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learn.whyPoints.map((point, i) => (
              <Reveal key={point.title} delay={(i % 4) * 0.07}>
                <div className="h-full rounded-md border border-hairline p-6 transition-colors hover:border-accent-line hover:bg-accent-soft/30">
                  <p className="mb-2.5 font-mono text-[10px] tracking-[0.14em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mb-2 font-display text-xl font-semibold leading-tight">
                    {point.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-bone-dim">{point.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Teaching approach band */}
        <Reveal>
          <section className="mb-(--section-pad) rounded-md border border-hairline bg-surface px-8 py-12 text-center md:px-16">
            <p className="eyebrow mb-6 justify-center">
              <span className="eyebrow-dot" />
              How teaching works
            </p>
            <blockquote className="display mx-auto mb-4 max-w-[28ch] text-[clamp(24px,3.5vw,44px)] italic leading-snug">
              "{learn.approach[0]}"
            </blockquote>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              {learn.approach[1]}
            </p>
          </section>
        </Reveal>

        {/* Curriculum */}
        <section className="mb-(--section-pad)">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            Curriculum
          </p>
          <h2 className="display mb-10 text-[clamp(30px,4.5vw,60px)]">
            {learn.modules.length} modules. <em>One path.</em>
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {learn.modules.map((module, i) => (
              <Reveal key={module.num} delay={i * 0.1}>
                <article className="flex h-full flex-col rounded-md border border-hairline p-7 transition-colors hover:border-accent-line hover:bg-accent-soft/30">
                  <div className="mb-5 flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-accent">
                      MODULE {module.num}
                    </span>
                    <span className="rounded-sm border border-hairline px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-mute">
                      {module.duration}
                    </span>
                  </div>
                  <h3 className="mb-3 font-display text-2xl font-semibold leading-tight">
                    {module.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-bone-dim">{module.desc}</p>
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {module.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-sm border border-hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-mute"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-auto flex flex-col gap-1.5">
                    {module.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2 text-[13px] text-bone-dim">
                        <span aria-hidden="true" className="text-accent">
                          →
                        </span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* After the course — placement */}
        <section className="mb-(--section-pad) grid grid-cols-1 gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow mb-4">
                <span className="eyebrow-dot" />
                After the course
              </p>
              <h2 className="display mb-6 text-[clamp(28px,4vw,52px)]">
                The course ends. <em>The support doesn't.</em>
              </h2>
              <ul className="flex flex-col gap-3.5">
                {learn.placement.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-bone-dim">
                    <span aria-hidden="true" className="mt-1 text-accent">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-md border border-hairline p-7">
              <p className="eyebrow mb-5">
                <span className="eyebrow-dot" />
                Getting started
              </p>
              <ul className="mb-7 flex flex-col gap-3.5">
                {learn.admission.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] text-bone-dim">
                    <span aria-hidden="true" className="mt-1 text-accent">
                      →
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="border-t border-hairline pt-5 font-mono text-[11px] leading-loose tracking-[0.06em] text-mute">
                <p>{learn.contact.address}</p>
                <p>
                  <a
                    href={`tel:${learn.contact.phone.replace(/\s/g, "")}`}
                    className="text-bone-dim transition-colors hover:text-accent"
                  >
                    {learn.contact.phone}
                  </a>{" "}
                  ·{" "}
                  <a
                    href={`mailto:${learn.contact.email}`}
                    className="text-bone-dim transition-colors hover:text-accent"
                  >
                    {learn.contact.email}
                  </a>
                </p>
                <p>{learn.contact.hours}</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Real student testimonials from learnsimm.com */}
        <section className="mb-(--section-pad)">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            Student words
          </p>
          <h2 className="display mb-10 text-[clamp(28px,4vw,52px)]">
            They came to learn. <em>They left earning.</em>
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {learn.testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-md border border-hairline p-7">
                  <blockquote className="mb-6 font-display text-lg italic leading-relaxed text-bone">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-auto font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                    <span className="text-accent">— {t.author}</span>
                    <br />
                    {t.role}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Program card */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-md border border-accent-line bg-accent-soft/40 px-8 py-8">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                Full program
              </p>
              <p className="font-display text-3xl font-semibold">
                {learn.program.price}{" "}
                <span className="text-base font-normal text-bone-dim">
                  · {learn.program.priceNote}
                </span>
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                {learn.program.duration} · ISO certified · Limited seats per batch
              </p>
            </div>
            <div className="flex flex-wrap gap-3.5">
              <a
                href={learn.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-7 py-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-accent-dim"
              >
                Visit {learn.name}.com ↗
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-sm border border-hairline-strong px-7 py-3.5 text-[13px] text-bone transition-colors hover:border-accent hover:text-accent"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
