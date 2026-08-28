"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { StillsLightbox } from "@/components/work/StillsLightbox";
import { StillTile } from "@/components/work/StillTile";
import { VideoTile } from "@/components/work/VideoTile";
import {
  allPortfolioItems,
  categories,
  imageCategories,
  imagesGallery,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type Mode = "films" | "stills";

function WorkGridInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("tab") === "stills" ? "stills" : "films";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [filmFilter, setFilmFilter] = useState("all");
  const [stillFilter, setStillFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const setMode_ = (m: Mode) => {
    setMode(m);
    const params = new URLSearchParams(searchParams.toString());
    if (m === "stills") {
      params.set("tab", "stills");
    } else {
      params.delete("tab");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Only offer categories that actually contain work.
  const filmCategories = useMemo(() => {
    const used = new Set(allPortfolioItems.map((item) => item.category));
    return categories.filter((c) => c.id === "all" || used.has(c.id));
  }, []);

  const filteredFilms =
    filmFilter === "all"
      ? allPortfolioItems
      : allPortfolioItems.filter((item) => item.category === filmFilter);

  const filteredStills =
    stillFilter === "all"
      ? imagesGallery
      : imagesGallery.filter((img) => img.category === stillFilter);

  const activeFilters = mode === "films" ? filmCategories : imageCategories;
  const activeFilter = mode === "films" ? filmFilter : stillFilter;
  const setActiveFilter = mode === "films" ? setFilmFilter : setStillFilter;

  const tabs = [
    { id: "films", label: "Films", count: allPortfolioItems.length },
    { id: "stills", label: "Stills", count: imagesGallery.length },
  ] as const;

  // Lightbox helpers — work on the currently filtered stills list
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + filteredStills.length) % filteredStills.length,
    );
  const nextImage = () =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filteredStills.length));

  return (
    <div>
      {/* Mode tabs — big serif, gold underline, nothing like the chips */}
      <div className="flex gap-10 border-b border-hairline">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode_(tab.id)}
            aria-pressed={mode === tab.id}
            className={cn(
              "display relative pb-4 text-[clamp(28px,4vw,48px)] transition-colors duration-300",
              mode === tab.id
                ? "text-bone after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:bg-accent"
                : "text-mute hover:text-bone-dim",
            )}
          >
            {tab.label}
            <sup
              className={cn(
                "ml-2 font-mono text-xs tracking-[0.08em]",
                mode === tab.id ? "text-accent" : "text-mute",
              )}
            >
              {tab.count}
            </sup>
          </button>
        ))}
      </div>

      {/* Category chips for the active mode */}
      <div className="sticky top-[57px] z-20 -mx-8 border-b border-hairline bg-ink/90 px-8 py-4 backdrop-blur-xl">
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={cn(
                "rounded-sm border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors",
                activeFilter === cat.id
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-hairline-strong text-bone-dim hover:border-accent-line hover:text-bone",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {mode === "films" ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-5">
          {filteredFilms.map((item) => (
            <VideoTile key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-5">
            {filteredStills.map((img, i) => (
              <StillTile key={img.id} image={img} onClick={() => openLightbox(i)} />
            ))}
          </div>

          {lightboxIndex !== null && (
            <StillsLightbox
              images={filteredStills}
              currentIndex={lightboxIndex}
              onClose={closeLightbox}
              onPrev={prevImage}
              onNext={nextImage}
            />
          )}
        </>
      )}
    </div>
  );
}

export function WorkGrid() {
  return (
    <Suspense
      fallback={<div className="mt-10 text-center font-mono text-[11px] text-mute">Loading…</div>}
    >
      <WorkGridInner />
    </Suspense>
  );
}
