import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { VideoTile } from "@/components/work/VideoTile";
import { allPortfolioItems, homeItems } from "@/lib/portfolio-data";

export function FeaturedWork() {
  return (
    <section className="py-(--section-pad)">
      <div className="mx-auto max-w-295 px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">
              <span className="eyebrow-dot" />
              Selected work
            </p>
            <h2 className="display max-w-[20ch] text-[clamp(36px,5.5vw,88px)]">
              Every frame, <em>a decision.</em>
            </h2>
          </div>
          <Link
            href="/work"
            className="group font-mono text-[12px] uppercase tracking-[0.1em] text-bone transition-colors hover:text-accent"
          >
            All {allPortfolioItems.length} projects{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:gap-6">
          {homeItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.07}>
              <VideoTile item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
