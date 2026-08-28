"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_PALETTE, PALETTES, type PaletteDef } from "@/constants/themes";
import { cn } from "@/lib/utils";

const GROUPS: PaletteDef["group"][] = ["Light", "In-between", "Dark"];

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

// "circle" grows from the click point and needs runtime coordinates, so it is
// driven in JS. The rest are pure CSS keyframes keyed off the data attribute
// set on <html> (see globals.css).
const ANIMATIONS = ["circle", "wipe", "blur", "slide"] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const lastAnim = useRef<string>("");

  // Swap the palette with a randomly chosen reveal animation, avoiding an
  // immediate repeat. Falls back to an instant swap when View Transitions are
  // unsupported or the user prefers reduced motion.
  function changeTheme(id: string, event: React.MouseEvent) {
    setOpen(false);

    const doc = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      setTheme(id);
      return;
    }

    const choices = ANIMATIONS.filter((a) => a !== lastAnim.current);
    const anim = choices[Math.floor(Math.random() * choices.length)];
    lastAnim.current = anim;

    const root = document.documentElement;
    root.dataset.themeAnim = anim;

    const x = event.clientX;
    const y = event.clientY;

    const transition = doc.startViewTransition(() => setTheme(id));

    if (anim === "circle") {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      transition.ready.then(() => {
        root.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 480,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    }

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  }

  // next-themes only knows the active theme after hydration; render a stable
  // placeholder until then to avoid a swatch mismatch.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = (mounted && theme) || DEFAULT_PALETTE;
  const current = PALETTES.find((p) => p.id === active) ?? PALETTES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change color theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex size-8 items-center justify-center rounded-full border border-hairline bg-surface-elevated transition-colors hover:border-accent md:size-9"
        style={{ color: current.swatch }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-4 md:size-[18px]"
        >
          <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
          <path d="M7.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M11.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-11 right-0 z-50 w-56 rounded-[14px] border border-hairline bg-surface-elevated p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              Theme
            </span>
            <span className="font-mono text-[10px] text-mute">{current.label}</span>
          </div>

          {GROUPS.map((group) => (
            <div key={group} className="mb-1.5 last:mb-0">
              <div className="px-1 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-mute">
                {group}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {PALETTES.filter((p) => p.group === group).map((p) => {
                  const isActive = p.id === active;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      title={p.label}
                      onClick={(e) => changeTheme(p.id, e)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-[9px] border px-1 py-1.5 transition-colors",
                        isActive
                          ? "border-accent bg-accent-soft"
                          : "border-transparent hover:border-hairline",
                      )}
                    >
                      <span
                        className="size-4 rounded-full border border-black/10"
                        style={{ background: p.swatch }}
                      />
                      <span className="font-mono text-[9px] text-bone-dim">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
