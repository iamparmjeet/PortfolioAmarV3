import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { ReelCard } from "@/components/video/ReelCard";
import { StillTile } from "@/components/work/StillTile";
import { VideoTile } from "@/components/work/VideoTile";
import {
  allPortfolioItems,
  categories,
  getItemBySlug,
  getNextItem,
  getRelatedFilms,
  getRelatedStills,
} from "@/lib/portfolio-data";

// ISR: re-render at most once per hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allPortfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) return { title: "Not found" };
  const description = item.brief ?? `${item.title} for ${item.client}.`;
  return {
    title: `${item.title} · ${item.client}`,
    description,
    openGraph: {
      type: "video.other",
      title: `${item.title} · ${item.client}`,
      description,
      images: item.posterUrl ? [{ url: item.posterUrl, alt: item.title }] : undefined,
    },
  };
}

function categoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}

const ACT_LABELS = ["Act I — Pre-Production", "Act II — Production", "Act III — The Cut"];

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  const next = getNextItem(slug);
  const relatedFilms = getRelatedFilms(item);
  const relatedStills = getRelatedStills(item);
  const index = allPortfolioItems.findIndex((i) => i.slug === slug);
  const num = String(index + 1).padStart(2, "0");
  const total = String(allPortfolioItems.length).padStart(2, "0");

  const videoJsonLd = item.mediaUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${item.title} · ${item.client}`,
        description: item.brief ?? `${item.title} for ${item.client}.`,
        thumbnailUrl: item.posterUrl,
        contentUrl: item.mediaUrl,
        creator: { "@type": "Person", name: "Amarjeet Mishra" },
        // VideoObject requires uploadDate; the exact date is unknown, so the
        // project year (or site launch year) stands in. TODO: refine per project.
        uploadDate: `${item.year ?? "2025"}-01-01`,
      }
    : null;

  return (
    <main className="pt-32">
      {videoJsonLd && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}
      {/* Screenplay-format opening (Design C signature) */}
      <section>
        <div className="mx-auto max-w-295 px-8">
          <nav className="mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-mute">
            <Link href="/work" className="transition-colors hover:text-bone">
              WORK
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent">{item.title.toUpperCase()}</span>
          </nav>

          <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-accent">FADE IN:</p>
          <p className="mb-5 font-mono text-[10px] tracking-[0.14em] text-mute">
            INT. {item.client.toUpperCase()} — {categoryName(item.category).toUpperCase()}
            {item.year ? ` — ${item.year}` : ""}
          </p>
          <h1 className="display mb-5 max-w-[18ch] text-[clamp(40px,6.5vw,96px)]">
            {item.title}
            <em>.</em>
          </h1>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-dim">
            Client — {item.client}
          </p>
          {item.deliverables && item.deliverables.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-1.5">
              {item.deliverables.map((deliverable) => (
                <span
                  key={deliverable}
                  className="rounded-sm border border-accent-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent"
                >
                  {deliverable}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The film itself */}
      <section className="pb-(--section-pad)">
        <div className="mx-auto max-w-295 px-8">
          {item.mediaUrl ? (
            // Vertical reel format — centered like an Instagram embed
            <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-xl border border-hairline">
              <HlsPlayer
                videoId={item.slug}
                src={item.mediaUrl}
                poster={item.posterUrl}
                className="aspect-[9/16]"
              />
            </div>
          ) : (
            // TODO: populate mediaUrl — graceful fallback until the HLS upload lands
            <div className="flex aspect-video items-center justify-center rounded-md border border-hairline bg-gradient-to-br from-surface-elevated to-surface">
              <div className="text-center">
                <p className="display mb-2 text-3xl text-bone-dim">
                  Film in the grade suite<em>.</em>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                  This one streams soon
                </p>
              </div>
            </div>
          )}
          <p className="mt-3.5 flex justify-between font-mono text-[10px] tracking-[0.1em] text-mute">
            <span>
              Streaming from <span className="text-accent">media.amarjeetmishra.com</span>
            </span>
            <span>
              {num} / {total}
            </span>
          </p>
        </div>
      </section>

      {/* Results strip — renders only when real numbers exist */}
      {item.results && item.results.length > 0 && (
        <section className="bg-accent">
          <div className="mx-auto grid max-w-295 grid-cols-2 px-8 md:grid-cols-4">
            {item.results.map((result) => (
              <div key={result.label} className="border-r border-ink/10 px-7 py-7 last:border-r-0">
                <p className="display text-[clamp(28px,4vw,52px)] font-semibold text-ink">
                  {result.stat}
                </p>
                <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/60">
                  {result.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brief + Acts — case-study narrative when written */}
      <section className="py-(--section-pad)">
        <div className="mx-auto max-w-295 px-8">
          {item.brief ? (
            <Reveal>
              <div className="mb-12 grid grid-cols-1 gap-6 border-b border-hairline pb-12 md:grid-cols-[140px_1fr] md:gap-10">
                <p className="pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  The Brief
                </p>
                <p className="font-display text-[clamp(22px,2.6vw,36px)] leading-snug">
                  {item.brief}
                </p>
              </div>
            </Reveal>
          ) : (
            // TODO: populate brief/approach/results per project
            <Reveal>
              <div className="rounded-md border border-hairline px-8 py-12 text-center">
                <p className="display mb-2 text-[clamp(22px,3vw,40px)]">
                  Full case study <em>coming soon.</em>
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  The film above is the real deliverable — the write-up is in progress
                </p>
              </div>
            </Reveal>
          )}

          {item.approach && item.approach.length > 0 && (
            <Reveal>
              <div className="mb-12 border-b border-hairline pb-12">
                {item.approach.map((step, i) => (
                  <div
                    key={step}
                    className="mb-7 grid grid-cols-1 gap-4 last:mb-0 md:grid-cols-[140px_1fr] md:gap-10"
                  >
                    <div>
                      <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                        {ACT_LABELS[i] ?? `Act ${i + 1}`}
                      </p>
                      <p className="font-mono text-xs italic text-mute">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <p className="leading-relaxed text-bone-dim">{step}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* The Craft — post-production notes */}
          {item.craft && item.craft.length > 0 && (
            <Reveal>
              <div className="mb-12 grid grid-cols-1 gap-6 border-b border-hairline pb-12 md:grid-cols-[140px_1fr] md:gap-10">
                <div>
                  <p className="mb-1 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                    The Craft
                  </p>
                  <p className="font-mono text-xs italic text-mute">Edit · Grade · Sound</p>
                </div>
                <div className="flex max-w-[64ch] flex-col gap-5">
                  {item.craft.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="leading-[1.8] text-bone-dim">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Project media gallery — when a case study has multiple films/stills */}
          {item.galleryVideos && item.galleryVideos.length > 0 && (
            <Reveal>
              <div className="mb-12 border-b border-hairline pb-12">
                <p className="eyebrow mb-3">
                  <span className="eyebrow-dot" />
                  The films · {item.galleryVideos.length + 1} cuts
                </p>
                <h2 className="display mb-8 text-[clamp(24px,3.5vw,44px)]">
                  One project, <em>every cut.</em>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                  {item.galleryVideos.map((video, i) => (
                    <ReelCard
                      key={video.id}
                      reel={video}
                      label={`${item.title} · Cut ${String(i + 2).padStart(2, "0")}`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {item.galleryImages && item.galleryImages.length > 0 && (
            <Reveal>
              <div className="mb-12 border-b border-hairline pb-12">
                <p className="eyebrow mb-3">
                  <span className="eyebrow-dot" />
                  On location
                </p>
                <h2 className="display mb-8 text-[clamp(24px,3.5vw,44px)]">
                  Stills from <em>the shoot.</em>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                  {item.galleryImages.map((src, i) => (
                    <figure
                      key={src}
                      className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-hairline bg-surface-elevated transition-colors duration-500 hover:border-accent-line"
                    >
                      <Image
                        src={src}
                        alt={`${item.title} — production still ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="film-grade object-cover"
                      />
                      <figcaption className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-dim backdrop-blur-sm">
                        STILL {String(i + 1).padStart(2, "0")}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* The Outcome */}
          {item.outcome && (
            <Reveal>
              <div className="mb-12 rounded-md border border-accent-line bg-accent-soft/30 px-8 py-10 md:px-12">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                  The Outcome
                </p>
                <p className="display max-w-[40ch] text-[clamp(20px,2.4vw,32px)] leading-snug">
                  {item.outcome}
                </p>
              </div>
            </Reveal>
          )}

          {/* More reels from the same world */}
          {relatedFilms.length > 0 && (
            <Reveal>
              <div className="mb-14 border-t border-hairline pt-12">
                <p className="eyebrow mb-3">
                  <span className="eyebrow-dot" />
                  More {categoryName(item.category)} films
                </p>
                <h2 className="display mb-8 text-[clamp(24px,3.5vw,44px)]">
                  From the same <em>world.</em>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                  {relatedFilms.map((related) => (
                    <VideoTile key={related.id} item={related} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Stills from the mapped galleries */}
          {relatedStills.length > 0 && (
            <Reveal>
              <div className="mb-14 border-t border-hairline pt-12">
                <p className="eyebrow mb-3">
                  <span className="eyebrow-dot" />
                  Selected stills
                </p>
                <h2 className="display mb-8 text-[clamp(24px,3.5vw,44px)]">
                  Frames that <em>held.</em>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                  {relatedStills.map((still) => (
                    <StillTile key={still.id} image={still} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* FADE OUT / next film */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-mute">FADE OUT.</p>
              <Link
                href="/work"
                className="inline-block rounded-sm border border-hairline px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
              >
                ← ALL WORK
              </Link>
            </div>
            <div className="text-right">
              <p className="mb-2 font-mono text-[9px] tracking-[0.14em] text-mute">UP NEXT</p>
              <Link
                href={`/work/${next.slug}`}
                className="font-display text-[clamp(20px,2.4vw,32px)] font-semibold tracking-tight transition-opacity hover:opacity-65"
              >
                {next.title} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
