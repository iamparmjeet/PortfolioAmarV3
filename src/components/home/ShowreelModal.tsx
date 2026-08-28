"use client";

import { useEffect, useState } from "react";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { brand } from "@/lib/data";
import { useVideoStore } from "@/stores/videoStore";

/**
 * "Watch the reel" button + fullscreen overlay player.
 * Renders nothing until brand.showreelUrl is populated in data.ts.
 */
export function ShowreelModal() {
  const [open, setOpen] = useState(false);
  const requestPlay = useVideoStore((s) => s.requestPlay);
  const stopAll = useVideoStore((s) => s.stopAll);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (brand.showreelUrl === "") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          requestPlay("showreel");
        }}
        className="inline-flex items-center gap-2.5 rounded-sm bg-accent px-7 py-3.5 text-[13px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-accent-dim"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
        Watch the reel
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
          {/* Backdrop button for keyboard & click dismiss */}
          <button
            type="button"
            aria-label="Close showreel modal backdrop"
            className="absolute inset-0 h-full w-full bg-ink/90 backdrop-blur-md cursor-default"
            onClick={() => {
              setOpen(false);
              stopAll();
            }}
          />
          <div
            className="relative z-10 w-full max-w-[420px]"
            role="dialog"
            aria-modal="true"
            aria-label="Showreel"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.18em] text-bone-dim">
                SHOWREEL · {new Date().getFullYear()}
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  stopAll();
                }}
                className="font-mono text-[11px] tracking-[0.14em] text-bone-dim transition-colors hover:text-accent"
              >
                CUT — CLOSE ×
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-hairline">
              <HlsPlayer
                videoId="showreel"
                src={brand.showreelUrl}
                autoPlay
                className="aspect-[9/16]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
