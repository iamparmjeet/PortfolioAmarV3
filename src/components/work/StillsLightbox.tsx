"use client";

import Image from "next/image";
import { useEffect } from "react";
import { type GalleryImage, imageCategories } from "@/lib/portfolio-data";

interface StillsLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function StillsLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: StillsLightboxProps) {
  const image = images[currentIndex];
  const label = imageCategories.find((c) => c.id === image?.category)?.name ?? image?.title ?? "";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close, keyboard handled via useEffect (Escape)
    // biome-ignore lint/a11y/useKeyWithClickEvents: same as above
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Stop event from closing when clicking inside */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: inner panel stops backdrop propagation */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handled by parent via useEffect */}
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-bone">{image.title}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-mute">{label}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-mono text-[10px] tracking-[0.1em] text-mute">
              {currentIndex + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="font-mono text-[11px] tracking-[0.1em] text-bone-dim transition-colors hover:text-accent"
            >
              CUT — CLOSE ×
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative max-h-[80vh] max-w-[85vw] overflow-hidden rounded-lg border border-hairline">
          <Image
            src={image.src}
            alt={image.title}
            width={1200}
            height={900}
            className="max-h-[80vh] w-auto object-contain"
            priority
          />
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className="rounded-sm border border-hairline-strong px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
          >
            ← PREV
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="rounded-sm border border-hairline-strong px-5 py-2.5 font-mono text-[11px] tracking-[0.1em] text-bone-dim transition-colors hover:border-accent hover:text-accent"
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}
