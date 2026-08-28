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
        // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close, with Escape + button alternatives
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-5 backdrop-blur-md"
          onClick={() => {
            setOpen(false);
            stopAll();
          }}
        >
          {/* biome-ignore lint/a11y/noStaticElementInteractions: stops backdrop close inside player */}
          <div
            className="w-full max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
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
