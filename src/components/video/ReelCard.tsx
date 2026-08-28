"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import type { ActionReel } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";

interface ReelCardProps {
  reel: ActionReel;
  label: string;
  className?: string;
}

/** Instagram-style 9:16 reel card with blur→poster load and tap-to-play. */
export function ReelCard({ reel, label, className }: ReelCardProps) {
  const [playing, setPlaying] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [blurFailed, setBlurFailed] = useState(false);
  const activeVideoId = useVideoStore((s) => s.activeVideoId);
  const requestPlay = useVideoStore((s) => s.requestPlay);

  useEffect(() => {
    if (activeVideoId !== reel.id) {
      setPlaying(false);
    }
  }, [activeVideoId, reel.id]);

  return (
    <div
      className={cn(
        "group relative aspect-[9/16] overflow-hidden rounded-xl border border-hairline bg-surface-elevated transition-colors duration-500 hover:border-accent-line",
        className,
      )}
    >
      {playing ? (
        <HlsPlayer
          videoId={reel.id}
          src={reel.mediaUrl}
          autoPlay
          loop
          poster={reel.posterUrl}
          className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />
      ) : (
        <>
          {reel.blurUrl && !blurFailed && (
            <Image
              src={reel.blurUrl}
              alt=""
              aria-hidden="true"
              fill
              sizes="40px"
              onError={() => setBlurFailed(true)}
              className="scale-105 object-cover"
            />
          )}
          <Image
            src={reel.posterUrl}
            alt={label}
            fill
            sizes="(max-width: 640px) 50vw, 330px"
            onLoad={() => setPosterLoaded(true)}
            className={cn(
              "object-cover transition-opacity duration-500",
              posterLoaded ? "opacity-100" : "opacity-0",
            )}
          />
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
              requestPlay(reel.id);
            }}
            aria-label={`Play ${label}`}
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent px-4 pb-3.5 pt-12">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-bone-dim">
              {label}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
