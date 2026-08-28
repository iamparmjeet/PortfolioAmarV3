import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/data";

export function ServicesList() {
  return (
    <section className="border-t border-hairline bg-surface py-(--section-pad)">
      <div className="mx-auto max-w-295 px-8">
        <div className="mb-14">
          <p className="eyebrow mb-4">
            <span className="eyebrow-dot" />
            What I do
          </p>
          <h2 className="display text-[clamp(36px,5.5vw,88px)]">
            Six services. <em>One bar.</em>
          </h2>
          <p className="mt-5 max-w-[44ch] text-bone-dim">
            From a 15-second reel to a full brand film. Same care, same colour, same pacing
            instincts.
          </p>
        </div>

        <ul className="border-t border-hairline">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.06}>
              <li className="group grid grid-cols-[56px_1fr] items-center gap-7 border-b border-hairline py-8 transition-[padding] duration-500 hover:pl-4 md:grid-cols-[90px_1fr_1.3fr_180px]">
                {/* Number fills → outlines on hover (Design B signature) */}
                <span
                  className="display text-[clamp(36px,4.5vw,64px)] text-surface-elevated transition-all duration-300 group-hover:text-transparent"
                  style={{ WebkitTextStroke: "0px var(--color-accent)" }}
                >
                  <span className="transition-all duration-300 group-hover:[-webkit-text-stroke:1px_var(--color-accent)]">
                    {service.num}
                  </span>
                </span>
                <span className="font-display text-[clamp(20px,2.4vw,34px)] leading-tight text-bone transition-colors duration-300 group-hover:text-accent">
                  {service.title}
                </span>
                <span className="hidden text-sm leading-relaxed text-bone-dim md:block">
                  {service.desc}
                </span>
                <span className="hidden flex-wrap justify-end gap-1.5 md:flex">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-hairline px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-mute"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
