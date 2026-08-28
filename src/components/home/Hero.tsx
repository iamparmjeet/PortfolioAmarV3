"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ShowreelModal } from "@/components/home/ShowreelModal";
import { KineticText } from "@/components/motion/KineticText";
import { Reveal } from "@/components/motion/Reveal";
import { brand, HeroImg } from "@/lib/data";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0.3, y: 0.4 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col overflow-hidden px-(--pad-x) pb-14 pt-32"
    >
      {/* Mouse-follow gold glow (Design A) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-200"
        style={{
          background: `radial-gradient(640px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(201,148,58,0.1), transparent 60%), radial-gradient(ellipse 50% 60% at 85% 80%, rgba(201,148,58,0.05) 0%, transparent 50%)`,
        }}
      />

      {/* Giant watermark behind everything */}
      <p
        aria-hidden="true"
        className="display pointer-events-none absolute -right-[4%] top-[8%] select-none text-[clamp(200px,34vw,560px)] leading-none text-bone opacity-[0.035]"
      >
        Amar.
      </p>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col justify-center">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Available for projects · {brand.location}
            </p>
            <p className="hidden font-mono text-[11px] tracking-[0.16em] text-mute sm:block">
              N 30.9010° E 75.8573° · PORTFOLIO V4
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <KineticText
              lines={[
                { text: "Cinematic stories," },
                { text: "told frame by frame.", accent: true },
              ]}
              className="mb-10 text-[clamp(44px,6.5vw,110px)]"
            />

            <Reveal delay={0.8}>
              <p className="mb-9 max-w-[46ch] text-[clamp(16px,1.4vw,21px)] leading-relaxed text-bone-dim">
                I'm <span className="text-bone">{brand.full}</span> — a video editor, filmmaker, and
                teacher. Reels, brand films, podcasts and visual stories that people actually watch.
                Launch your video campaigns in hours, not days.
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="flex flex-wrap items-center gap-4">
                {/* Appears once brand.showreelUrl is set in data.ts */}
                <ShowreelModal />
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-7 py-3.5 text-[13px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-accent-dim"
                >
                  See the work <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="border-b border-transparent pb-0.5 font-mono text-[12px] uppercase tracking-[0.1em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
                >
                  Let's talk
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Real action photo — tilted polaroid energy, straightens on hover */}
          <Reveal delay={0.5}>
            <div className="group relative mx-auto w-full max-w-[440px]">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-2xl border border-accent-line opacity-60"
              />
              <div className="relative aspect-[4/5] rotate-[1.5deg] overflow-hidden rounded-xl border border-hairline shadow-[0_32px_80px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-[1.015]">
                <Image
                  src={HeroImg}
                  alt={`${brand.full} on set`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="film-grade object-cover"
                />
                <div className="absolute left-3.5 top-3.5 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-dim backdrop-blur-sm">
                  REC ● 00:00:24:12
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3.5 pt-12">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone-dim">
                    Amar · In action
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
                    ● ON SET
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-3.5">
        <p className="animate-bounce font-mono text-[10px] tracking-[0.2em] text-mute">
          SCROLL TO ENTER ↓
        </p>
        <p className="font-mono text-[10px] tracking-[0.16em] text-mute">
          <span className="text-accent">●</span> {brand.tagline.toUpperCase()}
        </p>
      </div>
    </section>
  );
}
