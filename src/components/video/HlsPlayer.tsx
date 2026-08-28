"use client";

import Player from "next-video/player";
import { useEffect, useRef } from "react";
import { useVideoStore } from "@/stores/videoStore";

interface HlsPlayerProps {
  /** Unique per video — usually the project slug. */
  videoId: string;
  src: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string;
}

/**
 * next-video player wired to the global video store:
 * starting this player evicts whatever else is playing site-wide.
 */
export function HlsPlayer({
  videoId,
  src,
  className,
  muted = false,
  loop = false,
  autoPlay = false,
  controls = true,
  poster,
}: HlsPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const activeVideoId = useVideoStore((s) => s.activeVideoId);
  const requestPlay = useVideoStore((s) => s.requestPlay);

  useEffect(() => {
    if (activeVideoId !== videoId) {
      playerRef.current?.pause();
    }
  }, [activeVideoId, videoId]);

  return (
    <div className={className}>
      <Player
        ref={playerRef}
        src={src}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        controls={controls}
        poster={poster}
        playsInline
        onPlay={() => requestPlay(videoId)}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          "--media-accent-color": "var(--color-accent)",
        }}
      />
    </div>
  );
}
