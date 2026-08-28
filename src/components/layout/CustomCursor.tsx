"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Custom cursor: follows mouse with a small dot + expanding ring.
 * Shows "PLAY" label when hovering over [data-cursor="play"] elements.
 * Hidden on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"default" | "play" | "link">("default");
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Only show on pointer devices
    if (!window.matchMedia("(hover: hover)").matches) return;
    setVisible(true);

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        const { x, y } = pos.current;
        dot.style.transform = `translate(${x}px, ${y}px)`;
        ring.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='play']")) {
        setState("play");
      } else if (target.closest("a, button, [role='button']")) {
        setState("link");
      } else {
        setState("default");
      }
    };

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-transform duration-75"
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[199] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent transition-[width,height,opacity,background] duration-300",
          state === "play"
            ? "flex h-16 w-16 items-center justify-center bg-accent/10"
            : state === "link"
              ? "h-10 w-10 bg-accent/5"
              : "h-8 w-8",
        )}
      >
        {state === "play" && (
          <span className="select-none font-mono text-[9px] font-bold tracking-[0.14em] text-accent">
            PLAY
          </span>
        )}
      </div>
    </>
  );
}
