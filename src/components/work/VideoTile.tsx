"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { categories, type PortfolioItem } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";

interface VideoTileProps {
  item: PortfolioItem;
}

function categoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}

/**
 * Instagram-style 9:16 tile. The blur thumbnail paints instantly, the full
 * poster fades in over it, and clicking the media plays the film in place
 * (single-playback via the video store). Only the title row and the
 * case-study chip navigate away.
 */
export function VideoTile({ item }: VideoTileProps) {
  const [playing, setPlaying] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [blurFailed, setBlurFailed] = useState(false);
  const activeVideoId = useVideoStore((s) => s.activeVideoId);
  const requestPlay = useVideoStore((s) => s.requestPlay);

  const tileId = `tile-${item.id}`;
  const hasMedia = item.mediaUrl !== "";

  // Another player claimed playback — drop back to the poster.
  useEffect(() => {
    if (activeVideoId !== tileId) {
      setPlaying(false);
    }
  }, [activeVideoId, tileId]);

  const startPlayback = () => {
    if (!hasMedia) return;
    setPlaying(true);
    requestPlay(tileId);
  };

  return (
    <article className="group">
      <div className="relative aspect-[9/16] overflow-hidden rounded-xl border border-hairline bg-surface-elevated transition-colors duration-500 group-hover:border-accent-line">
        {playing ? (
          <HlsPlayer
            videoId={tileId}
            src={item.mediaUrl}
            autoPlay
            loop
            poster={item.posterUrl}
            className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          />
        ) : hasMedia ? (
          <>
            {/* Blur thumbnail paints first; full poster fades in over it.
                Not every video has one on R2 yet — skip or hide if missing/404. */}
            {item.blurUrl && item.blurUrl !== item.posterUrl && !blurFailed && (
              <Image
                src={item.blurUrl}
                alt=""
                aria-hidden="true"
                fill
                sizes="40px"
                onError={() => setBlurFailed(true)}
                className="scale-105 object-cover"
              />
            )}
            <Image
              src={item.posterUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setPosterLoaded(true)}
              className={cn(
                "object-cover transition-opacity duration-500",
                posterLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-surface" />
        )}

        {/* Tap target only while idle — once playing, the player's own
            controls (scrub, mute, fullscreen, pause) take over the surface */}
        {!playing && (
          <button
            type="button"
            onClick={startPlayback}
            aria-label={`Play ${item.title}`}
            data-cursor="play"
            className="absolute inset-0 z-10"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-ink/40 text-bone backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </span>
            </span>
          </button>
        )}

        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-sm border border-accent-line bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent backdrop-blur-sm">
          {categoryName(item.category)}
        </span>

        <Link
          href={`/work/${item.slug}`}
          className="absolute right-3 top-3 z-20 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-bone-dim backdrop-blur-sm transition-colors hover:text-accent"
        >
          Case study ↗
        </Link>

        {!hasMedia && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-sm bg-ink/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-mute backdrop-blur-sm">
            Film coming soon
          </span>
        )}

        {/* Bottom gradient + title overlay, Instagram-style */}
        {!playing && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-4 pb-4 pt-14">
            <h3 className="font-display text-xl leading-tight text-bone">{item.title}</h3>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone-dim">
              {item.client}
            </p>
          </div>
        )}
      </div>

      <Link
        href={`/work/${item.slug}`}
        className="mt-3 flex items-center justify-center gap-2.5 rounded-md border border-hairline-strong py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-all hover:border-accent hover:bg-accent-soft hover:text-accent"
      >
        View case study
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </article>
  );
}
