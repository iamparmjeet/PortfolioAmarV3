"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { imagesGallery } from "@/lib/portfolio-data";

// One representative still per gallery category keeps the strip varied.
const stripImages = imagesGallery.filter(
  (img, i, arr) => arr.findIndex((other) => other.category === img.category) === i || i % 4 === 0,
);

/** Draggable horizontal gallery of real editorial stills (Design B pattern). */
export function GalleryStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el || !drag.current.active) return;
    el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX) * 1.1;
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <section className="overflow-hidden border-t border-hairline py-(--section-pad)">
      <div className="mx-auto mb-8 flex max-w-295 items-end justify-between px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Editorial stills · Drag to explore
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="hidden font-mono text-[10px] tracking-[0.14em] text-mute sm:block">
            ← DRAG OR SCROLL →
          </p>
        </Reveal>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="hgallery-track mx-auto flex max-w-295 cursor-grab gap-3.5 overflow-x-auto px-8 active:cursor-grabbing"
      >
        {stripImages.map((img) => (
          <div
            key={img.id}
            className="group relative h-[360px] w-[270px] flex-shrink-0 select-none overflow-hidden rounded-sm md:h-[440px] md:w-[330px]"
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              sizes="(max-width: 768px) 270px, 330px"
              className="film-grade pointer-events-none object-cover"
            />
            <span className="absolute bottom-3.5 left-3.5 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-bone-dim backdrop-blur-sm">
              {img.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
