import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { siteStats } from "@/lib/portfolio-data";

/** Stats derived from the real data layer — nothing invented. */
export function StatsStrip() {
  return (
    <section className="border-b border-hairline bg-surface">
      <div className="mx-auto grid max-w-[1680px] grid-cols-2 lg:grid-cols-4">
        {siteStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <div className="group flex flex-col gap-2.5 border-r border-hairline px-8 py-14 transition-colors duration-500 last:border-r-0 hover:bg-accent-soft/40">
              <span className="display text-[clamp(48px,6vw,84px)] leading-none text-accent transition-transform duration-500 group-hover:-translate-y-1">
                <Counter value={stat.value} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute transition-colors group-hover:text-bone-dim">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
